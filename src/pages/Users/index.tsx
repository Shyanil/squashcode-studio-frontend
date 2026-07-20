import { MailPlus, MoreHorizontal, Shield, UserPlus } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import { Badge, SearchField } from '@/components/common';
import { Header } from '@/components/layout/Header';
import { Button, Card, CardContent, Input, Modal, Select } from '@/components/ui';
import { mockUsers } from '@/constants/mockData';
import type { MockUser } from '@/constants/mockData';

const roleOptions = [
  { label: 'Admin', value: 'Admin' },
  { label: 'Designer', value: 'Designer' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Viewer', value: 'Viewer' },
];

const statusTone = {
  Active: 'green',
  Invited: 'amber',
  Paused: 'slate',
} as const;

export default function UsersPage() {
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [inviteOpen, setInviteOpen] = useState(false);

  const inviteUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || 'New Teammate');
    const email = String(formData.get('email') || 'new@squashcode.com');
    const role = String(formData.get('role') || 'Viewer') as MockUser['role'];

    setUsers((currentUsers) => [
      {
        id: `user-${Date.now()}`,
        avatar: name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        email,
        lastLogin: 'Invitation sent',
        name,
        role,
        status: 'Invited',
      },
      ...currentUsers,
    ]);
    setInviteOpen(false);
    event.currentTarget.reset();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        actions={
          <Button onClick={() => setInviteOpen(true)} type="button">
            <UserPlus aria-hidden="true" className="h-4 w-4" />
            Invite User
          </Button>
        }
        description="Manage roles, access levels, last-login signals, and team permissions for the creative workspace."
        title="Team Users"
      />

      <Card>
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchField placeholder="Search name, email, or role" wrapperClassName="w-full lg:max-w-md" />
          <div className="flex flex-wrap gap-2">
            <Select className="w-36" options={[{ label: 'All roles', value: 'all' }, ...roleOptions]} />
            <Select className="w-36" options={[{ label: 'All status', value: 'all' }, { label: 'Active', value: 'Active' }, { label: 'Invited', value: 'Invited' }, { label: 'Paused', value: 'Paused' }]} />
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm dark:divide-slate-800">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Last Login</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((user) => (
                <tr className="transition hover:bg-slate-50 dark:hover:bg-slate-950" key={user.id}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950 dark:text-white">{user.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={user.role === 'Admin' ? 'purple' : 'blue'}>{user.role}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone[user.status]}>{user.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{user.lastLogin}</td>
                  <td className="px-5 py-4 text-right">
                    <Button aria-label={`Actions for ${user.name}`} size="icon" type="button" variant="ghost">
                      <MoreHorizontal aria-hidden="true" className="h-5 w-5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        description="Send a workspace invite with the right role and access scope."
        onClose={() => setInviteOpen(false)}
        open={inviteOpen}
        title="Invite User"
      >
        <form className="space-y-5" onSubmit={inviteUser}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Name" name="name" placeholder="Priya Sharma" required />
            <Input label="Email" name="email" placeholder="priya@squashcode.com" required type="email" />
            <Select label="Role" name="role" options={roleOptions} />
            <Select
              label="Access scope"
              name="scope"
              options={[
                { label: 'All brands', value: 'all' },
                { label: 'Assigned brands only', value: 'assigned' },
              ]}
            />
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
            <div className="flex items-start gap-3">
              <Shield aria-hidden="true" className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-white">Role permissions</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Admins can manage workspace settings, Designers can generate and edit creatives, Marketing can review campaigns, and Viewers have read-only access.
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={() => setInviteOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="submit">
              <MailPlus aria-hidden="true" className="h-4 w-4" />
              Send invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
