import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { AuthorisationModule } from './authorisation/authorisation.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestModule } from './request/request.module';

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

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      dbName: 'rideon',
    }),
    ConfigModule.forRoot(configModuleOptions),
    AuthorisationModule,
    UserModule,
    RequestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
