import { useCallback, useRef, useState } from 'react';

export interface SecurityEvent {
  id: string;
  type: 'upload' | 'validation' | 'error' | 'success' | 'warning';
  message: string;
  timestamp: Date;
  details?: Record<string, string | number | boolean>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityStats {
  totalEvents: number;
  uploads: number;
  validations: number;
  errors: number;
  successes: number;
  warnings: number;
  lastEvent?: SecurityEvent;
}

export const useSecurity = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const eventIdRef = useRef(0);

  // Générer un ID unique pour chaque événement
  const generateEventId = useCallback(() => {
    return `security-${Date.now()}-${++eventIdRef.current}`;
  }, []);

  // Ajouter un événement de sécurité
  const addEvent = useCallback(
    (
      type: SecurityEvent['type'],
      message: string,
      details?: Record<string, string | number | boolean>,
      severity: SecurityEvent['severity'] = 'medium'
    ) => {
      const event: SecurityEvent = {
        id: generateEventId(),
        type,
        message,
        timestamp: new Date(),
        details,
        severity,
      };

      setEvents(prev => [event, ...prev.slice(0, 99)]); // Garder seulement les 100 derniers événements

      // Logger dans la console pour le développement
      console.log(`🔒 Security Event [${severity.toUpperCase()}]:`, {
        type,
        message,
        details,
        timestamp: event.timestamp,
      });

      return event;
    },
    [generateEventId]
  );

  // Événements spécifiques
  const logFileUpload = useCallback(
    (filename: string, size: number, type: string) => {
      return addEvent(
        'upload',
        `Fichier uploadé: ${filename} (${(size / 1024 / 1024).toFixed(2)}MB)`,
        { filename, size, type },
        'low'
      );
    },
    [addEvent]
  );

  const logFileValidation = useCallback(
    (filename: string, isValid: boolean, reason?: string) => {
      return addEvent(
        'validation',
        `Validation ${isValid ? 'réussie' : 'échouée'} pour ${filename}`,
        { filename, isValid, reason },
        isValid ? 'low' : 'high'
      );
    },
    [addEvent]
  );

  const logSecurityError = useCallback(
    (error: string, details?: Record<string, string | number | boolean>) => {
      return addEvent('error', `Erreur de sécurité: ${error}`, details, 'high');
    },
    [addEvent]
  );

  const logSecuritySuccess = useCallback(
    (message: string, details?: Record<string, string | number | boolean>) => {
      return addEvent('success', message, details, 'low');
    },
    [addEvent]
  );

  const logSecurityWarning = useCallback(
    (warning: string, details?: Record<string, string | number | boolean>) => {
      return addEvent('warning', `Attention: ${warning}`, details, 'medium');
    },
    [addEvent]
  );

  // Détecter les patterns suspects
  const detectSuspiciousActivity = useCallback(
    (filename: string, size: number, type: string) => {
      const suspiciousPatterns = [
        { pattern: /\.exe$/i, reason: 'Fichier exécutable détecté' },
        { pattern: /\.bat$/i, reason: 'Script batch détecté' },
        { pattern: /\.cmd$/i, reason: 'Commande système détectée' },
        { pattern: /\.scr$/i, reason: 'Écran de veille suspect détecté' },
        { pattern: /\.pif$/i, reason: 'Fichier PIF suspect détecté' },
        { pattern: /\.vbs$/i, reason: 'Script VBS détecté' },
        { pattern: /\.js$/i, reason: 'Script JavaScript détecté' },
        { pattern: /\.jar$/i, reason: 'Archive Java détectée' },
        { pattern: /\.php$/i, reason: 'Script PHP détecté' },
        { pattern: /\.asp$/i, reason: 'Script ASP détecté' },
        { pattern: /\.jsp$/i, reason: 'Script JSP détecté' },
        { pattern: /\.sh$/i, reason: 'Script shell détecté' },
        { pattern: /\.ps1$/i, reason: 'Script PowerShell détecté' },
        { pattern: /\.py$/i, reason: 'Script Python détecté' },
        { pattern: /\.rb$/i, reason: 'Script Ruby détecté' },
        { pattern: /\.pl$/i, reason: 'Script Perl détecté' },
        { pattern: /\.sql$/i, reason: 'Script SQL détecté' },
      ];

      for (const { pattern, reason } of suspiciousPatterns) {
        if (pattern.test(filename)) {
          logSecurityError(reason, { filename, size, type });
          return true;
        }
      }

      // Vérifier la taille suspecte
      if (size < 100) {
        logSecurityWarning('Fichier très petit (possiblement corrompu)', {
          filename,
          size,
          type,
        });
      }

      if (size > 50 * 1024 * 1024) {
        // 50MB
        logSecurityWarning('Fichier très volumineux', { filename, size, type });
      }

      return false;
    },
    [logSecurityError, logSecurityWarning]
  );

  // Calculer les statistiques
  const getStats = useCallback((): SecurityStats => {
    const stats: SecurityStats = {
      totalEvents: events.length,
      uploads: events.filter(e => e.type === 'upload').length,
      validations: events.filter(e => e.type === 'validation').length,
      errors: events.filter(e => e.type === 'error').length,
      successes: events.filter(e => e.type === 'success').length,
      warnings: events.filter(e => e.type === 'warning').length,
      lastEvent: events[0],
    };

    return stats;
  }, [events]);

  // Nettoyer les événements
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  // Filtrer les événements par type
  const getEventsByType = useCallback(
    (type: SecurityEvent['type']) => {
      return events.filter(event => event.type === type);
    },
    [events]
  );

  // Filtrer les événements par sévérité
  const getEventsBySeverity = useCallback(
    (severity: SecurityEvent['severity']) => {
      return events.filter(event => event.severity === severity);
    },
    [events]
  );

  // Obtenir les événements récents (dernières 24h)
  const getRecentEvents = useCallback(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return events.filter(event => event.timestamp > oneDayAgo);
  }, [events]);

  // Démarrer/arrêter le monitoring
  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    addEvent('success', 'Monitoring de sécurité activé');
  }, [addEvent]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    addEvent('success', 'Monitoring de sécurité désactivé');
  }, [addEvent]);

  return {
    // État
    events,
    isMonitoring,
    stats: getStats(),

    // Actions
    addEvent,
    logFileUpload,
    logFileValidation,
    logSecurityError,
    logSecuritySuccess,
    logSecurityWarning,
    detectSuspiciousActivity,
    clearEvents,

    // Filtres
    getEventsByType,
    getEventsBySeverity,
    getRecentEvents,

    // Monitoring
    startMonitoring,
    stopMonitoring,
  };
};
