import type { ChallengeConfig } from '../config.schema';

export const challengeConfig: ChallengeConfig = {
  // How long a password confirmation unlocks sensitive account operations (ms)
  lifetimeMs: 5 * 60 * 1000
};
