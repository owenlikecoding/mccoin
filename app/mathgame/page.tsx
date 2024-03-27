"use client";

import React, { useState, useEffect } from "react";
import { getDatabase, get, ref, set, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import Cookie from "js-cookie";

const firebaseConfig = {
  apiKey: "AIzaSyBXn34NBurMAMvApEOTrASF_JxEm5dEkDY",
  authDomain: "owen-bucks-evolved.firebaseapp.com",
  databaseURL: "https://owen-bucks-evolved-default-rtdb.firebaseio.com",
  projectId: "owen-bucks-evolved",
  storageBucket: "owen-bucks-evolved.appspot.com",
  messagingSenderId: "78917635267",
  appId: "1:78917635267:web:e5aa6f89987f9e38326676",
  measurementId: "G-JG7NGCN5P1",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

interface MathProblem {
  num1: number;
  num2: number;
  operator: string;
}

const MathGamePage: React.FC = () => {
  const [problem, setProblem] = useState<MathProblem>({
    num1: 0,
    num2: 0,
    operator: "",
  });
  const [userAnswer, setUserAnswer] = useState<number | "">("");
  const [score, setScore] = useState<number>(0); // New state for score
  const [timeLeft, setTimeLeft] = useState<number>(10); // New state for countdown
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(0); // New state to track questions answered

  useEffect(() => {
    generateNewProblem();
    startCountdown();
  }, []);

  const generateNewProblem = () => {
    const operators = ["+", "-", "*", "/"];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;

    const totalQuestions = 5; // Total number of questions you want to ask
    const questionsLeft = totalQuestions - questionsAnswered;

    if (operator === "/") {
      while (num1 % num2 !== 0) {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      }
    }

    setProblem({ num1, num2, operator });
    setUserAnswer("");
  };

  const Reedeem = () => {
    const userId = Cookie.get("uid");
    get(ref(db, 'users/' + userId)).then((snapshot) => {
        const data = snapshot.val();
        const newBalance = parseInt(data.balance, 10) + score;
        update(ref(db, 'users/' + userId), { balance: newBalance });
        alert(`You have successfully redeemed ${score} McCoins!`);
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 500);
    });

  }

  const checkAnswer = () => {
    const answer = eval(`${problem.num1} ${problem.operator} ${problem.num2}`);
    if (userAnswer === answer) {
      setScore(score + 1); // Increment score if answer is correct
    }
    setQuestionsAnswered(questionsAnswered + 1); // Increment questions answered
    if (questionsAnswered < 5) {
      generateNewProblem(); // Generate a new problem if not all questions have been answered
    }
  };

  const startCountdown = () => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        if (prevTimeLeft <= 1) {
          clearInterval(countdown);
          return 0; // Explicitly set timeLeft to 0 when it reaches 0
        }
        return prevTimeLeft - 1;
      });
    }, 1000);
    // Return the cleanup function
    return () => clearInterval(countdown);
  };
  const questionsLeft = 5 - questionsAnswered;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100/40 dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Math Game
          </h1>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl mb-2">
              {problem.num1} {problem.operator} {problem.num2} = ?
            </p>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) =>
                setUserAnswer(
                  e.target.value ? parseInt(e.target.value, 10) : ""
                )
              }
              className="border-2 border-gray-300 rounded-md p-2 mb-2 text-black"
            />
            <button
              onClick={checkAnswer}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Check Answer
            </button>
            <p className="text-xl">Questions Left: {questionsLeft}</p>{" "}
            {/* Display questions left */}
            {/* Display time left */}
            {questionsAnswered >= 5 && (
              <div>
                <p className="text-xl">Final Score: {score}</p>{" "}
                {/* Display final score */}
                <button
                  onClick={Reedeem}
                  className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
                >
                  Reedeem McCoins
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathGamePage;
