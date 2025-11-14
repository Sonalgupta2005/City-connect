import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { ChatBot } from '../ChatBot';

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export const MobileLayout = ({ children, hideNav = false }: MobileLayoutProps) => {
  return (
    <main className="mobile-screen relative overflow-x-hidden bg-gray-50 dark:bg-gray-900">
      <div className={hideNav ? '' : 'pb-20'}>
        {children}
      </div>
      {!hideNav && <BottomNavigation />}
      <ChatBot />
    </main>
  );
};
