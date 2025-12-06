import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('paystack/initiate')
  async initiate(@Body() body: { email: string; amount: number }) {
    return await this.paymentsService.initiatePayment(body.email, body.amount);
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
  async getStatus(@Param('reference') reference: string) {
    return await this.paymentsService.verifyTransaction(reference);
  }
}
