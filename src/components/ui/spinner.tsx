import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface SpinnerProps {
  color?: string;
}

export function Spinner({ color = 'text-primary' }: SpinnerProps) {
  return (
    <Loader2 className={clsx("h-5 w-5 animate-spin", color)} />
  );
}
