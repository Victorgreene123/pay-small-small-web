import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Landing Page Hero */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">PaySmallSmall</div>
          <div className="flex gap-4">
            <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 px-3 py-2 font-medium">
              Login
            </Link>
            <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight sm:text-6xl mb-6">
          Buy now, pay <span className="text-blue-600">small small.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          The easiest way to manage your purchases with flexible payment plans.
          Join thousands of users today.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
            Start Your Journey
          </Link>
        </div>
      </main>
    </div>
  );
}
