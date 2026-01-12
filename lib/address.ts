export function shortenAddress(address: string): string {
  if (!address) return "";

  const parts = address.split(",").map((p) => p.trim());

  // If the last part is numeric (postal code), remove it
  if (parts.length && /^\d+$/.test(parts[parts.length - 1])) {
    parts.pop();
  }

  // If the last part is country (common names)
  const countries = ["Philippines", "USA", "United States", "Canada", "UK"];
  if (parts.length && countries.includes(parts[parts.length - 1])) {
    parts.pop();
  }

  // Remove known district words
  const filtered = parts.filter(
    (p) => !/District|Barangay|Subdivision|Zone|Capital District/i.test(p)
  );

  // Take up to first 3 parts for a readable address
  return filtered.slice(0, 3).join(", ");
}
