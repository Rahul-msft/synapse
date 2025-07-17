#!/bin/bash

# SSH Key Generation Script for Synapse Deployment
# This script helps generate SSH key pairs for secure backend deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo "================================================"
    echo "🔑 SSH Key Generator for Synapse Deployment"
    echo "================================================"
    echo ""
}

# Check if ssh-keygen is available
check_dependencies() {
    if ! command -v ssh-keygen &> /dev/null; then
        print_error "ssh-keygen is not installed. Please install OpenSSH client."
        exit 1
    fi
}

# Get user input for key configuration
get_user_input() {
    echo "This script will help you generate an SSH key pair for deploying the Synapse backend."
    echo ""
    
    # Key type selection
    print_info "Select SSH key type:"
    echo "1) Ed25519 (recommended - more secure and faster)"
    echo "2) RSA 4096-bit (traditional - widely compatible)"
    echo ""
    read -p "Enter your choice (1 or 2): " key_type_choice
    
    case $key_type_choice in
        1)
            KEY_TYPE="ed25519"
            KEY_SIZE=""
            ;;
        2)
            KEY_TYPE="rsa"
            KEY_SIZE="-b 4096"
            ;;
        *)
            print_warning "Invalid choice. Using Ed25519 (recommended)."
            KEY_TYPE="ed25519"
            KEY_SIZE=""
            ;;
    esac
    
    # Email/comment for key
    echo ""
    read -p "Enter your email address or comment for the key: " key_comment
    if [ -z "$key_comment" ]; then
        key_comment="synapse-deployment-$(date +%Y%m%d)"
    fi
    
    # Key filename
    echo ""
    default_filename="$HOME/.ssh/synapse_deploy_${KEY_TYPE}"
    read -p "Enter filename for the key (default: $default_filename): " key_filename
    if [ -z "$key_filename" ]; then
        key_filename="$default_filename"
    fi
    
    # Ensure .ssh directory exists
    ssh_dir=$(dirname "$key_filename")
    if [ ! -d "$ssh_dir" ]; then
        print_info "Creating SSH directory: $ssh_dir"
        mkdir -p "$ssh_dir"
        chmod 700 "$ssh_dir"
    fi
}

# Generate the SSH key
generate_key() {
    print_info "Generating SSH key..."
    echo ""
    
    # Check if key already exists
    if [ -f "$key_filename" ]; then
        print_warning "Key file already exists: $key_filename"
        read -p "Do you want to overwrite it? (y/N): " overwrite
        if [[ ! $overwrite =~ ^[Yy]$ ]]; then
            print_info "Operation cancelled."
            exit 0
        fi
    fi
    
    # Generate the key
    if [ "$KEY_TYPE" = "ed25519" ]; then
        ssh-keygen -t ed25519 -C "$key_comment" -f "$key_filename"
    else
        ssh-keygen -t rsa $KEY_SIZE -C "$key_comment" -f "$key_filename"
    fi
    
    # Set proper permissions
    chmod 600 "$key_filename"
    chmod 644 "${key_filename}.pub"
    
    print_success "SSH key pair generated successfully!"
}

# Display the results and next steps
show_results() {
    echo ""
    echo "================================================"
    echo "🎉 SSH Key Generation Complete!"
    echo "================================================"
    echo ""
    
    print_info "Generated files:"
    echo "   Private key: $key_filename"
    echo "   Public key:  ${key_filename}.pub"
    echo ""
    
    print_info "Public key content (add this to your server's authorized_keys):"
    echo ""
    cat "${key_filename}.pub"
    echo ""
    
    print_warning "Next steps for deployment setup:"
    echo ""
    echo "1. 📋 Copy the public key to your server:"
    echo "   ssh-copy-id -i ${key_filename}.pub user@your-server.com"
    echo "   OR manually add it to ~/.ssh/authorized_keys on your server"
    echo ""
    echo "2. 🔑 Add the private key as a GitHub secret:"
    echo "   • Go to your GitHub repository"
    echo "   • Navigate to Settings → Secrets and variables → Actions"
    echo "   • Add a new secret named 'SSH_PRIVATE_KEY'"
    echo "   • Copy and paste the ENTIRE content of the private key file:"
    echo ""
    print_info "Private key content (copy this to GitHub Secrets as SSH_PRIVATE_KEY):"
    echo ""
    echo "--- BEGIN PRIVATE KEY CONTENT ---"
    cat "$key_filename"
    echo "--- END PRIVATE KEY CONTENT ---"
    echo ""
    
    echo "3. 🔧 Configure other required secrets in GitHub:"
    echo "   • REMOTE_USER: Your server username (e.g., 'ubuntu', 'deploy')"
    echo "   • REMOTE_HOST: Your server hostname or IP address"
    echo "   • REMOTE_PATH: Deployment path on server (e.g., '/home/deploy/apps')"
    echo ""
    
    print_info "📖 See deployment-secrets-template.md for detailed descriptions of all required secrets."
    echo ""
    
    print_warning "Security reminders:"
    echo "   • Keep your private key secure and never share it"
    echo "   • The private key should only be added to GitHub Secrets"
    echo "   • Consider using a dedicated deployment user on your server"
    echo "   • Regularly rotate your SSH keys for better security"
    echo ""
    
    print_success "Your SSH key is ready for Synapse backend deployment!"
}

# Main execution
main() {
    print_header
    check_dependencies
    get_user_input
    generate_key
    show_results
}

# Run the script
main