"use client";

import Image from "next/image";
import { useState } from "react";

export function SiteLogo() {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <span className="text-sm font-medium uppercase tracking-[0.28em] text-[var(--foreground)]">
        Planet2x
      </span>
    );
  }

  return (
    <Image
      alt="Planet2x"
      className="h-auto w-[138px] sm:w-[154px]"
      height={52}
      onError={() => setImageFailed(true)}
      priority
      src="/brand/logos/planet2x-logo-white-transparent.png"
      width={420}
    />
  );
}
