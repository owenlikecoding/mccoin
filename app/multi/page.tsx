"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
    PopoverTrigger,
    PopoverContent,
    Popover,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
    CardDescription,
    CardTitle,
    CardHeader,
    CardContent,
    Card,
} from "@/components/ui/card";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, update } from "firebase/database";
import { useEffect, useState } from "react";
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
const uid = Cookies.get("uid");


export default function Multi() {
    useEffect(() => {
        // Code to run on component mount goes here
    }, []);

    const buyMulti = () => {
        get(ref(db, "users/" + uid)).then((snapshot) => {
            const userData = snapshot.val();
            const balance = userData.balance;
            if (balance >= 7000) {
                update(ref(db, "users/" + uid), {
                    balance: balance - 7000,
                    multiplier: 1.5
                });
                alert("Purchase successful.");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 500);
            }
            else {
                alert("Not enough McCoins.");
            }

        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="p-10">
                <CardTitle>
                    1.5 Times Multiplier
                </CardTitle>
                <CardDescription className="mt-1">
                    7,000 McCoins.
                </CardDescription>
                <Button className="mt-2" onClick={buyMulti}>
                    Buy
                </Button>
            </Card>
        </div>
    );



}
