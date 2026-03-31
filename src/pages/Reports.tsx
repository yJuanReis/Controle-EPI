
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BarChart, XAxis, YAxis, Bar, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Printer, Download, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MonthlyReport } from '@/types';
import { format } from 'date-fns';

// Colors for chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Get available months (last 12 months)
const generateMonthOptions = () => {
  const options = [];
  const now = new Date();
  
  for (let i = 0; i < 12; i++) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = format(month, 'yyyy-MM');
    const label = format(month, 'MMMM yyyy');
    options.push({ value, label });
  }
  
  return options;
};

// Mock function to get report data
const getMonthlyReport = (month: string): MonthlyReport => {
  // This would be replaced with a real API call
  const demoData: MonthlyReport = {
    month,
    entriesCount: Math.floor(Math.random() * 50) + 10,
    exitsCount: Math.floor(Math.random() * 40) + 5,
    discardedCount: Math.floor(Math.random() * 10),
    totalValue: Math.floor(Math.random() * 5000) + 1000,
    itemBreakdown: {
      'luvas': {
        entries: Math.floor(Math.random() * 20) + 5,
        exits: Math.floor(Math.random() * 15) + 3,
        discarded: Math.floor(Math.random() * 5),
        value: Math.floor(Math.random() * 1000) + 200,
      },
      'capacetes': {
        entries: Math.floor(Math.random() * 10) + 2,
        exits: Math.floor(Math.random() * 8) + 1,
        discarded: Math.floor(Math.random() * 3),
        value: Math.floor(Math.random() * 1500) + 500,
      },
      'oculos': {
        entries: Math.floor(Math.random() * 15) + 3,
        exits: Math.floor(Math.random() * 12) + 2,
        discarded: Math.floor(Math.random() * 4),
        value: Math.floor(Math.random() * 800) + 300,
      },
      'protetores': {
        entries: Math.floor(Math.random() * 8) + 1,
        exits: Math.floor(Math.random() * 6) + 1,
        discarded: Math.floor(Math.random() * 2),
        value: Math.floor(Math.random() * 600) + 100,
      }
    }
  };
  
  return demoData;
};

const Reports = () => {
  const { toast } = useToast();
  const monthOptions = generateMonthOptions();
  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0].value);
  const [reportData, setReportData] = useState<MonthlyReport>(getMonthlyReport(selectedMonth));
  const [activeTab, setActiveTab] = useState('summary');
  
  // Handle month change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setReportData(getMonthlyReport(month));
  };
  
  // Chart data for summary
  const summaryData = [
    { name: 'Entradas', value: reportData.entriesCount, color: COLORS[0] },
    { name: 'Saídas', value: reportData.exitsCount, color: COLORS[1] },
    { name: 'Descartados', value: reportData.discardedCount, color: COLORS[2] },
  ];
  
  // Chart data for item breakdown
  const itemBreakdownData = Object.entries(reportData.itemBreakdown).map(([key, value]) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      entradas: value.entries,
      saidas: value.exits,
      descartados: value.discarded,
    };
  });
  
  // Export data as CSV
  const exportToCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      
      // Add headers
      csvContent += 'Item,Entradas,Saídas,Descartados,Valor Total\n';
      
      // Add rows for each item
      Object.entries(reportData.itemBreakdown).forEach(([key, value]) => {
        csvContent += `${key},${value.entries},${value.exits},${value.discarded},${value.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
      });
      
      // Add total row
      csvContent += `Total,${reportData.entriesCount},${reportData.exitsCount},${reportData.discardedCount},${reportData.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`;
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `relatorio-epi-${reportData.month}.csv`);
      document.body.appendChild(link);
      
      // Trigger download and remove link
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Relatório exportado",
        description: `O relatório de ${format(new Date(reportData.month), 'MMMM yyyy')} foi exportado com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao exportar",
        description: "Não foi possível exportar o relatório.",
      });
    }
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
    toast({
      title: "Enviado para impressão",
      description: "O relatório foi enviado para a fila de impressão.",
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Relatório Mensal de EPIs</CardTitle>
            <CardDescription>
              Visualize entradas, saídas e descarte de EPIs
            </CardDescription>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="month">Mês do relatório</Label>
                <Select value={selectedMonth} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="summary">Resumo</TabsTrigger>
                <TabsTrigger value="breakdown">Detalhamento por Tipo</TabsTrigger>
              </TabsList>
              
              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-1 pt-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Entradas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.entriesCount}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-1 pt-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Saídas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.exitsCount}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-1 pt-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Descartados
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{reportData.discardedCount}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Visão Geral</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip formatter={(value) => [`${value} unidades`, '']} />
                        <Bar dataKey="value" name="Quantidade" background={{ fill: '#f3f4f6' }}>
                          {summaryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Breakdown Tab */}
              <TabsContent value="breakdown" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhamento por Tipo de EPI</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={itemBreakdownData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="entradas" name="Entradas" fill={COLORS[0]} />
                        <Bar dataKey="saidas" name="Saídas" fill={COLORS[1]} />
                        <Bar dataKey="descartados" name="Descartados" fill={COLORS[2]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tabela Detalhada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">Tipo de EPI</th>
                            <th className="text-left py-3 px-4">Entradas</th>
                            <th className="text-left py-3 px-4">Saídas</th>
                            <th className="text-left py-3 px-4">Descartados</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(reportData.itemBreakdown).map(([key, item]) => (
                            <tr key={key} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4 capitalize">{key}</td>
                              <td className="py-3 px-4">{item.entries}</td>
                              <td className="py-3 px-4">{item.exits}</td>
                              <td className="py-3 px-4">{item.discarded}</td>
                            </tr>
                          ))}
                          <tr className="font-medium">
                            <td className="py-3 px-4">Total</td>
                            <td className="py-3 px-4">{reportData.entriesCount}</td>
                            <td className="py-3 px-4">{reportData.exitsCount}</td>
                            <td className="py-3 px-4">{reportData.discardedCount}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
