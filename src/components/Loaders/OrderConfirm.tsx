// components/OrderButton.tsx
"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

const OrderButton: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const truckRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const checkmarkRef = useRef<SVGPolylineElement>(null);
  const defaultTextRef = useRef<HTMLSpanElement>(null);
  const successTextRef = useRef<HTMLSpanElement>(null);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setIsAnimating(false), 2000);
      },
    });

    tl.set(checkmarkRef.current, { strokeDashoffset: 16 });

    tl.to(defaultTextRef.current, {
      opacity: 0,
      duration: 0.3,
    });

    tl.to(
      boxRef.current,
      {
        x: 112,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      },
      0.1
    )
      .to(boxRef.current, {
        opacity: 0,
        duration: 0.2,
      })
      .set(boxRef.current, { x: 0 });

    tl.to(
      truckRef.current,
      {
        x: -164,
        duration: 0.6,
        ease: "power2.inOut",
      },
      0.1
    )
      .to(truckRef.current, {
        x: -104,
        duration: 0.4,
        ease: "power2.inOut",
      })
      .to(truckRef.current, {
        x: -224,
        duration: 0.6,
        ease: "power2.inOut",
      })
      .to(truckRef.current, {
        x: 0,
        duration: 0.6,
        ease: "power2.out",
      });

    tl.fromTo(
      linesRef.current,
      { opacity: 0, x: 0 },
      { opacity: 1, x: -400, duration: 1.6, ease: "power2.inOut" },
      0.2
    );

    tl.to(successTextRef.current, {
      opacity: 1,
      duration: 0.3,
      delay: 6.5,
    });

    tl.to(checkmarkRef.current, {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <button
      className="relative h-16 w-60 bg-[#1C212E] rounded-full overflow-hidden text-white select-none"
      onClick={handleClick}
    >
      {/* Default and Success Text */}
      <span
        ref={defaultTextRef}
        className="absolute inset-0 top-[19px] text-center text-base font-medium transition-opacity"
      >
        Complete Order
      </span>
      <span
        ref={successTextRef}
        className="absolute inset-0 top-[19px] text-center text-base font-medium opacity-0 transition-opacity flex justify-center items-center gap-1"
      >
        Order Placed
        <svg
          viewBox="0 0 12 10"
          className="w-3 h-2.5 stroke-green-500 fill-none"
        >
          <polyline
            ref={checkmarkRef}
            points="1.5 6 4.5 9 10.5 1"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="16"
            strokeDashoffset="16"
          />
        </svg>
      </span>

      {/* Box */}
      <div
        ref={boxRef}
        className="absolute w-[21px] h-[21px] top-[21px] right-full bg-gradient-to-b from-[#EDD9A9] to-[#DCB773] rounded-sm opacity-0"
      />

      {/* Truck */}
      <div
        ref={truckRef}
        className="absolute left-full top-[11px] w-[60px] h-[41px] translate-x-6 z-10"
      >
        <div className="absolute w-full h-full bg-gradient-to-b from-white to-gray-200 rounded-sm"></div>
        <div className="absolute left-[60px] w-[26px] h-[41px] overflow-hidden rounded-r-xl">
          <div className="absolute left-0 top-[14px] w-[2px] h-[13px] bg-gradient-to-b from-gray-500 to-gray-700" />
          <div className="absolute right-0 w-[24px] h-full bg-blue-600 rounded-r-xl" />
          <div className="absolute top-0 left-[2px] w-[22px] h-full bg-blue-300 rounded-r-lg">
            <div className="absolute right-0 w-[14px] h-full bg-[#1C212E]" />
            <div className="absolute right-0 top-[7px] w-[14px] h-[4px] skew-y-[14deg] bg-white/20 shadow-[0_7px_0_rgba(255,255,255,0.14)]" />
          </div>
        </div>
        <div className="absolute w-[3px] h-[8px] bg-yellow-300 rounded left-[83px] top-[4px]" />
        <div className="absolute w-[3px] h-[8px] bg-yellow-300 rounded left-[83px] bottom-[4px]" />
      </div>

      {/* Lines */}
      <div
        ref={linesRef}
        className="absolute top-[30px] left-full w-[6px] h-[3px] bg-white rounded-sm opacity-0 shadow-[15px_0_0_white,30px_0_0_white,45px_0_0_white,60px_0_0_white,75px_0_0_white,90px_0_0_white,105px_0_0_white,120px_0_0_white,135px_0_0_white,150px_0_0_white,165px_0_0_white,180px_0_0_white,195px_0_0_white,210px_0_0_white,225px_0_0_white,240px_0_0_white,255px_0_0_white,270px_0_0_white,285px_0_0_white,300px_0_0_white,315px_0_0_white,330px_0_0_white]"
      />
    </button>
  );
};

export default OrderButton;
