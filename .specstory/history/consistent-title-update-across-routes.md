## SpecStory

## Consistent Title Update Across Routes (2/3/2025, 11:00:05 AM)

_**User**_

@Codebase I want the application title that is described on the primary home page to be displayed by all the other routes including the swagger api docs and the config screen.

---

_**Assistant**_

I'll help you update the title across all routes to maintain consistency with the home page title "AISC Query Assist". Here are the necessary changes:

1. First, let's update the metadata in the root layout:

```typescript:src/app/layout.tsx
// existing imports...

export const metadata: Metadata = {
  title: 'AISC Query Assist',
  description: 'A modern, AI-powered query assistant',
};

// rest of the file...
```

2. Update the API Docs page title:

```typescript:src/app/api-docs/page.tsx
// ... existing imports

export default function ApiDocs() {
  const swaggerUI = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ... existing SwaggerUI setup code
  }, []);

  return (
    <Container maxW="container.xl" py={10}>
      <Box mb={6}>
        <Heading as="h1" size="xl">
          AISC Query Assist - API Documentation
        </Heading>
      </Box>
      <Box 
        id="swagger-ui"
        ref={swaggerUI}
        // ... existing styles
      />
    </Container>
  );
}
```

3. Update the Config page title:

```typescript:src/app/config/page.tsx
// ... existing imports

export default function ConfigPage() {
  // ... existing state and handlers

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            AISC Query Assist - Configuration
          </Heading>
        </Box>

        {/* rest of the component... */}
      </VStack>
    </Container>
  );
}
```

4. Update the Swagger API documentation title:

```typescript:src/lib/swagger.ts
export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'AISC Query Assist API Documentation',
        version: '1.0.0',
        description: 'API documentation for AISC Query Assist',
      },
      // ... rest of the configuration
    },
  });
  return spec;
};
```

These changes will ensure that:
- The browser tab title shows "AISC Query Assist" consistently
- Each page shows the application name in its heading
- The API documentation reflects the correct application name
- The configuration page maintains consistent branding

---

_**User**_

I don't want the title to be hard-coded in the HTML on the config and apidocs pages, I want it to pull from some sort of common metadata or variable.

---

_**Assistant**_

I'll help you create a centralized way to manage the application title and then reference it across different pages. Here's how we can do that:

1. First, let's create a new configuration file for common app metadata:

```typescript:src/lib/config/metadata.ts
export const APP_NAME = 'AISC Query Assist';
export const APP_DESCRIPTION = 'A modern, AI-powered query assistant';

export const getPageTitle = (pageName?: string) => {
  return pageName ? `${APP_NAME} - ${pageName}` : APP_NAME;
};
```

2. Now let's update the layout to use these constants:

```typescript:src/app/layout.tsx
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config/metadata';

// ... other imports

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

// ... rest of the file
```

3. Update the API Docs page to use the centralized title:

```typescript:src/app/api-docs/page.tsx
'use client';

import { useEffect, useRef } from 'react';
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import { Box, Container, Heading } from '@chakra-ui/react';
import { getPageTitle } from '@/lib/config/metadata';

export default function ApiDocs() {
  const swaggerUI = useRef<HTMLDivElement>(null);

  // ... existing SwaggerUI setup code

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
```

4. Update the Config page to use the centralized title:

```typescript:src/app/config/page.tsx
'use client';

import { getPageTitle } from '@/lib/config/metadata';
// ... other imports

export default function ConfigPage() {
  // ... existing state and handlers

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            {getPageTitle('Configuration')}
          </Heading>
        </Box>
        
        {/* ... rest of the component */}
      </VStack>
    </Container>
  );
}
```

5. Update the Swagger documentation to use the same constants:

```typescript:src/lib/swagger.ts
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
      // ... rest of the configuration
    },
  });
  return spec;
};
```

This approach:
- Creates a single source of truth for the application name and description
- Provides a consistent way to format page titles
- Makes it easy to update the application name across all pages
- Maintains consistency in how titles are displayed
- Makes it easier to implement any future title format changes

The `getPageTitle` helper function makes it easy to maintain a consistent format for page titles throughout the application, and if you ever need to change how titles are formatted, you only need to update it in one place.

---



---

