import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { admin, bearer } from "better-auth/plugins";
import { prisma } from "../prisma.service";
import { accessControl } from "./permissions.ts/access-control";
import { adminControl } from "./permissions.ts/admin-control";
import { counterControl } from "./permissions.ts/counter-control";

export const auth: any = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // disableSignUp: true,
  },
  plugins: [
    bearer(),
    admin({
      ac: accessControl,
      roles: {
        admin: adminControl,
        counter: counterControl,
      },
    }),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 6 * 60, // 6 minutes
    },
  },
  trustedOrigins: ["http://localhost:5173", "http://localhost:5174", "http://192.168.1.54:5173"],
});
