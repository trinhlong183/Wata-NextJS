import { getUsers } from "@/app/actions/actions";
import SSRUserCrud from "@/components/dashboard/SSRUserCrud";
import UserTable from "@/components/dashboard/UserTable";

export const dynamic = "force-dynamic";

export default async function SSRPage() {
  const users = await getUsers("SSR");

  return (
    <section className="space-y-4">
      <div className="rounded-lg border-l-4 border-emerald-500 bg-white p-5 shadow">
        <h2 className="text-2xl font-bold">
          SSR: Quan tri vien (Always Fresh)
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Mỗi lần vào trang sẽ lấy dữ liệu mới nhất.
        </p>
      </div>

      <SSRUserCrud />

      <UserTable users={users} isSSR />
    </section>
  );
}
