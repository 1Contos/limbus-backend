"use server";

import { asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { licenses } from "@/db/schema";
import { generateLicenseKey } from "@/lib/utils";

const PAGE_SIZE = 10;

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

export type LicenseInput = {
  ownerEmail?: string | null;
  plan: "free" | "pro";
  credits: number;
  expiresAt?: string | null;
};

export type LicenseUpdateInput = {
  ownerEmail?: string | null;
  credits?: number;
  status?: "ativa" | "banida";
};

function normalizeEmail(email?: string | null) {
  const value = email?.trim().toLowerCase();
  return value || null;
}

function validateCredits(credits: number) {
  return Number.isInteger(credits) && credits >= 0 && credits <= 1_000_000;
}

export async function getLicenses(searchTerm = "", page = 1) {
  const safePage = Math.max(1, Number.isFinite(page) ? Math.floor(page) : 1);
  const search = searchTerm.trim();
  const filter = search
    ? or(ilike(licenses.id, `%${search}%`), ilike(licenses.ownerEmail, `%${search}%`))
    : undefined;

  try {
    const [rows, [{ total }]] = await Promise.all([
      db.select().from(licenses).where(filter).orderBy(desc(licenses.createdAt), asc(licenses.id))
        .limit(PAGE_SIZE).offset((safePage - 1) * PAGE_SIZE),
      db.select({ total: count() }).from(licenses).where(filter),
    ]);

    return {
      success: true as const,
      data: rows,
      total,
      page: safePage,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };
  } catch (error) {
    console.error("getLicenses failed", error);
    return {
      success: false as const,
      error: "Não foi possível carregar as licenças.",
      data: [],
      total: 0,
      page: safePage,
      totalPages: 1,
    };
  }
}

export async function createLicense(input: LicenseInput): Promise<ActionResult<{ id: string }>> {
  if (!validateCredits(input.credits)) {
    return { success: false, error: "Informe uma quantidade válida de créditos." };
  }
  if (!(["free", "pro"] as const).includes(input.plan)) {
    return { success: false, error: "Selecione um plano válido." };
  }

  try {
    const id = generateLicenseKey();
    const [created] = await db.insert(licenses).values({
      id,
      ownerEmail: normalizeEmail(input.ownerEmail),
      plan: input.plan,
      credits: input.credits,
      expiresAt: input.expiresAt ? new Date(`${input.expiresAt}T23:59:59.999Z`) : null,
    }).returning({ id: licenses.id });

    revalidatePath("/dashboard");
    revalidatePath("/licenses");
    return { success: true, data: created };
  } catch (error) {
    console.error("createLicense failed", error);
    return { success: false, error: "Não foi possível gerar a licença." };
  }
}

export async function updateLicense(id: string, input: LicenseUpdateInput): Promise<ActionResult> {
  if (input.credits !== undefined && !validateCredits(input.credits)) {
    return { success: false, error: "Informe uma quantidade válida de créditos." };
  }
  if (input.status && !(["ativa", "banida"] as const).includes(input.status)) {
    return { success: false, error: "Status inválido." };
  }

  try {
    const update = {
      ...(input.ownerEmail !== undefined && { ownerEmail: normalizeEmail(input.ownerEmail) }),
      ...(input.credits !== undefined && { credits: input.credits }),
      ...(input.status !== undefined && { status: input.status }),
    };
    if (Object.keys(update).length === 0) {
      return { success: false, error: "Nenhuma alteração foi informada." };
    }
    await db.update(licenses).set(update).where(eq(licenses.id, id));
    revalidatePath("/dashboard");
    revalidatePath("/licenses");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("updateLicense failed", error);
    return { success: false, error: "Não foi possível atualizar a licença." };
  }
}

export async function deleteLicense(id: string): Promise<ActionResult> {
  try {
    await db.delete(licenses).where(eq(licenses.id, id));
    revalidatePath("/dashboard");
    revalidatePath("/licenses");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("deleteLicense failed", error);
    return { success: false, error: "Não foi possível excluir a licença." };
  }
}

export async function getStats() {
  const now = new Date();
  const inThirtyDays = new Date(now);
  inThirtyDays.setUTCDate(inThirtyDays.getUTCDate() + 30);

  try {
    const [stats] = await db.select({
      total: count(),
      active: sql<number>`count(*) filter (where ${licenses.status} = 'ativa')::int`,
      banned: sql<number>`count(*) filter (where ${licenses.status} = 'banida')::int`,
      credits: sql<number>`coalesce(sum(${licenses.credits}), 0)::int`,
      expiring: sql<number>`count(*) filter (where ${licenses.expiresAt} >= ${now} and ${licenses.expiresAt} <= ${inThirtyDays})::int`,
    }).from(licenses);
    return { success: true as const, data: stats };
  } catch (error) {
    console.error("getStats failed", error);
    return {
      success: false as const,
      error: "Não foi possível carregar as estatísticas.",
      data: { total: 0, active: 0, banned: 0, credits: 0, expiring: 0 },
    };
  }
}
