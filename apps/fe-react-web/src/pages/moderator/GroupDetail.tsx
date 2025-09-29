import { useNavigate, useParams } from "react-router-dom";

// Dummy data for demo
const groups = [
  {
    id: 1,
    name: "Group 1",
    project: "Project AI ứng dụng cho sinh viên",
    memberList: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Văn D", "Võ Thị E"],
    leader: "Cao Nguyen Hoai Nam",
    mentor: "Nguyễn Văn Mentor",
    teacher: "Nguyễn Văn Teacher",
  },
  {
    id: 2,
    name: "Group 2",
    project: "Project Web nâng cao cho sinh viên",
    memberList: ["Nguyễn Văn F", "Trần Thị G", "Lê Văn H", "Phạm Văn I"],
    leader: "Nguyễn Văn Leader",
    mentor: "Trần Thị Mentor",
    teacher: "Lê Văn Teacher",
  },
  {
    id: 3,
    name: "Group 3",
    project: "Project IoT thực tiễn cho sinh viên",
    memberList: ["Nguyễn Văn J", "Trần Thị K", "Lê Văn L", "Phạm Văn M", "Võ Thị N", "Đỗ Văn O"],
    leader: "Phạm Văn Leader",
    mentor: "Võ Thị Mentor",
    teacher: "Đỗ Văn Teacher",
  },
];

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const group = groups.find((g) => g.id === Number(id));

  if (!group) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-red-500">Không tìm thấy nhóm!</h2>
          <button className="rounded bg-gray-300 px-4 py-2" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-3xl rounded-2xl border-2 border-orange-500 bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-left text-3xl font-bold text-orange-500">{group.name}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left column: Project & Members */}
          <div>
            <div className="mb-6">
              <div className="mb-1 text-sm font-semibold text-orange-500">Project</div>
              <div className="min-h-[60px] rounded-lg border bg-gray-50 p-4 text-gray-700">{group.project}</div>
            </div>
            <div>
              <div className="mb-1 text-sm font-semibold text-orange-500">Group's member</div>
              <div className="rounded-lg border bg-gray-50 p-4">
                <ul className="space-y-2">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <li key={idx} className="flex min-h-[36px] items-center rounded border bg-white px-2 py-1">
                      {group.memberList[idx] || ""}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Right column: Leader, Mentor, Teacher */}
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-2 font-semibold">Leader</div>
              <div className="rounded border bg-white px-3 py-2 font-medium text-gray-800">{group.leader}</div>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-2 font-semibold">Mentor</div>
              <div className="rounded border bg-white px-3 py-2 font-medium text-gray-800">{group.mentor}</div>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
              <div className="mb-2 font-semibold">Teacher</div>
              <div className="rounded border bg-white px-3 py-2 font-medium text-gray-800">{group.teacher}</div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <button className="rounded-lg bg-orange-500 px-6 py-2 font-semibold text-white hover:bg-orange-600" onClick={() => navigate(-1)}>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
