import type { RateLimitConfig } from '../config.schema';

export const rateLimitConfig: RateLimitConfig = {
  // Broad protection against repeated requests from one network
  perIp: [100, 'h'],
  // Stricter protection for repeated form attempts from one browser/device
  perIpAndUserAgent: [10, 'm']
};
