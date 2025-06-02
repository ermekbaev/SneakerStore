// src/components/ui/Badge.tsx
'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
        secondary: "border-transparent bg-emerald-100 text-emerald-900 hover:bg-emerald-200",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-emerald-700 border-emerald-200 hover:bg-emerald-50",
        success: "border-transparent bg-green-100 text-green-800",
        warning: "border-transparent bg-amber-100 text-amber-800",
        info: "border-transparent bg-blue-100 text-blue-800",
        premium: "border-transparent bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
        new: "border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white animate-pulse",
        sale: "border-transparent bg-gradient-to-r from-red-500 to-orange-500 text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };