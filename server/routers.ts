import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  getChecklistRecords, 
  getChecklistRecordById, 
  getChecklistRecordsByType, 
  createChecklistRecord, 
  getPreProductionData, 
  getMixingProcessData, 
  getResponsiblePersonnel, 
  getEvidencePhotos,
  createPreProductionData,
  createMixingProcessData,
  createResponsiblePersonnel,
  searchChecklistRecords
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  checklist: router({
    exportPDF: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const record = await getChecklistRecordById(input.id);
        if (!record) throw new Error("Checklist not found");
        
        const preProduction = await getPreProductionData(input.id);
        const mixingProcess = await getMixingProcessData(input.id);
        const responsible = await getResponsiblePersonnel(input.id);
        
        // Importar o gerador de PDF
        const { generateChecklistPDF } = await import("./pdfGenerator");
        const doc = generateChecklistPDF({
          record,
          preProduction,
          mixingProcess,
          responsible,
        });
        
        // Converter para buffer
        return new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          doc.on("data", (chunk) => chunks.push(chunk));
          doc.on("end", () => {
            const buffer = Buffer.concat(chunks);
            resolve({
              success: true,
              buffer: buffer.toString("base64"),
              filename: `checklist_${record.productName}_${new Date().toISOString().split("T")[0]}.pdf`,
            });
          });
          doc.on("error", reject);
          doc.end();
        });
      }),
    
    listAll: publicProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        const { limit = 50, offset = 0 } = input || {};
        return await getChecklistRecords(limit, offset);
      }),
    
    listByType: publicProcedure
      .input(z.object({ type: z.enum(["po", "capsula", "gel"]), limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await getChecklistRecordsByType(input.type, input.limit, input.offset);
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(50), offset: z.number().default(0) }))
      .query(async ({ input }) => {
        return await searchChecklistRecords(input.query, input.limit, input.offset)
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const record = await getChecklistRecordById(input.id);
        if (!record) return null;
        
        const preProduction = await getPreProductionData(input.id);
        const mixingProcess = await getMixingProcessData(input.id);
        const responsible = await getResponsiblePersonnel(input.id);
        const photos = await getEvidencePhotos(input.id);
        
        return {
          record,
          preProduction,
          mixingProcess,
          responsible,
          photos,
        };
      }),
    
    create: publicProcedure
      .input(z.object({
        type: z.enum(["po", "capsula", "gel"]),
        productName: z.string().min(1, "Nome do produto é obrigatório"),
        client: z.string().min(1, "Cliente é obrigatório"),
        formulationCode: z.string().min(1, "Código da formulação é obrigatório"),
        accompanimentReason: z.string().optional(),
        productionDate: z.date().default(() => new Date()),
        qualityResponsible: z.string().min(1, "Responsável Qualidade é obrigatório"),
        innovationResponsible: z.string().min(1, "Responsável Inovação é obrigatório"),
        innovationVerification: z.string().min(1, "Verificação Inovação é obrigatória"),
        preProduction: z.object({
          developmentNeeded: z.string().optional(),
          orderConference: z.string().optional(),
          conferenceDate: z.date().optional(),
          datasulCode: z.string().optional(),
          packaging1: z.string().optional(),
          packaging2: z.string().optional(),
          packaging3: z.string().optional(),
          shippingBox: z.string().optional(),
          label: z.string().optional(),
          scoop: z.string().optional(),
          densityTest1: z.string().optional(),
          densityTest2: z.string().optional(),
          densityTest3: z.string().optional(),
          observations: z.string().optional(),
        }).optional(),
        mixingProcess: z.object({
          mixerUsed: z.string().optional(),
          mixingOrder: z.string().optional(),
          roomTemperature: z.string().optional(),
          relativeHumidity: z.string().optional(),
          mixingTime: z.string().optional(),
          initialTankTemperature: z.string().optional(),
          viscTempTankViscosity: z.string().optional(),
          viscTempTankTemperature: z.string().optional(),
          viscTempTankRpm: z.string().optional(),
          viscTempTankTorque: z.string().optional(),
          viscTempTankSpindle: z.string().optional(),
          visc1Viscosity: z.string().optional(),
          visc1Temperature: z.string().optional(),
          visc1Rpm: z.string().optional(),
          visc1Torque: z.string().optional(),
          visc1Spindle: z.string().optional(),
          visc2Viscosity: z.string().optional(),
          visc2Temperature: z.string().optional(),
          visc2Rpm: z.string().optional(),
          visc2Torque: z.string().optional(),
          visc2Spindle: z.string().optional(),
          densityMixing1: z.string().optional(),
          densityMixing2: z.string().optional(),
          densityMixing3: z.string().optional(),
          occurrence: z.string().optional(),
          heatedPulmonaryTank: z.string().optional(),
          observations: z.string().optional(),
          scoopConform: z.string().optional(),
          sensorialReleased: z.string().optional(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Criar registro principal
          const recordResult = await createChecklistRecord({
            type: input.type,
            productName: input.productName,
            client: input.client,
            formulationCode: input.formulationCode,
            accompanimentReason: input.accompanimentReason,
            productionDate: input.productionDate,
          });
          
          // Extrair o ID do registro criado
          const recordId = (recordResult as any).lastInsertRowid || (recordResult as any).insertId;
          
          if (recordId) {
            // Salvar dados de pré-produção
            if (input.preProduction) {
              await createPreProductionData({
                recordId: recordId as number,
                ...input.preProduction,
              });
            }
            
            // Salvar dados de processo de mistura
            if (input.mixingProcess) {
              await createMixingProcessData({
                recordId: recordId as number,
                ...input.mixingProcess,
              });
            }
            
            // Salvar dados de responsáveis
            await createResponsiblePersonnel({
              recordId: recordId as number,
              qualityResponsible: input.qualityResponsible,
              innovationResponsible: input.innovationResponsible,
              innovationVerification: input.innovationVerification,
            });
          }
          
          const record = await getChecklistRecordById(recordId as number);
          const responsible = await getResponsiblePersonnel(recordId as number);
          return {
            id: recordId,
            ...record,
            qualityResponsible: responsible?.qualityResponsible,
            innovationResponsible: responsible?.innovationResponsible,
            innovationVerification: responsible?.innovationVerification,
          };
        } catch (error) {
          console.error("Erro ao criar checklist:", error);
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
