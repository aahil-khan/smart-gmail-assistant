export function categorize(
  subject: string
): "Important" | "Promotions" | "General" {
  const lower = subject.toLowerCase();

  if (lower.includes("invoice") || lower.includes("payment")) {
    return "Important";
  }

  if (lower.includes("sale") || lower.includes("offer")) {
    return "Promotions";
  }

  return "General";
}
