'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  BarChart3,
  Flame,
  Heart,
  ImageIcon,
  Menu,
  ScrollText,
  Sparkles,
  User,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { MeritBadge } from './merit-badge';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [meritPoints] = useState(150);
  const [rank] = useState('香客');

  const navItems = [
    { href: '/temple', label: 'Temple Home', icon: Flame },
    { href: '/temple/incense', label: 'Burn Incense', icon: Flame },
    { href: '/temple/fortune', label: 'Draw Fortune', icon: ScrollText },
    { href: '/temple/wishes', label: 'Make Wish', icon: Heart },
    { href: '/temple/donate', label: 'Donate', icon: Sparkles },
    { href: '/temple/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/temple/collection', label: 'NFT Collection', icon: ImageIcon },
    { href: '/temple/buddha', label: 'Buddha Statue', icon: Users },
    { href: '/temple/profile', label: 'Profile', icon: User }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu className='w-5 h-5' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-80'>
        <SheetHeader>
          <SheetTitle className='flex items-center gap-2'>
            <Flame className='w-6 h-6 text-primary animate-glow' />
            Solji Menu
          </SheetTitle>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          {/* Merit Badge */}
          <div className='p-4 rounded-lg bg-card border border-border'>
            <MeritBadge points={meritPoints} rank={rank} />
          </div>

          {/* Navigation Links */}
          <nav className='space-y-1'>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className='flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors'>
                  <Icon className='w-5 h-5 text-muted-foreground' />
                  <span className='text-sm font-medium'>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
