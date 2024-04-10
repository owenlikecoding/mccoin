"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAnalytics } from "firebase/analytics";
import  AdBanner from "@/components/adBanner";

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
import { Dice1, Dice5, Dice6, MountainIcon, Weight, Menu } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import Cookies from "js-cookie";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

import { useEffect, useState } from "react";

import {
  Button as Cuttin,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

import { RecentTransactions } from "./recentTransactions";
import { Roboto_Mono } from "next/font/google";

const rm = Roboto_Mono({ weight: '400', subsets: ['latin', 'latin-ext'] });

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
// Check if window is defined (i.e., we are in a browser environment)
if (typeof window !== 'undefined') {
  // Your code that uses window here
  const analytics = getAnalytics(app);
}

const uid = Cookies.get("uid");

get(ref(db, "users/" + uid)).then((snapshot) => {
  console.log(snapshot.val());
});

// Rename the function to start with an uppercase letter
// Rename the function to start with an uppercase letter
export default function Sidebar() {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const greetings = ["Sup", "Hello", "Hi", "Hey", "Yo", "Greetings", "Howdy", "Hola", "Bonjour", "Ciao"];
  const [randomGreeting, setRandomGreeting] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setRandomGreeting(greetings[randomIndex]);

    // Set up an interval to change the greeting every 5 seconds
    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * greetings.length);
      setRandomGreeting(greetings[randomIndex]);
    }, 3000); // 5000 milliseconds = 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this effect runs once on mount

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
        } else {
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

          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              <Link
                className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2 text-gray-900  transition-all hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:text-gray-50"
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
        <main
          className={`flex-1 p-4 md:p-6 flex justify-center items-center ${modal ? "hidden" : ""
            }`}
        >
          <div className="flex flex-col lg:flex-row justify-between">
            <div>
              <div className="greeting-container">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  {randomGreeting} {username}
                </h1>
                <AdBanner
                  dataAdFormat="auto"
                  dataFullWidthResponsive={true}
                  dataAdSlot="4284247248"
                />
              </div>
              <p className="leading-7 [&:not(:first-child)]:mt-6 font-roboto-mono">
                You have <span className="font-semibold" >{balance}</span>{" "}
                McCoins
              </p>
              <div className="mobile-note">
                <p>Some features may not be available on mobile</p>
              </div>
              <Link href="/transactionInside">
                <Button className="mt-2">Create Transaction</Button>
              </Link>
              <Button color="primary" onClick={toggle} className="m-1">
                Show Recent Transactions
              </Button>

              <Modal isOpen={modal} toggle={toggle} className="flex items-center justify-center min-h-screen">
                <div className="bg-zinc-500 p-6 rounded shadow-lg">
                  <ModalBody>
                    <RecentTransactions />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={toggle} className="mt-2">
                      Close
                    </Button>
                  </ModalFooter>
                </div>
              </Modal>
            </div>
          </div>
        </main>
      </div>
    </div>
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
