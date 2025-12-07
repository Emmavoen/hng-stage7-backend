import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';
import type { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('paystack/initiate')
  @UseGuards(AuthGuard('jwt'))
  async initiate(@Req() req, @Body() body: { amount: number }) {
    const email = req.user.email;

    return await this.paymentsService.initiatePayment(email, body.amount);
  }

  @Post('paystack/webhook')
  async webhook(@Req() req, @Res() res: Response) {
    await this.paymentsService.processWebhook(
      req.headers['x-paystack-signature'],
      req.body,
    );
    return res.status(HttpStatus.OK).send();
  }

  @Get(':reference/status')
  @UseGuards(AuthGuard('jwt'))
  async getStatus(@Param('reference') reference: string) {
    return await this.paymentsService.verifyTransaction(reference);
  }
}
