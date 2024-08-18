import { AuthService } from 'src/auth/auth.service';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.authService.validateUser(username, password);

      if (!user) {
        throw new UnauthorizedException('Incorrect email or password');
      } else if (!user.isActive) {
        throw new UnauthorizedException(
          'Account is disabled. Please contact the administrator for assistance.',
        );
      } else if (!user.isVerified) {
        throw new UnauthorizedException(
          'Account is not verified. Please verify your account before proceeding.',
        );
      }
      return user;
    } catch (e) {
      if (e instanceof NotFoundException)
        throw new UnauthorizedException('Incorrect email or password');
      else throw e;
    }
  }
}
