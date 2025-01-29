import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReservationsModule } from './reservations/reservations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
      ConfigModule.forRoot({ // .env dosyasını yükler
        isGlobal: true, // Tüm modüllerde kullanılabilir hale getirir
      }),
      AuthModule,
      ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
