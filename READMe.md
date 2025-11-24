# **Expense Tracker – Full-Stack Assessment**

A complete expense-tracking application built using **Node.js + Express + MongoDB** for the backend and **Expo React Native** for the mobile app.

## 🚀 **Features Implemented**

- ✅ User Registration & Login (JWT Authentication)
- ✅ Protected Routes
- ✅ Full CRUD for Expenses
- ✅ Filtering by Category & Date Range
- ✅ Pagination (page / limit)
- ✅ Summary View (totals by category)
- ✅ Clean UI with Add, Edit & Delete

## 📁 **Repository Structure**

```
├── backend/               # Express + MongoDB server
├── expense-app/           # Expo React Native app
└── README.md
```

---

## 🖥️ **Backend Setup (Terminal 1)**

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# A live mongodb database link we temporary credentials has been left in the file env.example

# Build and start backend
npm run build && npm run dev
```

Backend will run at:

```
http://localhost:4112
```

➡️ **Leave this terminal running**

---

## 📱 **Mobile App Setup (Terminal 2)**

```bash
cd expense-app

# Install dependencies
npm install
```

### **1. Find your local IP address**

- **Windows:** Run `ipconfig` → look for **IPv4 Address**
  Example: `192.168.1.105`

### **2. Update API URL**

Edit the file:

```
expense-app/lib/constants.js
```

Replace this line:

```js
export const API_URL = "http://YOUR_IP_HERE:4112/api/v1";
```

With your actual IP:

```js
export const API_URL = "http://192.168.1.105:4112/api/v1";
```

### **3. Start Expo**

```bash
npx expo start
```

---

## 📲 **Open the App**

1. Install **Expo Go** on your mobile device
2. Ensure your **phone and computer are on the same Wi-Fi network**
3. Scan the QR code displayed in the terminal or Expo dashboard

You’re ready to test!

---

## 🧪 **Test Flow**

1. Register a new account
2. Log in
3. Add new expenses
4. View summary on the Home screen
5. Filter expenses by category or date
6. Edit or delete any expense

---

## 🛠️ **Tech Stack**

### **Backend**

- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt

### **Mobile**

- Expo React Native
- React Navigation
- React Query
- Zustand

Everything works **locally** — no deployment required.

## **POINTS TO NOTE**

- Data Validation was not implemented on purpose

---

Feel free to reach out if you need clarification - **uchexdhalitin@gmail.com**

Made with ❤️ by **Darlington**

---
