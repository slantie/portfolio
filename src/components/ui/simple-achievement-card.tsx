import { Calendar, Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Achievement } from "@/data/data";
import { achievementCategoryLabels } from "@/data/data";

interface SimpleAchievementCardProps {
  achievement: Achievement;
}

const SimpleAchievementCard = ({ achievement }: SimpleAchievementCardProps) => {
  return (
    <Card className="p-6 relative">
      {/* Title */}
      <div className="flex flex-col mb-3">
        <h3 className="text-xl font-bold">{achievement.title}</h3>
        
        {/* Issuer if available */}
        {achievement.organization && (
          <p className="text-lg font-semibold text-muted-foreground">{achievement.organization}</p>
        )}
      </div>
      
      {/* Description */}
      <p className="text-muted-foreground mb-4">
        {achievement.description}
      </p>
      
      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="h-4 w-4" />
        <span>
          {achievement.date.month} {achievement.date.year}
        </span>
      </div>
      
      {/* Type badge */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge 
          variant="secondary" 
          className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {achievementCategoryLabels[achievement.type]}
        </Badge>
      </div>
      
      {/* Link if available */}
      {achievement.link && (
        <Button 
          asChild 
          variant="outline"
          size="sm"
        >
          <a href={achievement.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
            <ExternalLink className="h-3 w-3" />
            <span>View Certificate</span>
          </a>
        </Button>
      )}
    </Card>
  );
};

export default SimpleAchievementCard;
