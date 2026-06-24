'use client';

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ChecklistPo() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    // Dados de Entrada
    productName: "",
    client: "",
    formulationCode: "",
    accompanimentReason: "",
    
    // Pré Produção
    developmentNeeded: "",
    orderConference: "",
    conferenceDate: "",
    datasulCode: "",
    packaging1: "",
    packaging2: "",
    packaging3: "",
    shippingBox: "",
    label: "",
    scoop: "",
    densityTest1: "",
    densityTest2: "",
    densityTest3: "",
    preProductionObservations: "",
    
    // Processo Mistura
    mixerUsed: "",
    mixingOrder: "",
    roomTemperature: "",
    relativeHumidity: "",
    mixingTime: "",
    mixingOccurrence: "",
    scoopMixing: "",
    sensorialReleased: "",
    densityMixing1: "",
    densityMixing2: "",
    densityMixing3: "",
    mixingObservations: "",
    
    // Processo Envase
    batchNumber: "",
    productionDate: "",
    baggingMachine: "",
    validityCorrect: "",
    packagingInfo: "",
    packageWeight: "",
    codingLocation: "",
    baggingOccurrence: "",
    baggingObservations: "",
    
    // Pós Produção
    specificationAdjustment: "",
    processAdjustment: "",
    formulationAdjustment: "",
    generalObservations: "",
    
    // Responsáveis (no final de Pós Produção)
    productionResponsible: "",
    qualityResponsible: "",
    innovationResponsible: "",
    innovationVerification: "",
  });

  const createChecklistMutation = trpc.checklist.create.useMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateDensityAverage = (test1: string, test2: string, test3: string) => {
    const values = [test1, test2, test3].map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (values.length === 0) return "";
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  };

  const handleSave = async () => {
    // Validações obrigatórias
    if (!formData.productName || !formData.client || !formData.formulationCode) {
      toast.error("Por favor, preencha Nome do Produto, Cliente e Código Formulação");
      return;
    }
    if (!formData.productionResponsible || !formData.qualityResponsible || !formData.innovationResponsible || !formData.innovationVerification) {
      toast.error("Por favor, preencha todos os campos de responsáveis");
      return;
    }

    try {
      await createChecklistMutation.mutateAsync({
        type: "po",
        productName: formData.productName,
        client: formData.client,
        formulationCode: formData.formulationCode,
        accompanimentReason: formData.accompanimentReason,
        productionDate: new Date(),
        productionResponsible: formData.productionResponsible,
        qualityResponsible: formData.qualityResponsible,
        innovationResponsible: formData.innovationResponsible,
        innovationVerification: formData.innovationVerification,
        preProduction: {
          developmentNeeded: formData.developmentNeeded,
          orderConference: formData.orderConference,
          conferenceDate: formData.conferenceDate ? new Date(formData.conferenceDate) : undefined,
          datasulCode: formData.datasulCode,
          packaging1: formData.packaging1,
          packaging2: formData.packaging2,
          packaging3: formData.packaging3,
          shippingBox: formData.shippingBox,
          label: formData.label,
          scoop: formData.scoop,
          densityTest1: formData.densityTest1,
          densityTest2: formData.densityTest2,
          densityTest3: formData.densityTest3,
          observations: formData.preProductionObservations,
        },
        mixingProcess: {
          mixerUsed: formData.mixerUsed,
          mixingOrder: formData.mixingOrder,
          roomTemperature: formData.roomTemperature,
          relativeHumidity: formData.relativeHumidity,
          mixingTime: formData.mixingTime,
          densityMixing1: formData.densityMixing1,
          densityMixing2: formData.densityMixing2,
          densityMixing3: formData.densityMixing3,
          occurrence: formData.mixingOccurrence,
          scoopConform: formData.scoopMixing,
          sensorialReleased: formData.sensorialReleased,
          observations: formData.mixingObservations,
        },
      });
      toast.success("Checklist salvo com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("Erro ao salvar checklist");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Checklist - Produto em Pó</h1>
                <p className="text-slate-600 text-sm">RED-029 REV. 06</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={createChecklistMutation.isPending} className="flex items-center gap-2">
              {createChecklistMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {/* DADOS DE ENTRADA */}
          <Card>
            <CardHeader>
              <CardTitle>Dados de Entrada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="productName">Nome do Produto *</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => handleInputChange("productName", e.target.value)}
                    placeholder="Ex: Pó Proteína"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="client">Cliente *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                    placeholder="Ex: Empresa X"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="formulationCode">Código Formulação *</Label>
                  <Input
                    id="formulationCode"
                    value={formData.formulationCode}
                    onChange={(e) => handleInputChange("formulationCode", e.target.value)}
                    placeholder="Ex: F-2024-001"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="accompanimentReason">Motivo do Acompanhamento</Label>
                <select
                  id="accompanimentReason"
                  value={formData.accompanimentReason}
                  onChange={(e) => handleInputChange("accompanimentReason", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Primeira produção">Primeira produção</option>
                  <option value="Teste industrial">Teste industrial</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* PRÉ PRODUÇÃO */}
          <Card>
            <CardHeader>
              <CardTitle>Pré Produção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Há necessidade de desenvolver o padrão?</Label>
                <RadioGroup value={formData.developmentNeeded} onValueChange={(v) => handleInputChange("developmentNeeded", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="dev-sim" />
                    <Label htmlFor="dev-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="dev-nao" />
                    <Label htmlFor="dev-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Conferência ordem de produção (antes da etapa de pesagem)</Label>
                <RadioGroup value={formData.orderConference} onValueChange={(v) => handleInputChange("orderConference", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Conforme" id="conf-sim" />
                    <Label htmlFor="conf-sim">Conforme</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não conforme" id="conf-nao" />
                    <Label htmlFor="conf-nao">Não conforme</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="conferenceDate">Data da Conferência</Label>
                <Input
                  id="conferenceDate"
                  type="date"
                  value={formData.conferenceDate}
                  onChange={(e) => handleInputChange("conferenceDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="datasulCode">Qual o código datasul da estrutura (item)?</Label>
                <Input
                  id="datasulCode"
                  value={formData.datasulCode}
                  onChange={(e) => handleInputChange("datasulCode", e.target.value)}
                />
              </div>

              {/* Embalagens */}
              {["Embalagem 1", "Embalagem 2", "Embalagem 3", "Caixa de embarque", "Rótulo", "Scoop"].map((item, idx) => (
                <div key={idx}>
                  <Label>{item} conforme teste de bancada?</Label>
                  <RadioGroup 
                    value={formData[`packaging${idx + 1}` as keyof typeof formData] as string} 
                    onValueChange={(v) => handleInputChange(`packaging${idx + 1}`, v)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id={`${item}-sim`} />
                      <Label htmlFor={`${item}-sim`}>Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id={`${item}-nao`} />
                      <Label htmlFor={`${item}-nao`}>Não</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="N/A" id={`${item}-na`} />
                      <Label htmlFor={`${item}-na`}>N/A</Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}

              {/* Densidade Pré Produção */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-4">Teste Densidade Compactada (Pré Produção)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="density1">1º Teste (g/cm³)</Label>
                    <Input
                      id="density1"
                      type="number"
                      step="0.01"
                      value={formData.densityTest1}
                      onChange={(e) => handleInputChange("densityTest1", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="density2">2º Teste (g/cm³)</Label>
                    <Input
                      id="density2"
                      type="number"
                      step="0.01"
                      value={formData.densityTest2}
                      onChange={(e) => handleInputChange("densityTest2", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="density3">3º Teste (g/cm³)</Label>
                    <Input
                      id="density3"
                      type="number"
                      step="0.01"
                      value={formData.densityTest3}
                      onChange={(e) => handleInputChange("densityTest3", e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2 p-2 bg-slate-100 rounded">
                  <Label>Média: {calculateDensityAverage(formData.densityTest1, formData.densityTest2, formData.densityTest3)} g/cm³</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="preObservations">Observações Pré Produção</Label>
                <Textarea
                  id="preObservations"
                  value={formData.preProductionObservations}
                  onChange={(e) => handleInputChange("preProductionObservations", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* PROCESSO MISTURA */}
          <Card>
            <CardHeader>
              <CardTitle>Processo Mistura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mixerUsed">Misturador Utilizado</Label>
                <Input
                  id="mixerUsed"
                  value={formData.mixerUsed}
                  onChange={(e) => handleInputChange("mixerUsed", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mixingOrder">Ordem de Mistura (detalhar)</Label>
                <Textarea
                  id="mixingOrder"
                  value={formData.mixingOrder}
                  onChange={(e) => handleInputChange("mixingOrder", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="roomTemp">Temperatura Sala de Mistura (°C)</Label>
                  <Input
                    id="roomTemp"
                    type="number"
                    step="0.1"
                    value={formData.roomTemperature}
                    onChange={(e) => handleInputChange("roomTemperature", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="humidity">Umidade Relativa da Sala (%)</Label>
                  <Input
                    id="humidity"
                    type="number"
                    step="0.1"
                    value={formData.relativeHumidity}
                    onChange={(e) => handleInputChange("relativeHumidity", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="mixTime">Tempo de Mistura (minutos)</Label>
                  <Input
                    id="mixTime"
                    type="number"
                    step="0.1"
                    value={formData.mixingTime}
                    onChange={(e) => handleInputChange("mixingTime", e.target.value)}
                  />
                </div>
              </div>

              {/* Densidade Processo Mistura - NOVA SEÇÃO */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-4">Análise de Densidade - Processo Mistura</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="densityMix1">1º Teste (g/cm³)</Label>
                    <Input
                      id="densityMix1"
                      type="number"
                      step="0.01"
                      value={formData.densityMixing1}
                      onChange={(e) => handleInputChange("densityMixing1", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="densityMix2">2º Teste (g/cm³)</Label>
                    <Input
                      id="densityMix2"
                      type="number"
                      step="0.01"
                      value={formData.densityMixing2}
                      onChange={(e) => handleInputChange("densityMixing2", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="densityMix3">3º Teste (g/cm³)</Label>
                    <Input
                      id="densityMix3"
                      type="number"
                      step="0.01"
                      value={formData.densityMixing3}
                      onChange={(e) => handleInputChange("densityMixing3", e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2 p-2 bg-slate-100 rounded">
                  <Label>Média: {calculateDensityAverage(formData.densityMixing1, formData.densityMixing2, formData.densityMixing3)} g/cm³</Label>
                </div>
              </div>

              <div>
                <Label>Caso necessário, foi detectada alguma ocorrência durante a mistura?</Label>
                <RadioGroup value={formData.mixingOccurrence} onValueChange={(v) => handleInputChange("mixingOccurrence", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="occur-sim" />
                    <Label htmlFor="occur-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="occur-nao" />
                    <Label htmlFor="occur-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="mixObservations">Observações Mistura</Label>
                <Textarea
                  id="mixObservations"
                  value={formData.mixingObservations}
                  onChange={(e) => handleInputChange("mixingObservations", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Scoop conforme teste?</Label>
                <RadioGroup value={formData.scoopMixing} onValueChange={(v) => handleInputChange("scoopMixing", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="scoop-sim" />
                    <Label htmlFor="scoop-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="scoop-nao" />
                    <Label htmlFor="scoop-nao">Não</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="N/A" id="scoop-na" />
                    <Label htmlFor="scoop-na">N/A</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Sensorial liberado para produção?</Label>
                <RadioGroup value={formData.sensorialReleased} onValueChange={(v) => handleInputChange("sensorialReleased", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="sens-sim" />
                    <Label htmlFor="sens-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="sens-nao" />
                    <Label htmlFor="sens-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* PÓS PRODUÇÃO COM RESPONSÁVEIS */}
          <Card>
            <CardHeader>
              <CardTitle>Pós Produção e Responsáveis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Precisamos fazer algum ajuste de especificação técnica para a próxima produção?</Label>
                <RadioGroup value={formData.specificationAdjustment} onValueChange={(v) => handleInputChange("specificationAdjustment", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="spec-sim" />
                    <Label htmlFor="spec-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="spec-nao" />
                    <Label htmlFor="spec-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Precisamos fazer algum ajuste na carta de processo para a próxima produção?</Label>
                <RadioGroup value={formData.processAdjustment} onValueChange={(v) => handleInputChange("processAdjustment", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="proc-sim" />
                    <Label htmlFor="proc-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="proc-nao" />
                    <Label htmlFor="proc-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Precisamos fazer algum ajuste na estrutura de formulação desse produto para a próxima produção?</Label>
                <RadioGroup value={formData.formulationAdjustment} onValueChange={(v) => handleInputChange("formulationAdjustment", v)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Sim" id="form-sim" />
                    <Label htmlFor="form-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Não" id="form-nao" />
                    <Label htmlFor="form-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="generalObs">Observações Gerais</Label>
                <Textarea
                  id="generalObs"
                  value={formData.generalObservations}
                  onChange={(e) => handleInputChange("generalObservations", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Responsáveis - OBRIGATÓRIOS */}
              <div className="border-t pt-4 mt-4">
                <h4 className="font-semibold mb-4">Responsáveis (Campos Obrigatórios)</h4>
                
                <div>
                  <Label htmlFor="prodResponsible">Responsável Produção *</Label>
                  <Input
                    id="prodResponsible"
                    value={formData.productionResponsible}
                    onChange={(e) => handleInputChange("productionResponsible", e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="qualResponsible">Responsável Qualidade *</Label>
                  <Input
                    id="qualResponsible"
                    value={formData.qualityResponsible}
                    onChange={(e) => handleInputChange("qualityResponsible", e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="innovResponsible">Responsável Inovação *</Label>
                  <Input
                    id="innovResponsible"
                    value={formData.innovationResponsible}
                    onChange={(e) => handleInputChange("innovationResponsible", e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="innovVerification">Verificação Inovação *</Label>
                  <Input
                    id="innovVerification"
                    value={formData.innovationVerification}
                    onChange={(e) => handleInputChange("innovationVerification", e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
