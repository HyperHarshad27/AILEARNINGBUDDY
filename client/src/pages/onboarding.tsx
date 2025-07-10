import { useState } from "react";
import { useLocation } from "wouter";
import OnboardingFlow from "@/components/onboarding-flow";
import Layout from "@/components/layout";
import { api, type UserProfile } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: keyof UserProfile;
  question: string;
  subtitle: string;
  icon: string;
  options: { value: string; label: string; description: string }[];
  type: "single" | "multiple";
}

const questions: Question[] = [
  {
    id: "skillLevel",
    question: "What's your current skill level?",
    subtitle: "Help us understand where you're starting from",
    icon: "user-graduate",
    type: "single",
    options: [
      {
        value: "Beginner",
        label: "Beginner",
        description: "Just starting my creative journey"
      },
      {
        value: "Intermediate",
        label: "Intermediate", 
        description: "Have some experience and want to improve"
      },
      {
        value: "Advanced",
        label: "Advanced",
        description: "Looking to master advanced techniques"
      }
    ]
  },
  {
    id: "interests",
    question: "What creative areas interest you most?",
    subtitle: "You can select multiple options",
    icon: "heart",
    type: "multiple",
    options: [
      { value: "Photography", label: "Photography", description: "Capture beautiful moments" },
      { value: "Graphic Design", label: "Graphic Design", description: "Create visual communications" },
      { value: "Illustration", label: "Illustration", description: "Draw and create artwork" },
      { value: "Animation", label: "Animation", description: "Bring images to life" },
      { value: "Video Editing", label: "Video Editing", description: "Edit and produce videos" },
      { value: "Web Design", label: "Web Design", description: "Design digital experiences" }
    ]
  },
  {
    id: "goals",
    question: "What are your learning goals?",
    subtitle: "Tell us what you want to achieve",
    icon: "target",
    type: "multiple",
    options: [
      { value: "Build a portfolio", label: "Build a portfolio", description: "Create a professional showcase" },
      { value: "Career change", label: "Career change", description: "Switch to a creative career" },
      { value: "Hobby/fun", label: "Hobby/fun", description: "Learn for personal enjoyment" },
      { value: "Freelancing", label: "Freelancing", description: "Start freelance work" },
      { value: "Improve existing skills", label: "Improve existing skills", description: "Enhance current abilities" }
    ]
  },
  {
    id: "timeCommitment",
    question: "How much time can you dedicate per week?",
    subtitle: "This helps us recommend the right pace",
    icon: "clock",
    type: "single",
    options: [
      { value: "1-2 hours", label: "1-2 hours", description: "Light learning schedule" },
      { value: "3-5 hours", label: "3-5 hours", description: "Moderate commitment" },
      { value: "5+ hours", label: "5+ hours", description: "Intensive learning" }
    ]
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleAnswer = (questionId: keyof UserProfile, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      setIsLoading(true);
      try {
        const profile = answers as UserProfile;
        
        // Save profile
        await api.createProfile(profile);
        
        // Generate learning path
        await api.getRecommendations(profile);
        
        // Store profile in localStorage for dashboard access
        localStorage.setItem("userProfile", JSON.stringify(profile));
        
        toast({
          title: "Welcome aboard! 🎉",
          description: "Your personalized learning journey is ready.",
        });
        
        setLocation("/dashboard");
      } catch (error) {
        console.error("Onboarding error:", error);
        toast({
          title: "Something went wrong",
          description: "Please try again or skip to continue.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const canProceed = () => {
    const currentQuestion = questions[currentStep];
    const currentAnswer = answers[currentQuestion.id];
    
    if (currentQuestion.type === "multiple") {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    
    return !!currentAnswer;
  };

  return (
    <Layout showNav={false}>
      <OnboardingFlow
        questions={questions}
        currentStep={currentStep}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onBack={handleBack}
        canProceed={canProceed()}
        isLoading={isLoading}
      />
    </Layout>
  );
}
