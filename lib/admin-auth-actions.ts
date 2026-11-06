"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  startAdminSession,
  verifyAdminNik,
} from "@/lib/admin-auth";

export type LoginState = {
  error?: string;
};

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const loginAttemptsGlobal = globalThis as typeof globalThis & {
  adminLoginAttempts?: Map<string, LoginAttempt>;
};
const loginAttempts =
  loginAttemptsGlobal.adminLoginAttempts ??
  (loginAttemptsGlobal.adminLoginAttempts = new Map<string, LoginAttempt>());

async function getClientIdentifier() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  return (
    forwardedFor?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "local"
  );
}

function canAttemptLogin(identifier: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt || attempt.resetAt <= now) {
    loginAttempts.set(identifier, {
      count: 1,
      resetAt: now + LOGIN_ATTEMPT_WINDOW_MS,
    });
    return true;
  }

  if (attempt.count >= LOGIN_ATTEMPT_LIMIT) {
    return false;
  }

  attempt.count += 1;
  return true;
}

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");
  const clientIdentifier = await getClientIdentifier();

  if (!canAttemptLogin(clientIdentifier)) {
    return {
      error: "Too many attempts. Please try again in 15 minutes.",
    };
  }

  if (typeof password !== "string") {
    return { error: "Enter the authorized NIK to continue." };
  }

  try {
    if (!(await verifyAdminNik(password.trim()))) {
      return { error: "That NIK is not authorized for this dashboard." };
    }
  } catch (error) {
    console.error("Admin sign-in is unavailable:", error);
    return { error: "Sign-in is temporarily unavailable." };
  }

  loginAttempts.delete(clientIdentifier);
  await startAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/login");
}
