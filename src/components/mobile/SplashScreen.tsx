'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-[200px] h-[200px] relative">
        <Image
          src="/logo-yallah-nobg.png"
          alt="Yallah"
          width={200}
          height={200}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
} 