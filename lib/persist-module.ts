'use server'

import { shop_items } from './shop-item-data'; //TODO: Move the contents of that file here
import sqlite from 'better-sqlite3';

export enum AuthLevel {
  None,
  Normal,
  Admin,
}

export type User = {
  email: string;
  password: string;
  authLevel: AuthLevel;
}

// Open SQLite database connection
async function openDb() {
  const options = {
    fileMustExist: true,
    // verbose: console.log
  };
  return sqlite('./database.sqlite3', options);
}

export async function addUser(email: string, hashedPassword: string, authLevel: number) {
  let db = await openDb();

  const insertUser = db.prepare('INSERT INTO Users (email, password, authLevel) VALUES (?, ?, ?)');
  insertUser.run(email, hashedPassword, authLevel);

  db.close();

  return getUser(email);
}

export async function getUser(email: string) {
  let db = await openDb();

  const getUser = db.prepare('SELECT * FROM Users WHERE email = ?');
  const user = getUser.get(email) as User;

  db.close();

  return user;
}
