# Blog-app-Submission
# 📝 MERN Blog Platform

A full-stack blog application built using the MERN stack (MongoDB, Express, React, Node.js) that supports:
- Draft saving with auto-save feature
- Blog publishing
- Blog editing
- One draft per blog enforcement
- Token-based authentication (JWT)

---

## 🚀 Features

- ✍️ Create, edit, and save blog drafts
- ⏳ Auto-save drafts every 5 seconds
- ✅ Update the same draft instead of creating multiple
- 📰 Publish saved blogs
- 🔐 JWT-based authentication
- 🧠 React frontend with controlled form and real-time autosaving
- 📚 Clean RESTful API design

---

## 🛠️ Tech Stack

**Frontend:**  
- React.js  
- Axios  
- Tailwind CSS  
- React Toastify  

**Backend:**  
- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- JSON Web Tokens (JWT)  

---

## 📂 Folder Structure

/client
├── src
│ ├── components
│   └── EditorPage.jsx
│   └── BlogListPage.jsx
│   └── LoginRegister.jsx
│ ├── App.jsx
│ └── main.jsx

/server
├── models
│ └── Blog.js
│ └── User.js
├── routes
│ └── blogRoutes.js
│ └── authRoutes.js
├── middleware
│ └── authenticate.js
├── controllers (optional)
├── server.js

---

## 🧑‍💻 How to Run Locally
### 1. Clone the repository
```bash
git clone https://github.com/yourusername/mern-blog-app.git
cd mern-blog-app

 Setup Server
cd server
npm install
npm run dev

 Setup Frontend
cd Frontend
npm install
npm run dev

🔐 Authentication (JWT)
Store token in localStorage
Include Authorization: <token> in headers for protected routes

📦 API Routes

POST /api/blogs/save-draft
Save or update a draft
Body: { id?, title, content, tags }
Auth required

POST /api/blogs/publish
Publish a draft or blog
Body: { id, title, content, tags }
Auth required

