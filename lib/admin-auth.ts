import "server-only";
import {
  createHmac,
  scrypt,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const SESSION_VERSION = "portfolio-admin-v1";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function deriveKey(
  value: string,
  salt: Buffer,
  keyLength: number,
  options: ScryptOptions,
) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(value, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

function signSession(expiresAt: number) {
  const sessionSecret = getRequiredEnv("ADMIN_SESSION_SECRET");
  const adminHash = getRequiredEnv("ADMIN_NIK_HASH");

  return createHmac("sha256", sessionSecret)
    .update(`${SESSION_VERSION}:${expiresAt}:${adminHash}`)
    .digest("base64url");
}

export async function verifyAdminNik(value: string) {
  if (!/^\d{16}$/.test(value)) {
    return false;
  }

  const encodedHash = getRequiredEnv("ADMIN_NIK_HASH");
  const [algorithm, cost, blockSize, parallelization, salt, key] =
    encodedHash.split(":");

  if (
    algorithm !== "scrypt" ||
    !cost ||
    !blockSize ||
    !parallelization ||
    !salt ||
    !key
  ) {
    throw new Error("ADMIN_NIK_HASH has an invalid format.");
  }

  const expectedKey = Buffer.from(key, "base64url");
  const actualKey = await deriveKey(
    value,
    Buffer.from(salt, "base64url"),
    expectedKey.length,
    {
      N: Number(cost),
      r: Number(blockSize),
      p: Number(parallelization),
      maxmem: 64 * 1024 * 1024,
    },
  );

  return (
    actualKey.length === expectedKey.length &&
    timingSafeEqual(actualKey, expectedKey)
  );
}

export async function startAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const token = `${expiresAt}.${signSession(expiresAt)}`;
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function isAdminAuthenticated() {
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const [expiresValue, signature, ...extra] = token.split(".");
  const expiresAt = Number(expiresValue);
  const now = Math.floor(Date.now() / 1000);

  if (
    extra.length > 0 ||
    !/^\d+$/.test(expiresValue ?? "") ||
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= now
  ) {
    return false;
  }

  const expectedSignature = signSession(expiresAt);
  const signatureBuffer = Buffer.from(signature ?? "", "base64url");
  const expectedBuffer = Buffer.from(expectedSignature, "base64url");

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }
}

export async function clearAdminSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
