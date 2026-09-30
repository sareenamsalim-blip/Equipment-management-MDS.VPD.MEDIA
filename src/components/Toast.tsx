import React from 'react';

interface ToastProps {
  show: boolean;
  title: string;
  message: string;
  icon?: string;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  title,
  message,
  icon = 'check_circle'
}) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none flex items-center gap-3 bg-primary text-on-primary px-4 py-3 rounded-lg shadow-2xl border border-white/10 ${
        show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
      }`}
    >
      <span className="material-symbols-outlined text-tertiary-fixed text-[22px] shrink-0">
        {icon}
      </span>
      <div className="flex flex-col min-w-0">
        <span className="font-label-md text-label-md font-semibold text-white leading-tight">
          {title}
        </span>
        <span className="font-body-sm text-body-sm text-on-primary-container text-xs mt-0.5 truncate max-w-sm">
          {message}
        </span>
      </div>
    </div>
  );
};
