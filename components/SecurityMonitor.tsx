import React, { useState } from 'react';

interface SecurityEvent {
  id: string;
  type: 'upload' | 'validation' | 'error' | 'success' | 'warning';
  message: string;
  timestamp: Date;
  details?: Record<string, unknown>;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityMonitorProps {
  events: SecurityEvent[];
  onClearEvents?: () => void;
  showDetails?: boolean;
}

const SecurityMonitor: React.FC<SecurityMonitorProps> = ({
  events,
  onClearEvents,
  showDetails = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<
    'all' | 'upload' | 'validation' | 'error' | 'success'
  >('all');

  const filteredEvents = events.filter(
    event => filter === 'all' || event.type === filter
  );

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return '📤';
      case 'validation':
        return '🔍';
      case 'error':
        return '🚨';
      case 'success':
        return '✅';
      default:
        return '📢';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'upload':
        return 'text-blue-600';
      case 'validation':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR');
  };

  return (
    <div className='bg-white rounded-lg shadow-md border border-gray-200'>
      {/* Header */}
      <div className='px-4 py-3 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <span className='text-lg'>🔒</span>
            <h3 className='text-sm font-medium text-gray-900'>
              Monitoring de Sécurité
            </h3>
            <span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full'>
              {events.length} événements
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className='text-gray-400 hover:text-gray-600 transition-colors'
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
            {onClearEvents && (
              <button
                onClick={onClearEvents}
                className='text-red-400 hover:text-red-600 transition-colors'
                title='Effacer les événements'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='px-4 py-2 border-b border-gray-100'>
        <div className='flex space-x-1'>
          {(['all', 'upload', 'validation', 'error', 'success'] as const).map(
            filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filterType === 'all'
                  ? 'Tous'
                  : filterType === 'upload'
                    ? 'Uploads'
                    : filterType === 'validation'
                      ? 'Validation'
                      : filterType === 'error'
                        ? 'Erreurs'
                        : 'Succès'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Events List */}
      {isExpanded && (
        <div className='max-h-64 overflow-y-auto'>
          {filteredEvents.length === 0 ? (
            <div className='px-4 py-8 text-center text-gray-500'>
              <span className='text-2xl'>🔍</span>
              <p className='mt-2 text-sm'>Aucun événement de sécurité</p>
            </div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {filteredEvents.map(event => (
                <div key={event.id} className='px-4 py-3 hover:bg-gray-50'>
                  <div className='flex items-start space-x-3'>
                    <span className='text-lg'>{getEventIcon(event.type)}</span>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between'>
                        <p
                          className={`text-sm font-medium ${getEventColor(event.type)}`}
                        >
                          {event.message}
                        </p>
                        <span className='text-xs text-gray-400'>
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      {showDetails && event.details && (
                        <div className='mt-1'>
                          <pre className='text-xs text-gray-500 bg-gray-50 p-2 rounded overflow-x-auto'>
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {!isExpanded && events.length > 0 && (
        <div className='px-4 py-2 bg-gray-50'>
          <div className='flex items-center justify-between text-xs text-gray-600'>
            <span>
              Dernier événement: {formatTimestamp(events[0].timestamp)}
            </span>
            <span className='flex items-center space-x-1'>
              <span>{getEventIcon(events[0].type)}</span>
              <span>{events[0].message}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityMonitor;
