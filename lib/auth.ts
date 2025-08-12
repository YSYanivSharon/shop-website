"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { getUser, addUser } from "@/lib/persist-module";
import type { User } from "@/lib/persist-module";
import { AuthLevel } from "@/lib/persist-module";

const userCookieName = "user";
const certCookieName = "cert";

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
  // TODO: Implement

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
  if (await getUser(email)) {
    return "Email already used";
  }

  let hashedPassword = await getScrypt(password);

  let user = await addUser(email, hashedPassword, AuthLevel.Normal);

  if (!user) {
    return "An error occurred while creating your account";
  }

  await storeVerifiedSession(user);

  return user;
}

export async function login(email: string, password: string) {
  const user = await getUser(email);

  if (user && user.password == (await getScrypt(password))) {
    await storeVerifiedSession(user);
    return user;
  }

  return null;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(userCookieName);
  cookieStore.delete(certCookieName);
}

async function storeVerifiedSession(user: User) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
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
