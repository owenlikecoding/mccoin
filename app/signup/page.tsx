/**
 * v0 by Vercel.
 * @see https://v0.dev/t/1BfvEqKcf2C
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="w-full py-12">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-4xl font-bold">Create an account</h1>{" "}
        <p className="text-gray-500 dark:text-gray-400">
          Already have an account? {" "}
          <Link className="underline" href="#">
            Sign in
          </Link>
        </p>
      </div>
      <div className="mx-auto max-w-[400px] space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input id="confirm-password" required type="password" />
          </div>
          <Button className="w-full">Sign Up</Button>
        </div>
      </div>
    </div>
  )
}
