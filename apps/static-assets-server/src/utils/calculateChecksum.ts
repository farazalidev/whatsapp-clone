import * as fs from 'fs';
import * as crypto from 'crypto';

export function calculateChecksum(filePath: string, algorithm: 'SHA-256' | 'MD5', encoding: crypto.BinaryToTextEncoding) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      const checksum = hash.digest(encoding);
      resolve(checksum);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
}
