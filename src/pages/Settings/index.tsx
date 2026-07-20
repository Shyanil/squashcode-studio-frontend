import {
  Bell,
  Brush,
  Database,
  KeyRound,
  Lock,
  Palette,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Select, Textarea } from '@/components/ui';

type SettingsTab =
  | 'General'
  | 'Profile'
  | 'Appearance'
  | 'Notifications'
  | 'OpenAI'
  | 'Storage'
  | 'Security'
  | 'Team'
  | 'Brand Defaults'
  | 'Preferences';

const settingsTabs: Array<{ icon: LucideIcon; label: SettingsTab }> = [
  { label: 'General', icon: Settings2 },
  { label: 'Profile', icon: User },
  { label: 'Appearance', icon: Brush },
  { label: 'Notifications', icon: Bell },
  { label: 'OpenAI', icon: KeyRound },
  { label: 'Storage', icon: Database },
  { label: 'Security', icon: Lock },
  { label: 'Team', icon: Users },
  { label: 'Brand Defaults', icon: Palette },
  { label: 'Preferences', icon: SlidersHorizontal },
];

const timezoneOptions = [
  { label: 'Asia/Kolkata', value: 'Asia/Kolkata' },
  { label: 'America/New_York', value: 'America/New_York' },
  { label: 'Europe/London', value: 'Europe/London' },
];

function ToggleRow({ description, label, enabled = true }: { description: string; enabled?: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <div>
        <p className="text-sm font-semibold text-slate-950 dark:text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <button
        aria-pressed={enabled}
        className={
          enabled
            ? 'relative h-6 w-11 shrink-0 rounded-full bg-slate-950 transition dark:bg-white'
            : 'relative h-6 w-11 shrink-0 rounded-full bg-slate-300 transition dark:bg-slate-700'
        }
        type="button"
      >
        <span
          className={
            enabled
              ? 'absolute right-1 top-1 h-4 w-4 rounded-full bg-white transition dark:bg-slate-950'
              : 'absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition'
          }
        />
      </button>
    </div>
  );
}

function SettingsSection({ children, description, title }: { children: ReactNode; description: string; title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function GeneralSettings() {
  return (
    <SettingsSection description="Configure workspace identity, default timezone, and operational ownership." title="General Settings">
      <div className="grid gap-4 md:grid-cols-2">
        <Input defaultValue="SquashCode Creative Studio" label="Workspace name" />
        <Select defaultValue="Asia/Kolkata" label="Timezone" options={timezoneOptions} />
        <Input defaultValue="studio@squashcode.com" label="Billing email" type="email" />
        <Input defaultValue="SquashCode Internal AI Platform" label="Workspace description" />
      </div>
      <ToggleRow description="Show monthly usage, generation quality, and storage health on the dashboard." label="Workspace health summary" />
    </SettingsSection>
  );
}

function ProfileSettings() {
  return (
    <SettingsSection description="Update personal details used in approvals, comments, and exports." title="Profile">
      <div className="flex flex-col gap-5 md:flex-row">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-950 text-xl font-semibold text-white dark:bg-white dark:text-slate-950">
          AR
        </div>
        <div className="grid flex-1 gap-4 md:grid-cols-2">
          <Input defaultValue="Anika Rao" label="Full name" />
          <Input defaultValue="anika@squashcode.com" label="Email" type="email" />
          <Input defaultValue="Creative Operations Lead" label="Title" />
          <Input defaultValue="+91 98765 43210" label="Phone" />
        </div>
      </div>
      <Textarea defaultValue="I review brand systems, campaign briefs, generated creatives, and final exports for client-ready quality." label="Bio" />
    </SettingsSection>
  );
}

function AppearanceSettings() {
  return (
    <SettingsSection description="Tune density, theme, and workspace appearance for focused creative production." title="Appearance">
      <div className="grid gap-4 md:grid-cols-3">
        {['System', 'Light', 'Dark'].map((theme) => (
          <button
            className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-950"
            key={theme}
            type="button"
          >
            <div className="h-20 rounded-lg bg-gradient-to-br from-slate-100 via-white to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-emerald-950" />
            <p className="mt-3 font-semibold text-slate-950 dark:text-white">{theme}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Interface theme</p>
          </button>
        ))}
      </div>
      <ToggleRow description="Reduce spacing in tables, galleries, and side panels." label="Compact mode" enabled={false} />
      <ToggleRow description="Enable motion on cards, panels, and generated previews." label="Smooth animations" />
    </SettingsSection>
  );
}

function NotificationsSettings() {
  return (
    <SettingsSection description="Control notifications for approvals, exports, usage, and storage limits." title="Notifications">
      <ToggleRow description="Receive alerts when a teammate requests creative approval." label="Approval requests" />
      <ToggleRow description="Notify when export bundles are prepared for download." label="Export completion" />
      <ToggleRow description="Warn admins when monthly AI usage crosses 80%." label="Usage threshold alerts" />
      <ToggleRow description="Send a weekly summary of generated assets and team activity." label="Weekly digest" enabled={false} />
    </SettingsSection>
  );
}

function OpenAISettings() {
  return (
    <SettingsSection description="Configure model defaults and generation behavior. Keys are masked for security." title="OpenAI">
      <div className="grid gap-4 md:grid-cols-2">
        <Input defaultValue="••••••••••••••••" label="API key" type="password" />
        <Select
          defaultValue="gpt-image-1"
          label="Default image model"
          options={[
            { label: 'GPT Image', value: 'gpt-image-1' },
            { label: 'DALL-E compatible', value: 'dalle' },
          ]}
        />
        <Select
          defaultValue="high"
          label="Default quality"
          options={[
            { label: 'Standard', value: 'standard' },
            { label: 'High', value: 'high' },
            { label: 'Ultra', value: 'ultra' },
          ]}
        />
        <Input defaultValue="6" label="Max variations per prompt" type="number" />
      </div>
      <ToggleRow description="Automatically improve prompts before sending them to image generation." label="Prompt enhancement" />
      <ToggleRow description="Analyze uploaded reference images before generation." label="Image analysis" />
    </SettingsSection>
  );
}

function StorageSettings() {
  return (
    <SettingsSection description="Manage Supabase Storage buckets, retention, and upload preferences." title="Storage">
      <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-950">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Used storage</span>
          <span className="font-semibold text-slate-950 dark:text-white">312 GB / 400 GB</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-400" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input defaultValue="generated-creatives" label="Generated bucket" />
        <Input defaultValue="brand-assets" label="Assets bucket" />
        <Input defaultValue="180" label="Archive after days" type="number" />
        <Select
          defaultValue="private"
          label="Default visibility"
          options={[
            { label: 'Private', value: 'private' },
            { label: 'Signed URL', value: 'signed' },
          ]}
        />
      </div>
    </SettingsSection>
  );
}

function SecuritySettings() {
  return (
    <SettingsSection description="Protect workspace access, exports, and sensitive brand files." title="Security">
      <ToggleRow description="Require two-factor authentication for Admin and Designer roles." label="Two-factor authentication" />
      <ToggleRow description="Attach visible audit metadata to exported creative bundles." label="Export audit stamps" />
      <ToggleRow description="Expire asset download links after 24 hours." label="Signed URL expiry" />
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950">
        <div className="flex items-start gap-3">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 text-emerald-700 dark:text-emerald-200" />
          <div>
            <p className="font-semibold text-emerald-900 dark:text-emerald-100">Security posture is healthy</p>
            <p className="mt-1 text-sm text-emerald-800 dark:text-emerald-200">No expired keys, public buckets, or inactive admin sessions detected.</p>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}

function TeamSettings() {
  return (
    <SettingsSection description="Set team defaults for invitations, approvals, and creative handoff." title="Team">
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          defaultValue="Designer"
          label="Default invited role"
          options={[
            { label: 'Designer', value: 'Designer' },
            { label: 'Marketing', value: 'Marketing' },
            { label: 'Viewer', value: 'Viewer' },
          ]}
        />
        <Input defaultValue="2" label="Approval reviewers required" type="number" />
      </div>
      <ToggleRow description="Route every final export through Marketing review." label="Marketing approval gate" />
      <ToggleRow description="Allow Designers to create brands without admin review." label="Designer brand creation" enabled={false} />
    </SettingsSection>
  );
}

function BrandDefaultSettings() {
  return (
    <SettingsSection description="Set default brand generation rules used when a campaign does not override them." title="Brand Defaults">
      <div className="grid gap-4 md:grid-cols-2">
        <Input defaultValue="#0f766e" label="Primary color" type="color" />
        <Input defaultValue="#f97316" label="Accent color" type="color" />
        <Input defaultValue="Inter" label="Primary font" />
        <Input defaultValue="Direct, useful, polished" label="CTA style" />
      </div>
      <Textarea defaultValue="Keep every creative clean, conversion-oriented, brand-safe, visually polished, and suitable for stakeholder review." label="Default creative guidance" />
    </SettingsSection>
  );
}

function PreferencesSettings() {
  return (
    <SettingsSection description="Personal workflow defaults for generation, library browsing, and exports." title="Preferences">
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          defaultValue="grid"
          label="Default library view"
          options={[
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' },
          ]}
        />
        <Select
          defaultValue="png"
          label="Default export type"
          options={[
            { label: 'PNG', value: 'png' },
            { label: 'JPG', value: 'jpg' },
            { label: 'ZIP bundle', value: 'zip' },
          ]}
        />
      </div>
      <ToggleRow description="Keep right-side detail panels open after selecting gallery items." label="Persistent detail panels" />
      <ToggleRow description="Show prompt quality hints in the generator." label="Prompt quality hints" />
    </SettingsSection>
  );
}

const tabContent: Record<SettingsTab, ReactNode> = {
  General: <GeneralSettings />,
  Profile: <ProfileSettings />,
  Appearance: <AppearanceSettings />,
  Notifications: <NotificationsSettings />,
  OpenAI: <OpenAISettings />,
  Storage: <StorageSettings />,
  Security: <SecuritySettings />,
  Team: <TeamSettings />,
  'Brand Defaults': <BrandDefaultSettings />,
  Preferences: <PreferencesSettings />,
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('General');

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        actions={
          <Button type="button">
            <Save aria-hidden="true" className="h-4 w-4" />
            Save changes
          </Button>
        }
        description="Configure workspace behavior, AI defaults, security, storage, team access, and creative preferences."
        title="Settings"
      />

      <div className="grid gap-6 xl:grid-cols-[260px_1fr]">
        <Card className="h-fit xl:sticky xl:top-24">
          <CardContent className="space-y-1 p-2">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.label;

              return (
                <button
                  className={
                    active
                      ? 'flex w-full items-center justify-between gap-3 rounded-lg bg-slate-950 px-3 py-2.5 text-left text-sm font-semibold text-white dark:bg-white dark:text-slate-950'
                      : 'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
                  }
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  type="button"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </span>
                  {tab.label === 'OpenAI' ? <Badge tone="green">Live</Badge> : null}
                </button>
              );
            })}
          </CardContent>
        </Card>

        <div className="animate-slide-up">{tabContent[activeTab]}</div>
      </div>
    </div>
  );
}
