import { apiRequest } from "./queryClient";

export interface UserProfile {
  skillLevel: string;
  interests: string[];
  goals: string[];
  timeCommitment: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface FeedbackRequest {
  projectDescription: string;
  category: string;
  imageUrl?: string;
}

export interface FeedbackResponse {
  positives: string[];
  improvement: string;
  challenge: string;
}

export interface LearningPath {
  courses: any[];
  estimatedWeeks: number;
  progress: number;
  createdAt: string;
}

export const api = {
  // Profile operations
  createProfile: async (profile: UserProfile) => {
    const response = await apiRequest("POST", "/api/profile", profile);
    return response.json();
  },

  getProfile: async (userId: number) => {
    const response = await apiRequest("GET", `/api/profile/${userId}`);
    return response.json();
  },

  // Chat operations
  sendChatMessage: async (message: string, userProfile?: UserProfile) => {
    const response = await apiRequest("POST", "/api/chat", { message, userProfile });
    return response.json();
  },

  getChatHistory: async (userId: number) => {
    const response = await apiRequest("GET", `/api/chat/${userId}`);
    return response.json();
  },

  // Recommendations
  getRecommendations: async (profile: UserProfile) => {
    const response = await apiRequest("POST", "/api/recommendations", profile);
    return response.json();
  },

  // Feedback operations
  requestFeedback: async (feedbackData: FeedbackRequest) => {
    const response = await apiRequest("POST", "/api/feedback", feedbackData);
    return response.json();
  },

  // Learning path operations
  getLearningPath: async (userId: number) => {
    const response = await apiRequest("GET", `/api/learning-path/${userId}`);
    return response.json();
  },

  updateProgress: async (userId: number, progress: number) => {
    const response = await apiRequest("PATCH", `/api/learning-path/${userId}/progress`, { progress });
    return response.json();
  }
};
