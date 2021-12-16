import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['RANDOMNUMBERSANDLETTERS']
  }))
  app.useGlobalPipes(new ValidationPipe({
    // MAKE SURE INCOMING REUQEST DOESN'T HAVE OTHER PROPERTIES
    // THEY WILL AUTOMATICALLY REMOVED
    whitelist: true
  }));
  await app.listen(3000);
}
bootstrap();
