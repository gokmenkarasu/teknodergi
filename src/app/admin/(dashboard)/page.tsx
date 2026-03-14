import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { RecentArticles } from "@/components/admin/dashboard/RecentArticles";
import { getArticleStats, getRecentAdminArticles } from "@/lib/db/queries";

export default async function AdminDashboard() {
  const [stats, recentArticles] = await Promise.all([
    getArticleStats(),
    getRecentAdminArticles(5),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-text-primary">
        Dashboard
      </h1>
      <StatsCards stats={stats} />
      <RecentArticles articles={recentArticles} />
    </div>
  );
}
