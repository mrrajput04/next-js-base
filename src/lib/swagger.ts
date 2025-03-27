import { createSwaggerSpec } from 'next-swagger-doc';
import { APP_NAME } from '@/lib/config/metadata';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: `${APP_NAME} API Documentation`,
        version: '1.0.0',
        description: `API documentation for ${APP_NAME}`,
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
  });
  return spec;
}; 