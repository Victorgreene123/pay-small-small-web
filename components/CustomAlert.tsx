'use client';

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

interface CustomAlertProps {
  message: string;
  type: AlertType;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  message,
  type,
  isOpen,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`flex items-center p-4 border rounded-lg shadow-lg max-w-md ${bgColors[type]}`}>
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className={`ml-3 mr-8 text-sm font-medium ${textColors[type]}`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className={`ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 focus:ring-gray-300 hover:bg-white/50 transition-colors ${textColors[type]}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
