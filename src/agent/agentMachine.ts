export type MessageRole = 'agent' | 'customer';

export type Lead = {
  issue?: string;
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
};

export type AgentConfig = {
  businessName: string;
  agentName?: string;
  contactFirstName?: string;
};

export type AgentSession = {
  config: Required<Pick<AgentConfig, 'businessName'>> & Omit<AgentConfig, 'businessName'>;
  lead: Lead;
  messages: Array<{ role: MessageRole; text: string }>;
  step: 'need' | 'name' | 'email' | 'address' | 'complete';
};

export function createAgentSession(config: AgentConfig): AgentSession {
  const businessName = clean(config.businessName) || 'Acme Inc.';
  const firstName = clean(config.contactFirstName);
  const greeting = firstName
    ? `Hey ${firstName}, you have reached ${businessName}. How can I help you today?`
    : `Hey, you have reached ${businessName}. How can I help you today?`;

  return {
    config: { ...config, businessName },
    lead: {},
    step: 'need',
    messages: [{ role: 'agent', text: greeting }]
  };
}

export function handleCustomerUtterance(session: AgentSession, utterance: string): AgentSession {
  const text = clean(utterance);
  const messages = [...session.messages, { role: 'customer' as const, text }];
  const lead = { ...session.lead };
  let step = session.step;
  let response = '';

  if (!text) {
    response = repeatPrompt(step);
    return { ...session, lead, step, messages: [...messages, { role: 'agent', text: response }] };
  }

  switch (step) {
    case 'need':
      lead.issue = text;
      step = 'name';
      response = `Got it. I'll make sure a team member can help with: ${text}. Can I start with your full name please?`;
      break;
    case 'name':
      lead.name = titleCaseName(text);
      step = 'email';
      response = `Thanks ${firstNameFrom(lead.name)}. Could you share your email address so we can contact you?`;
      break;
    case 'email':
      if (!isValidEmail(text)) {
        response = 'I want to make sure we can reach you. Could you provide a valid email address?';
      } else {
        lead.email = text.toLowerCase();
        step = 'address';
        response = 'Great, thanks. Lastly, could you provide your address so we know where to assist with the issue?';
      }
      break;
    case 'address':
      lead.address = text;
      step = 'complete';
      response = `Perfect. A team member will reach out shortly to assist with ${lead.issue ?? 'your request'}. Thanks for reaching out${lead.name ? ` ${firstNameFrom(lead.name)}` : ''}, and have a great day.`;
      break;
    case 'complete':
      response = 'Thanks — we already have the details we need. A team member will reach out shortly.';
      break;
  }

  return { ...session, lead, step, messages: [...messages, { role: 'agent', text: response }] };
}

export function isLeadComplete(lead: Lead): boolean {
  return Boolean(lead.issue && lead.name && lead.email && lead.address);
}

function repeatPrompt(step: AgentSession['step']): string {
  switch (step) {
    case 'need':
      return 'How can I help you today?';
    case 'name':
      return 'Can I start with your full name please?';
    case 'email':
      return 'Could you share your email address so we can contact you?';
    case 'address':
      return 'Could you provide your address so we know where to assist with the issue?';
    case 'complete':
      return 'A team member will reach out shortly.';
  }
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value: string | undefined): string {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}

function firstNameFrom(name: string): string {
  return name.split(' ')[0] || 'there';
}

function titleCaseName(name: string): string {
  return name
    .split(' ')
    .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(' ');
}
