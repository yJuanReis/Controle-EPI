
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ppeMovements, ppeCatalog, ppeInstances } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [monthlyData, setMonthlyData] = useState<any>(null);
  
  const years = Array.from(new Set(ppeMovements.map(m => new Date(m.date).getFullYear().toString())));
  const months = [
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  useEffect(() => {
    generateMonthlyData();
  }, [selectedYear, selectedMonth]);

  const generateMonthlyData = () => {
    const startDate = new Date(`${selectedYear}-${selectedMonth}-01T00:00:00Z`);
    const endMonth = parseInt(selectedMonth);
    const endYear = parseInt(selectedYear) + (endMonth === 12 ? 1 : 0);
    const endMonthFormatted = endMonth === 12 ? '01' : (endMonth + 1).toString().padStart(2, '0');
    const endDate = new Date(`${endYear}-${endMonthFormatted}-01T00:00:00Z`);
    
    // Filter movements for the selected month
    const filteredMovements = ppeMovements.filter(movement => {
      const movementDate = new Date(movement.date);
      return movementDate >= startDate && movementDate < endDate;
    });
    
    // Initialize item tracking
    const itemBreakdown = {};
    ppeCatalog.forEach(item => {
      itemBreakdown[item.id] = {
        type: item.type,
        entries: 0,
        exits: 0,
        discarded: 0,
        value: 0
      };
    });
    
    // Process movements
    let entriesCount = 0;
    let exitsCount = 0;
    let discardedCount = 0;
    let totalValue = 0;
    
    filteredMovements.forEach(movement => {
      const instance = ppeInstances.find(i => i.id === movement.ppeInstanceId);
      if (!instance) return;
      
      const catalogItemId = instance.catalogItemId;
      const itemValue = instance.unitValue || 0;
      
      switch (movement.type) {
        case 'delivery':
          entriesCount++;
          itemBreakdown[catalogItemId].entries++;
          itemBreakdown[catalogItemId].value += itemValue;
          totalValue += itemValue;
          break;
        case 'return':
          exitsCount++;
          itemBreakdown[catalogItemId].exits++;
          break;
        case 'discard':
          discardedCount++;
          itemBreakdown[catalogItemId].discarded++;
          break;
        case 'replacement':
          // Replacement is both an entry and exit
          entriesCount++;
          exitsCount++;
          break;
      }
    });
    
    setMonthlyData({
      period: `${months.find(m => m.value === selectedMonth)?.label} ${selectedYear}`,
      entriesCount,
      exitsCount,
      discardedCount,
      totalValue,
      itemBreakdown
    });
  };

  const handleExportReport = () => {
    try {
      const dataStr = JSON.stringify(monthlyData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `relatorio-epi-${selectedYear}-${selectedMonth}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Sucesso",
        description: "Relatório exportado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground mt-1">
            Análise de movimentações e estatísticas de uso de EPIs
          </p>
        </div>
        <Button onClick={handleExportReport}>
          <FileDown className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-1/3">
          <label className="text-sm font-medium">Ano</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.length > 0 ? (
                years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))
              ) : (
                <SelectItem value={new Date().getFullYear().toString()}>
                  {new Date().getFullYear()}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-1/3">
          <label className="text-sm font-medium">Mês</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {monthlyData && (
        <Tabs defaultValue="summary" className="w-full">
          <TabsList>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
            <TabsTrigger value="items">Itens</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Entrada de EPIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthlyData.entriesCount}</div>
                  <p className="text-muted-foreground">itens adicionados ao estoque</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Saída de EPIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthlyData.exitsCount}</div>
                  <p className="text-muted-foreground">itens distribuídos a colaboradores</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">EPIs Descartados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{monthlyData.discardedCount}</div>
                  <p className="text-muted-foreground">itens descartados ou danificados</p>
                </CardContent>
              </Card>
            </div>
            
            {monthlyData.totalValue > 0 && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Valor Total</CardTitle>
                  <CardDescription>
                    Valor dos EPIs adquiridos no período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-safety-blue">
                    R$ {monthlyData.totalValue.toFixed(2).replace('.', ',')}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="items">
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle>Movimentação por Tipo de EPI</CardTitle>
                <CardDescription>
                  Detalhamento por item no período {monthlyData.period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Entradas</TableHead>
                      <TableHead>Saídas</TableHead>
                      <TableHead>Descartados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(monthlyData.itemBreakdown)
                      .filter(([_, data]) => data.entries > 0 || data.exits > 0 || data.discarded > 0)
                      .map(([itemId, data]) => (
                        <TableRow key={itemId}>
                          <TableCell>{data.type}</TableCell>
                          <TableCell>
                            <Badge className="bg-safety-green">
                              {data.entries}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-safety-blue">
                              {data.exits}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-safety-red">
                              {data.discarded}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Reports;
