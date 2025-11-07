import React, { useState, useEffect } from 'react';

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
    />
  </svg>
);

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591" />
    </svg>
  );
  
const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

const App: React.FC = () => {
  const [rawUrl, setRawUrl] = useState<string>('');
  const [cleanedUrl, setCleanedUrl] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };
  
  const handleCopyToClipboard = (urlToCopy?: string) => {
    const url = urlToCopy || cleanedUrl;
    if (!url) {
      showToast('لا يوجد رابط لنسخه.', 'error');
      return;
    }
    navigator.clipboard.writeText(url).then(
      () => {
        showToast('تم النسخ بنجاح ✅', 'success');
      },
      (err) => {
        console.error('Async: Could not copy text: ', err);
        showToast('فشل النسخ. الرجاء المحاولة يدوياً.', 'error');
      }
    );
  };

  const handleCleanLink = () => {
    setCleanedUrl('');
    setToast(null);

    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) {
      showToast('الرجاء إدخال رابط.', 'error');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        let urlInput = trimmedUrl;
        if (!/^https?:\/\//i.test(urlInput)) {
          urlInput = 'https://' + urlInput;
        }

        const url = new URL(urlInput);
        const instagramRegex = /(^|\.)instagram\.com$/;

        if (!instagramRegex.test(url.hostname)) {
          showToast('الرابط المدخل لا يبدو كرابط إنستغرام صالح.', 'error');
          return;
        }
        
        const cleaned = `${url.origin}${url.pathname}`;
        setCleanedUrl(cleaned);
        handleCopyToClipboard(cleaned);
      } catch (e) {
        showToast('الرابط غير صالح. الرجاء التحقق والمحاولة مرة أخرى.', 'error');
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  };
  
  return (
    <div className="bg-gradient-to-br from-[#FFD3A5] to-[#A8E6CF] dark:bg-gradient-to-br dark:from-[#2a2a2a] dark:to-[#1B1B1B] min-h-screen flex flex-col items-center justify-center p-4 font-sans selection:bg-[#fd6585] selection:text-white relative">

      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 dark:hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-[#FD6585]"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
        </button>
      </div>

      <main className="w-full max-w-lg mx-auto bg-white/40 dark:bg-white/10 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl text-center flex flex-col gap-6 transform transition-all duration-300 relative overflow-hidden">
        
        {isProcessing && (
          <div className="absolute top-0 left-0 w-full h-1 bg-[#FDCB82]/50 overflow-hidden rounded-t-2xl">
            <div className="absolute h-full w-2/5 bg-gradient-to-r from-[#FD6585] to-[#FDCB82] animate-progress"></div>
          </div>
        )}

        <header>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            HYU ✨
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            إخفِ اسمك من روابط إنستغرام.
          </p>
        </header>

        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={rawUrl}
            onChange={(e) => setRawUrl(e.target.value)}
            placeholder="...الصق رابط إنستغرام هنا"
            className="w-full px-4 py-3 text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-black/20 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-[#FD6585] focus:border-transparent outline-none transition duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-right"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleCleanLink}
            disabled={isProcessing}
            className="w-full px-6 py-3 bg-[#FD6585] text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD6585] dark:focus:ring-offset-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isProcessing ? 'جاري التنظيف...' : 'نظّف الرابط'}
          </button>
          <div className="relative group">
            <button
              onClick={() => handleCopyToClipboard()}
              disabled={!cleanedUrl || isProcessing}
              className="w-full px-6 py-3 bg-[#FDCB82] text-white font-bold rounded-lg shadow-md hover:bg-opacity-90 transform hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDCB82] dark:focus:ring-offset-gray-900 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              <CopyIcon className="w-5 h-5" /> انسخ الرابط
            </button>
            {cleanedUrl && !isProcessing && (
              <div
                role="tooltip"
                className="absolute z-10 bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 px-3 py-1.5 text-sm font-medium text-gray-100 bg-gray-800 dark:bg-black rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 break-all pointer-events-none"
              >
                {cleanedUrl}
              </div>
            )}
          </div>
        </div>
        
        {cleanedUrl && (
            <div className="mt-4 text-left break-all animate-fade-in space-y-3">
              <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">الرابط النظيف:</p>
                  <p className="text-md text-green-700 dark:text-green-300 select-all">{cleanedUrl}</p>
              </div>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                تمت إزالة اسم المستخدم والمعرفات من الرابط لتصبح نسخة آمنة ومجهولة 💫
              </p>
            </div>
        )}
      </main>

      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white text-center animate-toast-in z-50
            ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toast.message}
        </div>
      )}

      <footer className="absolute bottom-4 text-center w-<div className="text-gray-600 dark:text-gray-400 text-sm text-center mt-6">
  <p>Made with 🤍 by Shfouya</p>
  <p className="opacity-80 text-xs mt-1">Clean your link! 🧼✨</p>
</div>
      </footer>
    </div>
  );
};

export default App;