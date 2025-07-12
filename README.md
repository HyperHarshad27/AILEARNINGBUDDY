# Domestika AI Learning Buddy

## Overview
A full-stack AI-powered learning assistant for creative learners. Provides personalized course recommendations, interactive chat support, and project feedback using Gemini AI. Built with React, Express.js, and TypeScript.

---

## 🚀 Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AILearningBuddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your-gemini-api-key
     ```
   - (Optional) Add database connection string if using PostgreSQL.

4. **Run the development server**
   ```bash
   npm run dev
   ```
   - The app will be available at [http://localhost:5000](http://localhost:5000)

5. **Access the app**
   - Open your browser and go to [http://localhost:5000](http://localhost:5000)
   - Start your creative learning journey!

---

## 🛠️ Known Gaps

- **Authentication**: No user login/signup; uses a fixed demo user.
- **Image Upload**: Feedback only supports image URLs, not direct file uploads.
- **Persistence**: Uses in-memory or localStorage for demo; not production-grade database.
- **Scalability**: Not optimized for high concurrent users.
- **Mobile Experience**: Responsive, but not fully optimized for all mobile devices.
- **Community Features**: No peer-to-peer or group learning yet.
- **Moderation**: Basic content safety, no advanced moderation tools.

---

## 🧪 Next Experiments

1. **Add User Authentication**
   - Implement signup/login and user-specific data storage.
2. **Enable File Upload for Feedback**
   - Allow users to upload images directly for project feedback.
3. **Integrate Persistent Database**
   - Use PostgreSQL or similar for all user, course, and feedback data.
4. **Expand Community Features**
   - Peer feedback, group challenges, and mentor matching.
5. **Mobile App Version**
   - Build a dedicated mobile app or enhance PWA support.
6. **Gamification**
   - Add badges, achievements, and learning streaks.
7. **Advanced Moderation**
   - AI-powered content moderation and reporting tools.
8. **Analytics Dashboard**
   - Real-time metrics for users and admins.

---

## 📞 Contact
For questions or demo requests, contact: [your-email@domain.com] 