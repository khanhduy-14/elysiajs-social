import Elysia from "elysia";
import fs from "fs";
import path from "path";
import { decryptRSA, encryptWithPublicKey } from "../../../utils/crypto";
import { RSADecryptionError, RSAEncryptionError } from "../../../utils/errors";
import { config } from "../../../config";

class AuthRSA {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const privateKeyPath = path.resolve(
      process.cwd(),
      config.rsa.privateKeyPath,
    );
    const publicKeyPath = path.resolve(process.cwd(), config.rsa.publicKeyPath);

    if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
      throw new Error(
        `RSA keys not found at:\n  Private: ${privateKeyPath}\n  Public: ${publicKeyPath}\n\nRun: bun -e "const crypto = require('crypto'); const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048, publicKeyEncoding: { type: 'pkcs1', format: 'pem' }, privateKeyEncoding: { type: 'pkcs1', format: 'pem' } }); require('fs').writeFileSync('${publicKeyPath}', publicKey); require('fs').writeFileSync('${privateKeyPath}', privateKey);"`,
      );
    }

    this.privateKey = fs.readFileSync(privateKeyPath, "utf-8");
    this.publicKey = fs.readFileSync(publicKeyPath, "utf-8");
  }

  decryptPassword(encryptedPassword: string) {
    try {
      return decryptRSA(this.privateKey, encryptedPassword);
    } catch (error) {
      throw new RSADecryptionError("Failed to decrypt password");
    }
  }

  encryptPassword(password: string) {
    try {
      return encryptWithPublicKey(this.publicKey, password);
    } catch (error) {
      throw new RSAEncryptionError("Failed to encrypt password");
    }
  }
}

export const authRSAPlugin = new Elysia().decorate("authRSA", new AuthRSA());
