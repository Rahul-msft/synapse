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

## Deployment

This repository includes a comprehensive CI/CD pipeline that automatically builds, tests, and deploys the application.

### GitHub Actions Workflow

The CI/CD pipeline (`.github/workflows/ci-cd.yml`) includes the following jobs:

1. **Build and Test**: Builds all packages, runs tests, and performs linting
2. **Deploy Backend**: Deploys the backend to a server via SSH (on main branch pushes)
3. **Deploy Web**: Deploys the web app to GitHub Pages (on main branch pushes)  
4. **Build Mobile Preview**: Optional mobile build preview

### Required Secrets

To enable full deployment functionality, configure the following secrets in your GitHub repository settings:

#### Backend Deployment (SSH)
- `SSH_PRIVATE_KEY`: Private SSH key for server access
- `REMOTE_USER`: Username for SSH connection (e.g., `ubuntu`, `deploy`)
- `REMOTE_HOST`: Server hostname or IP address (e.g., `your-server.com`)
- `REMOTE_PATH`: Deployment path on the server (e.g., `/home/deploy/apps`)

#### Mobile Development (Optional)
- `EXPO_TOKEN`: Expo authentication token (if using Expo builds)

### Setting up Deployment Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each required secret with its corresponding value

#### SSH Key Setup Example

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t ed25519 -C "deploy@synapse-app"

# Add public key to server's authorized_keys
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your-server.com

# Copy private key content for GitHub secret
cat ~/.ssh/id_ed25519
```

### Deployment Process

#### Backend Deployment
- Automatically deploys to the specified server on pushes to `main`
- Creates backups of previous deployments
- Uses PM2 for process management (if available)
- Falls back to basic process management if PM2 is not installed

#### Web Deployment  
- Automatically deploys to GitHub Pages on pushes to `main`
- Builds the React app with proper base path configuration
- Serves the application at `https://[username].github.io/[repository-name]/`

#### Mobile Deployment
- Currently supports React Native CLI projects
- Provides guidance for setting up CodePush, App Center, or Fastlane
- Future Expo support can be added if the project is converted

### Manual Deployment

You can also run deployments manually:

```bash
# Deploy backend (after SSH setup)
npm run build:all
scp -r backend/dist/* user@server:/path/to/app/
ssh user@server 'cd /path/to/app && npm install --production && pm2 restart app'

# Build for web deployment
npm run build:web
# Then upload web/dist/* to your web server
```

## License

MIT