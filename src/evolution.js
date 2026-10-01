export function deriveEvolution(touches) {
  let bless = 0;
  let corrupt = 0;

  for (const touch of touches) {
    if (touch.action === "bless") bless += 1;
    else if (touch.action === "corrupt") corrupt += 1;
  }

  return {
    touches: touches.length,
    bless,
    corrupt,
    balance: bless - corrupt,
  };
}
