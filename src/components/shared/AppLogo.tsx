// src/components/shared/AppLogo.tsx 
import Image from "next/image";
import Link from "next/link";

interface AppLogoProps {
  className?: string;
  showText?: boolean;
}

export function AppLogo({ className = "", showText = true }: AppLogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 font-medium hover:opacity-80 transition-opacity ${className}`}
    >
      <Image
        src="/images/logo-masjid.png"
        alt="Logo Masjid Jawahiruzzarqa"
        width={40}
        height={40}
        className="object-contain"
        priority
      />
      {showText && (
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Masjid Jawahiruzzarqa
        </span>
      )}
    </Link>
  );
}