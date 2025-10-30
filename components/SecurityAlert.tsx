import React, { useEffect, useState } from 'react';

interface SecurityAlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  details?: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const SecurityAlert: React.FC<SecurityAlertProps> = ({
  type,
  message,
  details,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '🚨';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full mx-4`}>
      <div className={`border rounded-lg p-4 shadow-lg ${getAlertStyles()}`}>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>
            <span className='text-xl'>{getIcon()}</span>
          </div>
          <div className='ml-3 flex-1'>
            <h3 className='text-sm font-medium'>
              {type === 'success' && 'Sécurité validée'}
              {type === 'warning' && 'Attention sécurité'}
              {type === 'error' && 'Alerte sécurité'}
              {type === 'info' && 'Information sécurité'}
            </h3>
            <div className='mt-1 text-sm'>
              <p>{message}</p>
              {details && <p className='mt-1 text-xs opacity-75'>{details}</p>}
            </div>
          </div>
          <div className='ml-4 flex-shrink-0'>
            <button
              onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
              }}
              className='inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition ease-in-out duration-150'
            >
              <span className='sr-only'>Fermer</span>
              <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAlert;
