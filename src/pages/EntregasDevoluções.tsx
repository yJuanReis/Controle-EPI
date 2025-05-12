
import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Plus, Eye, ArrowDownUp } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

const EntregasDevolucoes = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  return (
    <div className="w-full p-6 bg-gray-50 font-sans min-h-screen">
      <Header />
      <Navigation />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Entregas e Devoluções</h1>
          <p className="text-gray-600">Gerencie entregas e devoluções de EPIs para colaboradores</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Nova Movimentação
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <DatePicker date={startDate} setDate={setStartDate} placeholder="Data inicial" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <DatePicker date={endDate} setDate={setEndDate} placeholder="Data final" />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500">
                <option value="todos">Todos</option>
                <option value="entregas">Entregas</option>
                <option value="devolucoes">Devoluções</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Buscar colaborador"
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
          <CardDescription>Lista de entregas e devoluções de EPIs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>EPI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>001</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">Entrega</span>
                </TableCell>
                <TableCell>10/01/2023</TableCell>
                <TableCell>Carlos Silva</TableCell>
                <TableCell>Capacete de Segurança</TableCell>
                <TableCell>Concluído</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>002</TableCell>
                <TableCell>
                  <span className="bg-amber-100 text-amber-800 py-1 px-2 rounded-full text-xs">Devolução</span>
                </TableCell>
                <TableCell>15/02/2023</TableCell>
                <TableCell>Ana Almeida</TableCell>
                <TableCell>Luvas de Proteção</TableCell>
                <TableCell>Concluído</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>003</TableCell>
                <TableCell>
                  <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">Entrega</span>
                </TableCell>
                <TableCell>01/03/2023</TableCell>
                <TableCell>Marcos Oliveira</TableCell>
                <TableCell>Óculos de Proteção</TableCell>
                <TableCell>Concluído</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>004</TableCell>
                <TableCell>
                  <span className="bg-amber-100 text-amber-800 py-1 px-2 rounded-full text-xs">Devolução</span>
                </TableCell>
                <TableCell>20/03/2023</TableCell>
                <TableCell>Pedro Santos</TableCell>
                <TableCell>Respirador Semi-facial</TableCell>
                <TableCell>Concluído</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Eye size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntregasDevolucoes;
