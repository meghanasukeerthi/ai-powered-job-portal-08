import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Timer, Heart, MessageSquare, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
}

interface ExperienceRequired {
  id: string;
  years: string;
  level: string;
}

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedDate: string;
  requiredSkills?: string[];
  initialLikes?: number;
  experienceRequired: ExperienceRequired;
  comments: Comment[];
  category?: 'fresher' | 'experienced' | 'remote' | 'internship';
}

export const JobCard = ({ 
  id,
  title, 
  company, 
  location, 
  type, 
  description, 
  postedDate,
  requiredSkills = [],
  initialLikes = Math.floor(Math.random() * 1000) + 1,
  experienceRequired,
  comments: initialComments,
  category = 'experienced',
}: JobCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${title} at ${company}`,
        text: `Check out this job opportunity: ${title} at ${company}`,
        url: window.location.href
      });
    } catch (err) {
      // Fallback for browsers that don't support native sharing
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Job post link has been copied to clipboard",
      });
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        text: newComment,
        author: "Current User",
        date: "Just now"
      };
      setComments([...comments, comment]);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully",
      });
    }
  };

  const handleApply = () => {
    setIsAnimating(true);
    toast({
      title: "Application Submitted! 🎉",
      description: "We've received your application. Good luck!",
      className: "animate-bounce",
    });
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="mini-hover">
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building2 className="w-4 h-4 mr-1" />
              {company}
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center mini-hover">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover-button"
                  onClick={handleLike}
                >
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-all duration-300",
                      isLiked ? "fill-red-500 text-red-500" : "text-gray-500",
                      isAnimating && "animate-scale-in"
                    )}
                  />
                </Button>
                <span className="text-sm text-muted-foreground">{likesCount}</span>
              </div>
              <div className="flex flex-col items-center mini-hover">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover-button"
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageSquare className="w-5 h-5 text-gray-500" />
                </Button>
                <span className="text-sm text-muted-foreground">{comments.length}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover-button mini-hover"
                onClick={handleShare}
              >
                <Share2 className="w-5 h-5 text-gray-500" />
              </Button>
            </div>
            <Badge variant="secondary" className="mini-hover">
              {type}
            </Badge>
            {category === 'fresher' && (
              <Badge variant="outline" className="bg-green-500/10 text-green-500 mini-hover">
                Fresher Friendly
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          {location}
          <Timer className="w-4 h-4 ml-4 mr-1" />
          {postedDate}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {requiredSkills.map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline"
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {skill}
            </Badge>
          ))}
        </div>
        <div className="mb-4">
          <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
            Experience: {experienceRequired.years} ({experienceRequired.level})
          </Badge>
        </div>
        {showComments && (
          <div className="mt-4 space-y-4 animate-slide-in">
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 hover:border-primary transition-colors"
              />
              <Button onClick={handleAddComment} className="hover-button">Post</Button>
            </div>
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-muted p-3 rounded-lg hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{comment.author}</span>
                    <span>{comment.date}</span>
                  </div>
                  <p className="mt-1 text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button 
          onClick={handleApply} 
          className={cn(
            "apply-button",
            isAnimating && "animate-scale-in"
          )}
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};
