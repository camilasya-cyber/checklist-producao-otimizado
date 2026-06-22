import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";

export default function ChecklistGel() {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    // Dados de Entrada
    productName: "",
    client: "",
    formulationCode: "",
    accompanimentReason: "",
    
    // Responsáveis (Obrigatórios)
    qualityResponsible: "",
    innovationResponsible: "",
    innovationVerification: "",
    
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
    
    // Processo Mistura
    mixerUsed: "",
    mixingOrder: "",
    initialTankTemperature: "",
    
    // Viscosidade Temperatura Tanque (COM SPINDLE - NOVO)
    viscTempTankViscosity: "",
    viscTempTankTemperature: "",
    viscTempTankRpm: "",
    viscTempTankTorque: "",
    viscTempTankSpindle: "", // NOVO
    
    // Viscosidade 1
    visc1Viscosity: "",
    visc1Temperature: "",
    visc1Rpm: "",
    visc1Torque: "",
    visc1Spindle: "",
    
    // Viscosidade 2
    visc2Viscosity: "",
    visc2Temperature: "",
    visc2Rpm: "",
    visc2Torque: "",
    visc2Spindle: "",
    
    // Viscosidade 3 - REMOVIDO (não incluir mais)
    
    // Outros campos
    heatedPulmonaryTank: "",
    occurrence: "",
    observations: "",
    sensorialReleased: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const createChecklistMutation = trpc.checklist.create.useMutation();

  const handleSave = async () => {
    if (!formData.productName || !formData.client || !formData.formulationCode) {
      toast.error("Por favor, preencha todos os dados de entrada");
      return;
    }
    if (!formData.qualityResponsible || !formData.innovationResponsible || !formData.innovationVerification) {
      toast.error("Por favor, preencha todos os campos de responsáveis");
      return;
    }

    try {
      await createChecklistMutation.mutateAsync({
        type: "gel",
        productName: formData.productName,
        client: formData.client,
        formulationCode: formData.formulationCode,
        accompanimentReason: formData.accompanimentReason,
        productionDate: new Date(),
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
          observations: formData.observations,
        },
        mixingProcess: {
          mixerUsed: formData.mixerUsed,
          mixingOrder: formData.mixingOrder,
          initialTankTemperature: formData.initialTankTemperature,
          viscTempTankViscosity: formData.viscTempTankViscosity,
          viscTempTankTemperature: formData.viscTempTankTemperature,
          viscTempTankRpm: formData.viscTempTankRpm,
          viscTempTankTorque: formData.viscTempTankTorque,
          viscTempTankSpindle: formData.viscTempTankSpindle,
          visc1Viscosity: formData.visc1Viscosity,
          visc1Temperature: formData.visc1Temperature,
          visc1Rpm: formData.visc1Rpm,
          visc1Torque: formData.visc1Torque,
          visc1Spindle: formData.visc1Spindle,
          visc2Viscosity: formData.visc2Viscosity,
          visc2Temperature: formData.visc2Temperature,
          visc2Rpm: formData.visc2Rpm,
          visc2Torque: formData.visc2Torque,
          visc2Spindle: formData.visc2Spindle,
          heatedPulmonaryTank: formData.heatedPulmonaryTank,
          occurrence: formData.occurrence,
          observations: formData.observations,
          sensorialReleased: formData.sensorialReleased,
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
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Checklist - Produto em Gel</h1>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="entrada" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="entrada">Dados de Entrada</TabsTrigger>
            <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
            <TabsTrigger value="pre">Pré Produção</TabsTrigger>
            <TabsTrigger value="mistura">Processo Mistura</TabsTrigger>
            <TabsTrigger value="envase">Envase/Pós</TabsTrigger>
          </TabsList>

          {/* Dados de Entrada */}
          <TabsContent value="entrada">
            <Card>
              <CardHeader>
                <CardTitle>Dados de Entrada</CardTitle>
                <CardDescription>Informações básicas do produto e produção</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="productName">Nome do Produto *</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => handleInputChange("productName", e.target.value)}
                      placeholder="Ex: Gel Hidratante"
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
          </TabsContent>

          {/* Responsáveis */}
          <TabsContent value="responsaveis">
            <Card>
              <CardHeader>
                <CardTitle>Responsáveis pela Produção</CardTitle>
                <CardDescription>Campos obrigatórios - Responsáveis pela qualidade e inovação</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="qualityResponsible">Responsável Qualidade *</Label>
                  <Input
                    id="qualityResponsible"
                    value={formData.qualityResponsible}
                    onChange={(e) => handleInputChange("qualityResponsible", e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="innovationResponsible">Responsável Inovação *</Label>
                  <Input
                    id="innovationResponsible"
                    value={formData.innovationResponsible}
                    onChange={(e) => handleInputChange("innovationResponsible", e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="innovationVerification">Verificação Inovação *</Label>
                  <Input
                    id="innovationVerification"
                    value={formData.innovationVerification}
                    onChange={(e) => handleInputChange("innovationVerification", e.target.value)}
                    placeholder="Nome do responsável"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pré Produção */}
          <TabsContent value="pre">
            <Card>
              <CardHeader>
                <CardTitle>Pré Produção</CardTitle>
                <CardDescription>Verificações e testes antes da produção</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Há necessidade de desenvolver o padrão?</Label>
                  <RadioGroup value={formData.developmentNeeded} onValueChange={(value) => handleInputChange("developmentNeeded", value)}>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="orderConference">Conferência Ordem de Produção</Label>
                    <RadioGroup value={formData.orderConference} onValueChange={(value) => handleInputChange("orderConference", value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Conforme" id="conf-conforme" />
                        <Label htmlFor="conf-conforme">Conforme</Label>
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
                </div>

                <div>
                  <Label htmlFor="datasulCode">Código DATASUL da Estrutura</Label>
                  <Input
                    id="datasulCode"
                    value={formData.datasulCode}
                    onChange={(e) => handleInputChange("datasulCode", e.target.value)}
                    placeholder="Ex: 123456"
                  />
                </div>

                {/* Embalagens */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Conformidade de Embalagens</h3>
                  {["Embalagem 1", "Embalagem 2", "Embalagem 3", "Caixa de Embarque", "Rótulo", "Scoop"].map((item, idx) => (
                    <div key={idx}>
                      <Label>{item} conforme teste de bancada?</Label>
                      <RadioGroup
                        value={formData[`packaging${idx + 1}` as keyof typeof formData] as string}
                        onValueChange={(value) => handleInputChange(`packaging${idx + 1}`, value)}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processo Mistura */}
          <TabsContent value="mistura">
            <Card>
              <CardHeader>
                <CardTitle>Processo de Mistura</CardTitle>
                <CardDescription>Parâmetros de viscosidade e controle da mistura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="mixerUsed">Misturador Utilizado</Label>
                  <Input
                    id="mixerUsed"
                    value={formData.mixerUsed}
                    onChange={(e) => handleInputChange("mixerUsed", e.target.value)}
                    placeholder="Ex: Misturador modelo X"
                  />
                </div>

                <div>
                  <Label htmlFor="mixingOrder">Ordem de Adição das Matérias Primas</Label>
                  <Textarea
                    id="mixingOrder"
                    value={formData.mixingOrder}
                    onChange={(e) => handleInputChange("mixingOrder", e.target.value)}
                    placeholder="Descrever a sequência de adição dos ingredientes"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="initialTankTemperature">Temperatura Inicial do Tanque (°C)</Label>
                  <Input
                    id="initialTankTemperature"
                    type="number"
                    step="0.1"
                    value={formData.initialTankTemperature}
                    onChange={(e) => handleInputChange("initialTankTemperature", e.target.value)}
                    placeholder="0.0"
                  />
                </div>

                {/* Viscosidade Temperatura Tanque - COM SPINDLE (NOVO) */}
                <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900">Viscosidade Temperatura Tanque *SPINDLE ADICIONADO*</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="viscTempTankViscosity">Viscosidade (cP)</Label>
                      <Input
                        id="viscTempTankViscosity"
                        type="number"
                        step="0.1"
                        value={formData.viscTempTankViscosity}
                        onChange={(e) => handleInputChange("viscTempTankViscosity", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="viscTempTankTemperature">Temperatura (°C)</Label>
                      <Input
                        id="viscTempTankTemperature"
                        type="number"
                        step="0.1"
                        value={formData.viscTempTankTemperature}
                        onChange={(e) => handleInputChange("viscTempTankTemperature", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="viscTempTankRpm">RPM</Label>
                      <Input
                        id="viscTempTankRpm"
                        type="number"
                        step="0.1"
                        value={formData.viscTempTankRpm}
                        onChange={(e) => handleInputChange("viscTempTankRpm", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="viscTempTankTorque">Torque</Label>
                      <Input
                        id="viscTempTankTorque"
                        value={formData.viscTempTankTorque}
                        onChange={(e) => handleInputChange("viscTempTankTorque", e.target.value)}
                        placeholder="Ex: 50%"
                      />
                    </div>
                    <div>
                      <Label htmlFor="viscTempTankSpindle">Spindle *NOVO*</Label>
                      <Input
                        id="viscTempTankSpindle"
                        value={formData.viscTempTankSpindle}
                        onChange={(e) => handleInputChange("viscTempTankSpindle", e.target.value)}
                        placeholder="Ex: RV-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Viscosidade 1 */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Viscosidade 1</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="visc1Viscosity">Viscosidade (cP)</Label>
                      <Input
                        id="visc1Viscosity"
                        type="number"
                        step="0.1"
                        value={formData.visc1Viscosity}
                        onChange={(e) => handleInputChange("visc1Viscosity", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc1Temperature">Temperatura (°C)</Label>
                      <Input
                        id="visc1Temperature"
                        type="number"
                        step="0.1"
                        value={formData.visc1Temperature}
                        onChange={(e) => handleInputChange("visc1Temperature", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc1Rpm">RPM</Label>
                      <Input
                        id="visc1Rpm"
                        type="number"
                        step="0.1"
                        value={formData.visc1Rpm}
                        onChange={(e) => handleInputChange("visc1Rpm", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc1Torque">Torque</Label>
                      <Input
                        id="visc1Torque"
                        value={formData.visc1Torque}
                        onChange={(e) => handleInputChange("visc1Torque", e.target.value)}
                        placeholder="Ex: 50%"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc1Spindle">Spindle</Label>
                      <Input
                        id="visc1Spindle"
                        value={formData.visc1Spindle}
                        onChange={(e) => handleInputChange("visc1Spindle", e.target.value)}
                        placeholder="Ex: RV-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Viscosidade 2 */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Viscosidade 2</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="visc2Viscosity">Viscosidade (cP)</Label>
                      <Input
                        id="visc2Viscosity"
                        type="number"
                        step="0.1"
                        value={formData.visc2Viscosity}
                        onChange={(e) => handleInputChange("visc2Viscosity", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc2Temperature">Temperatura (°C)</Label>
                      <Input
                        id="visc2Temperature"
                        type="number"
                        step="0.1"
                        value={formData.visc2Temperature}
                        onChange={(e) => handleInputChange("visc2Temperature", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc2Rpm">RPM</Label>
                      <Input
                        id="visc2Rpm"
                        type="number"
                        step="0.1"
                        value={formData.visc2Rpm}
                        onChange={(e) => handleInputChange("visc2Rpm", e.target.value)}
                        placeholder="0.0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc2Torque">Torque</Label>
                      <Input
                        id="visc2Torque"
                        value={formData.visc2Torque}
                        onChange={(e) => handleInputChange("visc2Torque", e.target.value)}
                        placeholder="Ex: 50%"
                      />
                    </div>
                    <div>
                      <Label htmlFor="visc2Spindle">Spindle</Label>
                      <Input
                        id="visc2Spindle"
                        value={formData.visc2Spindle}
                        onChange={(e) => handleInputChange("visc2Spindle", e.target.value)}
                        placeholder="Ex: RV-2"
                      />
                    </div>
                  </div>
                </div>

                {/* Viscosidade 3 - REMOVIDO */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-900 font-semibold">✓ Viscosidade 3 foi removida conforme solicitado</p>
                </div>

                <div>
                  <Label>Tanque de pulmão aquecido?</Label>
                  <RadioGroup value={formData.heatedPulmonaryTank} onValueChange={(value) => handleInputChange("heatedPulmonaryTank", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id="tank-sim" />
                      <Label htmlFor="tank-sim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id="tank-nao" />
                      <Label htmlFor="tank-nao">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Ocorrência durante a mistura?</Label>
                  <RadioGroup value={formData.occurrence} onValueChange={(value) => handleInputChange("occurrence", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id="occ-sim" />
                      <Label htmlFor="occ-sim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id="occ-nao" />
                      <Label htmlFor="occ-nao">Não</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    value={formData.observations}
                    onChange={(e) => handleInputChange("observations", e.target.value)}
                    placeholder="Observações adicionais"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Sensorial liberado para produção?</Label>
                  <RadioGroup value={formData.sensorialReleased} onValueChange={(value) => handleInputChange("sensorialReleased", value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sim" id="sensorial-sim" />
                      <Label htmlFor="sensorial-sim">Sim</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Não" id="sensorial-nao" />
                      <Label htmlFor="sensorial-nao">Não</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Envase/Pós Produção */}
          <TabsContent value="envase">
            <Card>
              <CardHeader>
                <CardTitle>Processo de Envase e Pós Produção</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Campos de envase e pós-produção serão adicionados conforme necessário</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
