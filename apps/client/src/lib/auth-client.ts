import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/api/auth",
  plugins: [adminClient()],
});

export const { useSession, signIn, signOut, signUp, getSession } = authClient;
