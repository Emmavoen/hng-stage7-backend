import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt'; // Import this
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;

    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    return res.status(200).json({
      message: 'Authentication successful',
      token: token,
      user: user,
    });
  }
}
