const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });
/* ===================== DATABASE ===================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

/* ===================== MODELS ===================== */

// User
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model("User", userSchema);

// Learning Record
const recordSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  skill: String,
  subtopic: String,
  startDate: String,
  endDate: String,
  learnLink: String,
  completed: { type: Boolean, default: false }
});

const Record = mongoose.model("Record", recordSchema);

// Assessment Attempt
const attemptSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  topic: String,
  score: Number,
  total: Number,
  percentage: Number,
  passed: Boolean,
  createdAt: { type: Date, default: Date.now }
});

const Attempt = mongoose.model("Attempt", attemptSchema);
const noteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  text: String,
  topic: String,
  fileName: String
});

const Note = mongoose.model("Note", noteSchema);

/* ===================== AUTH MIDDLEWARE ===================== */

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();

  } catch {

    res.status(401).json({ message: "Invalid token" });

  }
};

/* ===================== AUTH ROUTES ===================== */

// Signup
app.post("/api/signup", async (req, res) => {

  const { name, email, password } = req.body;

  const exist = await User.findOne({ email });

  if (exist)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed
  });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });

});

// Login
app.post("/api/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });

});

/* ===================== RECORD ROUTES ===================== */

// Add record
app.post("/api/records", authMiddleware, async (req, res) => {

  const record = await Record.create({
    userId: req.userId,
    skill: req.body.skill.toLowerCase(), // normalize
    subtopic: req.body.subtopic,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    learnLink: req.body.learnLink,
    completed: req.body.completed || false
  });

  res.json(record);

});

// Get records
app.get("/api/records", authMiddleware, async (req, res) => {

  const records = await Record.find({ userId: req.userId });

  res.json(records);

});

// Mark complete
app.put("/api/records/:id/complete", authMiddleware, async (req, res) => {

  await Record.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { completed: true }
  );

  res.json({ message: "Marked complete" });

});

/* ===================== QUESTION BANK ===================== */

const questionBank = {

frontend: [
{question:"HTML stands for?",options:["Hyper Text Markup Language","High Text Machine Language","Hyperlinks Mark Language","None"],answer:0},
{question:"Which tag creates a hyperlink?",options:["<a>","<link>","<href>","<url>"],answer:0},
{question:"CSS is used for?",options:["Styling webpages","Database","Server","Logic"],answer:0},
{question:"Which CSS property changes text color?",options:["color","text-style","font-color","bgcolor"],answer:0},
{question:"Which HTML tag creates a list?",options:["<ul>","<list>","<li>","<olitem>"],answer:0},
{question:"Which input type hides text?",options:["password","hidden","text","private"],answer:0},
{question:"Which tag displays image?",options:["<img>","<image>","<src>","<picture>"],answer:0},
{question:"CSS stands for?",options:["Cascading Style Sheets","Creative Style System","Colorful Style Sheets","Computer Style Sheet"],answer:0},
{question:"Which attribute specifies image path?",options:["src","href","link","path"],answer:0},
{question:"Which HTML element is used for headings?",options:["<h1>","<head>","<title>","<heading>"],answer:0}
],

react: [
{question:"React is a?",options:["Library","Database","Language","Framework"],answer:0},
{question:"React is developed by?",options:["Facebook","Google","Microsoft","Amazon"],answer:0},
{question:"JSX stands for?",options:["JavaScript XML","Java Syntax Extension","JSON XML","JavaScript Extension"],answer:0},
{question:"React uses which architecture?",options:["Component Based","Layered","MVC","Monolithic"],answer:0},
{question:"Hook used for state?",options:["useState","useEffect","useRef","useContext"],answer:0},
{question:"Hook used for side effects?",options:["useEffect","useState","useMemo","useReducer"],answer:0},
{question:"Which command creates React app?",options:["npx create-react-app","npm start","react-init","npm install react"],answer:0},
{question:"React components must start with?",options:["Capital letter","Small letter","Number","Symbol"],answer:0},
{question:"Which hook handles form input?",options:["useState","useForm","useEffect","useInput"],answer:0},
{question:"Virtual DOM improves?",options:["Performance","Security","Design","Storage"],answer:0}
],

backend: [
{question:"Node.js is used for?",options:["Backend development","Styling","Database","Design"],answer:0},
{question:"Express.js is a?",options:["Node framework","Database","Language","Frontend library"],answer:0},
{question:"Node.js runs on?",options:["V8 Engine","Python Engine","Java Engine","C Engine"],answer:0},
{question:"Which method handles POST request?",options:["app.post()","app.get()","app.send()","app.create()"],answer:0},
{question:"Middleware is used for?",options:["Processing requests","Database storage","UI design","Styling"],answer:0},
{question:"JWT is used for?",options:["Authentication","Styling","Database","Routing"],answer:0},
{question:"Which package manages dependencies?",options:["npm","node","react","express"],answer:0},
{question:"Which method starts server?",options:["app.listen()","app.run()","app.start()","node.run()"],answer:0},
{question:"REST API stands for?",options:["Representational State Transfer","Remote State Transfer","React Server Transfer","Rapid Server Tech"],answer:0},
{question:"Which format is commonly used for APIs?",options:["JSON","HTML","TXT","XML"],answer:0}
],

database: [
{question:"MongoDB is?",options:["NoSQL database","SQL database","Language","Framework"],answer:0},
{question:"MongoDB stores data as?",options:["Documents","Tables","Rows","Sheets"],answer:0},
{question:"Which command inserts data?",options:["insertOne","addRow","create","push"],answer:0},
{question:"Which command finds data?",options:["find()","search()","get()","select()"],answer:0},
{question:"Which command deletes data?",options:["deleteOne()","removeRow","dropRow","clear"],answer:0},
{question:"Which command updates data?",options:["updateOne()","modify","change","replaceRow"],answer:0},
{question:"MongoDB uses which format?",options:["BSON","JSON","XML","CSV"],answer:0},
{question:"Database used in your project?",options:["MongoDB","MySQL","Oracle","SQLite"],answer:0},
{question:"Collection in MongoDB is like?",options:["Table","Row","Column","File"],answer:0},
{question:"Document in MongoDB is like?",options:["Row","Table","Column","Sheet"],answer:0}
]

};

/* ===================== RANDOM QUESTION GENERATOR ===================== */

function generateQuestions(topic) {

  const bank = questionBank[topic];

  if (!bank) return [];

  const shuffled = [...bank].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 10);

}
/* ===================== CHECK ASSESSMENT ELIGIBILITY ===================== */

/* ===================== CHECK ASSESSMENT ELIGIBILITY ===================== */

app.get("/api/assessment/status/:topic", authMiddleware, async (req, res) => {
  try {

    const topic = req.params.topic.toLowerCase();

    const records = await Record.find({
      userId: req.userId
    });

    const topicRecords = records.filter(
      r => r.skill && r.skill.toLowerCase().trim() === topic
    );

    if (topicRecords.length === 0) {
      return res.json({
        eligible: false,
        message: "No subtopics found"
      });
    }

    const incomplete = topicRecords.filter(r => r.completed !== true);

    if (incomplete.length > 0) {
      return res.json({
        eligible: false,
        message: "Complete all subtopics first"
      });
    }

    res.json({
      eligible: true,
      message: "Assessment unlocked"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Error checking eligibility"
    });

  }
});
/* ===================== GET QUESTIONS ===================== */

/* ===================== GET ASSESSMENT QUESTIONS ===================== */

app.get("/api/assessment/:topic", authMiddleware, async (req, res) => {

  try {

    const topic = req.params.topic.toLowerCase();

    const records = await Record.find({
      userId: req.userId
    });

    const topicRecords = records.filter(
      r => r.skill && r.skill.toLowerCase().trim() === topic
    );

    const incomplete = topicRecords.filter(r => r.completed !== true);

    if (incomplete.length > 0) {
      return res.status(403).json({
        message: "Complete all subtopics first"
      });
    }

    const questions = generateQuestions(topic);

    res.json({ questions });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to load questions"
    });

  }

});

//notes


/* ===================== SUBMIT ASSESSMENT ===================== */

app.post("/api/assessment/submit", authMiddleware, (req, res) => {

const {topic,answers,questions} = req.body;

let score = 0;

questions.forEach((q,i)=>{
if(answers[i]===q.answer){
score++;
}
});

const percentage = Math.round((score/questions.length)*100);

const passed = percentage>=60;

res.json({
score,
percentage,
passed
});

});
app.post("/api/notes", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const note = await Note.create({
      userId: req.userId,
      title: req.body.title,
      text: req.body.text,
      topic: req.body.topic,
      fileName: req.file ? req.file.filename : null
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to save note" });
  }
});
// Save note
app.post("/api/notes", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const note = await Note.create({
      userId: req.userId,
      title: req.body.title,
      text: req.body.text,
      topic: req.body.topic,
      fileName: req.file ? req.file.filename : null
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to save note" });
  }
});


// ADD THIS PART BELOW

// Get notes
app.get("/api/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// Delete note
app.delete("/api/notes/:id", authMiddleware, async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// Download file
app.get("/api/notes/:id/file", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note || !note.fileName) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, "uploads", note.fileName);

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ message: "Download failed" });
  }
});



/* ===================== DASHBOARD ===================== */

app.get("/api/dashboard", authMiddleware, async (req, res) => {

  const records = await Record.find({ userId: req.userId });

  const total = records.length;

  const completedRecords = records.filter(r => r.completed);

  const completed = completedRecords.length;

  const progressPercent =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  // Active Topics (not completed)
  const activeTopics = records.filter(r => !r.completed);

  // Overdue topics
  const today = new Date();

  const overdue = records.filter(r =>
    !r.completed && new Date(r.endDate) < today
  );

  // Skill progress calculation
  const skillMap = {};

  records.forEach(r => {

    if (!skillMap[r.skill]) {
      skillMap[r.skill] = { total: 0, completed: 0 };
    }

    skillMap[r.skill].total++;

    if (r.completed) {
      skillMap[r.skill].completed++;
    }

  });

  const skillProgress = Object.keys(skillMap).map(skill => {

    const s = skillMap[skill];

    return {
      skill,
      percent: Math.round((s.completed / s.total) * 100)
    };

  });

  res.json({

    total,
    completed,
    progressPercent,
    activeTopics,
    overdue,
    skillProgress

  });

});

/* ===================== SERVER ===================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`🚀 Server running on port ${PORT}`);

});