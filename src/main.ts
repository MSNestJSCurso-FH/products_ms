import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Definir logger en nestjs
  const logger = new Logger('Main');

  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port,
      },
    },
  );

  // Habilitar la configuracion global de pipes (Validacion)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // await app.listen(3000);
  // await app.listen(envs.port);
  await app.listen();

  // Inicializar todos los microservicios (Hibrido)
  // await app.startAllMicroservices();

  // console.log(`App running on port ${envs.port}`);
  // logger.log(`App running on port ${envs.port}`);
  logger.log(`Products microservices running on port ${envs.port}`);
}
bootstrap();
