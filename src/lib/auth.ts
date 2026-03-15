import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const adminCredentials = (process.env.ADMIN_CREDENTIALS ?? "")
  .split(",")
  .map((pair) => {
    const [email, password] = pair.trim().split(":");
    return { email: email?.toLowerCase(), password };
  })
  .filter((c) => c.email && c.password);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize(credentials) {
        const email = (credentials.email as string)?.toLowerCase();
        const password = credentials.password as string;

        const admin = adminCredentials.find(
          (c) => c.email === email && c.password === password
        );

        if (!admin) return null;

        return { id: admin.email, email: admin.email, name: "Admin" };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session }) {
      return session;
    },
  },
});
