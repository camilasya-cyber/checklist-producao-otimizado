import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context
function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Checklist Router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  it("should create a checklist for Pó", async () => {
    const result = await caller.checklist.create({
      type: "po",
      productName: "Pó Proteína Teste",
      client: "Empresa Teste",
      formulationCode: "F-2024-TEST-001",
      accompanimentReason: "Primeira produção",
      productionDate: new Date(),
      productionResponsible: "Carlos Oliveira",
      qualityResponsible: "João Silva",
      innovationResponsible: "Maria Santos",
      innovationVerification: "Pedro Costa",
      preProduction: {
        developmentNeeded: "Não",
        orderConference: "Conforme",
        conferenceDate: new Date(),
        datasulCode: "123456",
        packaging1: "Sim",
        packaging2: "Sim",
        packaging3: "Sim",
        shippingBox: "Sim",
        label: "Sim",
        scoop: "Sim",
        densityTest1: "0.850",
        densityTest2: "0.851",
        densityTest3: "0.849",
        observations: "Teste de pré-produção",
      },
      mixingProcess: {
        mixerUsed: "Misturador modelo X",
        mixingOrder: "Ordem de adição padrão",
        initialTankTemperature: "25.5",
        densityMixing1: "0.850",
        densityMixing2: "0.851",
        densityMixing3: "0.849",
        occurrence: "Não",
        observations: "Teste de mistura",
        sensorialReleased: "Sim",
      },
    });

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    expect(result.productName).toBe("Pó Proteína Teste");
    expect(result.type).toBe("po");
    expect(result.qualityResponsible).toBe("João Silva");
  });

  it("should create a checklist for Gel", async () => {
    const result = await caller.checklist.create({
      type: "gel",
      productName: "Gel Hidratante Teste",
      client: "Empresa Teste",
      formulationCode: "F-2024-TEST-002",
      accompanimentReason: "Teste industrial",
      productionDate: new Date(),
      productionResponsible: "Fernando Pereira",
      qualityResponsible: "Ana Silva",
      innovationResponsible: "Carlos Santos",
      innovationVerification: "Lucia Costa",
      preProduction: {
        developmentNeeded: "Não",
        orderConference: "Conforme",
        conferenceDate: new Date(),
        datasulCode: "234567",
        packaging1: "Sim",
        packaging2: "Sim",
        packaging3: "Sim",
        shippingBox: "Sim",
        label: "Sim",
        scoop: "Sim",
        observations: "Teste de pré-produção",
      },
      mixingProcess: {
        mixerUsed: "Misturador modelo Y",
        mixingOrder: "Ordem de adição padrão",
        initialTankTemperature: "22.0",
        viscTempTankViscosity: "1500",
        viscTempTankTemperature: "25.0",
        viscTempTankRpm: "50",
        viscTempTankTorque: "75",
        viscTempTankSpindle: "S64",
        visc1Viscosity: "1450",
        visc1Temperature: "24.5",
        visc1Rpm: "50",
        visc1Torque: "72",
        visc1Spindle: "S64",
        visc2Viscosity: "1550",
        visc2Temperature: "25.5",
        visc2Rpm: "50",
        visc2Torque: "78",
        visc2Spindle: "S64",
        heatedPulmonaryTank: "Sim",
        occurrence: "Não",
        observations: "Teste de mistura",
        sensorialReleased: "Sim",
      },
    });

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    expect(result.productName).toBe("Gel Hidratante Teste");
    expect(result.type).toBe("gel");
    expect(result.qualityResponsible).toBe("Ana Silva");
  });

  it("should create a checklist for Cápsula", async () => {
    const result = await caller.checklist.create({
      type: "capsula",
      productName: "Cápsula Vitamina Teste",
      client: "Empresa Teste",
      formulationCode: "F-2024-TEST-003",
      accompanimentReason: "Primeira produção",
      productionDate: new Date(),
      productionResponsible: "Gustavo Mendes",
      qualityResponsible: "Roberto Lima",
      innovationResponsible: "Fernanda Oliveira",
      innovationVerification: "Gustavo Martins",
      preProduction: {
        developmentNeeded: "Não",
        orderConference: "Conforme",
        conferenceDate: new Date(),
        datasulCode: "345678",
        packaging1: "Sim",
        packaging2: "Sim",
        packaging3: "Sim",
        shippingBox: "Sim",
        label: "Sim",
        scoop: "Sim",
        observations: "Teste de pré-produção",
      },
      mixingProcess: {
        mixerUsed: "Misturador modelo Z",
        mixingOrder: "Ordem de adição padrão",
        roomTemperature: "23.0",
        relativeHumidity: "55",
        mixingTime: "45",
        occurrence: "Não",
        observations: "Teste de mistura",
        scoopConform: "Sim",
        sensorialReleased: "Sim",
      },
    });

    expect(result).toBeDefined();
    expect(result.id).toBeGreaterThan(0);
    expect(result.productName).toBe("Cápsula Vitamina Teste");
    expect(result.type).toBe("capsula");
    expect(result.qualityResponsible).toBe("Roberto Lima");
  });

  it("should fail to create checklist without required fields", async () => {
    try {
      await caller.checklist.create({
        type: "po",
        productName: "",
        client: "Empresa Teste",
        formulationCode: "F-2024-TEST-004",
        accompanimentReason: "Teste",
        productionDate: new Date(),
        qualityResponsible: "João",
        innovationResponsible: "Maria",
        innovationVerification: "Pedro",
        preProduction: undefined,
        mixingProcess: undefined,
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should list all checklists", async () => {
    const result = await caller.checklist.listAll({ limit: 50, offset: 0 });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(0);
  });

  it("should filter checklists by type", async () => {
    const result = await caller.checklist.listByType({
      type: "po",
      limit: 50,
      offset: 0,
    });
    expect(Array.isArray(result)).toBe(true);
    // All results should be of type 'po'
    result.forEach((record) => {
      expect(record.type).toBe("po");
    });
  });

  it("should search checklists by product name", async () => {
    const result = await caller.checklist.search({
      query: "Proteína",
      limit: 50,
      offset: 0,
    });
    expect(Array.isArray(result)).toBe(true);
    // Results should contain the search term
    result.forEach((record) => {
      expect(
        record.productName.toLowerCase().includes("proteína") ||
          record.client.toLowerCase().includes("proteína") ||
          record.formulationCode.toLowerCase().includes("proteína")
      ).toBe(true);
    });
  });
});
