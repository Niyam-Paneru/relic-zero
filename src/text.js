export function normalizeText(value, max) {
  const text = String(value ?? "").normalize("NFKC").trim().replace(/\s+/g, " ");
  if (text.length < 1 || text.length > max) {
    throw new Error("invalid_text_length");
  }
  return text;
}

export function validateAction(action) {
  if (action !== "bless" && action !== "corrupt") {
    throw new Error("invalid_action");
  }
  return action;
}
