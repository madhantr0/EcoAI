'use client';
import clsx from 'clsx';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({ variant = 'primary', size = 'md', className, ...rest }: Props) {
  const base = 'rounded-full font-medium tracking-wide transition disabled:opacity-60';
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3', lg: 'px-8 py-4 text-lg' };
  const variants = {
    primary: 'bg-gold-500 text-forest-900 hover:bg-gold-400 shadow-glow',
    outline: 'border border-gold-500/40 text-gold-400 hover:bg-gold-500/10',
    ghost: 'text-forest-100/80 hover:text-gold-400',
  };
  return <button className={clsx(base, sizes[size], variants[variant], className)} {...rest} />;
}
