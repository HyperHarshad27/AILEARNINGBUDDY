import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { api, type UserProfile, type FeedbackResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface FeedbackPanelProps {
  userProfile: UserProfile | null;
}

export default function FeedbackPanel({ userProfile }: FeedbackPanelProps) {
  const [projectDescription, setProjectDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const { toast } = useToast();

  const feedbackMutation = useMutation({
    mutationFn: () => api.requestFeedback({
      projectDescription,
      category,
      imageUrl: imageUrl || undefined
    }),
    onSuccess: (data) => {
      setFeedback(data);
      toast({
        title: "Feedback generated! ✨",
        description: "Here's your personalized feedback from our AI mentor.",
      });
    },
    onError: (error) => {
      console.error("Feedback error:", error);
      toast({
        title: "Error generating feedback",
        description: "Please try again or check your connection.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async () => {
    if (!projectDescription.trim() || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in the project description and category.",
        variant: "destructive",
      });
      return;
    }

    feedbackMutation.mutate();
  };

  const reset = () => {
    setProjectDescription("");
    setCategory("");
    setImageUrl("");
    setFeedback(null);
  };

  if (feedback) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Feedback Ready! ✨</h3>
          <p className="text-gray-600">Here's your personalized creative feedback</p>
        </div>

        <div className="space-y-4">
          {/* Positives */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-green-800 mb-2">✅ What's Working Well</h4>
              <ul className="space-y-1">
                {feedback.positives.map((positive, index) => (
                  <li key={index} className="text-green-700 text-sm">{positive}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improvement */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Area for Growth</h4>
              <p className="text-blue-700 text-sm">{feedback.improvement}</p>
            </CardContent>
          </Card>

          {/* Challenge */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 Creative Challenge</h4>
              <p className="text-purple-700 text-sm">{feedback.challenge}</p>
            </CardContent>
          </Card>
        </div>

        <Button 
          onClick={reset}
          variant="outline"
          className="w-full"
        >
          Get Feedback on Another Project
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Work for Feedback</h3>
        <p className="text-gray-600">Get personalized, constructive feedback on your creative projects</p>
      </div>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-domestika-red transition-colors cursor-pointer">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CloudUpload className="text-gray-400" size={32} />
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">Drop your image here</h4>
        <p className="text-gray-600 mb-4">or paste an image URL below</p>
        <input
          type="url"
          placeholder="https://example.com/your-image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full max-w-md mx-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-domestika-red transition-colors"
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Photography">Photography</SelectItem>
              <SelectItem value="Graphic Design">Graphic Design</SelectItem>
              <SelectItem value="Illustration">Illustration</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="Web Design">Web Design</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tell us about your project</label>
          <Textarea
            rows={4}
            placeholder="Describe what you were trying to achieve, any specific challenges you faced, or areas you'd like feedback on..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="border-gray-300 focus:border-domestika-red transition-colors"
          />
        </div>
        
        <Button 
          onClick={handleSubmit}
          disabled={feedbackMutation.isPending || !projectDescription.trim() || !category}
          className="w-full bg-domestika-red text-white font-semibold hover:bg-domestika-red hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {feedbackMutation.isPending ? (
            "Analyzing your work..."
          ) : (
            <>
              Get AI Feedback
              <Sparkles className="ml-2" size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
