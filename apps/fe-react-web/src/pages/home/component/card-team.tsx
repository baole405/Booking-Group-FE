import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Users } from "lucide-react";

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

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col items-start gap-4 p-4 md:flex-row md:items-center">
      {/* Image */}
      <div className="flex h-28 w-40 flex-shrink-0 items-center justify-center rounded-md bg-gray-100">
        {project.logo ? (
          <img src={project.logo} alt={project.name} className="max-h-full object-contain" />
        ) : (
          <span className="text-sm text-gray-400">No image available</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        {/* Title + Action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Button variant="link" className="px-0 text-blue-600">
            Xem chi tiết →
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{project.id}</Badge>
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-emerald-100 text-emerald-700">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Info */}
        <div className="flex flex-wrap gap-x-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Team size: {project.teamSize}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" /> {project.startDate} - {project.endDate}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 text-sm text-gray-600">
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
        <p className="text-sm leading-relaxed text-gray-700">{project.description}</p>
      </div>
    </Card>
  );
}

export default ProjectCard;
