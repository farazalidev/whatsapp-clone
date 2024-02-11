import * as crypto from 'crypto';

// Set your secret key for encryption and decryption
const secretKey = process.env.COOKIE_SECRET_KEY;

// Function to encrypt data using AES
export function encryptCookie(data: string) {
  const iv = crypto.randomBytes(16); // Generate a random IV of 16 bytes
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv || '');
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return iv.toString('hex') + ':' + encryptedData; // Concatenate IV and encrypted data with a delimiter
}

// Function to decrypt data using AES
export function decryptCookie(encryptedData: string) {
  if (!encryptedData) {
    throw new Error('Encrypted data is undefined or null.');
  }

  const parts = encryptedData.split(':'); // Split IV and encrypted data
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted data format.');
  }

  const iv = Buffer.from(parts[0], 'hex'); // Convert IV back to Buffer
  const data = parts[1]; // Extract encrypted data
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
  let decryptedData = decipher.update(data, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}
