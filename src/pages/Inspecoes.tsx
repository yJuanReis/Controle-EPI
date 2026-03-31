import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useEPI } from '@/contexts/EPIContext';
import { useInspecao } from '@/contexts/InspecaoContext';
import { Inspecao, InspecaoFormData } from '@/types/inspecao';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { Plus, Search, CheckCircle, AlertTriangle, XCircle, Calendar, User, FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Inspecoes: React.FC = () => {
  const { epis } = useEPI();
  const { inspecoes, adicionarInspecao, atualizarInspecao, removerInspecao, getInspecoesRecentes } = useInspecao();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [formData, setFormData] = useState<InspecaoFormData>({
    epiId: 0,
    colaboradorId: 0,
    status: 'aprovado',
    observacoes: '',
    inspetor: '',
    proximaInspecao: ''
  });

  // Carregar colaboradores do localStorage
  const colaboradores = useMemo(() => {
    try {
      const saved = localStorage.getItem('colaboradores');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Filtrar inspeções
  const inspecoesFiltradas = useMemo(() => {
    return inspecoes.filter(inspecao => {
      const matchesSearch = 
        inspecao.epiNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspecao.colaboradorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inspecao.inspetor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || inspecao.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [inspecoes, searchTerm, statusFilter]);

  // Estatísticas
  const stats = useMemo(() => {
    const total = inspecoes.length;
    const aprovadas = inspecoes.filter(i => i.status === 'aprovado').length;
    const alertas = inspecoes.filter(i => i.status === 'alerta').length;
    const reprovadas = inspecoes.filter(i => i.status === 'reprovado').length;
    
    return { total, aprovadas, alertas, reprovadas };
  }, [inspecoes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.epiId || !formData.colaboradorId || !formData.inspetor) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const epi = epis.find(e => e.id === formData.epiId);
    const colaborador = colaboradores.find((c: any) => c.id === formData.colaboradorId);

    if (!epi || !colaborador) {
      toast.error('EPI ou Colaborador não encontrado');
      return;
    }

    const inspecaoCompleta: Inspecao = {
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
      epiId: formData.epiId,
      epiNome: epi.nome,
      epiCA: epi.ca,
      colaboradorId: formData.colaboradorId,
      colaboradorNome: colaborador.nome,
      status: formData.status,
      observacoes: formData.observacoes,
      inspetor: formData.inspetor,
      proximaInspecao: formData.proximaInspecao
    };

    adicionarInspecao(inspecaoCompleta);
    toast.success('Inspeção registrada com sucesso!');
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      epiId: 0,
      colaboradorId: 0,
      status: 'aprovado',
      observacoes: '',
      inspetor: '',
      proximaInspecao: ''
    });
  };

  const getStatusBadge = (status: Inspecao['status']) => {
    switch (status) {
      case 'aprovado':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
      case 'alerta':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Alerta</Badge>;
      case 'reprovado':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Reprovado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta inspeção?')) {
      removerInspecao(id);
      toast.success('Inspeção removida com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <Navigation />
      
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inspeções de EPIs</h1>
            <p className="text-gray-500">Gerencie as inspeções de equipamentos de proteção individual</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Inspeção
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Registrar Nova Inspeção</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="epi">EPI *</Label>
                  <Select
                    value={formData.epiId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, epiId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o EPI" />
                    </SelectTrigger>
                    <SelectContent>
                      {epis.map((epi) => (
                        <SelectItem key={epi.id} value={epi.id.toString()}>
                          {epi.nome} - CA: {epi.ca}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colaborador">Colaborador *</Label>
                  <Select
                    value={formData.colaboradorId.toString()}
                    onValueChange={(value) => setFormData({ ...formData, colaboradorId: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      {colaboradores.map((col: any) => (
                        <SelectItem key={col.id} value={col.id.toString()}>
                          {col.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status da Inspeção *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Inspecao['status']) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="alerta">Alerta</SelectItem>
                      <SelectItem value="reprovado">Reprovado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspetor">Inspetor *</Label>
                  <Input
                    id="inspetor"
                    value={formData.inspetor}
                    onChange={(e) => setFormData({ ...formData, inspetor: e.target.value })}
                    placeholder="Nome do inspetor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proximaInspecao">Próxima Inspeção</Label>
                  <Input
                    id="proximaInspecao"
                    type="date"
                    value={formData.proximaInspecao}
                    onChange={(e) => setFormData({ ...formData, proximaInspecao: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                    placeholder="Observações sobre a inspeção..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Registrar Inspeção
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.aprovadas}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.alertas}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reprovadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.reprovadas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por EPI, colaborador ou inspetor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="alerta">Alerta</SelectItem>
                    <SelectItem value="reprovado">Reprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Inspeções */}
        <Card>
          <CardHeader>
            <CardTitle>Inspeções Registradas</CardTitle>
            <CardDescription>
              {inspecoesFiltradas.length} inspeção(ões) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>EPI</TableHead>
                    <TableHead>CA</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Inspetor</TableHead>
                    <TableHead>Próxima Inspeção</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspecoesFiltradas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        Nenhuma inspeção encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspecoesFiltradas.map((inspecao) => (
                      <TableRow key={inspecao.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {inspecao.data}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{inspecao.epiNome}</TableCell>
                        <TableCell>{inspecao.epiCA}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            {inspecao.colaboradorNome}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(inspecao.status)}</TableCell>
                        <TableCell>{inspecao.inspetor}</TableCell>
                        <TableCell>
                          {inspecao.proximaInspecao ? (
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {inspecao.proximaInspecao}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(inspecao.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inspecoes;