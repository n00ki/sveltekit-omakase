import { getRequestEvent } from '$app/server';

import { createOTP } from '@better-auth/utils/otp';
import { APIError as BetterAuthAPIError } from 'better-auth/api';
import { generateRandomString, symmetricDecrypt, symmetricEncrypt } from 'better-auth/crypto';
import { eq } from 'drizzle-orm';
import QRCode from 'qrcode';

import { Session, TwoFactor, User } from '$lib/db/models';
import { auth } from '$lib/server/auth';
import db from '$lib/server/database';
import {
  markTwoFactorChallengeCompleted,
  requireEnabledTwoFactor,
  requirePendingTwoFactorSetup,
  requireTwoFactorSetup
} from '$lib/server/security';

import { config } from '$config/server';

const TOTP_DIGITS = 6;
const TOTP_PERIOD = 30;
const TOTP_SECRET_LENGTH = 32;
const RECOVERY_CODE_COUNT = 8;
const RECOVERY_CODE_LENGTH = 10;

export type TwoFactorSetup = {
  manualSetupKey: string;
  qrCodeSvg: string;
};

type TwoFactorChallengeResult = 'completed' | 'expired' | 'failed' | 'invalid';

async function getSecretKey() {
  return (await auth.$context).secretConfig;
}

function isBetterAuthCode(err: unknown, code: string) {
  return err instanceof BetterAuthAPIError && err.body?.code === code;
}

function isExpiredChallenge(err: unknown) {
  return (
    isBetterAuthCode(err, 'INVALID_TWO_FACTOR_COOKIE') ||
    isBetterAuthCode(err, 'TOTP_NOT_ENABLED') ||
    isBetterAuthCode(err, 'BACKUP_CODES_NOT_ENABLED')
  );
}

async function encrypt(value: string) {
  return symmetricEncrypt({
    data: value,
    key: await getSecretKey()
  });
}

function createRecoveryCodes() {
  return Array.from({ length: RECOVERY_CODE_COUNT }, () => {
    const code = generateRandomString(RECOVERY_CODE_LENGTH, 'a-z', '0-9', 'A-Z');
    return `${code.slice(0, 5)}-${code.slice(5)}`;
  });
}

async function encryptRecoveryCodes(codes: string[]) {
  return encrypt(JSON.stringify(codes));
}

async function decryptRecoveryCodes(value: string) {
  const parsed = JSON.parse(
    await symmetricDecrypt({
      data: value,
      key: await getSecretKey()
    })
  ) as unknown;

  return Array.isArray(parsed) && parsed.every((code) => typeof code === 'string') ? parsed : [];
}

async function verifyCode(twoFactor: TwoFactor, code: string) {
  const secret = await symmetricDecrypt({
    data: twoFactor.secret,
    key: await getSecretKey()
  });

  return createOTP(secret, { digits: TOTP_DIGITS, period: TOTP_PERIOD }).verify(code);
}

export async function startSetup(): Promise<TwoFactorSetup> {
  const { user } = await requireTwoFactorSetup();

  const secret = generateRandomString(TOTP_SECRET_LENGTH);
  const totpURI = createOTP(secret, { digits: TOTP_DIGITS, period: TOTP_PERIOD }).url(config.app.name, user.email);
  const recoveryCodes = createRecoveryCodes();
  const backupCodes = await encryptRecoveryCodes(recoveryCodes);
  const encryptedSecret = await encrypt(secret);
  const qrCodeSvg = await QRCode.toString(totpURI, {
    margin: 1,
    type: 'svg',
    width: 256
  });

  await db.transaction(async (tx) => {
    await tx.delete(TwoFactor).where(eq(TwoFactor.userId, user.id));
    await tx.update(User).set({ twoFactorEnabled: false }).where(eq(User.id, user.id));
    await tx.insert(TwoFactor).values({
      backupCodes,
      secret: encryptedSecret,
      userId: user.id,
      verified: false
    });
  });

  return {
    manualSetupKey: new URL(totpURI).searchParams.get('secret') ?? '',
    qrCodeSvg
  };
}

export async function confirmSetup(code: string): Promise<boolean> {
  const { session, twoFactor, user } = await requirePendingTwoFactorSetup();

  if (!(await verifyCode(twoFactor, code))) {
    return false;
  }

  const now = new Date();

  await db.transaction(async (tx) => {
    await tx.update(TwoFactor).set({ verified: true }).where(eq(TwoFactor.id, twoFactor.id));
    await tx
      .update(User)
      .set({
        twoFactorEnabled: true,
        updatedAt: now
      })
      .where(eq(User.id, user.id));
    await tx
      .update(Session)
      .set({
        challengeCompletedAt: now,
        twoFactorCompletedAt: now,
        updatedAt: now
      })
      .where(eq(Session.token, session.token));
  });

  return true;
}

export async function verifyTotpChallenge(code: string): Promise<TwoFactorChallengeResult> {
  const { request } = getRequestEvent();

  try {
    const result = await auth.api.verifyTOTP({
      body: { code },
      headers: request.headers
    });

    await markTwoFactorChallengeCompleted(result.token);
    return 'completed';
  } catch (err) {
    if (isExpiredChallenge(err)) return 'expired';
    if (isBetterAuthCode(err, 'INVALID_CODE')) return 'invalid';

    console.error('Failed to complete TOTP challenge:', err);
    return 'failed';
  }
}

export async function verifyRecoveryChallenge(code: string): Promise<TwoFactorChallengeResult> {
  const { request } = getRequestEvent();

  try {
    const result = await auth.api.verifyBackupCode({
      body: { code },
      headers: request.headers
    });

    if (result.token) {
      await markTwoFactorChallengeCompleted(result.token);
    }

    return 'completed';
  } catch (err) {
    if (isExpiredChallenge(err)) return 'expired';
    if (isBetterAuthCode(err, 'INVALID_BACKUP_CODE')) return 'invalid';

    console.error('Failed to complete recovery challenge:', err);
    return 'failed';
  }
}

export async function disable() {
  const { session, user } = await requireEnabledTwoFactor();

  const now = new Date();

  await db.transaction(async (tx) => {
    await tx.delete(TwoFactor).where(eq(TwoFactor.userId, user.id));
    await tx
      .update(User)
      .set({
        twoFactorEnabled: false,
        updatedAt: now
      })
      .where(eq(User.id, user.id));
    await tx
      .update(Session)
      .set({
        twoFactorCompletedAt: null,
        updatedAt: now
      })
      .where(eq(Session.token, session.token));
  });
}

export async function getRecoveryCodes(): Promise<string[]> {
  const { twoFactor } = await requireEnabledTwoFactor();
  return decryptRecoveryCodes(twoFactor.backupCodes);
}

export async function regenerateRecoveryCodes(): Promise<string[]> {
  const { twoFactor } = await requireEnabledTwoFactor();
  const recoveryCodes = createRecoveryCodes();

  await db
    .update(TwoFactor)
    .set({
      backupCodes: await encryptRecoveryCodes(recoveryCodes)
    })
    .where(eq(TwoFactor.id, twoFactor.id));

  return recoveryCodes;
}
