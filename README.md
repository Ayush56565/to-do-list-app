# To-do list app

This is a simple to-do list app built using Next.js. It uses Supabase for the database. It has also been integrated with an AI chatbot for automatically adding tasks. The AI chatbot is served as an n8n workflow which is activated using a webhook trigger. The workflow enhances the title of the task that the user wants to add by passing it through a LLM node using Groq API. This node provides a more enhanced and clear version of the task and then directly adds the new task to the Supabase table 'todos', which then pops up on the tasks section in the webapp.


---

## ⚙️ Tech Stack
- **Next.js**
- **Supabase**
- **n8n**
- **Vercel (for hosting)**

---

## 🛠 Setup & Run

### 1. Clone Repository
```bash
git clone https://github.com/Ayush56565/to-do-list-app
cd to-do-list-app
```

### 2. Install npm packages
```bash
npm install
```

### 3. Run Application
```bash
npm run dev
```

