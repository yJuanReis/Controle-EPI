import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEPI } from '@/contexts/EPIContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EpiDevolvido {
  id: string;
  nome: string;
  colaborador: string;
  dataAtribuicao: string;
  dataDevolucao: string;
  observacoes?: string;
  marina: string;
}

const RelatorioDevolvidos = () => {
  const { episAtribuidos, getEPIAtribuidoDetalhes } = useEPI();
  const [episDevolvidos, setEpisDevolvidos] = useState<EpiDevolvido[]>([]);

  useEffect(() => {
    // Carregar colaboradores do localStorage
    const colaboradoresStorage = localStorage.getItem('colaboradores');
    const colaboradores = colaboradoresStorage ? JSON.parse(colaboradoresStorage) : [];

    // Filtrar EPIs devolvidos e formatar dados
    const devolvidos = episAtribuidos
      .filter(epi => epi.status === 'devolvido')
      .map(epi => {
        const detalhes = getEPIAtribuidoDetalhes(epi.id);
        const colaborador = colaboradores.find((c: any) => c.id === epi.colaboradorId);
        
        if (!detalhes || !colaborador) return null;

        // Criar data de devolução baseada na última atualização do status
        const dataDevolucao = epi.historicoStatus?.find(h => h.status === 'devolvido')?.data || new Date().toISOString();

        return {
          id: epi.id,
          nome: detalhes.epi.nome,
          colaborador: colaborador.nome,
          dataAtribuicao: format(new Date(epi.dataAtribuicao), 'dd/MM/yyyy', { locale: ptBR }),
          dataDevolucao: format(new Date(dataDevolucao), 'dd/MM/yyyy', { locale: ptBR }),
          observacoes: epi.observacoes,
          marina: colaborador.marina
        };
      })
      .filter((item): item is EpiDevolvido => item !== null)
      .sort((a, b) => {
        // Ordenar por data de devolução (mais recente primeiro)
        const dateA = new Date(a.dataDevolucao.split('/').reverse().join('-'));
        const dateB = new Date(b.dataDevolucao.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });

    setEpisDevolvidos(devolvidos);
  }, [episAtribuidos, getEPIAtribuidoDetalhes]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de EPIs Devolvidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>EPI</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Marina</TableHead>
                <TableHead>Data Atribuição</TableHead>
                <TableHead>Data Devolução</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {episDevolvidos.length > 0 ? (
                episDevolvidos.map((epi) => (
                  <TableRow key={epi.id}>
                    <TableCell className="font-medium">{epi.nome}</TableCell>
                    <TableCell>{epi.colaborador}</TableCell>
                    <TableCell>{epi.marina}</TableCell>
                    <TableCell>{epi.dataAtribuicao}</TableCell>
                    <TableCell>{epi.dataDevolucao}</TableCell>
                    <TableCell className="max-w-xs truncate" title={epi.observacoes}>
                      {epi.observacoes || '-'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum EPI devolvido encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatorioDevolvidos; 