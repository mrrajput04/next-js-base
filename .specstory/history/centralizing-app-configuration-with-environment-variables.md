## SpecStory

## Centralizing App Configuration with Environment Variables (2/4/2025, 10:06:18 AM)

_**User**_

@Codebase I want to pull the application title and the application tagline from the .env.local file, display it on the home page and then have that reflected in all pages pulling from a centralized variable.

---

_**Assistant**_

I'll help you update the code to use the environment variables for the app name and tagline consistently across the application. Here are the necessary changes:

1. First, let's update the metadata configuration to use the environment variables:

```typescript:src/lib/config/metadata.ts
// existing code...
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'AISC Query Assist';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_TAGLINE || 'A modern, AI-powered query assistant';

export const getPageTitle = (pageName?: string) => {
  return pageName ? `${APP_NAME} - ${pageName}` : APP_NAME;
};
```

2. Update the home page to use these variables:

```typescript:src/app/page.tsx
// ... other imports
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config/metadata';

export default function Home() {
  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            {APP_NAME}
          </Heading>
          <Text fontSize="xl" color="gray.600">
            {APP_DESCRIPTION}
          </Text>
        </Box>

        {/* Rest of the component remains unchanged... */}
```

3. The layout file is already using these variables, but let's make sure it's consistent:

```typescript:src/app/layout.tsx
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config/metadata';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

// Rest of the file remains unchanged...
```

Now the application will:
1. Pull the app name from `NEXT_PUBLIC_APP_NAME` environment variable
2. Pull the tagline from `NEXT_PUBLIC_APP_TAGLINE` environment variable
3. Use these values consistently across all pages
4. Fall back to default values if the environment variables are not set
5. Maintain consistent page titles using the `getPageTitle` helper function

The changes centralize the application name and tagline configuration, making it easier to update these values by just modifying the environment variables. The values will be reflected across the entire application, including the browser tab title, main heading, and metadata.

---



---

