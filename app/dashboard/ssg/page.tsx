import { getUsers } from "@/app/actions/actions";
import UserTable from "@/components/dashboard/UserTable";

export const dynamic = "force-static";

export default async function SSGPage() {
  const users = await getUsers("SSG");

  return (
    <section className="space-y-4">
      <div className="rounded-lg border-l-4 border-blue-500 bg-white p-5 shadow">
        <h2 className="text-2xl font-bold">SSG</h2>
      </div>

      <UserTable users={users} />
    </section>
  );
}
