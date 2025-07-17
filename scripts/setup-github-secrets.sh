#!/bin/bash

# GitHub Secrets Setup Script for Synapse Deployment
# This script provides interactive guidance for setting up required GitHub Actions secrets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
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
    echo -e "${BOLD}${CYAN}"
    echo "================================================"
    echo "🔐 GitHub Secrets Setup for Synapse Deployment"
    echo "================================================"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BOLD}${GREEN}$1${NC}"
}

print_instruction() {
    echo -e "${YELLOW}📋 $1${NC}"
}

# Check if we're in the correct directory
check_directory() {
    if [ ! -f "deployment-secrets-template.md" ] || [ ! -f "scripts/generate-ssh-key.sh" ]; then
        print_error "This script must be run from the root of the Synapse repository."
        print_info "Please navigate to the repository root and try again."
        exit 1
    fi
}

# Show introduction and overview
show_introduction() {
    print_header
    echo "This interactive script will guide you through setting up all required GitHub Actions secrets"
    echo "for automated backend deployment of the Synapse application."
    echo ""
    print_info "Required secrets for deployment:"
    echo "   • SSH_PRIVATE_KEY - Private SSH key for server access"
    echo "   • REMOTE_USER     - Username for SSH connection"
    echo "   • REMOTE_HOST     - Server hostname or IP address"
    echo "   • REMOTE_PATH     - Deployment path on the server"
    echo ""
    print_warning "Make sure you have:"
    echo "   ✓ Administrative access to your GitHub repository"
    echo "   ✓ SSH access configured to your deployment server"
    echo "   ✓ All secret values ready (or use our SSH key generator)"
    echo ""
    read -p "Press Enter to continue..."
    echo ""
}

# Guide user to GitHub repository settings
guide_to_github() {
    print_step "Step 1: Navigate to GitHub Repository Settings"
    echo ""
    print_instruction "Follow these steps to access the GitHub Secrets settings:"
    echo ""
    echo "1. 🌐 Open your GitHub repository in a web browser"
    echo "2. 🔧 Click on the 'Settings' tab (near the top of the page)"
    echo "3. 📋 In the left sidebar, click 'Secrets and variables'"
    echo "4. 🎯 Click 'Actions' from the submenu"
    echo "5. 🆕 You should see a 'New repository secret' button"
    echo ""
    print_info "You should now be on a page that looks like:"
    echo "   GitHub → [Your Repo] → Settings → Secrets and variables → Actions"
    echo ""
    print_warning "Keep this browser tab open - you'll be adding secrets here!"
    echo ""
    read -p "Press Enter once you're on the GitHub Secrets page..."
    echo ""
}

# Check if user has SSH key ready
check_ssh_key() {
    print_step "Step 2: Prepare SSH Key"
    echo ""
    print_info "Do you already have an SSH key pair for deployment?"
    echo "1) Yes, I have SSH keys ready"
    echo "2) No, I need to generate SSH keys"
    echo "3) I'm not sure / I want to generate new keys anyway"
    echo ""
    read -p "Enter your choice (1, 2, or 3): " ssh_choice
    
    case $ssh_choice in
        1)
            print_success "Great! Make sure you have the private key content ready to copy."
            ;;
        2|3)
            print_info "I'll help you generate SSH keys using our automated script."
            echo ""
            print_instruction "Opening SSH key generation script..."
            echo ""
            if [ -f "scripts/generate-ssh-key.sh" ]; then
                ./scripts/generate-ssh-key.sh
                echo ""
                print_success "SSH key generation completed!"
                print_info "The private key content was displayed above - keep it ready for copying."
            else
                print_error "SSH key generation script not found."
                print_info "Please run: ssh-keygen -t ed25519 -C 'synapse-deploy' -f ~/.ssh/synapse_deploy"
                exit 1
            fi
            ;;
        *)
            print_warning "Invalid choice. Assuming you need to generate keys..."
            ./scripts/generate-ssh-key.sh
            ;;
    esac
    echo ""
    read -p "Press Enter when you have your SSH private key ready..."
    echo ""
}

# Guide through adding individual secrets
add_ssh_private_key() {
    print_step "Step 3: Add SSH_PRIVATE_KEY Secret"
    echo ""
    print_instruction "Add the SSH private key to GitHub:"
    echo ""
    echo "1. 🆕 Click 'New repository secret' button"
    echo "2. 📝 Enter name: SSH_PRIVATE_KEY"
    echo "3. 📋 In the value field, paste your ENTIRE private key content including:"
    echo "      -----BEGIN OPENSSH PRIVATE KEY-----"
    echo "      [key content]"
    echo "      -----END OPENSSH PRIVATE KEY-----"
    echo "4. 💾 Click 'Add secret'"
    echo ""
    print_warning "Important: Copy the ENTIRE private key file content, including headers and footers!"
    echo ""
    read -p "Press Enter after adding SSH_PRIVATE_KEY secret..."
    echo ""
}

add_remote_user() {
    print_step "Step 4: Add REMOTE_USER Secret"
    echo ""
    print_instruction "Add the server username to GitHub:"
    echo ""
    echo "1. 🆕 Click 'New repository secret' button"
    echo "2. 📝 Enter name: REMOTE_USER"
    echo "3. 👤 Enter the username you use to SSH into your server"
    echo ""
    print_info "Common examples:"
    echo "   • ubuntu    (for Ubuntu servers)"
    echo "   • deploy    (for dedicated deployment user)"
    echo "   • ec2-user  (for Amazon Linux)"
    echo "   • your-username (for custom users)"
    echo ""
    echo "4. 💾 Click 'Add secret'"
    echo ""
    read -p "Press Enter after adding REMOTE_USER secret..."
    echo ""
}

add_remote_host() {
    print_step "Step 5: Add REMOTE_HOST Secret"
    echo ""
    print_instruction "Add your server hostname or IP address:"
    echo ""
    echo "1. 🆕 Click 'New repository secret' button"
    echo "2. 📝 Enter name: REMOTE_HOST"
    echo "3. 🌐 Enter your server's hostname or IP address"
    echo ""
    print_info "Examples:"
    echo "   • your-server.com"
    echo "   • api.yourapp.com"
    echo "   • 192.168.1.100"
    echo "   • 10.0.0.50"
    echo ""
    echo "4. 💾 Click 'Add secret'"
    echo ""
    read -p "Press Enter after adding REMOTE_HOST secret..."
    echo ""
}

add_remote_path() {
    print_step "Step 6: Add REMOTE_PATH Secret"
    echo ""
    print_instruction "Add the deployment directory path:"
    echo ""
    echo "1. 🆕 Click 'New repository secret' button"
    echo "2. 📝 Enter name: REMOTE_PATH"
    echo "3. 📁 Enter the absolute path where you want to deploy the application"
    echo ""
    print_info "Examples:"
    echo "   • /home/deploy/apps"
    echo "   • /var/www/synapse"
    echo "   • /opt/applications/synapse"
    echo "   • /home/ubuntu/deployments"
    echo ""
    print_warning "Make sure:"
    echo "   ✓ The REMOTE_USER has read/write permissions to this directory"
    echo "   ✓ The directory exists or can be created"
    echo "   ✓ There's sufficient disk space"
    echo ""
    echo "4. 💾 Click 'Add secret'"
    echo ""
    read -p "Press Enter after adding REMOTE_PATH secret..."
    echo ""
}

# Verify all secrets are added
verify_secrets() {
    print_step "Step 7: Verify All Secrets"
    echo ""
    print_instruction "Let's verify all required secrets are configured:"
    echo ""
    print_info "On your GitHub Secrets page, you should now see these 4 secrets:"
    echo "   ✓ SSH_PRIVATE_KEY"
    echo "   ✓ REMOTE_USER"
    echo "   ✓ REMOTE_HOST"
    echo "   ✓ REMOTE_PATH"
    echo ""
    print_warning "Check that:"
    echo "   • All 4 secrets are listed"
    echo "   • Secret names match exactly (case-sensitive)"
    echo "   • No typos in secret names"
    echo "   • Values were pasted correctly (especially SSH_PRIVATE_KEY)"
    echo ""
    
    read -p "Are all 4 secrets configured correctly? (y/N): " verify_response
    if [[ $verify_response =~ ^[Yy]$ ]]; then
        print_success "Excellent! All secrets are configured."
    else
        print_warning "Please review and fix any missing or incorrect secrets."
        print_info "You can edit existing secrets by clicking on them in the GitHub interface."
        echo ""
        read -p "Press Enter when all secrets are corrected..."
    fi
    echo ""
}

# Test deployment readiness
test_deployment() {
    print_step "Step 8: Test Deployment Readiness"
    echo ""
    print_instruction "Let's verify your deployment setup:"
    echo ""
    print_info "The next push to the 'main' branch will trigger automatic deployment."
    print_warning "To test your setup:"
    echo ""
    echo "1. 🔍 Make a small commit and push to main branch"
    echo "2. 👀 Watch the GitHub Actions workflow run"
    echo "3. 📊 Check the 'Actions' tab in your repository"
    echo "4. 🔍 Look for the 'deploy-backend' job"
    echo "5. ✅ Verify it completes successfully"
    echo ""
    print_info "If the deployment fails:"
    echo "   • Check the Actions logs for detailed error messages"
    echo "   • Verify SSH connectivity to your server"
    echo "   • Ensure all secrets are correct"
    echo "   • Check server permissions and paths"
    echo ""
}

# Show additional resources
show_resources() {
    print_step "🎉 Setup Complete!"
    echo ""
    print_success "GitHub Actions secrets are now configured for Synapse deployment!"
    echo ""
    print_info "Additional resources:"
    echo "   📖 deployment-secrets-template.md - Detailed secret descriptions"
    echo "   🔧 scripts/generate-ssh-key.sh    - SSH key generation script"
    echo "   📚 README.md                      - Complete deployment documentation"
    echo ""
    print_warning "Security reminders:"
    echo "   • Never share or commit private keys"
    echo "   • Regularly rotate SSH keys"
    echo "   • Monitor deployment logs for security"
    echo "   • Use dedicated deployment users with minimal permissions"
    echo ""
    print_info "Need help? Check the repository documentation or GitHub Actions logs."
    echo ""
    print_success "Happy deploying! 🚀"
}

# Main execution flow
main() {
    check_directory
    show_introduction
    guide_to_github
    check_ssh_key
    add_ssh_private_key
    add_remote_user
    add_remote_host
    add_remote_path
    verify_secrets
    test_deployment
    show_resources
}

# Run the script
main