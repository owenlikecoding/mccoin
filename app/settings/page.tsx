// settings/page.tsx

import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
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
  username?: string;
  profilePictureUrl?: string;
}
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Component() {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const uid = Cookies.get("uid");
    if (uid) {
      get(ref(db, "users/" + uid)).then((snapshot) => {
        const userData = snapshot.val();
        setUserData(userData);
      });
    }
  }, []);

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
              defaultValue={userData?.username}
            />
          </div>
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <img
                alt="Profile picture"
                className="rounded-full"
                height="64"
                src={userData?.profilePictureUrl || "/placeholder.svg"}
                style={{
                  aspectRatio: "64/64",
                  objectFit: "cover",
                }}
                width="64"
              />
              <Button>Upload</Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => window.history.back()}>Go Back</Button>
          <Button className="ml-auto">Save</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
