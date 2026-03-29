import { auth } from "@koncokirim-app/auth";
import { db } from "@koncokirim-app/db";
import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({
    headers: context.req.raw.headers,
  });
  return {
    auth: null,
    session,
    db,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
