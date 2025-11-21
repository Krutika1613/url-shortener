# URL Shortener – Project README

## 📌 Overview

This project is a simple and efficient **URL Shortener** built using **Next.js App Router**, **Prisma**, and **Neon PostgreSQL**.
It provides features to:

* Create short URLs
* View all created short URLs
* Delete any short URL

---

## 🚀 Tech Stack

* **Next.js (App Router)**
* **Prisma ORM**
* **Neon PostgreSQL (Serverless DB)**
* **Tailwind CSS**

---

## 🏗️ Project Setup

### 1. Clone the Repository

```bash
 git clone https://github.com/your-username/url-shortener.git
 cd url-shortener
```

### 2. Install Dependencies

```bash
 npm install
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL="your-neon-postgres-connection-url"
```

### 4. Push Prisma Schema

```bash
 npx prisma generate
 npx prisma db push
```

### 5. Run the Project

```bash
 npm run dev
```

---

## 🐞 Delete API Issue (404 Error) – What Happened

While working on the project, a **404 Not Found error occurred** whenever trying to delete a URL.

### 🔍 **Cause of the Error**

In Next.js (App Router):

* All API route files must be named **`route.js`**
* File-based routing must match exactly

Your original folder structure had:

```
/api/links/[id]/delete/route.js   ❌ WRONG
```

This caused Next.js to look for:

```
DELETE /api/links/[id]/delete
```

but your frontend was calling:

```
DELETE /api/links/:id
```

So the DELETE route was never found → **404**.

---

## ✅ Fix Applied

### **Final correct API structure:**

```
/api/links/route.js        → for GET, POST
/api/links/[id]/route.js   → for DELETE
```

### ✔ Updated frontend fetch call:

```js
await fetch(`/api/links/${link.id}`, { method: "DELETE" });
```

### ✔ Regenerated `.next` folder (only locally)

You deleted `.next` locally to clear cached/stale routing.
This does **not affect the project** because `.next` is ignored in Git and regenerated automatically.

---

## 🗄️ About Neon Database

### ❗ **Is Neon database pushed to GitHub?**

**No.**
Your Neon database **is *not* stored or pushed to GitHub**.

GitHub only stores your **code**, not your actual database.

You must configure the database separately wherever you deploy.

---

## 🌐 Deployment Guide (GitHub + Vercel)

### 1. Push Code to GitHub

```bash
 git init
 git add .
 git commit -m "Initial commit"
 git branch -M master
 git remote add origin https://github.com/your-username/url-shortener.git
 git push -u origin master
```

### 2. Deploy to Vercel

1. Visit [https://vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variable:

```
DATABASE_URL=your-neon-db-url
```

4. Deploy 🎉

---

## 📬 Contact / Support

If you face any issues, feel free to ask!
