import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    signIn({ user }) {
      if (!user.email) return false;
      return adminEmails.includes(user.email.toLowerCase());
    },
    session({ session }) {
      return session;
    },
  },
});
