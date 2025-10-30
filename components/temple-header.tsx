'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useI18n } from '@/lib/i18n/context';
import { useUserState } from '@/hooks/use-user-state';
import { ChevronDown, Flame } from 'lucide-react';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
import { MeritBadge } from './merit-badge';
import { MobileNav } from './mobile-nav';
import { NetworkIndicator } from './network-indicator';
import { ThemeToggle } from './theme-toggle';
import { WalletButton } from './wallet-button';

export function TempleHeader() {
  const { t } = useI18n();
  const { userState, loading } = useUserState();
  
  // 调试：查看用户状态
  console.log('🏛️ TempleHeader - userState:', userState);
  console.log('🏛️ TempleHeader - loading:', loading);
  
  // 从用户状态获取功德值和等级
  const meritPoints = userState?.karmaPoints ?? 0;
  const rank = userState?.karmaLevel?.name ?? '新人';
  
  console.log('🏛️ TempleHeader - meritPoints:', meritPoints, 'rank:', rank);

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type='button'
                className='flex items-center gap-1 text-sm hover:text-primary transition-colors'>
                {t.nav.activities}
                <ChevronDown className='h-4 w-4' aria-hidden='true' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start' className='w-48 p-1'>
              <DropdownMenuItem asChild className='text-sm'>
                <Link href='/temple/incense'>{t.nav.burnIncense}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='text-sm'>
                <Link href='/temple/fortune'>{t.nav.drawFortune}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='text-sm'>
                <Link href='/temple/wishes'>{t.nav.makeWish}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className='text-sm'>
                <Link href='/temple/donate'>{t.nav.donate}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          {/* <NetworkIndicator /> */}
          <ThemeToggle />
          <LanguageSwitcher />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
