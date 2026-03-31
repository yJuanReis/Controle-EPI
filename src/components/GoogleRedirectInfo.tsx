import React from 'react';
import { Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface GoogleRedirectInfoProps {
  currentUrl: string;
}

const GoogleRedirectInfo: React.FC<GoogleRedirectInfoProps> = ({ currentUrl }) => {
  return (
    <Alert className="mb-4 bg-blue-50">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="font-semibold text-blue-600">Configuração do Google OAuth</AlertTitle>
      <AlertDescription className="text-sm">
        <p>
          Para configurar corretamente o login com Google, adicione as seguintes URLs no
          <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
            Console do Google Cloud
          </a>:
        </p>
        <div className="mt-2 p-2 bg-white rounded border border-blue-200 text-xs font-mono">
          <p><strong>Origens JavaScript autorizadas:</strong></p>
          <code>{currentUrl}</code>
          <p className="mt-2"><strong>URIs de redirecionamento autorizados:</strong></p>
          <code>{currentUrl}</code>
          <code className="block mt-1">{currentUrl}/login</code>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default GoogleRedirectInfo; 