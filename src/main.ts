import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const address =
    process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
  await app.listen(port, address);
  console.log('');
  console.log('='.repeat(50));
  console.log(`🚀 Server is running`);
  console.log(`📍 HTTP: http://localhost:${port}`);
  console.log(`📍 GraphQL: http://localhost:${port}/graphql`);
  console.log(`🔐 CSRF Protection: ENABLED (doubleCsrf)`);
  console.log('='.repeat(50));
}
bootstrap();
