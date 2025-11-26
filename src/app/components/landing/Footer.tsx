import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#FDFBF7] border-t border-orange-100/50 pt-20 pb-10 overflow-hidden">      
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-yellow-100/30 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 rounded-xl bg-white border border-orange-100 p-1.5 shadow-sm">
                    <img src="/LearnWai/images/Logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-krona text-xl text-neutral-900">LearnWAI</span>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Your AI Study Buddy. Simplifying education for everyone, everywhere.
            </p>
          </div>
          <div className="hidden md:block md:col-span-1" />
          <div>
            <h4 className="font-bold text-neutral-900 mb-4 font-krona text-sm tracking-wide">Product</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
                <li><Link href="/LearnWai/#features" className="hover:text-orange-600 transition-colors">Features</Link></li>
                <li><Link href="/LearnWai/register" className="hover:text-orange-600 transition-colors">Get Started</Link></li>
                <li><Link href="/LearnWai/login" className="hover:text-orange-600 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-900 mb-4 font-krona text-sm tracking-wide">Legal</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
                <li><a href="/LearnWai/#" className="hover:text-orange-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/LearnWai/#" className="hover:text-orange-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-orange-100/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
            <p>© 2025 LearnWAI Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}