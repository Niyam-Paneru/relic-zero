import crypto from "node:crypto";

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function nextToken(secret, sequence, previousHash) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${sequence}:${previousHash}`)
    .digest("base64url");
}
