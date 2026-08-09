import { listUsers } from "../../lib/api";
import Avatar from "../components/Avatar";

export default async function PeoplePage() {
  let users = [] as any[];
  try {
    users = await listUsers();
  } catch (e) {
    return (
      <div className="vf-card p-6">
        <p className="text-sm text-rose-200">Unable to load community members.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="vf-card p-6">
        <h2 className="text-xl font-semibold">Community Members</h2>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((u) => (
          <div key={u.id} className="vf-card p-4 flex items-center gap-3">
            <Avatar email={u.email} size={44} />
            <div>
              <div className="font-semibold">{u.email}</div>
              <div className="text-sm text-slate-300">Joined: {new Date(u.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
