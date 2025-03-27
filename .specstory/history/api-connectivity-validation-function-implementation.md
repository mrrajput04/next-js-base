## SpecStory

## API Connectivity Validation Function Implementation (2/3/2025, 9:53:39 AM)

_**User**_

@claude.ts I want to add an exported function to both the openai.txt and claude.ts that will validate that connectivity to the external api services is functioning as we suspect.  This function should test the configured API_KEYS for the services and provide either a success result or throw a reasonably understandable reason for a failure.

---

_**Assistant**_

I'll help you add a connectivity validation function to both files. Here are the changes needed:

For OpenAI:
```typescript:src/lib/ai/openai.ts
// ... existing code ...

export async function validateOpenAIConnection(): Promise<boolean> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
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
        throw new Error('Invalid OpenAI API key');
      } else if (error.message.includes('model')) {
        throw new Error(`Invalid model configuration: ${OPENAI_MODEL}`);
      }
      throw new Error(`OpenAI connection failed: ${error.message}`);
    }
    throw error;
  }
}

export default openai;
```

For Claude:
```typescript:src/lib/ai/claude.ts
// ... existing code ...

export async function validateClaudeConnection(): Promise<boolean> {
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
      throw new Error(`Claude connection failed: ${error.message}`);
    }
    throw error;
  }
}

export default anthropic;
```

These functions:
1. Return `true` if the connection is successful
2. Make a minimal API request to validate both the API key and model configuration
3. Throw specific errors for common issues (missing/invalid API key, invalid model)
4. Include error message details for other types of failures
5. Can be used in your application's startup or health check routines

You can use them like this:
```typescript
try {
  await validateOpenAIConnection();
  console.log('OpenAI connection successful');
} catch (error) {
  console.error('OpenAI connection failed:', error.message);
}
```

---

_**User**_

@Codebase Where is the code to validate the mongodb connection?  in which file?

---

_**Assistant**_

Looking at the provided codebase, the MongoDB connection validation is implemented in the API route:


```49:76:src/app/api/validate-mongodb/route.ts
export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const headersList = headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  // Check rate limit
  if (rateLimiter.isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    const conn = await connectDB();
    if (conn.readyState === 1) { // 1 = connected
      return NextResponse.json({ message: 'success' }, { status: 200 });
    } else {
      throw new Error('MongoDB connection not ready');
    }
  } catch (error) {
    logger.error('MongoDB validation failed:', error);
    return NextResponse.json(
      { error: 'Failed to connect to MongoDB' },
      { status: 500 }
    );
  }
}
```


This endpoint validates the MongoDB connection by:
1. Attempting to connect using `connectDB()`
2. Checking if the connection's `readyState` is 1 (connected)
3. Returns a success or error response accordingly

The actual connection logic is in:

```20:45:src/lib/db/mongodb.ts
async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logger.info('Connected to MongoDB');
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    logger.error('Error connecting to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}
```


However, for consistency with the AI service validation functions, we could create a dedicated validation function in `src/lib/db/mongodb.ts`. Here's how we could add it:

```typescript
export async function validateMongoDBConnection(): Promise<boolean> {
  try {
    const conn = await connectDB();
    if (conn.readyState !== 1) {
      throw new Error('MongoDB connection not ready');
    }
    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('MONGODB_URI')) {
        throw new Error('MongoDB URI is not set');
      } else if (error.message.includes('authentication')) {
        throw new Error('MongoDB authentication failed');
      }
      throw new Error(`MongoDB connection failed: ${error.message}`);
    }
    throw error;
  }
}
```

This would provide a consistent interface with the other validation functions (`validateClaudeConnection` and `validateOpenAIConnection`), making it easier to check all external service connections in a similar way.

---



---

