# 🌐 OurApp - Real-Time Social Network

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack, real-time social networking application built with Node.js, Express, and MongoDB. It features a live global chat room, dynamic user profiles, a global feed, and secure session-based authentication. 

## ✨ Features

* **Real-Time Global Chat:** A persistent, slide-up chat interface powered by Socket.io. Chat messages are synchronized instantly across all active users.
* **Smart Chat Caching:** Utilizes browser `localStorage` to cache chat history for up to 1 hour, ensuring a seamless user experience across page refreshes without overloading the database.
* **User Authentication:** Secure registration, login, and logout functionality with password hashing and persistent sessions stored in MongoDB.
* **Dynamic Profiles:** Unique user profile pages (`/profile/:username`) displaying all posts authored by that user.
* **Content Management (CRUD):** Users can securely create, read, edit, and delete their own posts. Unauthorized users are blocked from modifying others' content.
* **Global Feed:** A centralized dashboard displaying a chronological timeline of all user-generated posts.
* **Responsive UI:** Fully styled using Tailwind CSS for a sleek, modern, and mobile-friendly dark-mode aesthetic.

---

## 🧠 The Tech Flow (How it Works)

OurApp uses a modern Model-View-Controller (MVC) architecture combined with event-driven WebSockets.

1. **The Database Layer (MongoDB):** * Acts as the single source of truth for persistent data. It securely stores `Users`, `Posts`, and `Sessions`. 
2. **The Server Layer (Node & Express):** * Handles incoming HTTP requests, performs security/authorization checks, communicates with MongoDB, and dynamically injects data into the EJS templates using `res.locals`.
3. **The Real-Time Engine (Socket.io):**
   * Express shares its session data directly with Socket.io. When a user types a message in the chat, the frontend *emits* it to the server. The server attaches the user's secure identity (username/avatar) and *broadcasts* it to all other connected clients instantly.
4. **The Client Layer (Vanilla JS & Tailwind):**
   * JavaScript modules capture user interactions (like clicking "Edit" or "Send Message") without heavy frontend frameworks. Tailwind CSS handles the layout, animations (like the sliding chat box), and UI components.

graph TD
    A[User Browser] -->|HTTP Request| B(Express Server)
    A -->|Socket.io Emit| C{Socket Engine}
    B -->|Query/Update| D[(MongoDB)]
    D -->|Return Data| B
    B -->|Render EJS| A
    C -->|Broadcast Message| A
    A -->|Cache| E[LocalStorage]
---

## 🚀 Installation & Setup

To run this project locally, you will need **Node.js** installed on your machine and your own **MongoDB** connection string (either a local MongoDB server or a free MongoDB Atlas cloud cluster).

### 1. Clone the repository
```bash
git clone [https://github.com/rajks6055/OurApp.git](https://github.com/YourUsername/OurApp.git)
cd OurApp
