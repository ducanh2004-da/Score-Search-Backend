import { Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { Prisma } from '@prisma/client';

@Catch()
export class GqlGlobalExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GqlGlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      const response = ctx.getResponse();
      if (request.url.includes('favicon.ico') || request.url.includes('/api/ext')) {
        return response.status(404).send(); 
      }
    }

    this.logger.error(
      'An exception occurred:',
      exception instanceof Error ? exception.stack : String(exception),
    );

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();
      
      let message = exception.message;
      if (typeof response === 'object' && response !== null) {
        const resMessage = (response as any).message;
        message = Array.isArray(resMessage) ? resMessage.join(', ') : resMessage || exception.message;
      }

      return new GraphQLError(message, {
        extensions: {
          code: exception.name, 
          httpStatus: status,
        },
      });
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      let customMessage = 'Error when accessing database.';
      let code = 'PRISMA_ERROR';

      if (exception.code === 'P2002') {
        customMessage = 'There are the same data in database.';
        code = 'DUPLICATE_DATA';
      }
      else if (exception.code === 'P2025') {
        customMessage = 'Can not find the data.';
        code = 'RECORD_NOT_FOUND';
      }

      return new GraphQLError(customMessage, {
        extensions: { code },
      });
    }

    const isAxiosError = exception instanceof Error && (exception.name === 'AxiosError' || (exception as any).isAxiosError);
    if (isAxiosError) {
      const axiosError = exception as any;
      const apiResponseData = axiosError.response?.data || axiosError.message; 
      
      return new GraphQLError(`Error in calling API: ${axiosError.message}`, {
        extensions: {
          code: 'BAD_GATEWAY',
          aiResponse: apiResponseData, 
        },
      });
    }

    console.error('============ Other error ============');
    console.error(exception);
    
    const errorMessage = exception instanceof Error ? exception.message : 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau!';

    return new GraphQLError(`[DEV] ${errorMessage}`, {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        details: exception instanceof Error ? exception.stack : String(exception), // Ném stack trace xuống frontend để dễ đọc
      },
    });
  }
}