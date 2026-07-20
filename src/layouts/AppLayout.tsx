import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Footer, Navbar, Sidebar } from '@/components/layout';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen ? (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      ) : null}
      <div className="min-h-screen lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-8rem)] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

