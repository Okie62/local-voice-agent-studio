import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Bot, Building2, CheckCircle2, Code2, Copy, Globe2, Mic, Phone, Play, Settings2, Sparkles, Users } from 'lucide-react';
import { createAgentSession, handleCustomerUtterance, type AgentSession } from './agent/agentMachine';
import { buildEmbedCode, buildInlineDemoWidget, defaultPrompt, type WidgetPosition } from './embed/embedCode';
import './styles.css';

type BusinessType = 'Plumber' | 'Dental Practice' | 'Chiropractor' | 'Med Spa' | 'Roofer' | 'Real Estate Agent';

type StudioConfig = {
  businessName: string;
  agentName: string;
  businessType: BusinessType;
  voice: string;
  language: string;
  timezone: string;
  greeting: string;
  goals: string[];
  prompt: string;
  accentColor: string;
  position: WidgetPosition;
};

const starterConfig: StudioConfig = {
  businessName: 'Acme Plumbing',
  agentName: 'Demo AI Voice Agent',
  businessType: 'Plumber',
  voice: 'Jessica',
  language: 'English',
  timezone: 'America/Chicago',
  greeting: 'Hey, you have reached Acme Plumbing. How can I help you today?',
  goals: ['Service need', 'Full name', 'Email', 'Service address'],
  prompt: defaultPrompt,
  accentColor: '#2563eb',
  position: 'top-right'
};

const businessTypes: BusinessType[] = ['Plumber', 'Dental Practice', 'Chiropractor', 'Med Spa', 'Roofer', 'Real Estate Agent'];
const voices = ['Jessica', 'Marcus', 'Sofia', 'Ethan'];
const positions: WidgetPosition[] = ['top-right', 'bottom-right', 'bottom-left', 'top-left'];
const demoLines = ['My toilet is leaking and I need help', 'Jason Wardrop', 'jwar1088@gmail.com', '123 Main Street Dallas Texas'];

function App() {
  const [config, setConfig] = useState<StudioConfig>(starterConfig);
  const [session, setSession] = useState<AgentSession>(() => createAgentSession({ businessName: starterConfig.businessName, agentName: starterConfig.agentName }));
  const [draftUtterance, setDraftUtterance] = useState('');
  const [copied, setCopied] = useState(false);

  const embedCode = useMemo(() => buildEmbedCode(config), [config]);
  const inlineWidget = useMemo(() => buildInlineDemoWidget(config), [config]);
  const completedGoals = Object.values(session.lead).filter(Boolean).length;

  function updateConfig<K extends keyof StudioConfig>(key: K, value: StudioConfig[K]) {
    setConfig((current) => {
      const next = { ...current, [key]: value };
      if (key === 'businessName') {
        next.greeting = `Hey, you have reached ${value}. How can I help you today?`;
      }
      return next;
    });
  }

  function resetCall() {
    setSession(createAgentSession({ businessName: config.businessName, agentName: config.agentName }));
  }

  function sendUtterance(text = draftUtterance) {
    if (!text.trim()) return;
    setSession((current) => handleCustomerUtterance(current, text));
    setDraftUtterance('');
  }

  async function copyCode() {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={16} /> Build once, sell to local businesses</div>
          <h1>Local Voice Agent Studio</h1>
          <p>
            A white-label AI voice-agent builder inspired by the video: configure a local business agent, test the lead-capture call flow, preview a website voice widget, and copy the embed code.
          </p>
          <div className="hero-actions">
            <a href="#builder" className="button primary"><Settings2 size={18} /> Configure agent</a>
            <a href="#simulator" className="button secondary"><Play size={18} /> Test call</a>
          </div>
        </div>
        <div className="revenue-card">
          <span>Example agency math</span>
          <strong>10 clients × $299/mo</strong>
          <b>$2,990/mo</b>
          <small>Package the same setup for plumbers, dentists, med spas, roofers, chiropractors, and more.</small>
        </div>
      </section>

      <section className="grid" id="builder">
        <article className="panel span-7">
          <h2><Bot /> Agent setup wizard</h2>
          <div className="form-grid">
            <label>Business name<input value={config.businessName} onChange={(event) => updateConfig('businessName', event.target.value)} /></label>
            <label>Agent name<input value={config.agentName} onChange={(event) => updateConfig('agentName', event.target.value)} /></label>
            <label>Business type<select value={config.businessType} onChange={(event) => updateConfig('businessType', event.target.value as BusinessType)}>{businessTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label>Voice<select value={config.voice} onChange={(event) => updateConfig('voice', event.target.value)}>{voices.map((voice) => <option key={voice}>{voice}</option>)}</select></label>
            <label>Language<input value={config.language} onChange={(event) => updateConfig('language', event.target.value)} /></label>
            <label>Timezone<input value={config.timezone} onChange={(event) => updateConfig('timezone', event.target.value)} /></label>
          </div>
          <label className="full">Initial greeting<input value={config.greeting} onChange={(event) => updateConfig('greeting', event.target.value)} /></label>
          <label className="full">Advanced behavior prompt<textarea rows={5} value={config.prompt} onChange={(event) => updateConfig('prompt', event.target.value)} /></label>
        </article>

        <aside className="panel span-5 summary-card">
          <h2><CheckCircle2 /> Agent goals</h2>
          <ul className="goal-list">
            {config.goals.map((goal) => <li key={goal}><CheckCircle2 size={18} /> Collect {goal.toLowerCase()}</li>)}
          </ul>
          <div className="agent-profile">
            <Mic />
            <div><strong>{config.agentName}</strong><span>{config.voice} · {config.language} · {config.businessType}</span></div>
          </div>
        </aside>
      </section>

      <section className="grid" id="simulator">
        <article className="panel span-7">
          <div className="panel-heading">
            <h2><Phone /> Test inbound call</h2>
            <button className="ghost" onClick={resetCall}>Reset</button>
          </div>
          <div className="phone-shell">
            <div className="call-log">
              {session.messages.map((message, index) => <div className={`bubble ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>)}
            </div>
            <div className="quick-lines">
              {demoLines.map((line) => <button key={line} onClick={() => sendUtterance(line)}>{line}</button>)}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); sendUtterance(); }} className="utterance-form">
              <input placeholder="Type what the caller says…" value={draftUtterance} onChange={(event) => setDraftUtterance(event.target.value)} />
              <button className="primary" type="submit">Send</button>
            </form>
          </div>
        </article>

        <aside className="panel span-5">
          <h2><Users /> Captured lead</h2>
          <div className="progress"><span style={{ width: `${Math.min(100, completedGoals * 25)}%` }} /></div>
          <dl className="lead-list">
            <dt>Need</dt><dd>{session.lead.issue || 'Waiting…'}</dd>
            <dt>Name</dt><dd>{session.lead.name || 'Waiting…'}</dd>
            <dt>Email</dt><dd>{session.lead.email || 'Waiting…'}</dd>
            <dt>Address</dt><dd>{session.lead.address || 'Waiting…'}</dd>
          </dl>
        </aside>
      </section>

      <section className="grid">
        <article className="panel span-6">
          <h2><Globe2 /> Website widget preview</h2>
          <div className="form-grid compact">
            <label>Accent color<input type="color" value={config.accentColor} onChange={(event) => updateConfig('accentColor', event.target.value)} /></label>
            <label>Position<select value={config.position} onChange={(event) => updateConfig('position', event.target.value as WidgetPosition)}>{positions.map((position) => <option key={position}>{position}</option>)}</select></label>
          </div>
          <div className="website-preview">
            <div className="fake-nav"><Building2 size={18} /> {config.businessName}<span>Services</span><span>Reviews</span><span>Contact</span></div>
            <div className="fake-hero"><h3>Fast help from {config.businessName}</h3><p>Visitors can click the floating voice widget and start a lead-capture call.</p></div>
            <div dangerouslySetInnerHTML={{ __html: inlineWidget }} />
          </div>
        </article>

        <article className="panel span-6">
          <div className="panel-heading">
            <h2><Code2 /> Copy-paste embed code</h2>
            <button className="ghost" onClick={copyCode}><Copy size={16} /> {copied ? 'Copied' : 'Copy'}</button>
          </div>
          <pre className="code-block"><code>{embedCode}</code></pre>
          <p className="hint">Paste this into a site header/tracking-code area, like the video demonstrates. In production, replace the demo CDN URL with your hosted widget bundle.</p>
        </article>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
