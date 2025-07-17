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

### 🚀 Quick Start: Deployment Secrets Setup

**New to deployment setup?** Use these helpful resources:

- **📝 [`deployment-secrets-template.md`](./deployment-secrets-template.md)** - Complete reference for all required secrets
- **🔧 [`scripts/generate-ssh-key.sh`](./scripts/generate-ssh-key.sh)** - Interactive SSH key generation script
- **🔐 [`scripts/setup-github-secrets.sh`](./scripts/setup-github-secrets.sh)** - Interactive GitHub secrets configuration guide
- **📖 [Detailed setup instructions](#setting-up-deployment-secrets)** - Step-by-step guide below

### GitHub Actions Workflow

The CI/CD pipeline (`.github/workflows/ci-cd.yml`) includes the following jobs:

1. **Build and Test**: Builds all packages, runs tests, and performs linting
2. **Deploy Backend**: Deploys the backend to a server via SSH (on main branch pushes)
3. **Deploy Web**: Deploys the web app to GitHub Pages (on main branch pushes)  
4. **Build Mobile Preview**: Optional mobile build preview

### Required Secrets

⚠️ **Important**: All backend deployment secrets must be configured for successful deployment. The CI/CD pipeline will validate these secrets and fail with clear error messages if any are missing.

To enable full deployment functionality, configure the following secrets in your GitHub repository settings:

#### Backend Deployment (SSH)
- `SSH_PRIVATE_KEY`: Private SSH key for server access
- `REMOTE_USER`: Username for SSH connection (e.g., `ubuntu`, `deploy`)
- `REMOTE_HOST`: Server hostname or IP address (e.g., `your-server.com`)
- `REMOTE_PATH`: Deployment path on the server (e.g., `/home/deploy/apps`)

#### Mobile Development (Optional)
- `EXPO_TOKEN`: Expo authentication token (if using Expo builds)

### Setting up Deployment Secrets

#### Quick Setup with Helper Scripts

For a complete interactive setup experience, use our automated helper scripts:

```bash
# Option 1: Full guided setup (recommended for beginners)
./scripts/setup-github-secrets.sh

# Option 2: Just generate SSH keys (if you prefer manual GitHub setup)
./scripts/generate-ssh-key.sh
```

**The complete setup script** (`setup-github-secrets.sh`) will:
- Guide you through the entire GitHub secrets configuration process
- Help with SSH key generation if needed (calls generate-ssh-key.sh automatically)
- Provide step-by-step instructions for navigating GitHub's interface
- Verify all required secrets are properly configured
- Give you deployment testing guidance

**The SSH key generator** (`generate-ssh-key.sh`) will:
- Guide you through SSH key generation with recommended security settings
- Generate Ed25519 or RSA keys based on your preference
- Display the private key content for easy copying to GitHub Secrets
- Provide clear next steps for server setup and GitHub configuration

#### Manual Setup Steps

1. **Generate SSH Key (if you don't have one)**:
   ```bash
   # Generate Ed25519 key (recommended)
   ssh-keygen -t ed25519 -C "deploy@synapse-app" -f ~/.ssh/synapse_deploy_ed25519
   
   # Or generate RSA key (traditional)
   ssh-keygen -t rsa -b 4096 -C "deploy@synapse-app" -f ~/.ssh/synapse_deploy_rsa
   ```

2. **Add public key to your server**:
   ```bash
   # Copy public key to server
   ssh-copy-id -i ~/.ssh/synapse_deploy_ed25519.pub user@your-server.com
   
   # Or manually add to server's ~/.ssh/authorized_keys
   cat ~/.ssh/synapse_deploy_ed25519.pub | ssh user@your-server.com "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
   ```

3. **Configure GitHub repository secrets**:
   - Go to your GitHub repository
   - Navigate to **Settings → Secrets and variables → Actions**
   - Click **"New repository secret"**
   - Add each required secret with its corresponding value:

   ```bash
   # Get private key content for SSH_PRIVATE_KEY secret
   cat ~/.ssh/synapse_deploy_ed25519
   ```

#### Detailed Secret Descriptions

For complete descriptions of all required secrets, see [`deployment-secrets-template.md`](./deployment-secrets-template.md). This template includes:
- Detailed explanations of each secret
- Security best practices
- Troubleshooting tips
- Example values and formats

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

### Backend Deployment & Access

The backend API is configured to be accessible via a public URL for both mobile and web clients.

#### Configuration

The backend API URL is configured in the `.env` file:

```bash
BACKEND_API_URL=https://synapse-backend.rahul-msft.github.io
```

This URL allows both web and mobile clients to access the deployed backend services including:
- Chat messaging API
- Avatar generation and management
- Smart reply suggestions
- Text-to-speech services
- User authentication

#### Client Configuration

Both web and mobile clients are configured to use this backend URL:
- **Web client**: Configured in `web/src/utils/api.ts`
- **Mobile client**: Configured in `mobile/src/utils/api.ts`

For development, clients default to `http://localhost:8000/api`, but can be configured to use the public URL for testing against the deployed backend.

##### Environment Variables

To override the API URL in different environments:

**Web Client:**
Create a `.env` file in the `web/` directory:
```bash
REACT_APP_API_URL=https://synapse-backend.rahul-msft.github.io/api
```

**Mobile Client:**
The API URL can be set via environment variables or by updating the API_CONFIG in the shared package.

**Backend:**
The `.env` file in the `backend/` directory contains:
```bash
BACKEND_API_URL=https://synapse-backend.rahul-msft.github.io
```

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