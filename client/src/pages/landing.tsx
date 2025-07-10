import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Play, Bot, Route, MessageCircle } from "lucide-react";
import Layout from "@/components/layout";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-teal-50">
        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="max-w-4xl text-center animate-fade-in">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm mb-6 animate-slide-up">
                <Sparkles className="text-domestika-red mr-2" size={16} />
                <span className="text-sm font-medium text-gray-600">
                  AI-Powered Creative Learning
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Creative Learning Journey{" "}
                <span className="text-domestika-red">Starts Here</span> 🎨
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get personalized course recommendations and intelligent feedback on your creative work with our AI mentor
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={() => setLocation("/onboarding")}
                className="bg-domestika-red text-white px-8 py-4 text-lg font-semibold hover:bg-domestika-red hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg rounded-xl"
                size="lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2" size={20} />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 text-lg font-semibold hover:border-gray-400 transition-colors rounded-xl"
                size="lg"
              >
                Watch Demo
                <Play className="ml-2" size={20} />
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Bot className="text-blue-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Mentor</h3>
                  <p className="text-gray-600 text-sm">Get personalized guidance and support from our intelligent creative assistant</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Route className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Learning Paths</h3>
                  <p className="text-gray-600 text-sm">Receive curated course recommendations tailored to your goals and skill level</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow animate-slide-up" style={{ animationDelay: "0.3s" }}>
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <MessageCircle className="text-purple-600" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Feedback</h3>
                  <p className="text-gray-600 text-sm">Upload your work and get detailed, constructive feedback to improve your skills</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
