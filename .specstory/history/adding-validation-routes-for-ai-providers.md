## SpecStory

## Adding Validation Routes for AI Providers (2/2/2025, 10:04:09 PM)

_**User**_

@route.ts @openai.ts @claude.ts In a very similar way to the validate-mongodb route, I want to add a validate-openai route and a validate-anthropic route.  Please change the validation routine in claude.ts to be validateAnthropicConnection.  Anthropic is the provider, Claude is a model name.    I'd like these routes to show up in my API docs pages that shows the swagger interface.   Any questions?

---

_**Assistant**_

I'll help create the validation routes for OpenAI and Anthropic, and rename the Claude validation function. I'll create two new route files and update the Claude validation function name.

First, let's rename the validation function in claude.ts:

```typescript:src/lib/ai/claude.ts
// ... existing code ...

export async function validateAnthropicConnection(): Promise<boolean> {
  // ... existing validateClaudeConnection function content stays the same ...
}

// ... existing code ...
```

Now let's create the two new route files:

```typescript:src/app/api/validate-openai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateOpenAIConnection } from '@/lib/ai/openai';
import { RateLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

const rateLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

/**
 * @swagger
 * /api/validate-openai:
 *   post:
 *     tags:
 *       - AI Providers
 *     summary: Validate OpenAI connection
 *     description: Attempts to connect to OpenAI using configured API key and model
 *     responses:
 *       200:
 *         description: Successfully connected to OpenAI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Rate limit exceeded
 *       500:
 *         description: OpenAI connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to connect to OpenAI
 */
export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    await validateOpenAIConnection();
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('OpenAI validation failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to connect to OpenAI' },
      { status: 500 }
    );
  }
}
```

```typescript:src/app/api/validate-anthropic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { validateAnthropicConnection } from '@/lib/ai/claude';
import { RateLimiter } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

const rateLimiter = new RateLimiter(10, 60 * 1000); // 10 requests per minute

/**
 * @swagger
 * /api/validate-anthropic:
 *   post:
 *     tags:
 *       - AI Providers
 *     summary: Validate Anthropic connection
 *     description: Attempts to connect to Anthropic using configured API key and model
 *     responses:
 *       200:
 *         description: Successfully connected to Anthropic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: success
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Rate limit exceeded
 *       500:
 *         description: Anthropic connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to connect to Anthropic
 */
export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    await validateAnthropicConnection();
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('Anthropic validation failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to connect to Anthropic' },
      { status: 500 }
    );
  }
}
```

These changes will:
1. Rename the validation function in claude.ts to `validateAnthropicConnection`
2. Create two new API routes with Swagger documentation
3. Use the same rate limiting pattern as the MongoDB validation route
4. Group the new endpoints under an "AI Providers" tag in the Swagger docs
5. Return detailed error messages when the connection fails

The routes will be automatically picked up by your Swagger documentation system since they include the proper JSDoc comments. All three validation endpoints (MongoDB, OpenAI, and Anthropic) will be visible in your API documentation interface.

Let me know if you need any clarification or have questions about the implementation!

---

_**User**_

in claude.ts the error message should refer to anthropic connection not claude connection @claude.ts 

---

_**Assistant**_

I'll update the error message in claude.ts to refer to Anthropic instead of Claude:

```typescript:src/lib/ai/claude.ts
// ... existing code ...

export async function validateAnthropicConnection(): Promise<boolean> {
  try {
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    // Test the connection with a minimal request
    await anthropic.messages.create({
      model: ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'test' }]
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid Anthropic API key');
      } else if (error.message.includes('model')) {
        throw new Error(`Invalid model configuration: ${ANTHROPIC_MODEL}`);
      }
      throw new Error(`Anthropic connection failed: ${error.message}`);
    }
    throw error;
  }
}

// ... existing code ...
```

The change replaces the error message text from "Claude connection failed" to "Anthropic connection failed" to be consistent with referring to the provider rather than the model.

---

_**User**_

Can we fix it so that Anthropic Connection Failed message coming from the API doesn't present in the terminal output as a full on exception?

---

_**Assistant**_

Yes, we can modify the error handling in the validate-anthropic route to avoid logging the full exception while still maintaining informative error messages. Here's the change:

```typescript:src/app/api/validate-anthropic/route.ts
// ... existing code ...

export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    await validateAnthropic

---

_**User**_

@claude.ts 

---

_**Assistant**_

I'll modify the error handling in claude.ts to avoid throwing errors during validation, and instead return a more controlled response:

```typescript:src/lib/ai/claude.ts
// ... existing code ...

export async function validateAnthropicConnection(): Promise<boolean> {
  try {
    if (!ANTHROPIC_API_KEY) {
      logger.warn('ANTHROPIC_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await anthropic.messages.create({
      model: ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'test' }]
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        logger.warn('Invalid Anthropic API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${ANTHROPIC_MODEL}`);
      } else {
        logger.warn('Anthropic connection failed:', error.message);
      }
    }
    return false;
  }
}

// ... existing code ...
```

This change:
1. Uses `logger.warn` instead of throwing errors
2. Returns `false` instead of throwing when validation fails
3. Still provides informative messages in the logs but without full stack traces
4. Maintains the same functionality but with cleaner error handling

You'll need to update the validate-anthropic route to handle the boolean response accordingly.

---

_**User**_

I like the terminal output much better, but now the result from the api validation shows 'success'.  It failed because the api key was wrong.

---

_**Assistant**_



Ah yes, we need to update the validate-anthropic route to properly handle the boolean response from validateAnthropicConnection(). Here's the fix:

```typescript:src/app/api/validate-anthropic/route.ts
// ... existing code ...

export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    const isValid = await validateAnthropicConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to connect to Anthropic' },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('Anthropic validation failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Anthropic' },
      { status: 500 }
    );
  }
}
```

Now it will return a 500 status with an error message when the validation returns false. The same pattern should be applied to the OpenAI validation route as well for consistency.

---

_**User**_

Yes, please apply the pattern to the openai validation route.  

---

_**Assistant**_

I'll update the OpenAI validation to follow the same pattern, first modifying the validation function in openai.ts to return boolean and use logger.warn, then updating the route:

```typescript:src/lib/ai/openai.ts
// ... existing code ...

export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    if (!OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await openai.chat.completions.create({
      model: OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        logger.warn('Invalid OpenAI API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${OPENAI_MODEL}`);
      } else {
        logger.warn('OpenAI connection failed:', error.message);
      }
    }
    return false;
  }
}
```

```typescript:src/app/api/validate-openai/route.ts
// ... existing code ...

export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    const isValid = await validateOpenAIConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to connect to OpenAI' },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('OpenAI validation failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to OpenAI' },
      { status: 500 }
    );
  }
}
```

These changes will make the OpenAI validation behave consistently with the Anthropic validation, using warning logs instead of errors and returning appropriate responses through the API.

---

_**User**_

in both the openai and anthropic validation connections.  When the attempt fails, print the remote service api's response to the console

---

_**Assistant**_

I'll update both validation functions to log the detailed API error responses:

```typescript:src/lib/ai/openai.ts
export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    if (!OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await openai.chat.completions.create({
      model: OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        logger.warn('Invalid OpenAI API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${OPENAI_MODEL}`);
      } else {
        logger.warn('OpenAI connection failed:', error.message);
      }
      // Log the full error response
      logger.debug('OpenAI API response:', error);
    }
    return false;
  }
}
```

```typescript:src/lib/ai/claude.ts
export async function validateAnthropicConnection(): Promise<boolean> {
  try {
    if (!ANTHROPIC_API_KEY) {
      logger.warn('ANTHROPIC_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await anthropic.messages.create({
      model: ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'test' }]
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        logger.warn('Invalid Anthropic API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${ANTHROPIC_MODEL}`);
      } else {
        logger.warn('Anthropic connection failed:', error.message);
      }
      // Log the full error response
      logger.debug('Anthropic API response:', error);
    }
    return false;
  }
}
```

I've added `logger.debug` calls to log the full error object from both APIs. This will help with debugging by showing the complete error response from the remote services while keeping the user-facing messages clean and consistent.

---

_**User**_

set the logging level to DEBUG for the development environments @Codebase 

---

_**Assistant**_

Looking at your codebase, I'll help you set the logging level to DEBUG. This should be done in your `.env.local` file:

```env:.env.local
# ... other configurations ...

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=app.log

# ... rest of the configurations ...
```

This change from `LOG_LEVEL=info` to `LOG_LEVEL=debug` will allow you to see the detailed error responses from both OpenAI and Anthropic APIs in your logs when validation fails. The debug logs we added earlier with `logger.debug()` will now be visible in your console and log file.

Make sure to restart your development server after making this change for it to take effect.

---

_**User**_

In the opeai.ts file handle an OpenAI response of 429 "exceed your current quota" separately as an possible response.  When we get this error, I want the user to understand what the error was.

---

_**Assistant**_

I'll modify the OpenAI validation function to specifically handle the quota exceeded error:

```typescript:src/lib/ai/openai.ts
export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    if (!OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await openai.chat.completions.create({
      model: OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      // Check for quota exceeded error
      if (error.message.includes('exceed your current quota')) {
        logger.warn('OpenAI API quota exceeded. Please check your billing status and limits.');
        throw new Error('OpenAI API quota exceeded. Please check your billing status and limits.');
      }
      
      if (error.message.includes('API key')) {
        logger.warn('Invalid OpenAI API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${OPENAI_MODEL}`);
      } else {
        logger.warn('OpenAI connection failed:', error.message);
      }
      // Log the full error response
      logger.debug('OpenAI API response:', error);
    }
    return false;
  }
}
```

And update the route handler to display this specific error:

```typescript:src/app/api/validate-openai/route.ts
export async function POST(request: NextRequest) {
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    const isValid = await validateOpenAIConnection();
    if (!isValid) {
      return NextResponse.json(
        { error: 'Failed to connect to OpenAI' },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'success' }, { status: 200 });
  } catch (error) {
    logger.error('OpenAI validation failed:', error);
    // Check if it's a quota exceeded error
    if (error instanceof Error && error.message.includes('quota exceeded')) {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your billing status and limits.' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to connect to OpenAI' },
      { status: 500 }
    );
  }
}
```

This change will:
1. Specifically detect the quota exceeded error
2. Throw a specific error with a more informative message
3. Return a 429 status code with a clear message when the quota is exceeded
4. Still log the full error response for debugging
5. Provide a more helpful message to the user about checking their billing status

The user will now see a clear message when their OpenAI API quota is exceeded, rather than a generic connection failure message.

---

_**User**_

I still just get a 500 response in this validation case where I exceeded my service providers quota.  Can you double check your logic?

---

_**Assistant**_

Ah, I see the issue. In the OpenAI validation function, we're throwing the error but then continuing to execute code that returns false. Let's fix the logic:

```typescript:src/lib/ai/openai.ts
export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    if (!OPENAI_API_KEY) {
      logger.warn('OPENAI_API_KEY is not set');
      return false;
    }

    // Test the connection with a minimal request
    await openai.chat.completions.create({
      model: OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 1
    });

    return true;
  } catch (error) {
    if (error instanceof Error) {
      // Log the full error response first
      logger.debug('OpenAI API response:', error);
      
      // Check for quota exceeded error
      if (error.message.toLowerCase().includes('quota')) {
        logger.warn('OpenAI API quota exceeded. Please check your billing status and limits.');
        throw error; // Throw the original error to preserve the full error details
      }
      
      if (error.message.includes('API key')) {
        logger.warn('Invalid OpenAI API key');
      } else if (error.message.includes('model')) {
        logger.warn(`Invalid model configuration: ${OPENAI_MODEL}`);
      } else {
        logger.warn('OpenAI connection failed:', error.message);
      }
    }
    return false;
  }
}
```

The issue was that after throwing the quota error, the code was still hitting the `return false` statement. Now we:
1. Log the full error response first for debugging
2. Check for quota issues and throw immediately if found
3. Only handle other error cases if it's not a quota issue

This should now properly propagate the quota error to the route handler, which will then return the 429 status code as intended.

---



---

