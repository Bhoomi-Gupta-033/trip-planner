# ✈️ AI Trip Planner

## 🌍 Project Overview

AI Trip Planner is a full-stack web application that generates personalized travel itineraries using AI.
Users can input their destination, number of days, budget, interests, and preferred language to receive a structured, day-wise travel plan.

The application focuses on automation + flexibility, allowing users not only to generate trips but also to customize and manage them.

---

## 🛠️ Tech Stack

### Frontend

- Next.js (React)
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### AI Integration

- Google Gemini API

### Justification

- **Next.js** → Fast UI, routing, and scalability
- **Express.js** → Lightweight and easy API integration
- **MongoDB** → Flexible schema for itinerary data
- **Gemini API** && **GROQ API** → Dynamic AI-based content generation

---

## ⚙️ Setup Instructions

### 🔹 Local Setup

#### 1. Clone repo

```bash
git clone https://github.com/your-username/ai-trip-planner.git
cd ai-trip-planner
```

---

#### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
```

Run backend:

```bash
npm run dev
```

---

#### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 Deployed Setup

- Frontend: Vercel
- Backend: Render

Frontend `.env`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

---

## 🧩 High-Level Architecture

User → Frontend → Backend → AI Service → Database → Frontend

### Flow:

1. User enters trip details
2. Frontend sends request to backend
3. Backend calls Gemini AI
4. AI generates itinerary JSON
5. Backend processes + stores data
6. Response returned to frontend
7. UI renders itinerary

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Token stored in localStorage
- Protected routes require valid token
- Users can access only their own trips

---

## 🤖 AI Agent Design & Purpose

The AI agent generates structured travel itineraries.

### Responsibilities:

- Generate day-wise itinerary
- Include real locations & activities
- Provide estimated cost for each activity
- Suggest hotels
- Support multiple languages
- Adapt output based on:
  - Destination
  - Budget
  - Interests
  - Duration
  - Language

### Additional Logic:

- JSON extraction from AI response
- Cost parsing & calculation
- Fallback itinerary generation

---

## ✨ Creative / Custom Features

### 🌐 1. Multilingual Support

- Users can select preferred language (English, Hindi, etc.)
- AI generates itinerary in selected language
- Enhances accessibility for diverse users

---

### 🎯 2. Custom Interest Input

- Users can add their own interests dynamically
- Example: “Photography”, “Adventure Sports”
- AI adapts itinerary based on these custom preferences

---

### 💰 3. Smart Budget Estimation

- Automatically calculates total trip cost
- Includes:
  - Flights
  - Hotels
  - Food
  - Activities

- Users can view total and breakdown

---

### 📝 4. Editable Itinerary

- Add new activities
- Remove activities
- Regenerate specific day

---

### 🔁 5. AI Regeneration

- Each generation produces unique results
- Prevents repetitive itineraries

---

### 👤 6. User Profile System

- Stores user information
- Displays user details
- Personalizes experience

---

### ❤️ 7. Save / Unsave Trips

- Users can bookmark trips
- Toggle save/unsave state
- Easy access to favorite trips

---

### 📄 8. PDF Export

- Download full itinerary as PDF
- Useful for offline travel

---

## ⚖️ Key Design Decisions & Trade-offs

### 1. AI JSON Response Structure

- ✅ Easy to render on frontend
- ❌ Requires strict parsing and validation

---

### 2. LocalStorage for Auth

- ✅ Simple implementation
- ❌ Less secure than HTTP-only cookies

---

### 3. Single AI Request per Trip

- ✅ Faster performance
- ❌ Limited fine-grained control

---

### 4. Static Cost Estimation Logic

- ✅ Works without external APIs
- ❌ Not real-time accurate

---

## ⚠️ Known Limitations

- AI output may vary in accuracy
- Cost estimates are approximate
- No real-time booking integration
- Depends on external AI API availability
- Regeneration may still occasionally produce similar results

---

## 🚀 Future Improvements

- Real-time flight & hotel APIs
- Map integration (Google Maps)
- AI chat-based trip editing
- Collaborative trip planning
- Notifications & reminders

---

## 👩‍💻 Author

Bhoomi Gupta

---

## ⭐ Final Note

This project demonstrates full-stack development, AI integration, and real-world problem-solving.
It focuses on building a practical, user-friendly application with intelligent automation.

---
