const db = require("../database/db")

exports.getLeaderboard = (req,res)=>{

  try{

    const leaderboard = db.prepare(`
      SELECT 
        u.name,
        COUNT(p.id) as completedLessons,
        (
          SELECT COUNT(*) FROM lessons
        ) as totalLessons
      FROM users u
      LEFT JOIN progress p 
      ON p.student_id = u.id AND p.completed = 1
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY completedLessons DESC
      LIMIT 10
    `).all()

    const result = leaderboard.map((student)=>{

      const progress = student.totalLessons === 0
        ? 0
        : Math.round((student.completedLessons / student.totalLessons)*100)

      return {
        ...student,
        progress
      }

    })

    res.json(result)

  }catch(err){

    res.status(500).json({error:err.message})

  }

}
