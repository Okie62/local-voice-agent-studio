export type WidgetPosition = 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';

export type WidgetSettings = {
  businessName?: string;
  agentName?: string;
  accentColor?: string;
  position?: WidgetPosition;
  prompt?: string;
};

export type NormalizedWidgetSettings = Required<WidgetSettings>;

export const defaultPrompt =
  'You are a friendly AI voice agent. Capture the caller need, full name, email, and service address, then tell them a team member will reach out shortly.';

export function normalizeWidgetSettings(settings: WidgetSettings): NormalizedWidgetSettings {
  return {
    businessName: clean(settings.businessName) || 'Acme Inc.',
    agentName: clean(settings.agentName) || 'Demo AI Voice Agent',
    accentColor: clean(settings.accentColor) || '#2563eb',
    position: settings.position ?? 'top-right',
    prompt: clean(settings.prompt) || defaultPrompt
  };
}

export function buildEmbedCode(settings: WidgetSettings): string {
  const normalized = normalizeWidgetSettings(settings);
  const encodedConfig = escapeHtml(JSON.stringify(normalized));

  return `<script src="https://cdn.localvoiceagent.example/widget.js" data-local-voice-agent="${encodedConfig}" async></script>`;
}

export function buildInlineDemoWidget(settings: WidgetSettings): string {
  const config = normalizeWidgetSettings(settings);
  const positionStyles: Record<WidgetPosition, string> = {
    'top-right': 'top:24px;right:24px;',
    'bottom-right': 'bottom:24px;right:24px;',
    'bottom-left': 'bottom:24px;left:24px;',
    'top-left': 'top:24px;left:24px;'
  };

  return `<button aria-label="Call ${escapeHtml(config.businessName)}" style="position:fixed;${positionStyles[config.position]}background:${escapeHtml(config.accentColor)};color:white;border:0;border-radius:999px;padding:14px 18px;font:600 15px system-ui;box-shadow:0 15px 35px rgba(15,23,42,.25);cursor:pointer">☎ Call ${escapeHtml(config.businessName)}</button>`;
}

function clean(value: string | undefined): string {
  return (value ?? '').trim();
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
