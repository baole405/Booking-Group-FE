import { useNavigate } from "react-router-dom";

const groups = [
  { id: 1, name: "Nhóm 1", topic: "AI ứng dụng", members: 5, status: "Chờ duyệt" },
  { id: 2, name: "Nhóm 2", topic: "Web nâng cao", members: 4, status: "Hoạt động" },
  { id: 3, name: "Nhóm 3", topic: "IoT thực tiễn", members: 6, status: "Chưa hoạt động" },
];

export default function GroupList() {
  const navigate = useNavigate();
  const handleCancel = (id: number) => {
    alert(`Hủy nhóm ${id}`);
  };
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-orange-500">Danh sách nhóm sinh viên</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="flex flex-col gap-4 rounded-xl border-2 border-orange-500 bg-white p-6 shadow">
            <div className="text-lg font-bold">{group.name}</div>
            <div className="text-sm text-gray-500">{group.topic}</div>
            <div className="text-sm">
              Thành viên: <span className="text-orange-500">{group.members}</span>
            </div>
            <div className="text-sm">
              Trạng thái: <span className="text-orange-500">{group.status}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-orange-500 px-3 py-1 text-white hover:bg-orange-600"
                onClick={() => navigate(`/moderator/home/groups/${group.id}`)}
              >
                Xem chi tiết
              </button>
              <button className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600" onClick={() => handleCancel(group.id)}>
                Hủy nhóm
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
