import { auth } from "@/lib/auth";

export async function AdminHeader() {
  const session = await auth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface-1 px-6">
      <h1 className="font-display text-lg font-semibold text-text-primary">
        TeknoDergi CMS
      </h1>
      <div className="flex items-center gap-3">
        {session?.user?.image && (
          <img
            src={session.user.image}
            alt=""
            className="h-8 w-8 rounded-full"
          />
        )}
        <span className="text-sm text-text-secondary">
          {session?.user?.name ?? session?.user?.email}
        </span>
      </div>
    </header>
  );
}
