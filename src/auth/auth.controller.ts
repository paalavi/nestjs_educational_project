import { Controller, Get, Body, Post, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { authDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private autService: AuthService) {}

  @Post('signUp')
  async signUp(@Body() dto: authDto) {
    //create a new user and return its token
    const result = await this.autService.signUp(dto);
    return result;
  }
  @Get('signIn')
  async signIn(@Headers('email') email: string) {
    //find user from db and return its token
    const result = await this.autService.signIn(email);
    return result;
  }
}
