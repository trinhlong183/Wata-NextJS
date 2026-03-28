import { getUsers } from "@/app/actions/actions";
import UserTable from "@/components/dashboard/UserTable";

export const revalidate = 40;

export default async function ISRPage() {
  const users = await getUsers("ISR");

  return (
    <section className="space-y-4">
      <div className="rounded-lg border-l-4 border-orange-500 bg-white p-5 shadow">
        <h2 className="text-2xl font-bold">
          ISR: Cache 40s
        </h2>
        <p className="mt-2 text-sm text-slate-600">
           Tự động cập nhật theo chu kỳ ISR.
        </p>
      </div>

      <UserTable users={users} />
    </section>
  );
}
