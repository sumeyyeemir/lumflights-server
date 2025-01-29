import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
    { id: 2, username: 'staff', password: 'staff123', role: 'staff' },
  ];

  constructor(private jwtService: JwtService) {}

  validateUser(username: string, pass: string): any {
    const user = this.users.find(u => u.username === username && u.password === pass);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id, username: user.username, role: user.role };
  }

  login(user: any) {
    const payload = { username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
