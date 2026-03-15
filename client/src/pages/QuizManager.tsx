import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";

function QuizManager() {

  const [quizzes,setQuizzes] = useState<any[]>([]);
  const [lessons,setLessons] = useState<any[]>([]);

  const [lessonId,setLessonId] = useState("");
  const [question,setQuestion] = useState("");
  const [option1,setOption1] = useState("");
  const [option2,setOption2] = useState("");
  const [option3,setOption3] = useState("");
  const [option4,setOption4] = useState("");
  const [answer,setAnswer] = useState("");

  /* LOAD LESSONS */

  const loadLessons = async()=>{
    const res = await api.get("/api/lessons");
    setLessons(res.data);
  };

  /* LOAD QUIZZES */

  const loadQuizzes = async()=>{
    const res = await api.get("/api/quizzes");
    setQuizzes(res.data);
  };

  useEffect(()=>{
    loadLessons();
    loadQuizzes();
  },[]);

  /* CREATE QUIZ */

  const addQuiz = async()=>{

    const token = localStorage.getItem("token");

    await api.post(
      "/api/quizzes",
      {
        lesson_id:lessonId,
        question,
        option1,
        option2,
        option3,
        option4,
        answer
      },
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    alert("Quiz Added");

    setQuestion("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setAnswer("");

    loadQuizzes();
  };

  return (

    <DashboardLayout>

      <div className="max-w-5xl mx-auto">

        {/* PAGE HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Quiz Manager
          </h1>
          <p className="text-gray-500 mt-1">
            Create and manage quiz questions for lessons.
          </p>
        </div>

        {/* QUIZ FORM */}

        <div className="bg-white shadow-md rounded-xl p-6 mb-10">

          <h2 className="text-xl font-semibold mb-6">
            Add Quiz Question
          </h2>

          <div className="grid gap-4">

            {/* LESSON SELECT */}

            <div>
              <label className="text-sm text-gray-600">
                Select Lesson
              </label>

              <select
                className="border rounded-lg p-2 w-full mt-1"
                onChange={(e)=>setLessonId(e.target.value)}
              >
                <option>Select Lesson</option>

                {lessons.map((lesson:any)=>(
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}

              </select>
            </div>

            {/* QUESTION */}

            <div>
              <label className="text-sm text-gray-600">
                Question
              </label>

              <input
                placeholder="Enter quiz question"
                className="border rounded-lg p-2 w-full mt-1"
                value={question}
                onChange={(e)=>setQuestion(e.target.value)}
              />
            </div>

            {/* OPTIONS */}

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="Option 1"
                className="border rounded-lg p-2"
                value={option1}
                onChange={(e)=>setOption1(e.target.value)}
              />

              <input
                placeholder="Option 2"
                className="border rounded-lg p-2"
                value={option2}
                onChange={(e)=>setOption2(e.target.value)}
              />

              <input
                placeholder="Option 3"
                className="border rounded-lg p-2"
                value={option3}
                onChange={(e)=>setOption3(e.target.value)}
              />

              <input
                placeholder="Option 4"
                className="border rounded-lg p-2"
                value={option4}
                onChange={(e)=>setOption4(e.target.value)}
              />

            </div>

            {/* ANSWER */}

            <div>
              <label className="text-sm text-gray-600">
                Correct Answer
              </label>

              <input
                placeholder="Enter correct answer"
                className="border rounded-lg p-2 w-full mt-1"
                value={answer}
                onChange={(e)=>setAnswer(e.target.value)}
              />
            </div>

            {/* BUTTON */}

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold mt-2"
              onClick={addQuiz}
            >
              Add Quiz
            </button>

          </div>

        </div>


        {/* QUIZ LIST */}

        <div className="space-y-4">

          {quizzes.map((quiz:any)=>(
            <div
              key={quiz.id}
              className="bg-white shadow rounded-lg p-4 border"
            >

              <p className="font-semibold text-gray-800">
                {quiz.question}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Lesson ID: {quiz.lesson_id}
              </p>

            </div>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default QuizManager;
