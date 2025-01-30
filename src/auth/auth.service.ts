import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { firestore } from 'src/firebase/firebase.config';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService
  ) {}

  async validateUser(token: string): Promise<any> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userRef = firestore.collection('users').doc(decodedToken.uid);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new UnauthorizedException('User not found');
      }

      const user = userDoc.data();

      return { id: decodedToken.uid, email: user?.email, role: user?.role };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}