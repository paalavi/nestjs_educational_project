import { Controller, Get, Body, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private autService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() dto: authDto) {
    //create a new user
    const result = await this.autService.signUp(dto);
    return result;
  }
  @Get('signIn')
  async signIn(@Req() req: Request) {
    //find user from db
    const email = req.headers.email as string;
    const result = await this.autService.signIn(email);
    return result;
  }
}
