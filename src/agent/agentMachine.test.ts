import { describe, expect, it } from 'vitest';
import { createAgentSession, handleCustomerUtterance, isLeadComplete } from './agentMachine';

describe('voice agent conversation engine', () => {
  it('greets with the configured business name and asks how it can help', () => {
    const session = createAgentSession({ businessName: 'Acme Plumbing', contactFirstName: 'Jason' });

    expect(session.messages[0]).toMatchObject({
      role: 'agent',
      text: 'Hey Jason, you have reached Acme Plumbing. How can I help you today?'
    });
  });

  it('collects service need, name, email, and address in order', () => {
    let session = createAgentSession({ businessName: 'Acme Plumbing' });

    session = handleCustomerUtterance(session, 'My toilet is leaking and I need help');
    expect(session.lead.issue).toBe('My toilet is leaking and I need help');
    expect(session.messages.at(-1)?.text).toContain('full name');

    session = handleCustomerUtterance(session, 'Jason Wardrop');
    expect(session.lead.name).toBe('Jason Wardrop');
    expect(session.messages.at(-1)?.text).toContain('email');

    session = handleCustomerUtterance(session, 'jwar1088@gmail.com');
    expect(session.lead.email).toBe('jwar1088@gmail.com');
    expect(session.messages.at(-1)?.text).toContain('address');

    session = handleCustomerUtterance(session, '123 Main Street Dallas Texas');
    expect(session.lead.address).toBe('123 Main Street Dallas Texas');
    expect(session.messages.at(-1)?.text).toContain('team member will reach out');
    expect(isLeadComplete(session.lead)).toBe(true);
  });

  it('asks again when an email is invalid', () => {
    let session = createAgentSession({ businessName: 'Acme Plumbing' });
    session = handleCustomerUtterance(session, 'Leaking toilet');
    session = handleCustomerUtterance(session, 'Jason Wardrop');
    session = handleCustomerUtterance(session, 'not an email');

    expect(session.lead.email).toBeUndefined();
    expect(session.messages.at(-1)?.text).toContain('valid email');
  });
});
