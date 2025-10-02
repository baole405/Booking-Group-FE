import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RootState } from "@/redux/store";
import { Calendar, Trash2, User, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

type Project = {
  id: string;
  name: string;
  logo?: string;
  tags: string[];
  teamSize: number;
  startDate: string;
  endDate: string;
  leader: string;
  mentor?: string;
  lecturer?: string;
  description: string;
};

type ProjectCardProps = {
  project: Project;
  mode?: "student" | "moderator";
};

function ProjectCard({ project, mode }: ProjectCardProps) {
  const { role } = useSelector((state: RootState) => state.user);
  const isModerator = mode === "moderator" || role === "Moderator";
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa nhóm ${project.name}?`)) {
      console.log("Delete group:", project.id);
      //Implement actual delete functionality
    }
  };

  const handleViewDetail = () => {
    if (isModerator) {
      navigate(`/moderator/groups/${project.id}`);
    } else {
      navigate(`/student/groups/${project.id}`);
    }
  };

  return (
    <Card className="flex flex-col items-start gap-4 p-4 md:flex-row md:items-center">
      {/* Image */}
      <div className="bg-muted flex h-28 w-40 flex-shrink-0 items-center justify-center rounded-md">
        {project.logo ? (
          <img src={project.logo} alt={project.name} className="max-h-full object-contain" />
        ) : (
          <span className="text-muted-foreground text-sm">No image available</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        {/* Title + Action */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <div className="flex items-center gap-2">
            {isModerator && (
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> Xóa nhóm
              </Button>
            )}
            <Button variant="link" className="text-primary px-0" onClick={handleViewDetail}>
              Xem chi tiết →
            </Button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{project.id}</Badge>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Info */}
        <div className="text-muted-foreground flex flex-wrap gap-x-6 text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Team size: {project.teamSize}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {project.startDate} - {project.endDate}
          </div>
        </div>

        <div className="text-muted-foreground flex flex-wrap gap-x-6 text-sm">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" /> <span className="font-semibold">Leader:</span> {project.leader}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" /> <span className="font-semibold">Mentor:</span> {project.mentor}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" /> <span className="font-semibold">Lecturer:</span> {project.lecturer}
          </div>
        </div>

        <Separator />

        {/* Description */}
        <p className="text-foreground/80 text-sm leading-relaxed">{project.description}</p>
      </div>
    </Card>
  );
}

export default ProjectCard;
