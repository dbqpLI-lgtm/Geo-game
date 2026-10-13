export function normalizeFullLeaderName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

export function matchesLeaderFirstAndLastName(input: string, leaderName: string): boolean {
  const inputParts = normalizeFullLeaderName(input).split(' ').filter(Boolean);
  const leaderParts = normalizeFullLeaderName(leaderName).split(' ').filter(Boolean);
  return (
    inputParts.length >= 2 &&
    leaderParts.length >= 2 &&
    inputParts[0] === leaderParts[0] &&
    inputParts[inputParts.length - 1] === leaderParts[leaderParts.length - 1]
  );
}
