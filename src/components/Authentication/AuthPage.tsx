"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Authentication/useAuth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "@/components/Loaders/LoadingSpinner";

gsap.registerPlugin(ScrambleTextPlugin, MorphSVGPlugin);

const chars =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`~,.<>?/;":][}{+_)(*&^%$#@!±=-§';
const BLINK_SPEED = 0.075;
const TOGGLE_SPEED = 0.2;
const ENCRYPT_SPEED = 0.6;
const FLIP_DURATION = 0.6;

const AuthPage = () => {
  const {
    isAuthenticated,
    login,
    signup,
    allowGuestBrowsing,
    requireLoginForPurchase,
  } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [busy, setBusy] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "retailer">(
    "customer"
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const eyeRef = useRef<SVGGElement>(null);
  const proxyRef = useRef<HTMLDivElement | null>(null);
  const shouldBlink = useRef(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rehydrated, setRehydrated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);

    const email = (
      (e.currentTarget as HTMLFormElement).querySelector(
        'input[type="email"]'
      ) as HTMLInputElement
    ).value;
    const password = inputRef.current?.value || "";

    let success = false;
    try {
      if (isLogin) {
        success = await login(email, password, selectedRole);
        if (success) toast.success("Logged in successfully!");
      } else {
        success = await signup({
          username: email,
          password,
          role: selectedRole,
          // add other fields here if needed
        });
        if (success) {
          toast.success("Signup successful! Logging you in...");
          success = await login(email, password, selectedRole);
        }
      }

      if (success) {
        router.push("/dashboard");
      } else {
        toast.error("Authentication failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Auth Error", error);
    }

    setBusy(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/"); // Redirect to home or dashboard
    }
  }, [isAuthenticated, router]);

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

  const handleCardFlip = () => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const isFlippingToLogin = !isLogin;

    // Create flip animation
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLogin(isFlippingToLogin);
      },
    });

    // First half of flip (rotate to 90 degrees)
    tl.to(card, {
      rotateY: 90,
      duration: FLIP_DURATION / 2,
      ease: "power2.inOut",
      onComplete: () => {
        // Change content during the flip
        const title = card.querySelector("h2");
        const submitBtn = card.querySelector('button[type="submit"]');
        const toggleBtn = card.querySelector(".toggle-btn");

        if (title) {
          title.textContent = isFlippingToLogin
            ? "Welcome Back"
            : "Create an Account";
        }
        if (submitBtn) {
          submitBtn.textContent = isFlippingToLogin ? "Login" : "Register";
        }
        if (toggleBtn) {
          toggleBtn.textContent = isFlippingToLogin ? "Sign Up" : "Sign In";
        }
      },
    })
      // Second half of flip (rotate to 180 degrees)
      .to(card, {
        rotateY: 180,
        duration: FLIP_DURATION / 2,
        ease: "power2.inOut",
      })
      // Reset rotation
      .to(card, {
        rotateY: 0,
        duration: 0,
      });
  };

  useEffect(() => {
    // Wait for Redux Persist rehydration
    const unsub = (window as any).store?.subscribe?.(() => {
      const state = (window as any).store?.getState?.();
      if (state && state._persist && state._persist.rehydrated) {
        setRehydrated(true);
        unsub?.();
      }
    });
    // Fallback: set rehydrated after short delay if not using store on window
    setTimeout(() => setRehydrated(true), 1000);
    return () => unsub?.();
  }, []);

  if (!rehydrated) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return null; // Prevent render flicker
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600/20 to-transparent text-white px-4 z-90 perspective-1000">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-2xl border border-red-600/20 transform-style-preserve-3d transition-transform duration-300"
        style={{ transformStyle: "preserve-3d" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>

        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
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

          <div>
            <label className="text-sm text-gray-300">Account Type</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value as "customer" | "retailer")
                }
                className="w-full pl-10 pr-4 py-3 mt-1 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 appearance-none cursor-pointer"
              >
                <option value="customer">Customer</option>
                <option value="retailer">Retailer</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
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
            disabled={busy}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition duration-200 text-white py-3 rounded-lg font-semibold"
          >
            {busy ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={handleCardFlip}
            className="text-red-400 hover:underline ml-1 toggle-btn"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
