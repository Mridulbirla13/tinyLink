# 🌐 TinyLink – URL Shortener Web App (Next.js + Prisma + NeonDB)

TinyLink is a lightweight, production-ready URL shortening service inspired by Bit.ly.  
It allows users to generate short URLs, track clicks, view statistics, and manage links—all through a clean, responsive UI.

This project was built as a take-home assignment for a Full Stack / Software Engineer role.

---

## 🚀 Live Demo
🔗 **App:** https://tiny-link-sage.vercel.app/ 
🔗 **GitHub Repo:** https://github.com/Mridulbirla13/tinyLink  

---

## ✨ Features

### 🔗 URL Shortening
- Convert long URLs into short, shareable codes  
- Optional **custom short codes**  
- URL validation  
- Prevents duplicates (returns **409 Conflict**)

### ⚡ Redirect Handling
- Visiting `/{code}` issues an **HTTP 302 redirect**  
- Tracks:
  - Total clicks  
  - Last clicked timestamp  

### 🗑️ Link Management
- Delete links easily  
- Deleted codes return **404**

### 📊 Stats Page (`/code/:code`)
- Displays:
  - Target URL  
  - Total clicks  
  - Last clicked time  
  - Short link metadata

### 🖥️ Dashboard (`/`)
- Displays all links in a table  
- Add new links  
- Delete links  
- Copy short URLs  
- Clean UI with proper spacing, validation, loading states  
- Fully responsive

### ❤️ Healthcheck Endpoint
`GET /healthz` returns:
```json
{ "ok": true, "version": "1.0" }
