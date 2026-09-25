import React from "react";
import Image from "next/image";
import Link from "next/link";

interface VerdaliaLogoProps {
  variant?: "header" | "footer" | "hero" | "admin" | "compact";
  className?: string;
  href?: string;
  showTagline?: boolean;
}

export const VerdaliaLogo: React.FC<VerdaliaLogoProps> = ({
  variant = "header",
  className = "",
  href = "/",
  showTagline = false,
}) => {
  const sizeClass =
    variant === "compact"
      ? "h-10 w-auto"
      : variant === "footer"
      ? "h-14 w-auto"
      : variant === "admin"
      ? "h-11 w-auto"
      : "h-11 md:h-12 w-auto";

  // Slight brighten on dark footer so green mark stays readable
  const toneClass =
    variant === "footer" || variant === "admin"
      ? "brightness-110 contrast-105"
      : "";

  const content = (
    <div
      className={`inline-flex items-center gap-2.5 select-none transition-opacity hover:opacity-90 ${className}`}
    >
      <Image
        src="/images/verdalia-logo.png"
        alt="Verdalia Company VC — Huile d'olive Tunisie | Tunisian olive oil exporter"
        width={variant === "footer" ? 160 : variant === "compact" ? 120 : 148}
        height={variant === "footer" ? 56 : variant === "compact" ? 40 : 48}
        className={`${sizeClass} object-contain bg-transparent ${toneClass}`}
        priority={variant === "header"}
      />
      {variant === "header" && (
        <div className="flex flex-col justify-center">
          <span className="font-serif font-extrabold text-[15px] sm:text-[18px] tracking-[0.08em] text-verdalia-dark leading-none uppercase">
            Verdalia
          </span>
          <span className="text-[7.5px] sm:text-[9px] uppercase tracking-[0.22em] text-verdalia-gold font-bold mt-0.5">
            Company VC
          </span>
        </div>
      )}
      {showTagline && (
        <span className="hidden sm:inline font-sans text-[7.5px] uppercase tracking-[0.18em] text-verdalia-gray">
          Tunisia · Export
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
