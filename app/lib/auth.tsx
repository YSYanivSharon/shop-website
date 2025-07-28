import { NextRequest, NextResponse } from 'next/server'

export enum AuthLevel {
  None,
  User,
  Admin,
}

export async function getAuthLevel(request: NextRequest): Promise<AuthLevel> {
  // TODO: Implement logic
  return AuthLevel.Admin;
}
