'use client';

import { useEffect, useRef } from 'react';
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import { Box, Container, Heading } from '@chakra-ui/react';
import { getPageTitle } from '@/lib/config/metadata';

export default function ApiDocs() {
  const swaggerUI = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swaggerUI.current) {
      // Add Swagger UI CSS
      const link = document.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css';
      document.head.appendChild(link);

      SwaggerUIBundle({
        url: '/api/docs',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
      });
    }
  }, []);

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={6}>
        <Heading as="h1" size="xl">
          {getPageTitle('API Documentation')}
        </Heading>
      </Box>
      <Box 
        id="swagger-ui"
        ref={swaggerUI}
        sx={{
          '.swagger-ui': {
            fontFamily: 'inherit'
          }
        }}
      />
    </Container>
  );
} 