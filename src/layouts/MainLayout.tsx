import React from 'react';
import { useUI } from '../hooks/useUI';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Toast from '../components/ui/Toast';
import clsx from 'clsx';
import { AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const { theme, toasts, hideToast } = useUI();

  return (
    <div className={clsx(theme === 'dark' && 'dark')}>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Navbar />

        {/* Main Content */}
        <main className="min-h-[calc(100vh-64px-380px)]">{children}</main>

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                id={toast.id}
                type={toast.type}
                message={toast.message}
                duration={toast.duration}
                onClose={hideToast}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
};

export default Layout;
