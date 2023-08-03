import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { AuthorisationModule } from './authorisation/authorisation.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestModule } from './request/request.module';
import { VendorModule } from './vendor/vendor.module';
import { SMSModule } from './sms/sms.module';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';

const getEnvFilePath = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return '.env';
  }
  return `${process.env.NODE_ENV}.env`;
};

const configModuleOptions: ConfigModuleOptions = {
  envFilePath: getEnvFilePath(),
  isGlobal: true,
  load: [() => ({ app: { name: 'rideon-service' } })],
};

ConfigModule.forRoot();
@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      dbName: process.env.DB_NAME,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL_FROM_ADDRESS,
          clientId: process.env.EMAIL_CLIENT_ID,
          clientSecret: process.env.EMAIL_CLIENT_SECRET,
          refreshToken: process.env.EMAIL_CLIENT_REFRESH_TOKEN,
          accessToken: process.env.EMAIL_CLIENT_ACCESS_TOKEN,
        },
      },
    }),
    ConfigModule.forRoot(configModuleOptions),
    AuthorisationModule,
    UserModule,
    RequestModule,
    VendorModule,
    SMSModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
