
// Third-party libraries
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from 'next/dynamic';

const Wheel = dynamic(() => import('react-custom-roulette').then(mod => mod.Wheel), { ssr: false });

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
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveScatterPlot } from "@nivo/scatterplot";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { Dice1, Dice5, Dice6, MountainIcon, Menu, ShipWheel } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import Cookies from "js-cookie";

// Firebase and Utilities
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { useEffect, useState } from "react";

// Local Components
import { RecentTransactions } from "./recentTransactions";

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

interface Package2IconProps extends React.SVGProps<SVGSVGElement> { }

const db = getDatabase(app);

const uid = Cookies.get("uid");

get(ref(db, "users/" + uid)).then((snapshot) => {
    console.log(snapshot.val());
});


const data = [
    { option: '100 McCoins' },
    { option: '50 McCoins' },
    { option: '20 McCoins' },
    { option: '90 McCoins' },
    { option: '120 McCoins' },
    { option: '80 McCoins' },
    { option: '30 McCoins' },
    { option: '70 McCoins' },
    { option: '100 McCoins' },
    { option: '10 McCoins' },
    { option: '110 McCoins' },
    { option: '0 McCoins' },
];


export default function Sidebar() {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const handleSpinClick = () => {
        get(ref(db, "users/" + uid)).then((snapshot) => {
            const userData = snapshot.val();
            if (userData && userData.balance) {
                if (userData.balance >= 100) {
                    setBalance(userData.balance - 100);
                    set(ref(db, "users/" + uid + "/balance"), userData.balance - 100);
                    const newPrizeNumber = Math.floor(Math.random() * data.length);
                    setPrizeNumber(newPrizeNumber);
                    setMustSpin(true);
                } else {
                    alert("You don't have enough McCoins to spin the wheel.");
                    return;
                }
            } else {
                console.log("goofy account");
            }
        });
    };

    const [username, setUsername] = useState("");
    const [balance, setBalance] = useState(0);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true); // Add loading state
    const [profilePictureUrl, setProfilePictureUrl] = useState("");
    const [currentBalance, setCurrentBalance] = useState(0);

    const toggle = () => setModal(!modal);

    const logout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            Cookies.remove("uid");
            window.location.href = "/signin"; // Adjust the path as needed
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        const uid = Cookies.get("uid");
        if (uid) {
            setLoading(true); // Set loading to true before fetching data
            get(ref(db, "users/" + uid)).then((snapshot) => {
                const userData = snapshot.val();
                if (userData && userData.name) {
                    setUsername(userData.name);
                } else {
                    console.log("goofy account");
                }
                if (userData && userData.balance) {
                    setBalance(userData.balance);
                } else {
                    console.log("goofy account");
                }
                if (userData && userData.profile_picture) {
                    setProfilePictureUrl(userData.profile_picture);
                    console.log("midget");
                }
                if (userData && userData.balance) {
                    setCurrentBalance(userData.balance);
                }

                else {
                }
                setLoading(false); // Set loading to false after data is fetched
            });
        } else {
            // Handle the case where uid is not available
            console.log("UID not found in cookies");
            setLoading(false); // Set loading to false if uid is not available
            window.location.href = "/signin"; // Redirect to login page
        }
    }, []);

    if (loading) {
        return <div className="loading-bar"></div>;
    }

    return (
        <div
            className={`grid min-h-screen w-full lg:grid-cols-[280px_1fr] ${modal ? "hidden" : ""
                }`}
        >
            <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-[60px] items-center border-b px-6">
                        <Link className="flex items-center gap-2 font-semibold" href="#">
                            <MountainIcon className="h-6 w-6" />
                            <span className="">McCoin 1.0</span>
                        </Link>
                        <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
                            <BellIcon className="h-4 w-4" />
                            <span className="sr-only">Toggle notifications</span>
                        </Button>
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <nav className="grid items-start px-4 text-sm font-medium">
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                href="/dashboard"
                            >
                                <HomeIcon className="h-4 w-4" />
                                Home
                            </Link>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                href="/shop"
                            >
                                <LineChartIcon className="h-4 w-4" />
                                Buy McCoins
                            </Link>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                href="/game"
                            >
                                <PlayIcon className="h-4 w-4" />
                                Game
                            </Link>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                href="/buy"
                            >
                                <ShoppingCartIcon className="h-4 w-4" />
                                Buy
                            </Link>
                            <Link
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                                href="/gamble"
                            >
                                <Dice5 className="h-4 w-4" />
                                Gamble
                            </Link>
                            <Link
                                className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
                                href="/wheel"
                            >
                                <ShipWheel className="h-4 w-4" />
                                Wheel
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
                    <Link className="lg:hidden" href="/mobileNavbar">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Home</span>
                    </Link>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input
                                    className="w-full bg-white shadow-none appearance-none pl-8 md:w-2/3 lg:w-1/3 dark:bg-gray-950"
                                    placeholder="Search"
                                    type="search"
                                />
                            </div>
                        </form>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
                                size="icon"
                                variant="ghost"
                            >
                                <img
                                    alt="Avatar"
                                    className="rounded-full"
                                    height="32"
                                    src={profilePictureUrl}
                                    style={{
                                        aspectRatio: "32/32",
                                        objectFit: "cover",
                                    }}
                                    width="32"
                                />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href="/settings">
                                <span>
                                    <DropdownMenuItem>Settings</DropdownMenuItem>
                                </span>
                            </Link>
                            <Link href="/support">
                                <span>
                                    <DropdownMenuItem>Support</DropdownMenuItem>
                                </span>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex items-center justify-center min-h-screen">
                    <h1>Current Balance:</h1>
                    <h2>{balance} McCoins</h2>
                    <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={data}
                        onStopSpinning={() => {
                            setMustSpin(false);
                            // Determine the prize amount based on the prizeNumber
                            const prizeAmount = data[prizeNumber].option.split(' ')[0]; // Assuming the format is "X McCoins"
                            // Update the user's balance in the database
                            get(ref(db, "users/" + uid)).then((snapshot) => {
                                const userData = snapshot.val();
                                if (userData && userData.balance) {
                                    // Add the prize amount to the user's balance
                                    const newBalance = userData.balance + parseInt(prizeAmount);
                                    set(ref(db, "users/" + uid + "/balance"), newBalance);
                                    // Optionally, update the balance state in the UI
                                    setBalance(newBalance);
                                    alert(`You won ${prizeAmount} McCoins! Your new balance is ${newBalance} McCoins.`);
                                } else {
                                    console.error("Error updating balance");
                                }
                            });
                        }}
                    />
                    <Button onClick={handleSpinClick}>Spin For 100 McCoins</Button>
                </main>
            </div>
        </div >
    );
}

function Package2Icon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
            <path d="M12 3v6" />
        </svg>
    );
}

function BellIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
    );
}

function HomeIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function LineChartIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
        </svg>
    );
}

function PlayIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    );
}

function ShoppingCartIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    );
}

function SearchIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function ArrowLeftIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    );
}

function CalendarClockIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h5" />
            <path d="M17.5 17.5 16 16.25V14" />
            <path d="M22 16a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
        </svg>
    );
}

function mountinIcon(props: Package2IconProps) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}