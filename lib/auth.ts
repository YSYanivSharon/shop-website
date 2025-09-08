"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getUserByEmail, addUser, addUserEvent } from "@/lib/persist-module";
import { User, AuthLevel } from "@/lib/types";

const userCookieName = "user";
const certCookieName = "cert";
const sessionExpirationCookieName = "expiration";

export async function getSecret() {
  return "A completely random secret that is stored correctly";
}

export async function getScrypt(text: string) {
  return crypto.scryptSync(text, await getSecret(), 64).toString("hex");
}

export async function getHmac(text: string) {
  const hmac = crypto.createHmac("sha256", await getSecret());
  return hmac.update(text).digest().toString("hex");
}

export async function getAuthLevel(): Promise<AuthLevel> {
  let user = await getVerifiedSession();

  if (!user) {
    return AuthLevel.None;
  }

  return user.authLevel;
}

export async function signup(email: string, password: string) {
  // TODO: replace with zod
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const passwordRegex = /.+/;

  if (!emailRegex.test(email)) {
    return "Invalid email";
  }

  if (!passwordRegex.test(password)) {
    return "Invalid password";
  }

  // Check if email is already used
  if (await getUserByEmail(email)) {
    return "Email already used";
  }

  let hashedPassword = await getScrypt(password);

  let user = await addUser(email, hashedPassword, AuthLevel.Normal);

  if (!user) {
    return "An error occurred while creating your account";
  }

  await storeVerifiedSession(user, false);

  await addUserEvent(1, []);

  return user;
}

export async function login(
  email: string,
  password: string,
  longTerm: boolean,
) {
  const user = await getUserByEmail(email);

  if (user && user.password == (await getScrypt(password))) {
    await storeVerifiedSession(user, longTerm);
    await addUserEvent(0, []);
    return user;
  }

  return null;
}

export async function logout() {
  await addUserEvent(2, []);
  const cookieStore = await cookies();
  cookieStore.delete(userCookieName);
  cookieStore.delete(certCookieName);
}

async function storeVerifiedSessionCookies(user: User, expiresAt: number) {
  const cookieStore = await cookies();
  let userJson = JSON.stringify(user);
  cookieStore.set(userCookieName, userJson, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(certCookieName, await getHmac(userJson), {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  cookieStore.set(sessionExpirationCookieName, expiresAt.toString(), {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

async function storeVerifiedSession(user: User, longTerm: boolean) {
  const expiresAt =
    Date.now() + (longTerm ? 12 * 24 * 60 * 60 * 1000 : 30 * 60 * 1000);
  await storeVerifiedSessionCookies(user, expiresAt);
}

export async function updateVerifiedSession(user: User) {
  const cookieStore = await cookies();

  const expirationCookie = cookieStore.get(sessionExpirationCookieName);
  if (!expirationCookie) return;

  storeVerifiedSessionCookies(user, Number.parseInt(expirationCookie.value));
}

export async function getVerifiedSession() {
  const cookieStore = await cookies();
  const userJson = cookieStore.get(userCookieName)?.value;
  const cert = cookieStore.get(certCookieName)?.value;

  if (!userJson || !cert) {
    return null;
  }

  const user = JSON.parse(userJson) as User;

  // Verify that the user was deserialized correctly and that the cert is correct
  if (!user || (await getHmac(userJson)) != cert) {
    return null;
  }

  return user;
}
