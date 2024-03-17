"use client";

import Link from "next/link";
import { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
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

export default function Component() {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential) {
        const token = credential.accessToken;
        console.log(token);
      } else {
        console.error("Credential is null");
      }
      const user = result.user;
      console.log(user);
      Cookies.set("uid", user.uid);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert("Signed in successfully");
      Cookies.set("uid", userCredential.user.uid);
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        alert("Error signing in: " + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center">
      <div className="max-w-lg w-full bg-gray-800 rounded-lg shadow-2xl overflow-hidden p-8">
        <div className="text-center mb-8">
          <span className="text-2xl font-semibold text-gray-100 block">
            Sign In to McCoin
          </span>
        </div>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-400"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-2 border rounded-md bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-3 mt-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
            <button
              onClick={handleGoogleSignIn}
              className="mt-4 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex justify-center items-center"
            >
              <img
                src="/google.png"
                alt="Google Sign In"
                className="mr-2 h-5 w-5"
              />
              Continue With Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
