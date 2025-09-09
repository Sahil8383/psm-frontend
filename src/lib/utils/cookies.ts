import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "http";

// Cookie utility functions using the cookies package
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  // Use document.cookie for client-side cookie setting
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
};

export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

export const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Server-side cookie utilities (for middleware and API routes)
export const getServerCookie = (
  req: IncomingMessage,
  res: ServerResponse,
  name: string
): string | undefined => {
  const cookies = new Cookies(req, res);
  return cookies.get(name);
};

export const setServerCookie = (
  req: IncomingMessage,
  res: ServerResponse,
  name: string,
  value: string,
  options?: Cookies.SetOption
) => {
  const cookies = new Cookies(req, res);
  cookies.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    ...options,
  });
};

export const removeServerCookie = (
  req: IncomingMessage,
  res: ServerResponse,
  name: string
) => {
  const cookies = new Cookies(req, res);
  cookies.set(name, "", { expires: new Date(0) });
};
