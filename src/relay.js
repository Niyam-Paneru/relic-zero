import crypto from "node:crypto";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function nextToken(secret, sequence, previousHash) {
  return crypto
    .createHmac("sha256", secret)
    .update(`${sequence}:${previousHash}`)
    .digest("base64url");
}

function normalizeText(value, max) {
  const text = String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ");
  if (text.length < 1 || text.length > max) {
    throw new Error("invalid_text_length");
  }
  return text;
}

export class Relay {
  #secret;
  #activeInviteHash = null;
  #touches = [];

  constructor({ secret }) {
    if (!secret || secret.length < 8) throw new Error("secret_too_short");
    this.#secret = secret;
  }

  seed() {
    if (this.#activeInviteHash !== null || this.#touches.length !== 0) {
      throw new Error("relay_already_seeded");
    }
    const token = nextToken(this.#secret, 0, "genesis");
    this.#activeInviteHash = sha256(token);
    return token;
  }

  claim(invite, { actor, action, message }) {
    if (action !== "bless" && action !== "corrupt") {
      throw new Error("invalid_action");
    }

    const suppliedHash = sha256(String(invite));
    if (this.#activeInviteHash === null || suppliedHash !== this.#activeInviteHash) {
      throw new Error("invite_invalid_or_already_used");
    }

    const touch = Object.freeze({
      sequence: this.#touches.length + 1,
      actor: normalizeText(actor, 24),
      action,
      message: normalizeText(message, 80),
    });

    // Consume first so the same capability can never win twice.
    this.#activeInviteHash = null;
    this.#touches.push(touch);

    const token = nextToken(this.#secret, touch.sequence, suppliedHash);
    this.#activeInviteHash = sha256(token);

    return {
      publicTouch: { ...touch },
      nextInvite: token,
    };
  }

  publicHistory() {
    return this.#touches.map((touch) => ({ ...touch }));
  }

  evolution() {
    let bless = 0;
    let corrupt = 0;
    for (const touch of this.#touches) {
      if (touch.action === "bless") bless += 1;
      else corrupt += 1;
    }
    return {
      touches: this.#touches.length,
      bless,
      corrupt,
      balance: bless - corrupt,
    };
  }
}
