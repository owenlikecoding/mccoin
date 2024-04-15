"use client";

import React, { useEffect, useState, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get, onValue, off } from "firebase/database";
import Cookies from "js-cookie";

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

interface SnakeSegment {
  x: number;
  y: number;
}

const GamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState<number>(0);
  const [snakeSegments, setSnakeSegments] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
  ]);
  const [apple, setApple] = useState<SnakeSegment>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameSpeed] = useState<number>(16);
  const [currentBalance, setCurrentBalance] = useState<number>(0);

  useEffect(() => {
    const userId = Cookies.get("uid");
    const balanceRef = ref(db, `users/${userId}/balance`);

    const balanceListener = onValue(balanceRef, (snapshot) => {
      const balance = snapshot.val();
      setCurrentBalance(balance);
    });

    // Clean up the listener when the component unmounts
    return () => {
      off(balanceRef, "value", balanceListener);
    };
  }, [db, Cookies.get("uid")]);

  

  const initializeGame = () => {
    setGameOver(false);
    setGameStarted(true); // Set gameStarted to true to start the game immediately
    setScore(0);
    setSnakeSegments([{ x: 10, y: 10 }]);
    setApple({
      x: Math.floor(Math.random() * 20),
      y: Math.floor(Math.random() * 20),
    });
    setDirection({ x: 0, y: 0 });
  };

  // Call initializeGame immediately to start the game
  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameStarted(true);
      switch (e.key) {
        case "w":
        case "W":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "a":
        case "A":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "s":
        case "S":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "d":
        case "D":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };



    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setGameStarted(true);
      switch (e.key) {
        case "ArrowUp":
        case "Up":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowLeft":
        case "Left":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowDown":
        case "Down":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowRight":
        case "Right":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
   
    const handleTouchStart = (e: TouchEvent) => {
       touchStartX = e.touches[0].clientX;
    };
   
    const handleTouchEnd = (e: TouchEvent) => {
       touchEndX = e.changedTouches[0].clientX;
       handleSwipe();
    };
   
    const handleSwipe = () => {
       if (touchEndX < touchStartX) {
         // Swipe left
         setDirection({ x: -1, y: 0 });
       } else if (touchEndX > touchStartX) {
         // Swipe right
         setDirection({ x: 1, y: 0 });
       }
    };
   
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
   
    return () => {
       document.removeEventListener("touchstart", handleTouchStart);
       document.removeEventListener("touchend", handleTouchEnd);
    };
   }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    const gameLoop = setInterval(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      let newSegments = [...snakeSegments];
      let head = {
        x: newSegments[0].x + direction.x,
        y: newSegments[0].y + direction.y,
      };

      if (
        newSegments.some(
          (segment, index) =>
            index !== 0 && segment.x === head.x && segment.y === head.y
        )
      ) {
        setGameOver(true);
        return;
      }

      if (head.x >= 20) head.x = 0;
      if (head.y >= 20) head.y = 0;
      if (head.x < 0) head.x = 19;
      if (head.y < 0) head.y = 19;

      newSegments.unshift(head);
      if (head.x === apple.x && head.y === apple.y) {
        setScore((prevScore) => prevScore + 1);
        setApple({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        });
      } else {
        newSegments.pop();
      }

      setSnakeSegments(newSegments);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.fillStyle = "green";
      snakeSegments.forEach((segment) => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 20 - 2, 20 - 2);
      });

      ctx.fillStyle = "red";
      ctx.fillRect(apple.x * 20, apple.y * 20, 20 - 2, 20 - 2);

      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText(`Score: ${score}`, 20, 30);
    }, 1000 / gameSpeed);

    return () => clearInterval(gameLoop);
  }, [
    snakeSegments,
    direction,
    apple,
    score,
    gameSpeed,
    gameOver,
    gameStarted,
  ]);

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Snake Game
          </h1>
          <a href="/dashboard" className="text-blue-500">
            Back To Dashboard
          </a>
          {!gameOver ? (
            <>
              <canvas
                ref={canvasRef}
                width="400"
                height="400"
                className="mb-4"
              ></canvas>
              {!gameOver && (
                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  Score: {score}
                </p>
              )}
              <p className="leading-7 [&:not(:first-child)]:mt-6 text-white">
                You have {currentBalance} McCoins
              </p>
              <p className="leading-7 [&:not(:first-child)]:mt-6 text-white">
                Use W, A, S, D to Start
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl mb-4">
                Game Over! Your score was: {score}
              </h2>
              <button
                onClick={() => {
                  const userId = Cookies.get("uid");
                  get(ref(db, `users/${userId}`)).then((snapshot) => {
                    if (snapshot.val().multiplier == 1.5) {
                      var currentMcCoins = snapshot.val().balance;
                      update(ref(db, `users/${userId}`), {
                        balance: parseInt(currentMcCoins) + score * 1.5,
                      });
                      setScore(0);
                      setTimeout(() => {
                        initializeGame();
                      });
                    }
                    else {
                      var currentMcCoins = snapshot.val().balance;
                      update(ref(db, `users/${userId}`), {
                        balance: parseInt(currentMcCoins) + score,
                      });
                      setScore(0);
                      setTimeout(() => {
                        initializeGame();
                      });
                    }
                  });
                }}
                className="bg-green-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded"
              >
                Redeem McCoins
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
