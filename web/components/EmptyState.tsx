'use client';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon = '🔍', title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 animate-fade-in">
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-5 shadow-sm"
        style={{ backgroundColor: 'var(--surface-alt)' }}
      >
        {icon}
      </div>
      <p className="text-xl font-extrabold mb-2" style={{ color: 'var(--text-heading)' }}>
        {title}
      </p>
      {subtitle && (
        <p
          className="text-sm text-center leading-relaxed max-w-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
