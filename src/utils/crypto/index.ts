import crypto from "crypto";

export function decryptRSA(privateKey: string, encryptedData: string) {
  const buffer = Buffer.from(encryptedData, "base64");
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    buffer,
  );
  return decrypted.toString("utf8");
}

export function encryptWithPublicKey(publicKey: string, data: string): string {
  const encrypted = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data),
  );
  return encrypted.toString("base64");
}
