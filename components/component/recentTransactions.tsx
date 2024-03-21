import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import Cookies from "js-cookie"; // Import Cookies if using js-cookie
import React from "react";
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

interface Transaction {
  id: string;
  amount: number;
  date: string; // Assuming date is a string, adjust the type as necessary
  uid: string; // Add this line if 'uid' is part of the Transaction
  recipient: string;
  sender: string;
}
// Initialize Firebase with your config
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

export function RecentTransactions() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    const db = getDatabase();
    const transactionsRef = ref(db, "transactions");

    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transactionsArray: Transaction[] = [];
        snapshot.forEach((childSnapshot) => {
          const transaction: Transaction = childSnapshot.val();
          transaction.id = childSnapshot.key as string; // Use the child key as the transaction ID
          transactionsArray.push(transaction);
        });
        setTransactions(transactionsArray);
      } else {
        console.error("Data fetched from Firebase is not an object:", data);
        setTransactions([]);
      }
    });
  }, []);

  React.useEffect(() => {
    const uid = Cookies.get("uid");
    if (uid) {
      const matchingTransaction = transactions.find(
        (transaction) => transaction.sender === uid
      );
      if (matchingTransaction) {
        console.log("Matching transaction found:", matchingTransaction);
      } else {
        console.log("No matching transaction found");
      }
    }
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.map((transaction) => (
          <div key={transaction.id}>
            <h1>Recipient {transaction.recipient}</h1>
            <p>Amount: {transaction.amount}</p>
            <p>Date: {new Date(transaction.date).toLocaleString()}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button>View All</Button>
      </CardFooter>
    </Card>
  );
}
