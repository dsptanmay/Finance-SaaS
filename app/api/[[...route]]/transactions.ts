import { db } from "@/db/drizzle";
import {
  transactions,
  insertTransactionSchema,
  categories,
  accounts,
} from "@/db/schema";
import { parse, subDays } from "date-fns";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
// import { HTTPException } from "hono/http-exception";
import { createId } from "@paralleldrive/cuid2";
import { Hono } from "hono";
import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono().get(
  "/",
  clerkMiddleware(),
  zValidator(
    "query",
    z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })
  ),
  async (c) => {
    const auth = getAuth(c);
    if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

    const { from, to, accountId } = c.req.valid("query");
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
      ? parse(from, "yyyy-MM-dd", new Date())
      : defaultFrom;

    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const data = await db
      .select({
        id: transactions.id,
        category: categories.name,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        accountId: transactions.accountId,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date));

    return c.json({ data });
  }
);

export default app;
