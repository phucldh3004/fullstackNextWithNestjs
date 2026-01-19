import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        
        {/* Header with Logout */}
        <div className="w-full flex justify-between items-center mb-8">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <LogoutButton />
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          {/* Welcome Message */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              ✨ Đã đăng nhập thành công!
            </span>
          </div>

          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Chào mừng đến với Dashboard
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Bạn đã đăng nhập thành công với cookie-based authentication. 
            Access token được lưu an toàn trong HTTP-only cookie.
          </p>

          {/* Features */}
          <div className="w-full mt-8 space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔒 Bảo mật cao
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Token được lưu trong HTTP-only cookie, không thể truy cập qua JavaScript
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                🚀 Auto-redirect
              </h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Middleware tự động kiểm tra authentication và redirect về login nếu cần
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ⚡ Server-side
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Cookie được set từ server-side, bảo mật hơn localStorage
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row w-full mt-8">
          <Link
            href="/hello"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
          >
            Hello Page
          </Link>
          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
