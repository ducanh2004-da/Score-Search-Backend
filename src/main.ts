import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://score-search-frontend-tqa5.vercel.app',
      'https://score-search-backend-1.onrender.com',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, Cookie',
  });
  
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
