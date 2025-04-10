# TinyTales 📚 [http://104.209.44.197/login](website here)

> A not-so-tiny tale about switching stacks and battling bugs.

Originally, TinyTales was meant to be a classic LAMP stack project (Linux, Apache, MySQL, PHP). But since I planned to deploy it online, I figured it was time to try something new. I started rebuilding it in React... until I ran into weird frontend issues.

To troubleshoot, I switched the frontend to Vue — only to find out that the actual problem was with my Express version on the backend. 😅

Either way, the journey taught me a lot — and here we are with a working MEVN (MongoDB, Express, Vue, Node) full-stack app. This repo is my personal version of the coursework, now public and documented for future reference (and for anyone else who might enjoy the tale).

---

## 🔧 How to Use

1. **Clone this repo**:
   ```bash
   git clone https://github.com/DefoNotGus/TinyTales_MEVN.git
   cd TinyTales_MEVN
   ```

2. **Run the setup script**:
   ```bash
   ./setup.sh
   ```

3. **Create a `.env` file** in the root directory with the following:
   ```
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key_for_tokens
   ```

4. **Start the app**:
   ```bash
   npm run dev
   ```

---

## 📖 Tech Stack

- **Frontend**: Vue.js
- **Backend**: Express.js + Node.js
- **Database**: MongoDB
- **Auth**: JWT-based authentication

---

## 🧙 May the force be with ya!

Stay curious, keep experimenting, and don’t be afraid to change the stack mid-project (as long as you commit often ~And lack social life~😉).
