import DeleteButton from "@/components/dashboard/DeleteButton";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  createAt: string;
  updateAt: string;
};

type UserTableProps = {
  users: UserRow[];
  isSSR?: boolean;
};

export default function UserTable({ users, isSSR = false }: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              ID
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Email
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Create At
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Update At
            </th>
            <th className="px-4 py-3 text-left font-semibold text-slate-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-3 text-slate-600">{user.id}</td>
              <td className="px-4 py-3 text-slate-900">{user.email}</td>
              <td className="px-4 py-3 text-slate-600">{user.name ?? "-"}</td>
              <td className="px-4 py-3 text-slate-600">{user.createAt}</td>
              <td className="px-4 py-3 text-slate-600">{user.updateAt}</td>
              <td className="px-4 py-3">
                {isSSR ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <DeleteButton id={user.id} email={user.email} />
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
