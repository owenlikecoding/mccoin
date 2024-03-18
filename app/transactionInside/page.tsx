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
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  getDatabase,
  ref,
  onValue,
  off,
  DataSnapshot,
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
  const [step, setStep] = useState(1);
  const [userNames, setUserNames] = useState<string[]>([]);
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValue(value);
    const filtered = userNames.filter((name) =>
      name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredNames(filtered);
    setTransactionDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 1) {
      // Assuming the name input field's name attribute is "name"
      // This will update the transactionDetails with the selected name
      setTransactionDetails((prevDetails) => ({
        ...prevDetails,
        recipient: inputValue,
      }));
    }
    setStep(step + 1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card>
        {step === 1 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <CardHeader>
              <CardTitle>Who Are we Sending McCoins?</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="name">Name</Label>
              <CommandInput
                id="name"
                name="name"
                placeholder="Name"
                value={inputValue}
                onChange={handleInputChange}
              />
              {filteredNames.length > 0 && (
                <CommandList>
                  {filteredNames.map((name, index) => (
                    <Command
                      key={index}
                      onClick={() => setInputValue(name)}
                      className="flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent"
                    >
                      {name.length > 20 ? `${name.substring(0, 20)}...` : name}
                    </Command>
                  ))}
                </CommandList>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Next
              </Button>
            </CardFooter>
          </form>
        ) : step === 2 ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
            </CardHeader>

            <CardContent>
              <label htmlFor="recipent">To</label>
              <Input
                id="recipient"
                name="recipient"
                placeholder="Recipient"
                value={transactionDetails.recipient}
                onChange={handleInputChange}
                disabled
              />
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="Amount"
                type="number"
                onChange={handleInputChange}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit">Next</Button>
            </CardFooter>
          </form>
        ) : (
          <div>
            <CardHeader>
              <CardTitle>Confirm Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Recipient: {transactionDetails.recipient}</p>
              <p>Amount: {transactionDetails.amount}</p>
              {transactionDetails.description && (
                <p>Description: {transactionDetails.description}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit">Submit</Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
}
