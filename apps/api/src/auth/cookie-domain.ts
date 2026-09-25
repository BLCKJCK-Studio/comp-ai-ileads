/**
 * Determine the cookie domain based on environment.
 *
 * AUTH_COOKIE_DOMAIN (e.g. `.compliance.example.com`) lets self-hosted
 * deployments on their own domain share the session across app/portal/api.
 */
export function getCookieDomain(
  env: Partial<NodeJS.ProcessEnv> = process.env,
): string | undefined {
  if (env.AUTH_COOKIE_DOMAIN) {
    return env.AUTH_COOKIE_DOMAIN;
  }

  const baseUrl = env.BASE_URL || '';

  if (baseUrl.includes('staging.trycomp.ai')) {
    return '.staging.trycomp.ai';
  }
  if (baseUrl.includes('trycomp.ai')) {
    return '.trycomp.ai';
  }
  return undefined;
}
