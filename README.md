# Synapse MVP

A multi-platform chat application with AI-powered features including smart replies, avatar creation, and text-to-speech capabilities.

## Architecture

This is a monorepo containing four main packages:

- **`web/`** - React web application
- **`mobile/`** - React Native mobile application  
- **`backend/`** - Express.js API server
- **`shared/`** - Shared types, utilities, and constants

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- For mobile development: React Native CLI, Xcode (iOS), Android Studio (Android)

### Installation

```bash
# Install all dependencies
npm install

# Start development servers
npm run dev:backend  # Start backend API server
npm run dev:web      # Start web development server
npm run dev:mobile   # Start React Native metro bundler
```

### Building

```bash
# Build all packages
npm run build:all

# Build individual packages
npm run build:web
npm run build:mobile  
npm run build:backend
```

### Testing

```bash
# Run all tests
npm run test:all

# Run linting
npm run lint:all
```

## Features

### Chat UI
- Real-time messaging interface
- Message history and persistence
- Typing indicators
- Message status indicators

### Avatar Creation
- AI-powered avatar generation
- Customizable avatar features
- Photo-based avatar creation
- Avatar gallery and management

### Smart Reply
- AI-generated response suggestions
- Context-aware replies
- Customizable reply options

### Text-to-Speech
- Natural voice synthesis
- Multiple voice options
- Adjustable speech settings

## Project Structure

```
synapse-mvp/
├── web/                 # React web application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages/screens
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Web-specific utilities
├── mobile/              # React Native mobile app
│   ├── src/
│   │   ├── components/  # Mobile UI components
│   │   ├── screens/     # Application screens
│   │   ├── navigation/  # Navigation configuration
│   │   └── utils/       # Mobile-specific utilities
├── backend/             # Express.js API server
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── services/    # Business logic services
│   │   ├── middleware/  # Express middleware
│   │   └── utils/       # Backend utilities
└── shared/              # Shared code across platforms
    ├── src/
    │   ├── types/       # TypeScript type definitions
    │   ├── constants/   # Application constants
    │   └── utils/       # Shared utility functions
```

## Development

Each package has its own development workflow. See individual README files in each package for specific instructions.

## Contributing

1. Follow the existing code style and patterns
2. Add tests for new functionality
3. Update documentation as needed
4. Ensure all packages build successfully

## License

MIT