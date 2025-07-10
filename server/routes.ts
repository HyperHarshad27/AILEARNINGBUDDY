import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProfileSchema, insertChatMessageSchema, insertFeedbackRequestSchema } from "@shared/schema";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// Using Gemini 2.5 Flash as the main model
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || ""
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Load courses data into storage
  const coursesPath = path.resolve(import.meta.dirname, "..", "data", "courses.json");
  if (fs.existsSync(coursesPath)) {
    const coursesData = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
    // Note: In a real app, we'd load this data into the storage properly
    // For now, we'll handle this in the API routes
  }

  // Create user profile
  app.post("/api/profile", async (req, res) => {
    try {
      const profileData = insertUserProfileSchema.parse(req.body);
      const userId = 1; // For demo purposes, using fixed user ID
      
      const profile = await storage.createUserProfile({
        ...profileData,
        userId
      });
      
      res.json(profile);
    } catch (error) {
      console.error("Profile creation error:", error);
      res.status(400).json({ error: "Failed to create profile" });
    }
  });

  // Get user profile
  app.get("/api/profile/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Generate learning path recommendations
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { skillLevel, interests, goals, timeCommitment } = req.body;
      const userId = 1; // For demo purposes

      // Load courses from JSON file
      const coursesPath = path.resolve(import.meta.dirname, "..", "data", "courses.json");
      let allCourses = [];
      
      if (fs.existsSync(coursesPath)) {
        allCourses = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
      }

      // Filter courses based on user preferences
      let recommendedCourses = allCourses.filter((course: any) => {
        // Match skill level
        if (skillLevel === 'Beginner' && course.difficulty === 'Advanced') return false;
        if (skillLevel === 'Advanced' && course.difficulty === 'Beginner') return false;
        
        // Match interests
        return interests.some((interest: string) => 
          course.category.toLowerCase().includes(interest.toLowerCase()) ||
          course.tags.some((tag: string) => tag.toLowerCase().includes(interest.toLowerCase()))
        );
      });

      // Limit based on time commitment
      const maxCourses = timeCommitment === '1-2 hours' ? 3 : timeCommitment === '3-5 hours' ? 5 : 7;
      recommendedCourses = recommendedCourses.slice(0, maxCourses);

      // Create learning path
      const learningPath = await storage.createLearningPath({
        userId,
        courses: recommendedCourses,
        estimatedWeeks: Math.ceil(recommendedCourses.length * 2),
        progress: 0,
        createdAt: new Date().toISOString()
      });

      res.json(learningPath);
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  // Chat with AI mentor
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, userProfile } = req.body;
      const userId = 1; // For demo purposes

      // Save user message
      await storage.createChatMessage({
        userId,
        role: "user",
        content: message,
        timestamp: new Date().toISOString()
      });

      const systemPrompt = `You are a supportive creative mentor at Domestika. 
      The user has these preferences: ${JSON.stringify(userProfile)}
      
      Respond in a warm, encouraging tone. Use emojis appropriately. 
      Help them with course recommendations, creative advice, or learning guidance.
      Keep responses conversational and actionable.`;

      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ text: systemPrompt + "\n\nUser message: " + message }]
      });
      
      const response = result.text;

      // Save AI response
      await storage.createChatMessage({
        userId,
        role: "assistant",
        content: response || "I'm sorry, I couldn't generate a response right now. Please try again!",
        timestamp: new Date().toISOString()
      });

      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        error: "Failed to generate response",
        response: "I'm sorry, I'm having trouble connecting right now. Please try again later! 😊"
      });
    }
  });

  // Get chat history
  app.get("/api/chat/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  // Generate project feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const { imageUrl, projectDescription, category } = req.body;
      const userId = 1; // For demo purposes

      // Create feedback request
      const feedbackRequest = await storage.createFeedbackRequest({
        userId,
        projectDescription,
        category,
        imageUrl,
        createdAt: new Date().toISOString()
      });

      const feedbackPrompt = `You are an expert creative mentor reviewing a ${category} project. 
      
      Project description: ${projectDescription}
      
      ${imageUrl ? 'I will also analyze the uploaded image to provide visual feedback.' : ''}
      
      Please provide structured, encouraging feedback in this exact JSON format:
      {
        "positives": ["specific positive aspect 1", "specific positive aspect 2"],
        "improvement": "one specific area for improvement with actionable advice",
        "challenge": "a creative challenge or exercise they can try next"
      }
      
      Keep the tone warm, encouraging, and constructive. Focus on specific details and actionable advice.`;

      try {
        let completion;
        
        if (imageUrl) {
          // Use vision model for image analysis
          try {
            // Fetch the image
            const imageResponse = await fetch(imageUrl);
            const imageBuffer = await imageResponse.arrayBuffer();
            const base64Image = Buffer.from(imageBuffer).toString("base64");
            
            // Determine MIME type from URL or default to jpeg
            const mimeType = imageUrl.toLowerCase().includes('.png') ? 'image/png' : 
                           imageUrl.toLowerCase().includes('.gif') ? 'image/gif' : 'image/jpeg';
            
            const result = await ai.models.generateContent({
              model: "gemini-1.5-flash",
              contents: [
                {
                  inlineData: {
                    data: base64Image,
                    mimeType: mimeType,
                  },
                },
                { text: feedbackPrompt }
              ]
            });
            
            completion = { text: result.text };
          } catch (imageError) {
            console.error("Image processing error:", imageError);
            // Fallback to text-only analysis if image processing fails
            const result = await ai.models.generateContent({
              model: "gemini-1.5-flash",
              contents: [{ text: feedbackPrompt + "\n\nNote: Image analysis was not possible, providing text-based feedback." }]
            });
            completion = { text: result.text };
          }
        } else {
          // Text-only analysis
          const result = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: [{ text: feedbackPrompt }]
          });
          completion = { text: result.text };
        }

        // Try to parse the response as JSON, with fallback
        let feedback;
        try {
          feedback = JSON.parse(completion.text || "{}");
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          // Extract feedback from text response if JSON parsing fails
          const text = completion.text || "";
          feedback = {
            positives: [
              text.includes("positive") ? "Great work on your creative approach!" : "Excellent effort on this project!",
              text.includes("composition") ? "Your composition shows good understanding!" : "I can see your creativity shining through!"
            ],
            improvement: text.includes("improve") ? 
              (text.split("improve")[1]?.split(".")[0] || "") + "." : 
              "Consider experimenting with different techniques to enhance your work.",
            challenge: text.includes("challenge") ? 
              (text.split("challenge")[1]?.split(".")[0] || "") + "." : 
              "Try creating a variation of this project with a different color palette or style."
          };
        }
        
        // Update feedback request with the generated feedback
        await storage.updateFeedbackRequest(feedbackRequest.id, feedback);
        
        res.json(feedback);
      } catch (aiError) {
        console.error("AI feedback error:", aiError);
        // Provide fallback feedback
        const fallbackFeedback = {
          positives: ["Great effort on this project!", "I can see creativity in your approach!"],
          improvement: "Consider exploring different techniques to enhance your composition and make your work more dynamic.",
          challenge: "Try creating a variation of this project using a limited color palette or different lighting approach."
        };
        
        await storage.updateFeedbackRequest(feedbackRequest.id, fallbackFeedback);
        res.json(fallbackFeedback);
      }
    } catch (error) {
      console.error("Feedback error:", error);
      res.status(500).json({ error: "Failed to generate feedback" });
    }
  });

  // Get learning path
  app.get("/api/learning-path/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const learningPath = await storage.getLearningPath(userId);
      
      if (!learningPath) {
        return res.status(404).json({ error: "Learning path not found" });
      }
      
      res.json(learningPath);
    } catch (error) {
      console.error("Learning path error:", error);
      res.status(500).json({ error: "Failed to fetch learning path" });
    }
  });

  // Update learning path progress
  app.patch("/api/learning-path/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { progress } = req.body;
      
      const updatedPath = await storage.updateLearningPathProgress(userId, progress);
      
      if (!updatedPath) {
        return res.status(404).json({ error: "Learning path not found" });
      }
      
      res.json(updatedPath);
    } catch (error) {
      console.error("Progress update error:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // Get feedback history for a user
  app.get("/api/feedback/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const feedbackRequests = await storage.getFeedbackRequests(userId);
      res.json(feedbackRequests);
    } catch (error) {
      console.error("Feedback history error:", error);
      res.status(500).json({ error: "Failed to fetch feedback history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
