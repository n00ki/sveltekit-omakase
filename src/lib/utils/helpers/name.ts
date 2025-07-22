/**
 * Extracts user initials for avatar placeholders and compact displays.
 * Provides a consistent way to represent users when profile images aren't available.
 *
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Two-character initials in uppercase
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
