import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface LoginErrorMessageProps {
  message: string;
  details?: string;
}

const LoginErrorMessage: React.FC<LoginErrorMessageProps> = ({ message, details }) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-semibold">Erro de Autenticação</AlertTitle>
      <AlertDescription className="text-sm">
        <p>{message}</p>
        {details && (
          <details className="mt-2 text-xs">
            <summary className="cursor-pointer font-medium">Detalhes técnicos</summary>
            <p className="mt-1">{details}</p>
          </details>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default LoginErrorMessage; 