# **KicksVault – E-Commerce Web Application**

**Live Demo:** https://kicksvault-e-commerce.onrender.com/

KicksVault is a full-stack e-commerce application built with **Node.js, Express, MongoDB Atlas, EJS, and Passport.js**.  
It delivers a smooth shopping experience with authentication, cart functionality, reviews, and a complete admin panel for product management.

---

## **📌 Table of Contents**
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Database Seeding](#database-seeding)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [Author](#author)

---

## **Overview**
KicksVault recreates essential functionality found in modern online stores—product listings, user authentication, cart management, and review systems—supported by a clean UI and robust server-side architecture.

The application is deployed on **Render**, with the database hosted on **MongoDB Atlas**.

---

## **Features**

### **Store**
- Browse all products  
- Product detail pages with images, price, and description  
- Add items to cart  
- Remove items from cart  
- Review and rating system  

### **Authentication**
- User signup & login via **Passport.js**  
- Password hashing using **passport-local-mongoose**  
- Session-based authentication  

### **Admin Panel**
(Admins are identified via emails listed in environment variables.)

- Create new products  
- Edit existing products  
- Delete products  
- Manage reviews  

### **General**
- Flash messages for success and error  
- EJS templating using layout support from **ejs-mate**  
- Middleware for access control  

---

## **Tech Stack**

### **Backend**
- Node.js  
- Express.js  
- MongoDB Atlas  
- Mongoose  

### **Frontend**
- EJS Templates  
- Custom CSS  
- Server-side rendering  

### **Authentication**
- Passport.js  
- Passport-Local Strategy  
- Session cookies  

### **Deployment**
- Render (Auto Deploy from GitHub)  
- MongoDB Atlas (Cloud Database)  

---

## **Project Structure**
```
KicksVault
│── app.js
│── seed.js
│── package.json
│
├── models/
│ ├── Product.js
│ ├── Review.js
│ └── User.js
│
├── routes/
│ ├── auth.js
│ ├── cart.js
│ ├── products.js
│ └── review.js
│
├── public/
│ ├── css/
│ ├── js/
│ └── img/
│
└── views/
├── layouts/
├── partials/
├── auth/
├── products/
└── *.ejs
```
Author

Saksham Wadhwa
Open to feedback, suggestions, and collaboration.
