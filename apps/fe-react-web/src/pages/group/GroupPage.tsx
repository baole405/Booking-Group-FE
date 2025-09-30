import { useState } from "react";

type Group = {
  id: number;
  name: string;
  leader: string;
  status: string;
  createdAt: string;
};

type JoinRequest = {
  id: number;
  name: string;
  progress: number;
};

export default function GroupPage() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const groups: Group[] = [{ id: 1, name: "Group 1", leader: "Minh", status: "Active", createdAt: "25/09/2025" }];

  const joinRequests: JoinRequest[] = [
    { id: 1, name: "Nguyen Van A", progress: 40 },
    { id: 2, name: "Nguyen Van B", progress: 70 },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-amber-400 p-4">
          <button className="flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-white">
            <span role="img" aria-label="home">
              🏠
            </span>{" "}
            Home
          </button>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Tìm kiếm" className="rounded-full border px-4 py-2" />
            <span role="img" aria-label="notifications">
              🔔
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 font-bold text-white">C</div>
          </div>
        </div>

        {/* Groups List */}
        {!selectedGroup && (
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold text-orange-600">Groups</h2>
            <table className="w-full overflow-hidden rounded-lg border border-gray-300">
              <thead className="bg-gray-100">
                <tr className="text-orange-600">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Leader</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedGroup(group)}>
                    <td className="p-2">{group.name}</td>
                    <td className="p-2">{group.leader}</td>
                    <td className="p-2">{group.status}</td>
                    <td className="p-2">{group.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Group Detail */}
        {selectedGroup && (
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-orange-600">{selectedGroup.name}</h2>
            <div className="grid grid-cols-3 gap-6">
              <textarea className="col-span-2 h-32 rounded-lg border p-2" placeholder="Project"></textarea>

              <div className="space-y-2 rounded-lg bg-orange-100 p-4">
                <div>
                  <p className="font-bold">Leader</p>
                  <p>Cao Nguyen Hoai Nam (K17 HCM)</p>
                </div>
                <div>
                  <p className="font-bold">Mentor</p>
                  <input className="w-full rounded border p-1" />
                </div>
                <div>
                  <p className="font-bold">Teacher</p>
                  <input className="w-full rounded border p-1" />
                </div>
              </div>
            </div>

            {/* Members */}
            <div>
              <h3 className="mb-2 font-bold">Group's member</h3>
              <div className="space-y-2 rounded-lg border p-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <input key={i} className="w-full rounded border p-1" placeholder={`Member ${i + 1}`} />
                ))}
              </div>
            </div>

            {/* Join Request */}
            <div>
              <h3 className="mb-2 font-bold">Join Request</h3>
              <div className="space-y-4 rounded-lg border p-4">
                {joinRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between">
                    <div className="w-1/3">{req.name}</div>
                    <div className="w-1/3">
                      <div className="h-4 w-full rounded-full bg-gray-200">
                        <div className="h-4 rounded-full bg-orange-500" style={{ width: `${req.progress}%` }}></div>
                      </div>
                      <span className="text-sm">{req.progress}%</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-full bg-green-100 px-3 py-1 text-green-600">Accept</button>
                      <button className="rounded-full bg-red-100 px-3 py-1 text-red-600">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setSelectedGroup(null)} className="mt-4 rounded-lg bg-gray-300 px-4 py-2">
              ← Back to Groups
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
