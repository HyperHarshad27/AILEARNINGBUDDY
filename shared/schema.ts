import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  skillLevel: text("skill_level").notNull(),
  interests: text("interests").array().notNull(),
  goals: text("goals").array().notNull(),
  timeCommitment: text("time_commitment").notNull(),
  createdAt: text("created_at").notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructor: text("instructor").notNull(),
  difficulty: text("difficulty").notNull(),
  category: text("category").notNull(),
  duration: text("duration").notNull(),
  thumbnail: text("thumbnail"),
  tags: text("tags").array().notNull(),
  rating: text("rating"),
});

export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  courses: jsonb("courses").notNull(),
  estimatedWeeks: integer("estimated_weeks").notNull(),
  progress: integer("progress").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  role: text("role").notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
});

export const feedbackRequests = pgTable("feedback_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  projectDescription: text("project_description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  feedback: jsonb("feedback"),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  userId: true,
  timestamp: true,
});

export const insertFeedbackRequestSchema = createInsertSchema(feedbackRequests).omit({
  id: true,
  userId: true,
  feedback: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type Course = typeof courses.$inferSelect;
export type LearningPath = typeof learningPaths.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type FeedbackRequest = typeof feedbackRequests.$inferSelect;
export type InsertFeedbackRequest = z.infer<typeof insertFeedbackRequestSchema>;
