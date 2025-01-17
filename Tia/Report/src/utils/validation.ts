import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios from 'axios';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      // Validate token with the auth service
      const response = await axios.post(
        'http://auth_service:5555/api/validate',
        { token },
      );

      if (response.status !== 200) {
        throw new UnauthorizedException('Invalid token');
      }

      // Add user info to request object
      request.user = response.data.user;
      return true;
    } catch {
      throw new UnauthorizedException('Auth service error');
    }
  }
}
