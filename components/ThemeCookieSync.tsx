"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const COOKIE_KEY = "theme";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function setThemeCookie(value: string) {
  document.cookie = `${COOKIE_KEY}=${value}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

function clearThemeCookie() {
  document.cookie = `${COOKIE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function ThemeCookieSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme === "dark" || theme === "light") {
      setThemeCookie(theme);
      return;
    }

    clearThemeCookie();
  }, [theme]);

  return null;
}
