import Link from 'next/link';
import { Search, User, ShoppingBag, Globe, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full sticky top-0 z-50 font-sans">
      {/* Top utility / announcement bar (black background, white text) */}
      <div className="bg-black text-white text-[12px] h-[36px] flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center space-x-6">
          <span className="cursor-pointer hover:underline">Support</span>
          <span className="cursor-pointer hover:underline">Track Order</span>
          <span className="cursor-pointer hover:underline">Subscriptions</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="#" className="hover:underline">Unlock Rewards</Link>
          <Link href="#" className="hover:underline">Our Cause</Link>
          <Link href="#" className="hover:underline font-semibold">Sale</Link>
          <div className="flex items-center space-x-1 cursor-pointer hover:opacity-80">
            <Globe className="w-3.5 h-3.5" />
            <span>EN</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (white background, dark text) */}
      <div className="bg-white border-b border-neutral-200 h-[68px] flex items-center justify-between px-4 sm:px-8">
        {/* Left: Mobile Menu + Navigation Links */}
        <div className="flex items-center space-x-8">
          <button className="lg:hidden p-1 text-neutral-800" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
          
          <nav className="hidden lg:flex items-center space-x-7 text-[15px] font-medium text-neutral-900 tracking-wide">
            <Link href="#" className="hover:text-neutral-600 transition-colors">Male Grooming</Link>
            <Link href="#" className="hover:text-neutral-600 transition-colors">Manscaped Lab</Link>
            <Link href="#" className="hover:text-neutral-600 transition-colors">Deals & Kits</Link>
            <Link href="#" className="hover:text-neutral-600 transition-colors">Quiz</Link>
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="text-[22px] font-black tracking-[0.1em] uppercase text-black">
            MANSCAPED
          </Link>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-5 text-neutral-900">
          <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors hidden sm:block" aria-label="Account">
            <User className="w-5 h-5" />
          </button>
          <Link href="#" className="p-2 hover:bg-neutral-100 rounded-full transition-colors relative" aria-label="Cart">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
