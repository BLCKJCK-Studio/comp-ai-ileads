import { createElement } from 'react';

const mockTrigger = jest.fn();
const mockSendEmail = jest.fn();

jest.mock('@trigger.dev/sdk', () => ({
  tasks: { trigger: (...args: unknown[]) => mockTrigger(...args) },
}));
jest.mock('@react-email/render', () => ({
  render: jest.fn().mockResolvedValue('<p>hi</p>'),
}));
jest.mock('./resend', () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

import { triggerEmail } from './trigger-email';

describe('triggerEmail', () => {
  const originalKey = process.env.TRIGGER_SECRET_KEY;

  beforeEach(() => {
    mockTrigger.mockReset();
    mockSendEmail.mockReset();
  });

  afterAll(() => {
    if (originalKey === undefined) {
      delete process.env.TRIGGER_SECRET_KEY;
      return;
    }
    process.env.TRIGGER_SECRET_KEY = originalKey;
  });

  it('queues the send-email task when Trigger.dev is configured', async () => {
    process.env.TRIGGER_SECRET_KEY = 'tr_test';
    mockTrigger.mockResolvedValue({ id: 'run_1' });

    const result = await triggerEmail({
      to: 'a@example.com',
      subject: 'Login',
      react: createElement('p', null, 'hi'),
      system: true,
    });

    expect(result).toEqual({ id: 'run_1' });
    expect(mockTrigger).toHaveBeenCalledWith(
      'send-email',
      expect.objectContaining({ to: 'a@example.com', channel: 'system' }),
    );
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('sends directly through Resend when TRIGGER_SECRET_KEY is missing', async () => {
    delete process.env.TRIGGER_SECRET_KEY;
    mockSendEmail.mockResolvedValue({ id: 'email_1' });

    const result = await triggerEmail({
      to: 'a@example.com',
      subject: 'Login',
      react: createElement('p', null, 'hi'),
      system: true,
    });

    expect(result).toEqual({ id: 'email_1' });
    expect(mockTrigger).not.toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'a@example.com', subject: 'Login', system: true }),
    );
  });

  it('routes trust portal emails through the system sender when sending directly', async () => {
    delete process.env.TRIGGER_SECRET_KEY;
    mockSendEmail.mockResolvedValue({ id: 'email_2' });

    await triggerEmail({
      to: 'a@example.com',
      subject: 'Access',
      react: createElement('p', null, 'hi'),
      trustPortal: true,
    });

    expect(mockSendEmail).toHaveBeenCalledWith(expect.objectContaining({ system: true }));
  });
});
