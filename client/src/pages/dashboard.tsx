import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout";
import ChatInterface from "@/components/chat-interface";
import FeedbackPanel from "@/components/feedback-panel";
import LearningPath from "@/components/learning-path";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Camera, TrendingUp, Trophy, Upload, Star } from "lucide-react";
import { api, type UserProfile } from "@/lib/api";

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("chat");

  useEffect(() => {
    // Load user profile from localStorage
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      setUserProfile(JSON.parse(profile));
    }
  }, []);

  const { data: learningPath } = useQuery({
    queryKey: ["/api/learning-path", 1], // Using fixed user ID for demo
    enabled: !!userProfile,
    staleTime: 300000, // 5 minutes
  });

  const tabs = [
    { id: "chat", label: "Chat Assistant", icon: MessageCircle },
    { id: "feedback", label: "Get Feedback", icon: Camera },
    { id: "progress", label: "Progress", icon: TrendingUp },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-4 pt-8">
          {/* Welcome Header */}
          <Card className="mb-6 border border-gray-100 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, Alex! 👋
                  </h1>
                  <p className="text-gray-600">Ready to continue your creative journey?</p>
                </div>
                <div className="hidden md:flex items-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-domestika-red">5</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">82%</div>
                    <div className="text-sm text-gray-600">Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Projects</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Card className="border border-gray-100 animate-slide-up">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-6 pt-6">
                  <div className="flex space-x-6">
                    {tabs.map((tab) => {
                      const IconComponent = tab.icon;
                      return (
                        <Button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          variant="ghost"
                          className={`tab-btn pb-4 px-1 border-b-2 font-medium ${
                            activeTab === tab.id
                              ? "border-domestika-red text-domestika-red"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          <IconComponent className="mr-2" size={16} />
                          {tab.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "chat" && <ChatInterface userProfile={userProfile} />}
                  {activeTab === "feedback" && <FeedbackPanel userProfile={userProfile} />}
                  {activeTab === "progress" && <ProgressTab />}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <LearningPath learningPath={learningPath} />
              <RecentActivity />
              <RecommendedCourses />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ProgressTab() {
  const progressData = [
    {
      title: "Photography Fundamentals",
      instructor: "Sarah Johnson",
      progress: 100,
      color: "green",
      icon: "camera"
    },
    {
      title: "Color Theory Essentials",
      instructor: "Maria Garcia", 
      progress: 75,
      color: "red",
      icon: "palette"
    },
    {
      title: "Logo Design Essentials",
      instructor: "Mike Chen",
      progress: 45,
      color: "orange", 
      icon: "pen"
    }
  ];

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Progress</h3>
      
      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Overall Progress</h4>
          <span className="text-2xl font-bold text-domestika-red">82%</span>
        </div>
        <div className="w-full bg-white rounded-full h-3">
          <div className="bg-gradient-to-r from-domestika-red to-pink-500 h-3 rounded-full progress-bar" style={{ width: "82%" }} />
        </div>
        <p className="text-sm text-gray-600 mt-2">You're doing great! Keep up the momentum 🚀</p>
      </div>
      
      {/* Course Progress */}
      <div className="space-y-4">
        {progressData.map((course, index) => (
          <div key={index} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${course.color}-100 rounded-lg flex items-center justify-center`}>
                  <Camera className={`text-${course.color}-600`} size={20} />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{course.title}</h5>
                  <p className="text-sm text-gray-600">by {course.instructor}</p>
                </div>
              </div>
              <span className={`text-${course.color}-600 font-semibold`}>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-${course.color}-500 h-2 rounded-full progress-bar`} 
                style={{ width: `${course.progress}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    {
      icon: Trophy,
      title: "Course Completed!",
      subtitle: "Photography Fundamentals",
      time: "2h ago",
      color: "green"
    },
    {
      icon: Upload,
      title: "Project Uploaded", 
      subtitle: "Portrait series feedback",
      time: "1d ago",
      color: "blue"
    },
    {
      icon: Star,
      title: "New Achievement",
      subtitle: "First course milestone",
      time: "3d ago", 
      color: "purple"
    }
  ];

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                  <IconComponent className={`text-${activity.color}-600`} size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{activity.title}</div>
                  <div className="text-xs text-gray-600">{activity.subtitle}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendedCourses() {
  const recommendedCourses = [
    {
      title: "Advanced Composition",
      instructor: "David Miller",
      difficulty: "Intermediate",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    },
    {
      title: "Digital Illustration",
      instructor: "Emma Taylor",
      difficulty: "Beginner", 
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
    }
  ];

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended for You</h3>
        
        <div className="space-y-4">
          {recommendedCourses.map((course, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-24 object-cover" 
              />
              <div className="p-3">
                <h4 className="font-medium text-gray-900 text-sm mb-1">{course.title}</h4>
                <p className="text-xs text-gray-600 mb-2">by {course.instructor}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    course.difficulty === "Beginner" ? "text-green-600" : 
                    course.difficulty === "Intermediate" ? "text-domestika-red" : "text-purple-600"
                  }`}>
                    {course.difficulty}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-400" size={12} />
                    <span className="text-xs text-gray-600">{course.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
