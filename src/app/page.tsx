import { BackgroundLines } from "@/components/ui/background-lines";
import LoginForm from "@/components/admin/layout/login/page";
import Image from "next/image";

export default function LoginPage() {
  return (
    <BackgroundLines className="w-full min-h-svh">
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 relative z-10">
        <div className="flex w-full max-w-md flex-col gap-6">
          <a href="/" className="flex items-center gap-2 self-center font-medium">
            <Image
              src="/images/logo-masjid.png"
              alt="Logo Masjid"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <span className="text-lg font-semibold">Masjid Jawahiruzzarqa</span>
          </a>
          <LoginForm />
        </div>
      </div>
    </BackgroundLines>
  );
}