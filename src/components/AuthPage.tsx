"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Mail, Lock } from "lucide-react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin);

const chars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';
const BLINK_SPEED = 0.075;
const TOGGLE_SPEED = 0.2;
const ENCRYPT_SPEED = 0.6;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [busy, setBusy] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [password, setPassword] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const eyeRef = useRef<SVGGElement>(null);
  const proxyRef = useRef<HTMLDivElement | null>(null);
  const shouldBlink = useRef(true);

  useEffect(() => {
    const proxy = document.createElement("div");
    proxy.style.position = "absolute";
    proxy.style.top = "-9999px";
    proxy.style.left = "-9999px";

    proxy.style.whiteSpace = "pre";
    document.body.appendChild(proxy);
    proxyRef.current = proxy;

    return () => {
      proxy.remove();
    };
  }, []);

  const blinkTlRef = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    // Eye starts open
    gsap.set(".eye", { opacity: 1 });
    gsap.set(".lid--upper", {
      morphSVG: "M1 12C1 12 5 4 12 4C19 4 23 12 23 12",
    });
    shouldBlink.current = true;
  }, []);

  const startBlink = () => {
    if (!shouldBlink.current) return;

    const duration = BLINK_SPEED;
    const delay = gsap.utils.random(2, 6);

    blinkTlRef.current = gsap.timeline({
      delay,
      onComplete: () => {
        gsap.set(".lid--upper", {
          morphSVG: "M1 12C1 12 5 4 12 4C19 4 23 12 23 12", // reset
        });
        startBlink(); // recursive if allowed
      },
    });

    blinkTlRef.current
      .to(".lid--upper", { morphSVG: ".lid--lower", duration })
      .to(".eye", { opacity: 0, duration }, 0)
      .to(".eye", { opacity: 1, duration }, duration);
  };

  useEffect(() => {
    startBlink();

    const moveEye = (e: PointerEvent) => {
      const eye = eyeRef.current;
      if (!eye) return;

      const posMapper = gsap.utils.mapRange(-100, 100, 30, -30);
      const bounds = eye.getBoundingClientRect();
      const xPercent = gsap.utils.clamp(
        -30,
        30,
        posMapper(bounds.x - e.clientX)
      );
      const yPercent = gsap.utils.clamp(
        -30,
        30,
        posMapper(bounds.y - e.clientY)
      );

      gsap.set(eye, { xPercent, yPercent });
      gsap.delayedCall(2, () =>
        gsap.to(eye, { xPercent: 0, yPercent: 0, duration: 0.2 })
      );
    };

    window.addEventListener("pointermove", moveEye);
    return () => {
      window.removeEventListener("pointermove", moveEye);
      blinkTlRef.current?.kill();
    };
  }, []);
  const handleToggle = () => {
    if (!inputRef.current || !proxyRef.current) return;

    const input = inputRef.current;
    const proxy = proxyRef.current;
    const isRevealing = !isPasswordVisible;

    // Toggle blinking
    shouldBlink.current = isRevealing;
    if (!isRevealing) {
      blinkTlRef.current?.pause();
    } else {
      startBlink();
    }

    // Animate eyelid and eye
    gsap.to(".lid--upper", {
      morphSVG: isRevealing ? ".lid--upper" : ".lid--lower",
      duration: TOGGLE_SPEED,
    });

    gsap.to(".eye", {
      opacity: isRevealing ? 1 : 0,
      duration: TOGGLE_SPEED,
    });

    const fromText = input.value;
    const toText = isRevealing ? password : "•".repeat(password.length);

    proxy.innerHTML = fromText;

    gsap.to(proxy, {
      duration: ENCRYPT_SPEED,
      scrambleText: {
        text: toText,
        chars,
      },
      onUpdate: () => {
        if (inputRef.current) {
          inputRef.current.value = proxy.innerText;
        }
      },
      onComplete: () => {
        if (inputRef.current) {
          inputRef.current.value = toText;
        }
        setIsPasswordVisible(isRevealing);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600/20 to-transparent text-white px-4 z-90">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-red-600/20">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div>
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full mt-1 px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 mt-1 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                defaultValue=""
                onChange={(e) => {
                  const newValue = e.target.value;
                  setPassword(newValue);
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 mt-1 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              />

              <button
                type="button"
                title="Toggle Password"
                aria-pressed={isPasswordVisible}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-white"
                onClick={handleToggle}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    className="lid lid--upper"
                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    className="lid lid--lower"
                    d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g className="eye" ref={eyeRef}>
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <circle cx="13" cy="11" r="1" fill="black" />
                  </g>
                </svg>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 transition duration-200 text-white py-3 rounded-lg font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-400 hover:underline ml-1"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
