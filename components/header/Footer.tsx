import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Twitch, Check } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-12 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Trust Bar - Matches Reference Image */}
        <div className="flex justify-center items-center gap-12 mb-12 border-b border-neutral-800 pb-8 text-sm">
          <div className="flex items-center gap-2"><Check size={16} /> Money-Back Guarantee</div>
          <div className="flex items-center gap-2"><Check size={16} /> Free Shipping Over $49</div>
          <div className="flex items-center gap-2"><Check size={16} /> 2-Year Warranty</div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-bold mb-4 text-[#b87422]">Company</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>About Us</li>
              <li>Leadership</li>
              <li>Press</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>FAQ</li>
              <li>Patents</li>
              <li>Store Finder</li>
              <li>Reviews</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-[#b87422]">Customer Experience</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>Manage Orders</li>
              <li>Military</li>
              <li>First Responders</li>
              <li>Healthcare Workers</li>
              <li>Warranty & Return</li>
              <li>Waterproof Disclaimer</li>
              <li>Accessibility</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 text-[#b87422]">Privacy & Terms</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>Terms of Use & Sale</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
              <li>CA Supply Chains Act</li>
              <li>CA Notice at Collection</li>
              <li>CA Do Not Sell or Share Personal Information</li>
              <li>CA Limit Use of Sensitive Personal Information</li>
              <li>Privacy Preferences</li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-neutral-800 pt-12">
          <div>
            <h3 className="font-bold mb-4">Get early access to new products</h3>
            <input type="email" placeholder="YOUR EMAIL*" className="w-full p-3 bg-transparent border border-neutral-600 text-white mb-4 placeholder-neutral-500" />
            <button className="bg-[#b87422] text-white px-10 py-3 font-bold uppercase tracking-wide">Submit</button>
            <p className="text-[11px] text-neutral-500 mt-4 leading-relaxed max-w-md">By entering your email you agree to receive emails from MANSCAPED about its products, offers and promotions. You can unsubscribe at anytime.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Follow us on social</h3>
            <div className="flex gap-4 mb-8 text-neutral-400">
              <Facebook size={20} />
              <Instagram size={20} />
              <Twitter size={20} />
              <Youtube size={20} />
              <Twitch size={20} />
            </div>
            <h3 className="font-bold mb-4">Accepted payment methods</h3>
            <div className="flex gap-2 text-3xl">
              <span>💳</span> {/* Replace with actual icon set if available */}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between text-xs text-neutral-500">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4 md:mb-0">
            <span className="font-black text-xl text-white">MANSCAPED</span>
            <p>Copyright © 2026, Manscaped. All Rights Reserved</p>
          </div>
          <div className="flex gap-4">
            <span>Warranty & Return</span>
            <span>Terms of Use and Sale</span>
            <span>Privacy Policy</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
