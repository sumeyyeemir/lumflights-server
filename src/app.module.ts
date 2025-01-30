import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true, 
      }),
      AuthModule,
      ReservationsModule,
      OpenAIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
