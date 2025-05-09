import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { validateFile } from "@/utils/uploadUtils";

interface ResumeUploadProps {
  onResumeData: (data: {
    fullName: string;
    email: string;
    skills: string[];
    experience: string;
    education: string;
    careerGoals: string;
  }) => void;
}

export const ResumeUpload = ({ onResumeData }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file);
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8080/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      const data = await response.json();
      
      // Transform the experience and education arrays into strings
      const experienceString = data.experience
        ?.map((exp: any) => `${exp.jobTitle} at ${exp.company} (${exp.duration})`)
        .join("\n") || "";

      const educationString = data.education
        ?.map((edu: any) => `${edu.degree} from ${edu.institution} (${edu.year})`)
        .join("\n") || "";

      onResumeData({
        fullName: data.fullName || "",
        email: data.email || "",
        skills: data.skills || [],
        experience: experienceString,
        education: educationString,
        careerGoals: data.careerGoals || "",
      });

      toast({
        title: "Resume Uploaded",
        description: "Your resume has been processed and the form has been filled.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to process resume",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-8 glass-effect rounded-lg p-6 border border-white/10 
                    shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
        Resume Parser
      </div>
      <div className="text-lg font-semibold mb-2 text-center">
        Auto-fill Profile from PDF Resume
      </div>
      <p className="text-sm text-muted-foreground mb-6 text-center max-w-md mx-auto">
        Upload your resume in PDF format to automatically fill out the profile form below, or manually enter your information
      </p>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        id="resume-upload"
      />
      <label htmlFor="resume-upload" className="block w-full max-w-md mx-auto">
        <Button
          variant="outline"
          className="w-full hover-button glass-effect border-2 border-primary/20 
                   hover:border-primary transition-all duration-300"
          disabled={isUploading}
          asChild
        >
          <span className="flex items-center justify-center gap-2 py-6">
            <Upload className="w-5 h-5" />
            {isUploading ? "Processing..." : "Upload Resume (PDF)"}
          </span>
        </Button>
      </label>
    </div>
  );
};
