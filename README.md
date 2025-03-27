# Next.js Base Project

A modern, production-ready Next.js scaffolding project that provides a solid foundation for building full-stack web applications. This project uses the App Router and follows current best practices for Next.js development.

## Core Features

- **Frontend**
  - Next.js 14 with App Router architecture
  - TypeScript for type safety
  - Chakra UI for simple, accessible styling
  - Responsive layouts with modern design patterns
  - Client-side state management using React Context

- **Backend**
  - Server-side API routes with Next.js
  - MongoDB integration with Mongoose
  - JWT-based authentication with cookie storage
  - Winston logging system for production monitoring
  - Swagger/OpenAPI documentation

- **AI Integration**
  - Anthropic API (@anthropic-ai/sdk)
  - OpenAI API (openai)
  - Pre-configured clients with error handling
  - Environment-based configuration

- **Development Tools**
  - Jest and React Testing Library
  - ESLint and TypeScript for code quality
  - Hot reloading for rapid development
  - Environment variable management
  - Vercel deployment configuration

## Quick Start

### Prerequisites
This project requires Node.js version 18.17 or later. If you don't have Node.js installed:
- **Windows/macOS**: Download and install from [nodejs.org](https://nodejs.org/)
- **Linux**: Use your distribution's package manager or [nodejs.org](https://nodejs.org/)

You can verify your Node.js installation by running `node --version` in your terminal.

1. Clone and install:
   ```bash
   git clone <repository-url>
   cd next-js-base
   npm install
   ```

2. Configure environment:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your settings
   ```

3. Start development:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── config/         # Configuration page
│   └── page.tsx        # Main application page
├── components/         # Reusable React components
├── lib/               # Core utilities
│   ├── ai/            # AI service integrations
│   ├── auth/          # Authentication utilities
│   ├── db/            # Database configuration
│   └── logger/        # Winston logger setup
└── models/            # MongoDB models
```

## Key Features

### Authentication
- Simple JWT-based system using cookies
- Middleware protection for API routes
- Configurable token expiration
- Secure HTTP-only cookie storage

### Database
- MongoDB connection with Mongoose
- Connection pooling and caching
- Type-safe models with TypeScript
- Automatic schema validation

### AI Integration
- Pre-configured API clients
- Error handling and logging
- Rate limiting support
- Type-safe message interfaces

### Logging
- Winston-based logging system
- Environment-based log levels
- File and console transports
- Request/response logging

## Configuration

The system uses environment variables for sensitive configuration and localStorage for user preferences:

### Environment Variables (.env.local)
Sensitive configuration values are stored in `.env.local`:
```bash
# Core
MONGODB_URI=           # MongoDB connection string
JWT_SECRET=           # JWT signing secret

# AI Services
ANTHROPIC_API_KEY=    # Claude API key
OPENAI_API_KEY=       # OpenAI API key

# Optional
LOG_LEVEL=info        # Winston log level
```

### User Preferences (localStorage)
The following settings are configurable through the UI and stored in the browser:
- Active AI Provider (Anthropic/OpenAI)
- Anthropic Model Name
- OpenAI Model Name

Default values for these settings are loaded from environment variables:
```bash
# Default AI Configuration (user-configurable via UI)
NEXT_PUBLIC_ACTIVE_AI_PROVIDER=anthropic
NEXT_PUBLIC_ANTHROPIC_MODEL=claude-3-sonnet-20240229
NEXT_PUBLIC_OPENAI_MODEL=gpt-4-turbo-preview
```

Changes to user preferences:
- Are immediately reflected in the UI
- Persist across browser sessions via localStorage
- Are specific to each user's browser
- Do not modify the .env.local file

### Available Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npm test` - Run tests
- `npm run lint` - ESLint check
- `npm run type-check` - TypeScript check

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel login
vercel
```

### Manual Deployment
1. Build: `npm run build`
2. Set environment variables
3. Start: `npm start`

## Issues
### next-swagger-doc@0.4.0 (pinned in package.json)
next-swagger-doc@0.4.1 has a bug that causes the build to fail: https://github.com/jellydn/next-swagger-doc/issues/1157

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - See LICENSE file 