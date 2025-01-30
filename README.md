# LumFlights API

<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firestore">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger">
</div>

## 📖 Table of Contents
- [Project Description](#-project-description)
- [Features](#-features)
- [Technologies](#-technologies)
- [Setup](#-setup)
- [API Documentation](#-api-documentation)
- [Sample Scenarios](#-sample-scenarios)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Project Description
LumFlights is a **flight reservation management** REST API project. It operates with a role-based authorization system for both admin and staff and provides AI-powered analytics.

![Swagger UI Preview](https://miro.medium.com/v2/resize:fit:1400/1*4bT3VJ7vE6mAbN-6m8Ljsw.png)

---

## 🚀 Features
### Role-Based Access
| Role   | Permissions                           |
|--------|--------------------------------------|
| Admin  | View all reservations and customer details |
| Staff  | View only flight details |

### Core Functions
- 🔐 Authentication with JWT
- ✈️ Create/List reservations
- 📅 Filter by date range
- 🤖 AI-powered reservation analysis

---

## 🛠 Technologies
| Technology  | Description                         |
|------------|---------------------------------|
| **NestJS** | Server-side framework            |
| **Firestore** | NoSQL database (Firebase)       |
| **OpenAI** | AI integration                    |
| **Swagger** | API documentation tool          |

---

## ⚙️ Setup
### 1. Requirements
- Node.js v18+
- Firebase account
- OpenAI API key

### 2. Clone the Project
```bash
git clone https://github.com/sumeyyeemir/lumflights-api.git
cd lumflights-api
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Firebase Configuration
1. Create a project on Firebase Console
2. Download the service account key (`firebase-admin-key.json`)
3. Change file name (`serviceAccountkey.json`)
4. Move the file to the project root

### 5. Environment Variables
Create a `.env` file:
```env
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1h
OPENAI_API_KEY=your_openai_key_here
```
### 7. Start the Application
```bash
npm run start:dev
```

---

## 📚 API Documentation
Swagger UI is automatically generated while the app is running:
```
http://localhost:3000/api
```

![Swagger UI](https://static1.smartbear.co/swagger/media/assets/images/swagger_logo.png)

---

## 🧪 Sample Scenarios

### 2. Create a Reservation
```http
POST /generate-bulk
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "success": "true",
  "count": 1000,
}
```

---

## 🤝 Contributing
1. Fork the repo (https://github.com/sumeyyeemir/lumflights-api/fork)
2. Create a new branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -am 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---

## 📜 License
This project is distributed under the MIT license. See the [LICENSE](LICENSE) file for details.

---

**🚨 Important Note:** Before using in a production environment, make sure to secure JWT_SECRET and other sensitive information!

