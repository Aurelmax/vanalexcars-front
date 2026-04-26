/**
 * Payload CMS Media Upload Service
 *
 * Gère l'authentification et l'upload de fichiers vers la collection Media de Payload CMS.
 */

import fs from 'fs-extra';
import path from 'path';

const PAYLOAD_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200';

export interface PayloadMediaDoc {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
}

let cachedToken: string | null = null;

export async function getPayloadToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const email = process.env.PAYLOAD_ADMIN_EMAIL;
  const password = process.env.PAYLOAD_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD must be set in .env.local'
    );
  }

  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(`Payload login failed (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  cachedToken = data.token;
  return cachedToken!;
}

export async function uploadToPayloadMedia(
  filePath: string,
  alt: string
): Promise<PayloadMediaDoc> {
  const token = await getPayloadToken();

  const fileBuffer = await fs.readFile(filePath);
  const fileName = path.basename(filePath);

  const formData = new FormData();
  formData.append(
    'file',
    new Blob([fileBuffer], { type: 'image/webp' }),
    fileName
  );
  formData.append('alt', alt);

  let res = await fetch(`${PAYLOAD_URL}/api/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  // Si 401, re-auth et retry une fois
  if (res.status === 401) {
    cachedToken = null;
    const newToken = await getPayloadToken();
    res = await fetch(`${PAYLOAD_URL}/api/media`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${newToken}` },
      body: formData,
    });
  }

  if (!res.ok) {
    throw new Error(
      `Payload media upload failed (${res.status}): ${await res.text()}`
    );
  }

  const data = await res.json();
  return data.doc as PayloadMediaDoc;
}
