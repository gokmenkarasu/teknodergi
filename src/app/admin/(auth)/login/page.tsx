import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export const metadata = {
  title: "Giris Yap | TeknoDergi Admin",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  return <LoginForm searchParams={searchParams} />;
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-0 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-surface-1 p-8">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-text-primary">
            TeknoDergi Admin
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Yonetim paneline erisim icin giris yapin
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            Email veya sifre hatali
          </div>
        )}

        <form
          action={async (formData: FormData) => {
            "use server";
            try {
              await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/admin",
              });
            } catch (error) {
              if (error instanceof AuthError) {
                redirect("/admin/login?error=credentials");
              }
              throw error;
            }
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-text-secondary"
            >
              Sifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            Giris Yap
          </button>
        </form>

        <p className="text-center text-xs text-text-tertiary">
          Sadece yetkilendirilmis hesaplar giris yapabilir.
        </p>
      </div>
    </div>
  );
}
