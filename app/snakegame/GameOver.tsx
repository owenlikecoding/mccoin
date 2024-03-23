import React, { useEffect } from "react";
import { getDatabase, ref, update, get } from "firebase/database"; // Import Realtime Database functions
import { initializeApp } from "firebase/app"; // Import Firebase initialization
import Cookies from "js-cookie";

// Initialize Firebase
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

interface GameOverProps {
 width: string;
 height: string;
 score: number;
 newHighScore: boolean;
 highScore: number;
 userId: string; // Assuming you have the user's ID
}

function GameOver(props: GameOverProps) {
 const userId = Cookies.get("userId") || "";

 useEffect(() => {
  const handleSpaceBar = async (event: KeyboardEvent) => {
    if (event.code === "Space") {
      // Fetch the user's current balance from the database
      const userRef = ref(db, `users/${userId}`);
      const snapshot = await get(userRef);
      const currentBalance = snapshot.val()?.balance || 0; // Default to 0 if balance is not set

      // Calculate the new balance by adding the score to the current balance
      const newBalance = currentBalance + props.score;

      // Update the user's balance in the database
      update(userRef, {
        balance: newBalance,
      })
        .then(() => {
          console.log("User's balance updated successfully");
        })
        .catch((error) => {
          console.error("Error updating user's balance: ", error);
        });
    }
  };

  window.addEventListener("keydown", handleSpaceBar);

  return () => {
    window.removeEventListener("keydown", handleSpaceBar);
  };
}, [props.userId, props.score]);

 return (
    <div
      id="GameBoard"
      style={{
        width: props.width,
        height: props.height,
        borderWidth: parseFloat(props.width) / 50,
      }}
    >
      <div id="GameOver" style={{ fontSize: parseFloat(props.width) / 15 }}>
        <div id="GameOverText">GAME OVER</div>
        <div>Your score: {props.score}</div>
        <div>
          {props.newHighScore ? "New local " : "Local "}high score:{" "}
          {props.highScore}
        </div>
        <div id="PressSpaceText">Press Space to restart</div>
      </div>
    </div>
 );
}

export default GameOver;