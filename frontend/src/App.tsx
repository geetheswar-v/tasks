import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterBar } from './components/FilterBar';
import { InfiniteList } from './components/InfiniteList';
import { CreateItemModal } from './components/CreateItemModal';
import type { ItemStatus } from './hooks/useItems';
import { Plus } from 'lucide-react';
import { Button } from './components/ui/button';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'All'>('All');
  const [showArchive, setShowArchive] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-300">
        <div className='fixed top-0 left-0 h-8 bg-background w-full' />
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4">
          <header className="rounded-lg border bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg shadow-black/5">
            <div className="px-6 h-16 flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <h1 className="text-lg font-semibold tracking-tight">Tasks</h1>
                <div className="hidden sm:block h-6 w-px bg-border" />
                <div className="hidden md:block">
                  <FilterBar 
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    showArchive={showArchive}
                    setShowArchive={setShowArchive}
                    onCreateClick={() => setIsCreateModalOpen(true)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  variant="default"
                  title="New Task"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Task</span>
                </Button>
                <Button
                  onClick={() => setIsDark(!isDark)}
                  variant="ghost"
                >
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4.5"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                      <path d="M12 3l0 18" />
                      <path d="M12 9l4.65 -4.65" />
                      <path d="M12 14.3l7.37 -7.37" />
                      <path d="M12 19.6l8.85 -8.85" />
                    </svg>
                    <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            </div>
            <div className="md:hidden border-t px-6 py-2 bg-background/40">
              <FilterBar 
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                showArchive={showArchive}
                setShowArchive={setShowArchive}
                onCreateClick={() => setIsCreateModalOpen(true)}
              />
            </div>
          </header>
        </div>

        <main className="container max-w-4xl mx-auto px-4 pt-44 pb-24 md:pt-32">
          <div className="rounded-lg border bg-card overflow-hidden">
            <InfiniteList 
              statusFilter={statusFilter}
              showArchive={showArchive}
            />
          </div>

          <CreateItemModal 
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
