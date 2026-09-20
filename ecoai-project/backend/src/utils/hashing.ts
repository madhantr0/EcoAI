import { createHash } from 'node:crypto';

export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export function buildChainHash(input: {
  prevHash: string | null;
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  imageUrl: string;
}): { input: string; hash: string } {
  const prev = input.prevHash ?? 'GENESIS';
  const canonical =
    prev +
    '|' +
    input.userId +
    '|' +
    `${input.latitude},${input.longitude}` +
    '|' +
    input.timestamp +
    '|' +
    input.imageUrl;
  return { input: canonical, hash: sha256(canonical) };
}
