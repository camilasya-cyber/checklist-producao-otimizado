import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Search, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type ChecklistType = "po" | "capsula" | "gel";

export default function Home() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ChecklistType | "all">("all");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Fetch all records
  const { data: allRecords = [], isLoading: loadingAll } = trpc.checklist.listAll.useQuery(
    { limit: 100, offset: 0 },
    { staleTime: 30000 }
  );

  // Filter records based on search and type
  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      const matchesType = selectedType === "all" || record.type === selectedType;
      const matchesSearch =
        searchTerm === "" ||
        record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.formulationCode.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [allRecords, searchTerm, selectedType]);

  // Paginate records
  const paginatedRecords = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredRecords.slice(start, start + itemsPerPage);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  const getTypeLabel = (type: ChecklistType) => {
    const labels: Record<ChecklistType, string> = {
      po: "Produto em Pó",
      capsula: "Produto em Cápsula",
      gel: "Produto em Gel",
    };
    return labels[type];
  };

  const getTypeBadgeColor = (type: ChecklistType) => {
    const colors: Record<ChecklistType, string> = {
      po: "bg-amber-100 text-amber-800",
      capsula: "bg-blue-100 text-blue-800",
      gel: "bg-green-100 text-green-800",
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Checklist de Produção</h1>
              <p className="text-slate-600 mt-1">RED-029 REV. 06 - Sistema de Acompanhamento de Produção</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate("/checklist/po")}
                className="flex items-center gap-2"
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Novo Pó
              </Button>
              <Button
                onClick={() => navigate("/checklist/capsula")}
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Nova Cápsula
              </Button>
              <Button
                onClick={() => navigate("/checklist/gel")}
                variant="outline"
                className="flex items-center gap-2"
                size="lg"
              >
                <Plus className="w-4 h-4" />
                Novo Gel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filtrar Registros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por produto, cliente ou código da formulação..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(0);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={(value) => {
                setSelectedType(value as ChecklistType | "all");
                setCurrentPage(0);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="po">Produto em Pó</SelectItem>
                  <SelectItem value="capsula">Produto em Cápsula</SelectItem>
                  <SelectItem value="gel">Produto em Gel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {loadingAll ? (
            <Card>
              <CardContent className="py-12">
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                </div>
              </CardContent>
            </Card>
          ) : paginatedRecords.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <p className="text-slate-600 text-lg">Nenhum registro encontrado</p>
                  <p className="text-slate-500 text-sm mt-2">
                    {filteredRecords.length === 0 && allRecords.length > 0
                      ? "Tente ajustar seus filtros de busca"
                      : "Crie um novo checklist para começar"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {paginatedRecords.map((record) => (
                <Card
                  key={record.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/checklist/${record.id}`)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">
                            {record.productName}
                          </h3>
                          <Badge className={getTypeBadgeColor(record.type as ChecklistType)}>
                            {getTypeLabel(record.type as ChecklistType)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-slate-500">Cliente</p>
                            <p className="text-slate-900 font-medium">{record.client}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Código Formulação</p>
                            <p className="text-slate-900 font-medium">{record.formulationCode}</p>
                          </div>
                          <div>
                            <p className="text-slate-500">Data de Produção</p>
                            <p className="text-slate-900 font-medium">
                              {format(new Date(record.productionDate), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        {record.accompanimentReason && (
                          <p className="text-sm text-slate-600 mt-2">
                            <span className="font-medium">Motivo:</span> {record.accompanimentReason}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-slate-600">
                    Página {currentPage + 1} de {totalPages} ({filteredRecords.length} registros)
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
