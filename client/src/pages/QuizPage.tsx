import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

function QuizPage() {

  const { lessonId } = useParams();

  const [quiz, setQuiz] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any>({});

  useEffect(() => {

    const token = localStorage.getItem("token");

    api.get(`/api/quizzes/lesson/${lessonId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res)=>{
      setQuiz(res.data)
    })

  },[lessonId])


  const handleAnswer = (index:number, option:any)=>{

    setAnswers({
      ...answers,
      [index]: option
    })

  }


  const submitQuiz = async () => {

    let correct = 0

    quiz.forEach((q,index)=>{

      const userAnswer = (answers[index] || "").trim().toLowerCase()
      const correctAnswer = (q.answer || "").trim().toLowerCase()

      if(userAnswer === correctAnswer){
        correct++
      }

    })

    const percentage = quiz.length
      ? Math.round((correct / quiz.length) * 100)
      : 0


    const user = JSON.parse(localStorage.getItem("user") || "{}")

      console.log("USER FROM STORAGE:", user)

    await api.post("/api/quizzes/submit", {
    user_id: user.id,
    lesson_id: Number(lessonId),
    score: percentage
  })


    alert(`Quiz completed\n\nCorrect: ${correct}/${quiz.length}\nScore: ${percentage}%`)

  }


  return (

    <DashboardLayout>

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Lesson Quiz
        </h1>

        {quiz.map((q,index)=>(
          <div key={index} className="bg-white p-6 rounded-xl shadow mb-6">

            <h3 className="font-semibold mb-4">
              {index+1}. {q.question}
            </h3>

            {[q.option1,q.option2,q.option3,q.option4].map((option,i)=>(
              <button
                key={i}
                onClick={()=>handleAnswer(index,option)}
                className={`block w-full text-left p-3 rounded border mb-2
                ${answers[index]===option
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-50"}`}
              >
                {option}
              </button>
            ))}

          </div>
        ))}


        <button
          onClick={submitQuiz}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Submit Quiz
        </button>

      </div>

    </DashboardLayout>

  )

}

export default QuizPage