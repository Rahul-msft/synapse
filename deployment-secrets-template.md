# Deployment Secrets Template for Synapse Backend

This template lists all the required secrets needed for the Synapse backend deployment via GitHub Actions. Configure these secrets in your GitHub repository settings under **Settings → Secrets and variables → Actions**.

## Required Secrets for Backend Deployment

### 🔑 SSH_PRIVATE_KEY
- **Description**: The private SSH key used to authenticate with your deployment server
- **Format**: Complete private key content including headers and footers
- **Example**: 
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAFwAAAAdzc2gtcn
  ...
  -----END OPENSSH PRIVATE KEY-----
  ```
- **Security**: Never share this key or commit it to your repository
- **Generation**: Use the provided script `scripts/generate-ssh-key.sh` to generate a new key pair

### 👤 REMOTE_USER
- **Description**: Username for SSH connection to your deployment server
- **Format**: String (username)
- **Examples**: 
  - `ubuntu` (for Ubuntu servers)
  - `deploy` (for dedicated deployment user)
  - `ec2-user` (for Amazon Linux)
  - `root` (not recommended for security reasons)
- **Recommendation**: Use a dedicated deployment user with limited privileges

### 🌐 REMOTE_HOST
- **Description**: Hostname or IP address of your deployment server
- **Format**: String (hostname or IP address)
- **Examples**:
  - `your-server.com`
  - `api.yourapp.com`
  - `192.168.1.100`
  - `10.0.0.50`
- **Note**: Ensure this server is accessible from GitHub Actions runners

### 📁 REMOTE_PATH
- **Description**: Base directory path on the server where the application will be deployed
- **Format**: Absolute path string
- **Examples**:
  - `/home/deploy/apps`
  - `/var/www/synapse`
  - `/opt/applications/synapse`
  - `/home/ubuntu/deployments`
- **Requirements**: 
  - The REMOTE_USER must have read/write permissions to this directory
  - Directory should exist or the deployment script should be able to create it
  - Sufficient disk space for application files and backups

## Optional Secrets

### 🚀 EXPO_TOKEN (for future mobile deployment)
- **Description**: Expo authentication token for mobile app builds (if using Expo)
- **Format**: String (authentication token)
- **Required**: Only if planning to use Expo for mobile deployment
- **Note**: Currently optional as the project uses React Native CLI

## Setting Up Secrets in GitHub

1. **Navigate to your repository on GitHub**
2. **Go to Settings tab**
3. **Click on "Secrets and variables" → "Actions"**
4. **Click "New repository secret"**
5. **Add each secret with its exact name and value**

### Important Notes:
- Secret names are case-sensitive and must match exactly as shown above
- Values should not include extra spaces or newlines unless they are part of the actual secret
- SSH_PRIVATE_KEY should include the complete key file content with proper line breaks
- Test your deployment after adding all secrets to ensure they work correctly

## Validation

The GitHub Actions workflow includes automatic validation of all required secrets. If any secret is missing or empty, the deployment will fail with clear error messages indicating which secrets need to be configured.

## Security Best Practices

1. **SSH Key Security**:
   - Use strong key types (Ed25519 recommended, RSA 4096-bit minimum)
   - Generate dedicated keys for deployment (don't reuse personal keys)
   - Regularly rotate SSH keys
   - Store private keys only in secure locations (GitHub Secrets, secure key management)

2. **Server Security**:
   - Use a dedicated deployment user with minimal required permissions
   - Restrict SSH access using firewall rules or security groups
   - Keep your server updated with latest security patches
   - Consider using SSH key restrictions (command, from, etc.)

3. **Access Control**:
   - Limit who can modify GitHub repository secrets
   - Use environment-specific secrets for different deployment stages
   - Monitor deployment logs for suspicious activity
   - Implement proper backup and recovery procedures

## Troubleshooting

### Common Issues:
1. **Permission Denied**: Check that SSH key is properly configured and REMOTE_USER has necessary permissions
2. **Host Key Verification Failed**: Ensure the server's host key is known or configure the deployment to accept new host keys
3. **Path Not Found**: Verify REMOTE_PATH exists and REMOTE_USER has access to it
4. **Authentication Failed**: Confirm SSH_PRIVATE_KEY matches the public key added to the server

### Getting Help:
- Check the GitHub Actions logs for detailed error messages
- Verify all secrets are properly configured using the CI/CD validation step
- Use the `scripts/generate-ssh-key.sh` script to generate new SSH keys if needed
- Refer to the main README.md for additional deployment documentation

---

**Last Updated**: Generated for Synapse MVP deployment setup
**Script Helper**: Use `scripts/generate-ssh-key.sh` for easy SSH key generation