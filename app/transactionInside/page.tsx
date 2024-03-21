"use client";

import React, { useState, useEffect } from "react";
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
import {
  getDatabase,
  ref,
  onValue,
  off,
  DataSnapshot,
  get,
  update,
  push,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { initializeApp } from "firebase/app";
import Cookies from "js-cookie";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";

// Firebase configuration and initialization
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

export default function Component() {
  const [userNames, setUserNames] = useState<string[]>([]);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const [isAmountInputFocused, setIsAmountInputFocused] = useState(false);
  const [nameInputValue, setNameInputValue] = useState("");
  const [amountInputValue, setAmountInputValue] = useState("");
  const [transactionDetails, setTransactionDetails] = useState({
    name: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    recipient: "",
  });

  useEffect(() => {
    const usersRef = ref(db, "users");
    const handleUsers = (snapshot: DataSnapshot) => {
      const users = snapshot.val();
      const names = Object.keys(users).map((key) => users[key].name);
      setUserNames(names);
    };

    onValue(usersRef, handleUsers);

    return () => {
      off(usersRef, "value", handleUsers);
    };
  }, []);

  const fetchCurrentBalance = async () => {
    return get(ref(db, `users/${Cookies.get("uid")}/balance`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val();
        } else {
          return 0;
        }
      }
    );
  };

  const createTransaction = async (transactionDetails: any) => {
    const { recipient, amount, description, category } = transactionDetails;
    const sender = Cookies.get("uid");
    const senderRef = ref(db, `users/${sender}`);
    const recipientRef = ref(db, `users/${recipient}`);
    const senderBalance = await fetchCurrentBalance();
    const recipientBalance = await get(
      ref(db, `users/${recipient}/balance`)
    ).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return 0;
      }
    });

    if (senderBalance >= amount) {
      const newSenderBalance = senderBalance - amount;
      const newRecipientBalance = Number(recipientBalance) + Number(amount);

      // Update the sender's balance
      await update(ref(db, `users/${sender}/`), { balance: newSenderBalance });

      // Update the recipient's balance
      await update(ref(db, `users/${recipient}/`), {
        balance: newRecipientBalance,
      });

      // Create the transaction with the current date
      const currentDate = new Date().toISOString(); // This formats the date as an ISO string
      await push(ref(db, "transactions"), {
        sender,
        recipient,
        amount,
        description,
        category,
        date: currentDate, // Set the date here
      });

      setTimeout(() => {
        alert("Transaction successful!");
        window.location.href = "/dashboard";
      }, 500);
    } else {
      alert("Insufficient balance for this transaction.");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "name") {
      setNameInputValue(value);
      const filtered = userNames.filter((name) => name);
      setFilteredNames(filtered);
    }
    setTransactionDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };
  const getUserIdByName = async (name: string): Promise<string | null> => {
    const usersRef = ref(db, "users");
    const snapshot = await get(usersRef);

    const users = snapshot.val();
    const userIds = Object.keys(users);

    const userId = userIds.find((id) => users[id].name === name);
    console.log(userId);
    return userId || null;
  };

  const handleAmountInputFocus = () => setIsAmountInputFocused(true);
  const handleAmountInputBlur = () => setIsAmountInputFocused(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if the recipient's name has been resolved to a user ID
    const recipientId = await getUserIdByName(transactionDetails.name);
    if (!recipientId) {
      alert("Please select a valid recipient.");
      return;
    }

    // Check if the amount is a valid number
    const amount = parseFloat(transactionDetails.amount);
    if (isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    // Check if the sender has sufficient balance
    const currentBalance = await fetchCurrentBalance();
    if (currentBalance < amount) {
      alert("Insufficient balance for this transaction.");
      return;
    }

    // Proceed with creating the transaction
    createTransaction({ ...transactionDetails, recipient: recipientId });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardHeader>
            <CardTitle>Alright Lebronzo Who we Sending Mccoins to</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="name">Recipient</Label>
            <Input
              id="name"
              name="name"
              placeholder="Name"
              value={nameInputValue}
              onChange={handleInputChange}
            />
            {filteredNames.length > 0 && (
              <ul className="list-none">
                {filteredNames.map((name, index) => (
                  <li
                    key={index}
                    onClick={() => setNameInputValue(name)}
                    className="cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent"
                  >
                    {name.length > 20 ? `${name.substring(0, 20)}...` : name}
                  </li>
                ))}
              </ul>
            )}
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              placeholder="Amount"
              type="number"
              onChange={handleInputChange}
              onFocus={handleAmountInputFocus}
              onBlur={handleAmountInputBlur}
            />
            {/* Add other input fields for description, category, and date if needed */}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
