const WHITESPACE = /\s+/g;

function replaceControlCharacters(value: string): string {
  return Array.from(value, (char) => {
    const codePoint = char.codePointAt(0) ?? 0;
    return codePoint <= 0x1f || codePoint === 0x7f ? ' ' : char;
  }).join('');
}

function compactName(value: string): string {
  return replaceControlCharacters(value.normalize('NFC')).trim().replace(WHITESPACE, ' ');
}

function capitalizeNamePart(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function titleCaseName(value: string): string {
  return value
    .split(' ')
    .map((word) => word.split('-').map(capitalizeNamePart).join('-'))
    .join(' ');
}

export function normalizeFullName(value: string): string {
  return titleCaseName(compactName(value));
}

function getNameParts(name: string | null | undefined): string[] {
  return compactName(name ?? '')
    .split(' ')
    .filter(Boolean);
}

export function getFirstName(name: string | null | undefined): string {
  return getNameParts(name)[0] ?? '';
}

export function getInitials(name: string | null | undefined): string {
  const parts = getNameParts(name);

  if (!parts[0]) {
    return '';
  }

  const firstInitial = parts[0].charAt(0);
  const lastInitial = parts.length > 1 ? (parts.at(-1)?.charAt(0) ?? '') : '';

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
