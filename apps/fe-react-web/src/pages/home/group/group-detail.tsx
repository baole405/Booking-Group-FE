import HeaderMain from "@/components/layout/header/header-main";
import { Input } from "@/components/ui/input";
import ProjectCard from "./components/group-card";

export default function HomePage() {
  // const currentYear = new Date().getFullYear()

  const projects = [
    {
      id: "EXE201",
      name: "NuFit",
      logo: "/nufit-logo.png",
      tags: ["AI & Machine Learning", "Healthcare"],
      teamSize: 1,
      startDate: "28/09/2025",
      endDate: "31/12/2025",
      leader: "NGUYEN LE NHAT HUY (K18 QN)",
      mentor: "N/A",
      lecturer: "N/A",
      description:
        "NuFit is a project designed for young people who aspire to transform themselves and enhance both their physical and mental well-being through exercise. Understanding the challenges of choosing the right workouts and building a suitable schedule, NuFit leverages AI to create personalized training plans.",
    },
    {
      id: "EXE202",
      name: "Trầm Hương TA",
      logo: "",
      tags: ["Logistics", "GreenTech"],
      teamSize: 1,
      startDate: "27/09/2025",
      endDate: "31/12/2025",
      leader: "Nguyễn Thanh",
      mentor: "N/A",
      lecturer: "N/A",
      description: "Một dự án về logistics kết hợp công nghệ xanh.",
    },
    {
      id: "EXE203",
      name: "Trầm Hương TA",
      logo: "",
      tags: ["Logistics", "GreenTech"],
      teamSize: 1,
      startDate: "27/09/2025",
      endDate: "31/12/2025",
      leader: "Nguyễn Thanh",
      mentor: "N/A",
      lecturer: "N/A",
      description: "Một dự án về logistics kết hợp công nghệ xanh.",
    },
    {
      id: "EXE204",
      name: "Trầm Hương TA",
      logo: "",
      tags: ["Logistics", "GreenTech"],
      teamSize: 1,
      startDate: "27/09/2025",
      endDate: "31/12/2025",
      leader: "Nguyễn Thanh",
      mentor: "N/A",
      lecturer: "N/A",
      description: "Một dự án về logistics kết hợp công nghệ xanh.",
    },
    {
      id: "EXE205",
      name: "Trầm Hương TA",
      logo: "",
      tags: ["Logistics", "GreenTech"],
      teamSize: 1,
      startDate: "27/09/2025",
      endDate: "31/12/2025",
      leader: "Nguyễn hoàng minh dự án",
      mentor: "N/A",
      lecturer: "N/A",
      description: "Một dự án về logistics kết hợp công nghệ xanh.",
    },
  ];

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />
      <HeaderMain />

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-[#00fff1]">Các nhóm</h1>
        <div className="w-64">
          <Input type="text" placeholder="Nhập tên nhóm..." />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-5 gap-6 px-6 py-8">
        {/* Sidebar */}
        <aside className="col-span-1">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Lĩnh vực</h2>
            <ul className="space-y-2">
              <li>
                <input type="checkbox" /> Logistics
              </li>
              <li>
                <input type="checkbox" /> Cybersecurity
              </li>
              <li>
                <input type="checkbox" /> Healthcare
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-4 space-y-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </main>
      </div>

      {/* Footer
      <footer className="border-border/60 border-t py-8">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span>(c) {currentYear} EXE Booking. Crafted for campus experiences.</span>
          <div className="flex flex-wrap gap-4">
            <a className="hover:text-foreground transition-colors" href="/">
              Privacy
            </a>
            <a className="hover:text-foreground transition-colors" href="/">
              Security
            </a>
            <a className="hover:text-foreground transition-colors" href="/">
              Support
            </a>
          </div>
        </div>
      </footer> */}
    </div>
  );
}
