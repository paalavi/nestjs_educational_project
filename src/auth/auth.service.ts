import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { authDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async signUp(body: authDto) {
    try {
      const createResult = await this.prismaService.user.create({
        data: {
          email: body.email,
          hash: body.password,
          firstName: 'payam',
          lastName: 'alavi',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
      console.log({ createResult });
      return createResult;
    } catch (error) {
      throw new InternalServerErrorException('custom error message');
    }
  }

  async signIn(email: string) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { email },
      });
      const payload = {
        sub: user.id,
        email: user.email,
      };
      const token = this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('jwt_secret'),
      });

      return token;
    } catch (error) {
      throw new InternalServerErrorException('custom error message');
    }
  }
}
