import clsx from 'clsx';

export default function GlassPanel({
  className,
  children,
  hi = false,
}: {
  className?: string;
  children: React.ReactNode;
  hi?: boolean;
}) {
  return (
    <div className={clsx(hi ? 'glass-hi' : 'glass', 'rounded-3xl', className)}>{children}</div>
  );
}
