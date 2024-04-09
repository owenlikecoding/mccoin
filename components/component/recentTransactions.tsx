import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, child, get} from "firebase/database";
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
const uid = Cookies.get("uid");

export function RecentTransactions() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  // Inside your RecentTransactions component

// Inside your RecentTransactions component
React.useEffect(() => {
 const db = getDatabase();
 const transactionsRef = ref(db, "transactions");

 onValue(transactionsRef, async (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const transactionsArray: Transaction[] = [];
      const usersRef = ref(db, "users"); // Reference to the users folder

      // Assuming data is an object where each key is a transaction ID
      for (const transactionId in data) {
        const transactionData = data[transactionId];
        const senderRef = child(usersRef, transactionData.sender); // Reference to the sender in the users folder
        const recipientRef = child(usersRef, transactionData.recipient); // Reference to the recipient in the users folder

        const senderSnapshot = await get(senderRef);
        const recipientSnapshot = await get(recipientRef);

        const senderName = senderSnapshot.exists() ? senderSnapshot.val().name : 'Unknown Sender';
        const recipientName = recipientSnapshot.exists() ? recipientSnapshot.val().name : 'Unknown Recipient';

        const transaction: Transaction = {
          id: transactionId,
          amount: transactionData.amount,
          date: transactionData.date,
          uid: transactionData.uid,
          recipient: recipientName,
          sender: transactionData.sender,
        };

        // Check if the transaction is related to the current user
        if (transaction.sender === uid || transaction.recipient === uid) {
          transactionsArray.push(transaction);
        }
      }

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
        {transactions.slice(0, 3).map((transaction) => (
          <div key={transaction.id} className="mb-4 p-4 border border-gray-200 rounded">
            <h2 className="font-bold">Transaction ID {transaction.id}</h2>
            <p>Recipient: {transaction.recipient}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Date: {new Date(transaction.date).toLocaleString()}</p>
            <p className={transaction.sender === uid ? "text-green-500" : "text-red-500"}>
              {transaction.sender === uid ? "Credit" : "Debit"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
