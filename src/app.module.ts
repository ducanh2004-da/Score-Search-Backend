import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ScoreModule } from './score/score.module';
import { GqlGlobalExceptionFilter } from './common/filters/gql-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
const depthLimit = require('graphql-depth-limit');
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    ScoreModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',

      debug: process.env.NODE_ENV !== 'production',
      introspection: true,
      playground: false,
      csrfPrevention: false,

      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        ApolloServerPluginCacheControl({ defaultMaxAge: 1800 }),
      ],
      validationRules: [
        depthLimit(parseInt(process.env.MAX_QUERY_DEPTH || '11'), {
          ignore: [/IntrospectionQuery/, /__schema/],
        }),
      ],
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      context: ({ req, res }) => ({ req, res }),
      formatError: (error) => {
        console.error('GraphQL Error:', {
          message: error.message,
          code: error.extensions?.code,
          path: error.path,
        });

        if (process.env.NODE_ENV === 'production') {
          return {
            message: error.message,
            extensions: {
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            },
          };
        }
        return error;
      },
    }),
    // ========================================
    // CACHE MODULE (REDIS)
    // ========================================
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get<string>('REDIS_URL') || process.env.REDIS_URL,
        ttl: 600,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GqlGlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
