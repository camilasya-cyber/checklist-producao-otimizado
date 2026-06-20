import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, checklistRecords, preProductionData, mixingProcessData, packagingProcessData, postProductionData, responsiblePersonnel, evidencePhotos, InsertChecklistRecord, InsertPreProductionData, InsertMixingProcessData, InsertResponsiblePersonnel, InsertEvidencePhoto } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Checklist Records Functions
export async function createChecklistRecord(data: InsertChecklistRecord) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(checklistRecords).values(data);
  return result;
}

export async function getChecklistRecords(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(checklistRecords)
    .orderBy(desc(checklistRecords.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getChecklistRecordById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(checklistRecords)
    .where(eq(checklistRecords.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getChecklistRecordsByType(type: 'po' | 'capsula' | 'gel', limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(checklistRecords)
    .where(eq(checklistRecords.type, type))
    .orderBy(desc(checklistRecords.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createPreProductionData(data: InsertPreProductionData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(preProductionData).values(data);
}

export async function getPreProductionData(recordId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(preProductionData)
    .where(eq(preProductionData.recordId, recordId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createMixingProcessData(data: InsertMixingProcessData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(mixingProcessData).values(data);
}

export async function getMixingProcessData(recordId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(mixingProcessData)
    .where(eq(mixingProcessData.recordId, recordId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createResponsiblePersonnel(data: InsertResponsiblePersonnel) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(responsiblePersonnel).values(data);
}

export async function getResponsiblePersonnel(recordId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(responsiblePersonnel)
    .where(eq(responsiblePersonnel.recordId, recordId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createEvidencePhoto(data: InsertEvidencePhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(evidencePhotos).values(data);
}

export async function getEvidencePhotos(recordId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(evidencePhotos)
    .where(eq(evidencePhotos.recordId, recordId))
    .orderBy(desc(evidencePhotos.uploadedAt));
}
