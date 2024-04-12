"use client";

import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Cookies from "js-cookie";
import {
 CardTitle,
 CardDescription,
 CardHeader,
 CardContent,
 CardFooter,
 Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Your Firebase configuration
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

interface UserData {
 name?: string;
 profile_picture?: string;
 uid?: string;
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

export default function Component() {
 const [userData, setUserData] = useState<UserData | null>(null);
 const [profilePicture, setProfilePicture] = useState<File | null>(null);

 useEffect(() => {
    const uid = Cookies.get("uid"); // Retrieve UID from cookies
    if (uid) {
      get(ref(db, "users/" + uid))
        .then((snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            setUserData(userData);
          } else {
            console.error("User data not found for uid:", uid);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.error("UID is undefined");
      // Handle the case where uid is undefined, e.g., redirect to login page
    }
 }, []);
 const uploadProfilePicture = async () => {
  const uid = Cookies.get("uid"); // Retrieve UID from cookies
  if (!uid) {
    console.error("UID is undefined");
    // Handle the case where uid is undefined, e.g., redirect to login page
    return;
  }

  if (profilePicture) {
    const profilePictureRef = storageRef(storage, `profile_pictures/${uid}`);
    await uploadBytes(profilePictureRef, profilePicture).then(() => {
      console.log("Uploaded a blob or file!");
      // Generate a download URL for the uploaded file
      getDownloadURL(profilePictureRef).then((url) => {
        // Update profile picture URL in Firebase
        updateUserData(uid, { profile_picture: url });
      });
    });
  }
};

 const saveSettings = async () => {
    const uid = Cookies.get("uid"); // Retrieve UID from cookies
    if (!uid) {
      console.error("UID is undefined");
      // Handle the case where uid is undefined, e.g., redirect to login page
      return;
    }

    const username = (document.getElementById("username") as HTMLInputElement)?.value;
    if (username) {
      // Update username in Firebase
      updateUserData(uid, { name: username });

      // Upload profile picture if a file is selected
      if (profilePicture) {
        uploadProfilePicture();
      }
    }
 };

 const updateUserData = (uid: string, data: Partial<UserData>) => {
    update(ref(db, "users/" + uid), data);
    console.log("User data updated:", data);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 500);
 };

 return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Update your account settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              defaultValue={userData?.name}
            />
          </div>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <img
                alt="Profile picture"
                className="rounded-full"
                height="64"
                src={userData?.profile_picture || "/placeholder.svg"}
                style={{
                 aspectRatio: "64/64",
                 objectFit: "cover",
                }}
                width="64"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
              />
              <Button onClick={uploadProfilePicture} type="button">Upload</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.history.back()}>Go Back</Button>
          <Button className="ml-auto" onClick={saveSettings}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
 );
}