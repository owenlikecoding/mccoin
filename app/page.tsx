import Link from "next/link";

// Assuming Input and Button components are already optimized for Tailwind CSS
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MountainIconProps extends React.SVGProps<SVGSVGElement> {}

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen">
      {" "}
      {/* Use min-h-screen for full viewport height */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link href="#" className="flex items-center justify-center">
          <MountainIcon className="h-6 w-6" aria-hidden="true" />
          <span className="sr-only">McCoin Inc</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {/* Use Tailwind CSS for styling links */}
          <Link href="#" className="text-sm font-medium hover:text-opacity-75">
            Features
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-opacity-75">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-opacity-75">
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-opacity-75">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto flex flex-col items-center justify-center space-y-4 px-4 md:px-6">
            <div className="flex items-center justify-center">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  The Digital {""}
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                    Currency
                  </span>{" "}
                  Of Innovation
                </h1>
                <p className="mx-auto max-w-prose text-gray-500 text-base md:text-lg dark:text-gray-400">
                  The simplist way to enter cyptocurrency. Without the crypto
                  side.
                </p>
              </div>
            </div>
            <form className="w-full max-w-md flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button type="submit">Get Started</Button>
            </form>
          </div>
        </section>
      </main>
      <footer className="py-6 w-full border-t">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 McCoin Inc. All rights reserved.
          </p>
          <nav className="flex gap-4 mt-4 sm:mt-0">
            <Link href="#" className="text-xs hover:text-opacity-75">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs hover:text-opacity-75">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function MountainIcon(props: MountainIconProps) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
