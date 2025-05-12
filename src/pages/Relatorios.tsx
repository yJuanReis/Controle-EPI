
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { FileText, Download, Filter } from "lucide-react";
import { useState } from "react";
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

const Relatorios = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [reportType, setReportType] = useState<string>("entregas");

  return (
    <div className="w-full p-6 bg-gray-50 font-sans min-h-screen">
      <Header />
      <Navigation />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Relatórios</h1>
        <p className="text-gray-600">Gere relatórios detalhados sobre entregas, devoluções e status dos EPIs.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Relatório</CardTitle>
          <CardDescription>Selecione o período e o tipo de relatório que deseja gerar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <DatePicker date={startDate} setDate={setStartDate} placeholder="Data inicial" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <DatePicker date={endDate} setDate={setEndDate} placeholder="Data final" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="entregas">Entregas de EPIs</option>
                <option value="devolucoes">Devoluções de EPIs</option>
                <option value="vencimentos">EPIs Próximos ao Vencimento</option>
                <option value="estoque">Status de Estoque</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button className="flex items-center gap-2">
              <Filter size={16} />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              {reportType === "entregas" && "Relatório de entregas de EPIs"}
              {reportType === "devolucoes" && "Relatório de devoluções de EPIs"}
              {reportType === "vencimentos" && "EPIs próximos ao vencimento"}
              {reportType === "estoque" && "Status atual do estoque"}
            </CardDescription>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            Exportar CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>EPI</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportType === "entregas" && (
                <>
                  <TableRow>
                    <TableCell>12345</TableCell>
                    <TableCell>Capacete de Segurança</TableCell>
                    <TableCell>Carlos Silva</TableCell>
                    <TableCell>10/01/2023</TableCell>
                    <TableCell>Entregue</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12346</TableCell>
                    <TableCell>Luvas de Proteção</TableCell>
                    <TableCell>Ana Almeida</TableCell>
                    <TableCell>15/01/2023</TableCell>
                    <TableCell>Entregue</TableCell>
                  </TableRow>
                </>
              )}
              {reportType === "devolucoes" && (
                <>
                  <TableRow>
                    <TableCell>12347</TableCell>
                    <TableCell>Óculos de Proteção</TableCell>
                    <TableCell>Marcos Oliveira</TableCell>
                    <TableCell>25/02/2023</TableCell>
                    <TableCell>Devolvido</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12348</TableCell>
                    <TableCell>Respirador Semi-facial</TableCell>
                    <TableCell>Pedro Santos</TableCell>
                    <TableCell>28/02/2023</TableCell>
                    <TableCell>Devolvido</TableCell>
                  </TableRow>
                </>
              )}
              {reportType === "vencimentos" && (
                <>
                  <TableRow>
                    <TableCell>12349</TableCell>
                    <TableCell>Capacete de Segurança</TableCell>
                    <TableCell>Carlos Silva</TableCell>
                    <TableCell>15/12/2023</TableCell>
                    <TableCell className="text-amber-600">30 dias</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12350</TableCell>
                    <TableCell>Óculos de Proteção</TableCell>
                    <TableCell>Ana Almeida</TableCell>
                    <TableCell>10/12/2023</TableCell>
                    <TableCell className="text-red-600">15 dias</TableCell>
                  </TableRow>
                </>
              )}
              {reportType === "estoque" && (
                <>
                  <TableRow>
                    <TableCell>12351</TableCell>
                    <TableCell>Capacete de Segurança</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-green-600">Em estoque (15)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>12352</TableCell>
                    <TableCell>Luvas de Proteção</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-amber-600">Baixo estoque (3)</TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Relatorios;
