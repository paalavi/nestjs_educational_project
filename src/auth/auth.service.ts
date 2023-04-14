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
      const payload = {
        sub: createResult.id,
        email: createResult.email,
      };
      return this.getJwtToken(payload);
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
      return this.getJwtToken(payload);
    } catch (error) {
      throw new InternalServerErrorException('custom error message');
    }
  }

  private getJwtToken(jwtPayload: { sub: number; email: string }) {
    return this.jwt.signAsync(jwtPayload, {
      expiresIn: '15min',
      secret: this.config.get('jwt_secret'),
    });
  }
}
