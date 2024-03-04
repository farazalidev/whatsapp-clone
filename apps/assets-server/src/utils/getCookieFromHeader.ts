export function getCookieValue(cookieHeader: string, cookieName: string) {
  const cookies = cookieHeader?.split('; ');
  for (let i = 0; i < cookies?.length; i++) {
    const cookie = cookies[i]?.split('=');
    const name = cookie[0];
    const value = cookie[1];
    if (name === cookieName) {
      return decodeURIComponent(value); // Use decodeURIComponent to decode URI-encoded values
    }
  }
  return null;
}
