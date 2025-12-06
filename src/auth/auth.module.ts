import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.stategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule], // Imports UsersModule to get access to User Repository
  controllers: [AuthController],
  providers: [GoogleStrategy],
})
export class AuthModule {}
