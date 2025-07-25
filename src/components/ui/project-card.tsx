import { Calendar, ExternalLink, Github, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Project } from "@/data/data";

interface SimpleProjectCardProps {
    project: Project;
}

const SimpleProjectCard = ({ project }: SimpleProjectCardProps) => {
    return (
        <Card className="p-6 relative">
            {/* Title and badges */}
            <div className="flex flex-col mb-3">
                <h3 className="text-xl font-bold">{project.title}</h3>

                {/* Event name if available */}
                {project.event && (
                    <p className="text-lg font-semibold text-muted-foreground">
                        {project.event}
                    </p>
                )}

                {/* Role if available */}
                {project.role && (
                    <p className="text-primary/80 font-medium text-sm mt-1">
                        {project.role}
                    </p>
                )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-4">{project.description}</p>

            {/* Date range */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4" />
                <span>
                    {project.startDate.month} {project.startDate.year}
                    {project.isOngoing
                        ? " - Present"
                        : project.endDate
                        ? ` - ${project.endDate.month} ${project.endDate.year}`
                        : ""}
                </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, i) => (
                    <Badge
                        key={i}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                        {tag}
                    </Badge>
                ))}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-2">
                {project.liveLink && (
                    <Button asChild variant="outline" size="sm" className="cursor-none">
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 cursor-none"
                        >
                            <ExternalLink className="h-3 w-3" />
                            <span>Live</span>
                        </a>
                    </Button>
                )}

                {project.githubLink && (
                    <Button asChild variant="outline" size="sm" className="cursor-none">
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 cursor-none"
                        >
                            <Github className="h-3 w-3" />
                            <span>GitHub</span>
                        </a>
                    </Button>
                )}

                {project.link && (
                    <Button asChild variant="outline" size="sm" className="cursor-none">
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 cursor-none"
                        >
                            <Linkedin className="h-3 w-3" />
                            <span>LinkedIn</span>
                        </a>
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default SimpleProjectCard;
