import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function configureSwagger(app: NestFastifyApplication) {
  const config = new DocumentBuilder()
    .setTitle('Address book example')
    .setDescription('The strv-addressbook-anton-robert API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const customSwaggerOption: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'strv-address-book API Docs',
  };

  SwaggerModule.setup('api', app, document, customSwaggerOption);
}
