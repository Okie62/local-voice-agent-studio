import { describe, expect, it } from 'vitest';
import { buildEmbedCode, normalizeWidgetSettings } from './embedCode';

describe('website voice widget embed', () => {
  it('creates a copy-paste script with business config encoded as JSON', () => {
    const code = buildEmbedCode({
      businessName: 'Acme Plumbing',
      agentName: 'Demo AI Voice Agent',
      accentColor: '#2563eb',
      position: 'top-right',
      prompt: 'Collect name, email, and address.'
    });

    expect(code).toContain('<script');
    expect(code).toContain('data-local-voice-agent');
    expect(code).toContain('&quot;businessName&quot;:&quot;Acme Plumbing&quot;');
    expect(code).toContain('https://cdn.localvoiceagent.example/widget.js');
  });

  it('normalizes empty widget settings to useful defaults', () => {
    expect(normalizeWidgetSettings({ businessName: '' })).toEqual({
      businessName: 'Acme Inc.',
      agentName: 'Demo AI Voice Agent',
      accentColor: '#2563eb',
      position: 'top-right',
      prompt: 'You are a friendly AI voice agent. Capture the caller need, full name, email, and service address, then tell them a team member will reach out shortly.'
    });
  });
});
