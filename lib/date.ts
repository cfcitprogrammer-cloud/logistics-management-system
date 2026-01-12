/**
 * Converts an ISO date string to a readable format.
 * Example: "2026-01-12T16:00:00.000Z" => "January 12, 2026"
 */
export function formatDate(isoString: string): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
}

/**
 * Converts an ISO date string to a readable date + time format.
 * Example: "2026-01-12T16:00:00.000Z" => "January 12, 2026, 4:00 PM"
 */
export function formatDateTime(
  isoString: string,
  use24Hour: boolean = false
): string {
  if (!isoString) return "";

  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: !use24Hour,
  };

  return date.toLocaleString(undefined, options);
}
