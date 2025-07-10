import { Card, CardContent } from "@/components/ui/card";
import { Check, Play, Lock, Route } from "lucide-react";
import { type LearningPath } from "@/lib/api";

interface LearningPathProps {
  learningPath: LearningPath | null;
}

export default function LearningPath({ learningPath }: LearningPathProps) {
  // Mock data for demo purposes when no learning path is provided
  const mockPath = [
    { id: 1, title: "Photography Basics", status: "completed" },
    { id: 2, title: "Color Theory", status: "in-progress" },
    { id: 3, title: "Advanced Lighting", status: "locked" },
    { id: 4, title: "Portfolio Building", status: "locked" },
  ];

  const pathItems = learningPath?.courses || mockPath;
  const progress = learningPath?.progress || 50;
  const completed = pathItems.filter((item: any) => item.status === "completed").length;
  const total = pathItems.length;

  return (
    <Card className="border border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Learning Path</h3>
          <Route className="text-domestika-red" size={20} />
        </div>
        
        <div className="space-y-4">
          {pathItems.map((item: any, index: number) => {
            const getStatusConfig = (status: string) => {
              switch (status) {
                case "completed":
                  return {
                    icon: Check,
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    iconBg: "bg-green-500",
                    iconColor: "text-white",
                    titleColor: "text-green-800",
                    statusColor: "text-green-600",
                    statusText: "Completed"
                  };
                case "in-progress":
                  return {
                    icon: Play,
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    iconBg: "bg-blue-500",
                    iconColor: "text-white",
                    titleColor: "text-blue-800",
                    statusColor: "text-blue-600",
                    statusText: "In Progress"
                  };
                default:
                  return {
                    icon: Lock,
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    iconBg: "bg-gray-300",
                    iconColor: "text-white",
                    titleColor: "text-gray-700",
                    statusColor: "text-gray-500",
                    statusText: "Locked"
                  };
              }
            };

            const config = getStatusConfig(item.status || (index === 0 ? "completed" : index === 1 ? "in-progress" : "locked"));
            const IconComponent = config.icon;

            return (
              <div
                key={item.id || index}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor}`}
              >
                <div className={`w-6 h-6 ${config.iconBg} rounded-full flex items-center justify-center`}>
                  <IconComponent className={config.iconColor} size={12} />
                </div>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${config.titleColor}`}>
                    {item.title || `Course ${index + 1}`}
                  </div>
                  <div className={`text-xs ${config.statusColor}`}>
                    {config.statusText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-gray-900">{completed} of {total} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-domestika-red h-2 rounded-full progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
