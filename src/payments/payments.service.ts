import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../users/user.entity';
import { lastValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async initiatePayment(email: string, amount: number) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user)
      throw new HttpException(
        'User not found in DB. Please sign in via Google first.',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'https://api.paystack.co/transaction/initialize',
          { email, amount: amount.toString() },
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          },
        ),
      );

      const transaction = this.transactionRepo.create({
        reference: response.data.data.reference,
        amount: amount,
        user: user,
        status: 'pending',
      });
      await this.transactionRepo.save(transaction);

      return response.data.data;
    } catch (error) {
      throw new HttpException(
        'Paystack initialization failed',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async verifyTransaction(reference: string) {
    let transaction = await this.transactionRepo.findOne({
      where: { reference },
    });
    if (!transaction)
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);

    try {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://api.paystack.co/transaction/verify/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            },
          },
        ),
      );

      const data = response.data.data;
      if (transaction.status !== data.status) {
        transaction.status = data.status;
        transaction.paidAt = data.paid_at ? new Date(data.paid_at) : null;
        await this.transactionRepo.save(transaction);
      }
      return {
        reference: transaction.reference,
        status: transaction.status,
        amount: transaction.amount,
        paid_at: transaction.paidAt,
      };
    } catch (error) {
      return transaction;
    }
  }

  async processWebhook(signature: string, event: any) {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not set');
    }
    const hash = crypto
      .createHmac('sha512', secretKey)
      .update(JSON.stringify(event))
      .digest('hex');

    if (hash !== signature)
      throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);

    if (event.event === 'charge.success') {
      const transaction = await this.transactionRepo.findOne({
        where: { reference: event.data.reference },
      });
      if (transaction) {
        transaction.status = 'success';
        transaction.paidAt = new Date(event.data.paid_at);
        await this.transactionRepo.save(transaction);
      }
    }
    return true;
  }
}
