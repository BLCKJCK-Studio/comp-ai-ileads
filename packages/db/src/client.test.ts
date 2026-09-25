import { describe, it, expect } from 'bun:test';
import tls from 'node:tls';
import { resolveSslConfig } from './ssl-config';

describe('resolveSslConfig', () => {
  it('returns undefined for localhost', () => {
    expect(resolveSslConfig('postgresql://u:p@localhost:5432/x', {})).toBeUndefined();
  });

  it('returns undefined for 127.0.0.1', () => {
    expect(resolveSslConfig('postgresql://u:p@127.0.0.1:5432/x', {})).toBeUndefined();
  });

  it('returns undefined for ::1', () => {
    expect(resolveSslConfig('postgresql://u:p@[::1]:5432/x', {})).toBeUndefined();
  });

  it('returns rejectUnauthorized:false when PRISMA_ALLOW_INSECURE_TLS=1', () => {
    expect(
      resolveSslConfig('postgresql://u:p@db.prod.example.com:5432/x', {
        PRISMA_ALLOW_INSECURE_TLS: '1',
      }),
    ).toEqual({ rejectUnauthorized: false });
  });

  it('returns checkServerIdentity-noop for remote URLs (verified TLS via Node defaults)', () => {
    const result = resolveSslConfig('postgresql://u:p@db.prod.example.com:5432/x', {});
    expect(result).toBeDefined();
    expect(typeof (result as { checkServerIdentity: unknown }).checkServerIdentity).toBe('function');
    expect((result as { checkServerIdentity: () => undefined }).checkServerIdentity()).toBeUndefined();
  });

  it('adds DATABASE_CA_CERT to the default trust store with full verification', () => {
    const pem = '-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----';
    const result = resolveSslConfig('postgresql://u:p@db.prod.example.com:5432/x', {
      DATABASE_CA_CERT: pem,
    });
    expect(result).toBeDefined();
    const { ca } = result as { ca: string[] };
    expect(ca).toContain(pem);
    expect(ca.length).toBe(tls.rootCertificates.length + 1);
    expect(result).not.toHaveProperty('checkServerIdentity');
    expect(result).not.toHaveProperty('rejectUnauthorized');
  });

  it('prefers DATABASE_CA_CERT over PRISMA_ALLOW_INSECURE_TLS', () => {
    const result = resolveSslConfig('postgresql://u:p@db.prod.example.com:5432/x', {
      DATABASE_CA_CERT: 'pem',
      PRISMA_ALLOW_INSECURE_TLS: '1',
    });
    expect(result).toHaveProperty('ca');
    expect(result).not.toHaveProperty('rejectUnauthorized');
  });

  it('treats malformed URLs as remote (defensive)', () => {
    const result = resolveSslConfig('not-a-valid-url', {});
    expect(result).toBeDefined();
    expect(typeof (result as { checkServerIdentity: unknown }).checkServerIdentity).toBe('function');
  });
});
