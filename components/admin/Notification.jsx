import { useEffect } from 'react';

/**
 * Composant Notification pour afficher des messages de succès, erreur, warning, ou info
 * @param {Object} props
 * @param {'success' | 'error' | 'warning' | 'info'} props.type - Type de notification
 * @param {string} props.message - Message à afficher
 * @param {Function} props.onClose - Fonction appelée pour fermer la notification
 * @param {number} [props.duration=5000] - Durée d'affichage en millisecondes (0 = pas de fermeture auto)
 */
export default function Notification({
  type = 'info',
  message,
  onClose,
  duration = 5000,
}) {
  // Fermeture automatique après la durée spécifiée
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Styles selon le type de notification
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-500',
          text: 'text-green-800 dark:text-green-200',
          icon: '✓',
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-500',
          text: 'text-red-800 dark:text-red-200',
          icon: '✕',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-500',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: '⚠',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-500',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'ℹ',
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-3
        ${styles.bg} ${styles.text}
        border-l-4 ${styles.border}
        p-4 rounded-lg shadow-lg
        max-w-md
        animate-slide-in-right
      `}
      role="alert"
    >
      {/* Icône */}
      <div className="flex-shrink-0">
        <span className="text-2xl" aria-hidden="true">
          {styles.icon}
        </span>
      </div>

      {/* Message */}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>

      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
        aria-label="Fermer la notification"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Styles pour l'animation */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
