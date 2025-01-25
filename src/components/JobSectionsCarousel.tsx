import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface JobSectionsCarouselProps {
  allJobs: Job[];
  sortOrder: 'newest' | 'oldest';
}

export const JobSectionsCarousel = ({ allJobs, sortOrder }: JobSectionsCarouselProps) => {
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'recommended'>('all');
  const [displayedJobs, setDisplayedJobs] = useState<Job[]>(allJobs);

  useEffect(() => {
    // Get user profile from localStorage
    const userProfileStr = localStorage.getItem('userProfile');
    
    // If no profile exists, all jobs are initially recommended
    if (!userProfileStr) {
      setRecommendedJobs(allJobs);
      return;
    }

    // Parse user profile
    const userProfile = JSON.parse(userProfileStr);
    
    // If no skills in profile, all jobs are recommended
    if (!userProfile.skills || userProfile.skills.length === 0) {
      setRecommendedJobs(allJobs);
      return;
    }

    // Function to check if a job matches user profile skills
    const matchesUserSkills = (job: Job) => {
      return job.requiredSkills.some(jobSkill =>
        userProfile.skills.some((userSkill: string) => 
          jobSkill.toLowerCase() === userSkill.toLowerCase()
        )
      );
    };

    // Filter jobs based on skill matching
    const recommended = allJobs.filter(matchesUserSkills);
    setRecommendedJobs(recommended);
  }, [allJobs]);

  // Sort jobs based on posted date
  const sortJobs = (jobs: Job[]) => {
    return [...jobs].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.postedDate - a.postedDate;
      } else {
        return a.postedDate - b.postedDate;
      }
    });
  };

  useEffect(() => {
    // Update displayed jobs whenever active section or sort order changes
    const jobsToDisplay = activeSection === 'all' ? allJobs : recommendedJobs;
    setDisplayedJobs(sortJobs(jobsToDisplay));
  }, [activeSection, sortOrder, allJobs, recommendedJobs]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-center gap-4 mb-6">
        <Button
          variant={activeSection === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveSection('all')}
          className="min-w-[120px]"
        >
          All Jobs ({allJobs.length})
        </Button>
        <Button
          variant={activeSection === 'recommended' ? 'default' : 'outline'}
          onClick={() => setActiveSection('recommended')}
          className="min-w-[120px]"
        >
          Recommended ({recommendedJobs.length})
        </Button>
      </div>
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <div className="p-4">
              <JobList jobs={displayedJobs} />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};