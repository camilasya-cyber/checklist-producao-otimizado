import PDFDocument from "pdfkit";
import type { ChecklistRecord, PreProductionData, MixingProcessData, ResponsiblePersonnel } from "../drizzle/schema";

interface ChecklistData {
  record: ChecklistRecord;
  preProduction?: PreProductionData | null;
  mixingProcess?: MixingProcessData | null;
  responsible?: ResponsiblePersonnel | null;
}

export function generateChecklistPDF(data: ChecklistData): InstanceType<typeof PDFDocument> {
  const doc = new PDFDocument({
    size: "A4",
    margin: 30,
    bufferPages: true,
  });

  const { record, preProduction, mixingProcess, responsible } = data;

  // Configurações de estilos
  const fontSize = {
    title: 14,
    sectionTitle: 10,
    label: 8,
    value: 8,
    footer: 7,
  };

  const colors = {
    black: "#000",
    darkGray: "#333",
    lightGray: "#f0f0f0",
    borderGray: "#ccc",
  };

  // Helper para adicionar linha horizontal
  const addLine = (y: number, width: number = 520) => {
    doc.strokeColor(colors.borderGray).lineWidth(0.5).moveTo(30, y).lineTo(30 + width, y).stroke();
  };

  // Helper para adicionar seção com título
  const addSectionTitle = (title: string, y: number) => {
    doc.fillColor(colors.lightGray).rect(30, y - 3, 520, 18).fill();
    doc.fillColor(colors.black).fontSize(fontSize.sectionTitle).font("Helvetica-Bold").text(title, 35, y + 2);
    return y + 22;
  };

  // Helper para adicionar campo label + value
  const addField = (label: string, value: string | undefined, x: number, y: number, width: number = 170) => {
    doc.fontSize(fontSize.label).font("Helvetica-Bold").fillColor(colors.black).text(label, x, y, { width });
    doc.fontSize(fontSize.value).font("Helvetica").fillColor(colors.darkGray).text(value || "-", x, y + 12, { width });
    return y + 28;
  };

  let currentY = 50;

  // Header
  doc.fontSize(fontSize.title).font("Helvetica-Bold").fillColor(colors.black).text("CHECKLIST DE PRODUÇÃO - RED-029 REV. 06", 30, currentY);
  currentY += 20;
  doc.fontSize(fontSize.value).font("Helvetica").fillColor(colors.darkGray);
  doc.text(`Tipo: ${record.type.toUpperCase()}`, 30, currentY);
  currentY += 12;
  doc.text(`Data: ${new Date(record.productionDate).toLocaleDateString("pt-BR")}`, 30, currentY);
  currentY += 20;
  addLine(currentY);
  currentY += 15;

  // Dados de Entrada
  currentY = addSectionTitle("DADOS DE ENTRADA", currentY);
  doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Produto:", 30, currentY);
  doc.fontSize(fontSize.value).font("Helvetica").text(record.productName, 30, currentY + 12);
  
  doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Cliente:", 220, currentY);
  doc.fontSize(fontSize.value).font("Helvetica").text(record.client, 220, currentY + 12);
  
  doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Código Formulação:", 380, currentY);
  doc.fontSize(fontSize.value).font("Helvetica").text(record.formulationCode, 380, currentY + 12);
  
  currentY += 40;

  if (record.accompanimentReason) {
    doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Motivo Acompanhamento:", 30, currentY);
    doc.fontSize(fontSize.value).font("Helvetica").text(record.accompanimentReason, 30, currentY + 12);
    currentY += 30;
  }

  // Responsáveis
  if (responsible) {
    currentY = addSectionTitle("RESPONSÁVEIS", currentY);
    doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Resp. Qualidade:", 30, currentY);
    doc.fontSize(fontSize.value).font("Helvetica").text(responsible.qualityResponsible, 30, currentY + 12);
    
    doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Resp. Inovação:", 220, currentY);
    doc.fontSize(fontSize.value).font("Helvetica").text(responsible.innovationResponsible, 220, currentY + 12);
    
    doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Verif. Inovação:", 380, currentY);
    doc.fontSize(fontSize.value).font("Helvetica").text(responsible.innovationVerification, 380, currentY + 12);
    
    currentY += 40;
  }

  // Pré Produção
  if (preProduction) {
    currentY = addSectionTitle("PRÉ PRODUÇÃO", currentY);

    if (preProduction.developmentNeeded) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Necessidade Desenvolvimento:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(preProduction.developmentNeeded, 30, currentY + 12);
      currentY += 28;
    }

    if (preProduction.orderConference) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Conferência Ordem:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(preProduction.orderConference, 30, currentY + 12);
      
      if (preProduction.conferenceDate) {
        doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Data:", 280, currentY);
        doc.fontSize(fontSize.value).font("Helvetica").text(new Date(preProduction.conferenceDate).toLocaleDateString("pt-BR"), 280, currentY + 12);
      }
      currentY += 28;
    }

    if (preProduction.datasulCode) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Código DATASUL:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(preProduction.datasulCode, 30, currentY + 12);
      currentY += 28;
    }

    // Embalagens
    doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Embalagens:", 30, currentY);
    currentY += 12;
    const packagingItems = [
      { label: "Emb. 1:", value: preProduction.packaging1 },
      { label: "Emb. 2:", value: preProduction.packaging2 },
      { label: "Emb. 3:", value: preProduction.packaging3 },
      { label: "Caixa:", value: preProduction.shippingBox },
      { label: "Rótulo:", value: preProduction.label },
    ];

    let packX = 30;
    for (const item of packagingItems) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text(item.label, packX, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(item.value || "N/A", packX, currentY + 12);
      packX += 100;
      if (packX > 400) {
        packX = 30;
        currentY += 28;
      }
    }
    currentY += 28;

    // Densidade Pré Produção
    if (preProduction.densityTest1 || preProduction.densityTest2 || preProduction.densityTest3) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Densidade 1º Teste:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(preProduction.densityTest1 || "-", 30, currentY + 12);
      
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Densidade 2º Teste:", 220, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(preProduction.densityTest2 || "-", 220, currentY + 12);
      
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Densidade 3º Teste:", 380, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(preProduction.densityTest3 || "-", 380, currentY + 12);
      
      currentY += 28;
    }

    if (preProduction.observations) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Observações:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(preProduction.observations, 30, currentY + 12, { width: 500 });
      currentY += 40;
    }
  }

  // Processo Mistura
  if (mixingProcess) {
    currentY = addSectionTitle("PROCESSO DE MISTURA", currentY);

    if (mixingProcess.mixerUsed) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Misturador:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.mixerUsed, 30, currentY + 12);
      currentY += 28;
    }

    // Parâmetros de Temperatura e Umidade
    if (mixingProcess.roomTemperature || mixingProcess.relativeHumidity || mixingProcess.initialTankTemperature) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Temp. Sala (°C):", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.roomTemperature || "-", 30, currentY + 12);
      
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Umidade (%):", 220, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.relativeHumidity || "-", 220, currentY + 12);
      
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Temp. Inicial (°C):", 380, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.initialTankTemperature || "-", 380, currentY + 12);
      
      currentY += 28;
    }

    // Viscosidade Temperatura Tanque
    if (mixingProcess.viscTempTankViscosity || mixingProcess.viscTempTankTemperature) {
      doc.fontSize(fontSize.sectionTitle).font("Helvetica-Bold").text("Viscosidade Temperatura Tanque", 30, currentY);
      currentY += 16;
      
      // Cabeçalho da tabela
      doc.fontSize(7).font("Helvetica-Bold");
      doc.text("Visc. (cP)", 30, currentY);
      doc.text("Temp. (°C)", 100, currentY);
      doc.text("RPM", 170, currentY);
      doc.text("Torque", 240, currentY);
      doc.text("Spindle", 310, currentY);
      
      currentY += 12;
      addLine(currentY, 300);
      currentY += 8;
      
      // Dados
      doc.fontSize(fontSize.value).font("Helvetica");
      doc.text(mixingProcess.viscTempTankViscosity || "-", 30, currentY);
      doc.text(mixingProcess.viscTempTankTemperature || "-", 100, currentY);
      doc.text(mixingProcess.viscTempTankRpm || "-", 170, currentY);
      doc.text(mixingProcess.viscTempTankTorque || "-", 240, currentY);
      doc.text(mixingProcess.viscTempTankSpindle || "-", 310, currentY);
      
      currentY += 20;
    }

    // Viscosidade 1
    if (mixingProcess.visc1Viscosity || mixingProcess.visc1Temperature) {
      doc.fontSize(fontSize.sectionTitle).font("Helvetica-Bold").text("Viscosidade 1", 30, currentY);
      currentY += 16;
      
      doc.fontSize(7).font("Helvetica-Bold");
      doc.text("Visc. (cP)", 30, currentY);
      doc.text("Temp. (°C)", 100, currentY);
      doc.text("RPM", 170, currentY);
      doc.text("Torque", 240, currentY);
      doc.text("Spindle", 310, currentY);
      
      currentY += 12;
      addLine(currentY, 300);
      currentY += 8;
      
      doc.fontSize(fontSize.value).font("Helvetica");
      doc.text(mixingProcess.visc1Viscosity || "-", 30, currentY);
      doc.text(mixingProcess.visc1Temperature || "-", 100, currentY);
      doc.text(mixingProcess.visc1Rpm || "-", 170, currentY);
      doc.text(mixingProcess.visc1Torque || "-", 240, currentY);
      doc.text(mixingProcess.visc1Spindle || "-", 310, currentY);
      
      currentY += 20;
    }

    // Viscosidade 2
    if (mixingProcess.visc2Viscosity || mixingProcess.visc2Temperature) {
      doc.fontSize(fontSize.sectionTitle).font("Helvetica-Bold").text("Viscosidade 2", 30, currentY);
      currentY += 16;
      
      doc.fontSize(7).font("Helvetica-Bold");
      doc.text("Visc. (cP)", 30, currentY);
      doc.text("Temp. (°C)", 100, currentY);
      doc.text("RPM", 170, currentY);
      doc.text("Torque", 240, currentY);
      doc.text("Spindle", 310, currentY);
      
      currentY += 12;
      addLine(currentY, 300);
      currentY += 8;
      
      doc.fontSize(fontSize.value).font("Helvetica");
      doc.text(mixingProcess.visc2Viscosity || "-", 30, currentY);
      doc.text(mixingProcess.visc2Temperature || "-", 100, currentY);
      doc.text(mixingProcess.visc2Rpm || "-", 170, currentY);
      doc.text(mixingProcess.visc2Torque || "-", 240, currentY);
      doc.text(mixingProcess.visc2Spindle || "-", 310, currentY);
      
      currentY += 20;
    }

    // Densidade Mistura (para Pó)
    if (mixingProcess.densityMixing1 || mixingProcess.densityMixing2 || mixingProcess.densityMixing3) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Densidade 1º Teste:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.densityMixing1 || "-", 30, currentY + 12);
      
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Densidade 2º Teste:", 220, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.densityMixing2 || "-", 220, currentY + 12);
      
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Densidade 3º Teste:", 380, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.densityMixing3 || "-", 380, currentY + 12);
      
      currentY += 28;
    }

    // Outros campos
    if (mixingProcess.occurrence) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Ocorrência:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.occurrence, 30, currentY + 12);
      currentY += 28;
    }

    if (mixingProcess.sensorialReleased) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Sensorial Liberado:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.sensorialReleased, 30, currentY + 12);
      currentY += 28;
    }

    if (mixingProcess.observations) {
      doc.fontSize(fontSize.label).font("Helvetica-Bold").text("Observações:", 30, currentY);
      doc.fontSize(fontSize.value).font("Helvetica").text(mixingProcess.observations, 30, currentY + 12, { width: 500 });
      currentY += 40;
    }
  }

  // Footer
  currentY += 20;
  addLine(currentY);
  currentY += 10;
  doc.fontSize(fontSize.footer).font("Helvetica").fillColor(colors.darkGray);
  doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 30, currentY);
  doc.text("Sistema de Checklist de Produção - RED-029", 30, currentY + 10);

  return doc;
}
