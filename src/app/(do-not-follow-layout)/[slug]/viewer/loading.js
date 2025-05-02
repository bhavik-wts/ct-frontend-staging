"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function Loading() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    import("../../../../../public/images/LOADER.json").then((mod) => {
      setAnimationData(mod.default);
    });
  }, []);

  if (!animationData) return null;

  return (
    <div className="loader-center">
      <Lottie animationData={animationData} loop={true} style={{ width: 200 }} />
    </div>
  );
}
