import { stripe } from "@/utils/stripe";
import { getDatabase, get, ref, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface SearchParams {
  session_id: string;
  uid: string; // Add this line to include the uid property
}

async function getSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId!);
  return session;
}

export default async function CheckoutReturn({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sessionId = searchParams.session_id;
  const uid = searchParams.uid;
  const session = await getSession(sessionId);

  console.log(session);

  if (session?.status === "open") {
    return <p>Payment did not work.</p>;
  }

  if (session?.status === "complete") {
    get(ref(db, "users/" + uid)).then((snapshot) => {
      var userdata = snapshot.val();
      console.log(userdata);
      if (userdata && userdata.balance !== undefined) {
        var newbalance = parseInt(userdata.balance) + 1000000;
        update(ref(db, "users/" + uid), {
          balance: newbalance,
        });
      } else {
        console.error("User data is null or does not contain a balance field");
        // Handle the case where userdata is null or does not have a balance field
      }
    });

    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-sm p-10">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Thank You For You business!
          </h1>
          <a href="/dashboard"><Button>Update Account And Return Home</Button></a>
          
        </Card>
      </div>
    );
  }

  return null;
}
