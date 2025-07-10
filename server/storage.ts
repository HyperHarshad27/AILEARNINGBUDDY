import { 
  users, 
  userProfiles, 
  courses, 
  learningPaths, 
  chatMessages, 
  feedbackRequests,
  type User, 
  type InsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Course,
  type LearningPath,
  type ChatMessage,
  type InsertChatMessage,
  type FeedbackRequest,
  type InsertFeedbackRequest
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // User profile operations
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile & { userId: number }): Promise<UserProfile>;
  updateUserProfile(userId: number, profile: Partial<InsertUserProfile>): Promise<UserProfile | undefined>;
  
  // Course operations
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  
  // Learning path operations
  getLearningPath(userId: number): Promise<LearningPath | undefined>;
  createLearningPath(learningPath: Omit<LearningPath, 'id'>): Promise<LearningPath>;
  updateLearningPathProgress(userId: number, progress: number): Promise<LearningPath | undefined>;
  
  // Chat operations
  getChatMessages(userId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage & { userId: number, timestamp: string }): Promise<ChatMessage>;
  
  // Feedback operations
  getFeedbackRequests(userId: number): Promise<FeedbackRequest[]>;
  createFeedbackRequest(request: InsertFeedbackRequest & { userId: number, createdAt: string }): Promise<FeedbackRequest>;
  updateFeedbackRequest(id: number, feedback: any): Promise<FeedbackRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, UserProfile>;
  private courses: Map<number, Course>;
  private learningPaths: Map<number, LearningPath>;
  private chatMessages: Map<number, ChatMessage>;
  private feedbackRequests: Map<number, FeedbackRequest>;
  private currentUserId: number;
  private currentProfileId: number;
  private currentCourseId: number;
  private currentLearningPathId: number;
  private currentChatMessageId: number;
  private currentFeedbackRequestId: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.courses = new Map();
    this.learningPaths = new Map();
    this.chatMessages = new Map();
    this.feedbackRequests = new Map();
    this.currentUserId = 1;
    this.currentProfileId = 1;
    this.currentCourseId = 1;
    this.currentLearningPathId = 1;
    this.currentChatMessageId = 1;
    this.currentFeedbackRequestId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async createUserProfile(profile: InsertUserProfile & { userId: number }): Promise<UserProfile> {
    const id = this.currentProfileId++;
    const userProfile: UserProfile = { 
      ...profile, 
      id, 
      createdAt: new Date().toISOString() 
    };
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }

  async updateUserProfile(userId: number, profileData: Partial<InsertUserProfile>): Promise<UserProfile | undefined> {
    const existingProfile = await this.getUserProfile(userId);
    if (!existingProfile) return undefined;
    
    const updatedProfile: UserProfile = { ...existingProfile, ...profileData };
    this.userProfiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  async getLearningPath(userId: number): Promise<LearningPath | undefined> {
    return Array.from(this.learningPaths.values()).find(
      (path) => path.userId === userId
    );
  }

  async createLearningPath(learningPath: Omit<LearningPath, 'id'>): Promise<LearningPath> {
    const id = this.currentLearningPathId++;
    const path: LearningPath = { ...learningPath, id };
    this.learningPaths.set(id, path);
    return path;
  }

  async updateLearningPathProgress(userId: number, progress: number): Promise<LearningPath | undefined> {
    const existingPath = await this.getLearningPath(userId);
    if (!existingPath) return undefined;
    
    const updatedPath: LearningPath = { ...existingPath, progress };
    this.learningPaths.set(existingPath.id, updatedPath);
    return updatedPath;
  }

  async getChatMessages(userId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(
      (message) => message.userId === userId
    );
  }

  async createChatMessage(message: InsertChatMessage & { userId: number, timestamp: string }): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    const chatMessage: ChatMessage = { ...message, id };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getFeedbackRequests(userId: number): Promise<FeedbackRequest[]> {
    return Array.from(this.feedbackRequests.values()).filter(
      (request) => request.userId === userId
    );
  }

  async createFeedbackRequest(request: InsertFeedbackRequest & { userId: number, createdAt: string }): Promise<FeedbackRequest> {
    const id = this.currentFeedbackRequestId++;
    const feedbackRequest: FeedbackRequest = { 
      ...request, 
      id, 
      feedback: null,
      imageUrl: request.imageUrl || null
    };
    this.feedbackRequests.set(id, feedbackRequest);
    return feedbackRequest;
  }

  async updateFeedbackRequest(id: number, feedback: any): Promise<FeedbackRequest | undefined> {
    const existingRequest = this.feedbackRequests.get(id);
    if (!existingRequest) return undefined;
    
    const updatedRequest: FeedbackRequest = { ...existingRequest, feedback };
    this.feedbackRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
