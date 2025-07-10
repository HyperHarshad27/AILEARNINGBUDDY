import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Heart, Target, Clock } from "lucide-react";

interface Question {
  id: string;
  question: string;
  subtitle: string;
  icon: string;
  options: { value: string; label: string; description: string }[];
  type: "single" | "multiple";
}

interface OnboardingFlowProps {
  questions: Question[];
  currentStep: number;
  answers: Record<string, any>;
  onAnswer: (questionId: string, answer: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  isLoading: boolean;
}

const iconMap = {
  "user-graduate": GraduationCap,
  "heart": Heart,
  "target": Target,
  "clock": Clock,
};

export default function OnboardingFlow({
  questions,
  currentStep,
  answers,
  onAnswer,
  onNext,
  onBack,
  canProceed,
  isLoading
}: OnboardingFlowProps) {
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const IconComponent = iconMap[currentQuestion.icon as keyof typeof iconMap] || GraduationCap;

  const handleOptionClick = (value: string) => {
    if (currentQuestion.type === "single") {
      onAnswer(currentQuestion.id, value);
    } else {
      const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(a => a !== value)
        : [...currentAnswers, value];
      onAnswer(currentQuestion.id, newAnswers);
    }
  };

  const isSelected = (value: string) => {
    if (currentQuestion.type === "single") {
      return answers[currentQuestion.id] === value;
    } else {
      const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
      return currentAnswers.includes(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fade-in">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-domestika-red h-2 rounded-full progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="shadow-lg animate-slide-up">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-domestika-red bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconComponent className="text-domestika-red" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentQuestion.question}
              </h2>
              <p className="text-gray-600">{currentQuestion.subtitle}</p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionClick(option.value)}
                  className={`option-card flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    isSelected(option.value)
                      ? "border-domestika-red bg-red-50"
                      : "border-gray-200 hover:border-domestika-red hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center transition-colors ${
                    isSelected(option.value)
                      ? "border-domestika-red bg-domestika-red"
                      : "border-gray-300"
                  }`}>
                    {isSelected(option.value) && (
                      <Check className="text-white" size={12} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={onBack}
                variant="ghost"
                className={`px-6 py-3 ${currentStep === 0 ? "invisible" : ""}`}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="mr-2" size={16} />
                Back
              </Button>
              
              <Button
                onClick={onNext}
                disabled={!canProceed || isLoading}
                className="bg-domestika-red text-white px-8 py-3 font-semibold hover:bg-domestika-red hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? (
                  "Setting up..."
                ) : currentStep === questions.length - 1 ? (
                  <>
                    Complete Setup
                    <Check className="ml-2" size={16} />
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="ml-2" size={16} />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
