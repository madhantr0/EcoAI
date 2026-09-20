import clsx from 'clsx';

export default function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={clsx('glass rounded-3xl shadow-luxe', className)}>{children}</div>
  );
}
