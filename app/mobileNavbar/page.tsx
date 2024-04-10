import Link from "next/link";

export default function MobileNav() {
    return (
        <div className="mobile-nav flex items-center justify-center h-screen">
            <ul className="flex flex-col space-y-2">
                <li className="hover-scale">
                    <Link href="/dashboard"><span>Dashboard</span></Link>
                </li>
                <li className="hover-scale">
                    <Link href="/buy"><span>Buy McCoins</span></Link>   
                </li>
                <li className="hover-scale">
                    <Link href="/game"><span>Game</span></Link>
                </li>
                <li className="hover-scale">
                    <Link href="/buy"><span>Buy</span></Link>
                </li>
                <li className="hover-scale">
                    <Link href="/gamble"><span>Gamble</span></Link>
                </li>
            </ul>
        </div>
    )
}