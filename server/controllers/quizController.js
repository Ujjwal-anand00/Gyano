const db = require("../database/db")

exports.createQuiz = (req,res)=>{

 const { lesson_id, question, option1, option2, option3, option4, answer } = req.body

 db.prepare(`
 INSERT INTO quizzes
 (lesson_id, question, option1, option2, option3, option4, answer)
 VALUES (?, ?, ?, ?, ?, ?, ?)
 `).run(
  lesson_id,
  question,
  option1,
  option2,
  option3,
  option4,
  answer
 )

 res.json({message:"Quiz created"})

}


exports.getQuizzes = (req,res)=>{

 const quizzes = db.prepare(`
 SELECT * FROM quizzes
 `).all()

 res.json(quizzes)

}


exports.deleteQuiz = (req,res)=>{

 const id = req.params.id

 db.prepare(`
 DELETE FROM quizzes
 WHERE id=?
 `).run(id)

 res.json({message:"Quiz deleted"})

}

exports.getQuizByLesson = (req,res)=>{

 const lessonId = req.params.lessonId

 const quizzes = db.prepare(`
  SELECT * FROM quizzes
  WHERE lesson_id = ?
 `).all(lessonId)

 res.json(quizzes)

}

exports.submitQuiz = (req, res) => {

  console.log("=== QUIZ SUBMIT HIT ===")
  console.log(req.body)

  const { user_id, lesson_id, score } = req.body

  const result = db.prepare(`
    INSERT INTO quiz_attempts
    (user_id, lesson_id, score)
    VALUES (?, ?, ?)
  `).run(user_id, lesson_id, score)

  console.log("Inserted row:", result)

  res.json({ message: "Quiz submitted successfully" })

}

exports.getQuizStats = (req, res) => {

 const userId = req.params.userId;

 const result = db.prepare(`
   SELECT 
   COUNT(*) as quizzesTaken,
   AVG(score) as avgScore
   FROM quiz_attempts
   WHERE user_id = ?
 `).get(userId);

 res.json({
   quizzesTaken: result.quizzesTaken || 0,
   avgScore: Math.round(result.avgScore || 0)
 });
};

exports.getQuizAttempts = (req,res)=>{

 const userId = req.params.userId

 const attempts = db.prepare(`
 SELECT lesson_id, score
 FROM quiz_attempts
 WHERE user_id = ?
 ORDER BY id ASC
 `).all(userId)

 res.json(attempts)

}