import { NextApiRequest, NextApiResponse } from 'next';

// Rate limiting par IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuration de sécurité
const SECURITY_CONFIG = {
  // Rate limiting
  RATE_LIMIT_WINDOW: 60 * 60 * 1000, // 1 heure
  MAX_REQUESTS_PER_HOUR: 10,

  // Taille des fichiers
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_TOTAL_SIZE: 20 * 1024 * 1024, // 20MB total

  // Types autorisés
  ALLOWED_MIME_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ],

  // Extensions autorisées
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf'],

  // Extensions dangereuses
  DANGEROUS_EXTENSIONS: [
    '.exe',
    '.bat',
    '.cmd',
    '.scr',
    '.pif',
    '.com',
    '.vbs',
    '.js',
    '.jar',
    '.php',
    '.asp',
    '.jsp',
    '.sh',
    '.ps1',
    '.py',
    '.rb',
    '.pl',
    '.sql',
  ],
};

// Obtenir l'IP du client
export const getClientIP = (req: NextApiRequest): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded
    ? Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded.split(',')[0]
    : req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';

  return ip.replace(/^::ffff:/, ''); // IPv4 mapped IPv6
};

// Vérifier le rate limiting
export const checkRateLimit = (
  ip: string
): { allowed: boolean; remaining: number } => {
  const now = Date.now();
  const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;

  // Nettoyer les anciennes entrées
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }

  // Obtenir ou créer l'entrée pour cette IP
  const entry = rateLimitMap.get(ip) || {
    count: 0,
    resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW,
  };

  // Vérifier si la limite est dépassée
  if (entry.count >= SECURITY_CONFIG.MAX_REQUESTS_PER_HOUR) {
    return { allowed: false, remaining: 0 };
  }

  // Incrémenter le compteur
  entry.count++;
  rateLimitMap.set(ip, entry);

  return {
    allowed: true,
    remaining: SECURITY_CONFIG.MAX_REQUESTS_PER_HOUR - entry.count,
  };
};

// Valider les types MIME
export const validateMimeType = (mimeType: string): boolean => {
  return SECURITY_CONFIG.ALLOWED_MIME_TYPES.includes(mimeType);
};

// Valider les extensions
export const validateExtension = (filename: string): boolean => {
  const extension = '.' + filename.split('.').pop()?.toLowerCase();
  return SECURITY_CONFIG.ALLOWED_EXTENSIONS.includes(extension);
};

// Détecter les extensions dangereuses
export const detectDangerousExtension = (filename: string): boolean => {
  const extension = '.' + filename.split('.').pop()?.toLowerCase();
  return SECURITY_CONFIG.DANGEROUS_EXTENSIONS.includes(extension);
};

// Valider la taille du fichier
export const validateFileSize = (size: number): boolean => {
  return size <= SECURITY_CONFIG.MAX_FILE_SIZE;
};

// Sanitizer le nom de fichier
export const sanitizeFileName = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplacer caractères spéciaux
    .replace(/\.{2,}/g, '.') // Points multiples
    .replace(/^\.+|\.+$/g, '') // Points en début/fin
    .substring(0, 255); // Longueur maximale
};

// Logger les événements de sécurité
export const logSecurityEvent = (
  event: string,
  details: Record<string, string | number | boolean>,
  req: NextApiRequest
) => {
  const ip = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'unknown';

  console.log(`🚨 SECURITY EVENT: ${event}`, {
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    details,
  });

  // Ici vous pourriez envoyer une alerte par email/Slack/Discord
  // sendSecurityAlert(event, { ip, userAgent, details });
};

// Middleware de sécurité principal
export const securityMiddleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = getClientIP(req);

    try {
      // 1. Vérifier le rate limiting
      const rateLimit = checkRateLimit(ip);
      if (!rateLimit.allowed) {
        logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip }, req);
        return res.status(429).json({
          error: 'Trop de requêtes',
          message: 'Limite de requêtes dépassée. Veuillez réessayer plus tard.',
          retryAfter: 3600, // 1 heure
        });
      }

      // 2. Ajouter les headers de sécurité
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Content-Security-Policy', "default-src 'self'");

      // 3. Vérifier la méthode HTTP
      if (req.method !== 'POST' && req.method !== 'GET') {
        logSecurityEvent('INVALID_METHOD', { method: req.method, ip }, req);
        return res.status(405).json({
          error: 'Méthode non autorisée',
          message: 'Seules les méthodes GET et POST sont autorisées',
        });
      }

      // 4. Vérifier les headers suspects
      const suspiciousHeaders = [
        'x-forwarded-host',
        'x-originating-ip',
        'x-remote-ip',
      ];
      for (const header of suspiciousHeaders) {
        if (req.headers[header]) {
          logSecurityEvent(
            'SUSPICIOUS_HEADER',
            { header, value: req.headers[header], ip },
            req
          );
        }
      }

      // 5. Continuer avec le handler
      return handler(req, res);
    } catch (error) {
      logSecurityEvent(
        'SECURITY_MIDDLEWARE_ERROR',
        { error: error instanceof Error ? error.message : String(error), ip },
        req
      );
      return res.status(500).json({
        error: 'Erreur de sécurité',
        message: "Une erreur de sécurité s'est produite",
      });
    }
  };
};

// Valider les données de formulaire
export const validateFormData = (
  data: Record<string, string | number | boolean | File[]>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Vérifier les champs obligatoires
  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length < 2
  ) {
    errors.push('Le nom est obligatoire (minimum 2 caractères)');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("L'email est obligatoire et doit être valide");
  }

  // Vérifier la longueur des champs
  if (data.name && data.name.length > 100) {
    errors.push('Le nom ne peut pas dépasser 100 caractères');
  }

  if (data.email && data.email.length > 255) {
    errors.push("L'email ne peut pas dépasser 255 caractères");
  }

  if (data.message && data.message.length > 5000) {
    errors.push('Le message ne peut pas dépasser 5000 caractères');
  }

  // Vérifier les caractères suspects
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
  ];

  for (const field of ['name', 'email', 'message']) {
    if (data[field]) {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(data[field])) {
          errors.push(`Contenu suspect détecté dans le champ ${field}`);
          break;
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Détecter les tentatives de bot
export const detectBot = (req: NextApiRequest): boolean => {
  const userAgent = req.headers['user-agent'] || '';
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /php/i,
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
};

// Middleware de protection contre les bots
export const botProtectionMiddleware = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (detectBot(req)) {
      logSecurityEvent(
        'BOT_DETECTED',
        { userAgent: req.headers['user-agent'] },
        req
      );
      return res.status(403).json({
        error: 'Accès refusé',
        message: 'Les bots ne sont pas autorisés',
      });
    }

    return handler(req, res);
  };
};

export default {
  getClientIP,
  checkRateLimit,
  validateMimeType,
  validateExtension,
  detectDangerousExtension,
  validateFileSize,
  sanitizeFileName,
  logSecurityEvent,
  securityMiddleware,
  validateFormData,
  detectBot,
  botProtectionMiddleware,
};
