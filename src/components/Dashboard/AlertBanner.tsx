
import React from 'react';
import { Alert as AlertType } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, AlertTriangle, Calendar, Package, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const getAlertIcon = (type: AlertType['type']) => {
  switch (type) {
    case 'expiry':
      return <Calendar className="h-5 w-5" />;
    case 'stock':
      return <Package className="h-5 w-5" />;
    case 'compliance':
      return <Shield className="h-5 w-5" />;
    case 'training':
      return <Calendar className="h-5 w-5" />;
    case 'maintenance':
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getSeverityColor = (severity: AlertType['severity']) => {
  switch (severity) {
    case 'high':
      return 'bg-safety-red/10 text-safety-red border-safety-red/20';
    case 'medium':
      return 'bg-safety-orange/10 text-safety-orange-dark border-safety-orange/20';
    case 'low':
      return 'bg-safety-blue/10 text-safety-blue border-safety-blue/20';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

interface AlertBannerProps {
  alert: AlertType;
  onDismiss?: (id: string) => void;
}

export function AlertBanner({ alert, onDismiss }: AlertBannerProps) {
  const { id, type, message, severity, date } = alert;
  
  // Format date to display as "5 Apr, 2024"
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Card className={cn("mb-3 border", getSeverityColor(severity))}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full", 
              severity === 'high' ? 'bg-safety-red/20' : 
              severity === 'medium' ? 'bg-safety-orange/20' : 
              'bg-safety-blue/20'
            )}>
              {getAlertIcon(type)}
            </div>
            <div>
              <p className="font-medium">{message}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          {onDismiss && (
            <button 
              onClick={() => onDismiss(id)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Dismiss alert"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
