import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import RelatorioGeral from '@/components/RelatorioGeral';
import RelatorioColaborador from '@/components/RelatorioColaborador';
import RelatorioDevolvidos from '@/components/RelatorioDevolvidos';
import BuscaAvancadaModal from '@/components/BuscaAvancadaModal';
import { Button } from '@/components/ui/button';
import { Search, UserSearch } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Relatorios = () => {
  const [modalBuscaAberto, setModalBuscaAberto] = useState(false);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<any>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const realizarBuscaSimples = () => {
    if (!termoBusca) return;

    const colaboradoresStorage = localStorage.getItem('colaboradores');
    if (!colaboradoresStorage) return;

    const colaboradores = JSON.parse(colaboradoresStorage);
    const colaborador = colaboradores.find((c: any) => 
      c.nome.toLowerCase().includes(termoBusca.toLowerCase())
    );

    if (colaborador) {
      setColaboradorSelecionado(colaborador);
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 font-sans min-h-screen">
      <Header />
      <Navigation />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
        <p className="text-gray-600">Visualize relatórios gerais e individuais do sistema</p>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral">Relatório Geral</TabsTrigger>
          <TabsTrigger value="individual">Relatório Individual</TabsTrigger>
          <TabsTrigger value="devolvidos">EPIs Devolvidos</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <RelatorioGeral />
        </TabsContent>

        <TabsContent value="individual">
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar colaborador por nome..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    className="pl-8"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        realizarBuscaSimples();
                      }
                    }}
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setModalBuscaAberto(true)}
                className="flex items-center gap-2"
              >
                <UserSearch size={16} />
                Busca Avançada
              </Button>
            </div>

            {colaboradorSelecionado ? (
              <RelatorioColaborador colaborador={colaboradorSelecionado} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                Selecione um colaborador para visualizar seu relatório individual
              </div>
            )}
          </div>

          <BuscaAvancadaModal
            isOpen={modalBuscaAberto}
            onClose={() => setModalBuscaAberto(false)}
            onSearch={(colaborador) => {
              setColaboradorSelecionado(colaborador);
              setModalBuscaAberto(false);
            }}
          />
        </TabsContent>

        <TabsContent value="devolvidos">
          <RelatorioDevolvidos />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Relatorios;
