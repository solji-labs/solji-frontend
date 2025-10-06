'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { useI18n } from '@/lib/i18n/context';
import { Flame } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { LanguageSwitcher } from './language-switcher';
import { MeritBadge } from './merit-badge';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from './theme-toggle';
import { WalletButton } from './wallet-button';

export function TempleHeader() {
  const { t } = useI18n();
  const [meritPoints] = useState(150);
  const [rank] = useState('香客');

  return (
    <header className='fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <MobileNav />
          <Link href='/temple' className='flex items-center gap-2'>
            <Flame className='w-6 h-6 text-primary animate-glow' />
            <span className='text-xl font-bold'>Solji</span>
          </Link>
        </div>

        <nav className='hidden md:flex items-center gap-6'>
          <Link
            href='/temple'
            className='text-sm hover:text-primary transition-colors'>
            {t.nav.temple}
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className='text-sm'>
                  {t.nav.activities}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className='w-48 p-2'>
                    <Link
                      href='/temple/incense'
                      className='block px-3 py-2 text-sm hover:bg-accent rounded-md'>
                      {t.nav.burnIncense}
                    </Link>
                    <Link
                      href='/temple/fortune'
                      className='block px-3 py-2 text-sm hover:bg-accent rounded-md'>
                      {t.nav.drawFortune}
                    </Link>
                    <Link
                      href='/temple/wishes'
                      className='block px-3 py-2 text-sm hover:bg-accent rounded-md'>
                      {t.nav.makeWish}
                    </Link>
                    <Link
                      href='/temple/donate'
                      className='block px-3 py-2 text-sm hover:bg-accent rounded-md'>
                      {t.nav.donate}
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link
            href='/temple/dashboard'
            className='text-sm hover:text-primary transition-colors'>
            {t.nav.dashboard}
          </Link>
          <Link
            href='/temple/collection'
            className='text-sm hover:text-primary transition-colors'>
            {t.nav.collection}
          </Link>
          <Link
            href='/temple/buddha'
            className='text-sm hover:text-primary transition-colors'>
            {t.nav.buddha}
          </Link>
          <Link
            href='/temple/profile'
            className='text-sm hover:text-primary transition-colors'>
            {t.nav.profile}
          </Link>
        </nav>

        <div className='flex items-center gap-2'>
          <MeritBadge
            points={meritPoints}
            rank={rank}
            className='hidden lg:flex'
          />
          <ThemeToggle />
          <LanguageSwitcher />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
