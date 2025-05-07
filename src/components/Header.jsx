'use client'
import Link from 'next/link'
import Image from 'next/image'
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import userprofile from "../assets/userprofile.png"

function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <span className="text-2xl font-bold">Trupti Foodz</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/products" 
              className="text-gray-700 hover:text-gray-900"
            >
              Products
            </Link>
            <Link 
              href="/cart" 
              className="text-gray-700 hover:text-gray-900"
            >
             Cart 
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
            {isSignedIn ? (
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    avatarImage: "rounded-full"
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="cursor-pointer">
                  <Image 
                    src={userprofile}
                    alt="Sign In"
                    width={40}
                    height={40}
                    className="rounded-full hover:opacity-80 transition-opacity"
                  />
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
