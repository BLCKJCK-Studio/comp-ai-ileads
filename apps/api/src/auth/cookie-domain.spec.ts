import { getCookieDomain } from './cookie-domain';

describe('getCookieDomain', () => {
  it('uses AUTH_COOKIE_DOMAIN when set (self-hosted custom domains)', () => {
    expect(
      getCookieDomain({
        AUTH_COOKIE_DOMAIN: '.compliance.example.com',
        BASE_URL: 'https://api.compliance.example.com',
      }),
    ).toBe('.compliance.example.com');
  });

  it('prefers AUTH_COOKIE_DOMAIN over the trycomp.ai inference', () => {
    expect(
      getCookieDomain({
        AUTH_COOKIE_DOMAIN: '.other.example.com',
        BASE_URL: 'https://api.trycomp.ai',
      }),
    ).toBe('.other.example.com');
  });

  it('infers .staging.trycomp.ai from BASE_URL', () => {
    expect(getCookieDomain({ BASE_URL: 'https://api.staging.trycomp.ai' })).toBe(
      '.staging.trycomp.ai',
    );
  });

  it('infers .trycomp.ai from BASE_URL', () => {
    expect(getCookieDomain({ BASE_URL: 'https://api.trycomp.ai' })).toBe('.trycomp.ai');
  });

  it('returns undefined for other hosts without AUTH_COOKIE_DOMAIN', () => {
    expect(getCookieDomain({ BASE_URL: 'http://localhost:3333' })).toBeUndefined();
    expect(getCookieDomain({})).toBeUndefined();
  });
});
