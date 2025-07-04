"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ZapOff, Bolt, Skull, Flame, AlertTriangle } from "lucide-react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice"; // Adjust path if needed
import { useTransition } from "react";
const NotFound = () => {
  const router = useRouter();
  const [isShocked, setIsShocked] = useState(false);
  const [isChewing, setIsChewing] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();

  const handleBackHome = () => {
    dispatch(startLoading());
    startTransition(() => {
      router.push(`/`);
      // stopLoading should ideally happen after route load
      // but for now we simulate delay if needed
      setTimeout(() => {
        dispatch(stopLoading());
      }, 800); // adjust if your route loads slowly
    });
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const shockInterval = setInterval(() => {
      setIsChewing(false);
      setIsShocked(true);
      setTimeout(() => {
        setIsShocked(false);
        setTimeout(() => {
          setIsChewing(true);
        }, 1000);
      }, 2000);
    }, 6000);

    return () => clearInterval(shockInterval);
  }, []);

  const handleGoHome = () => {
    handleBackHome();
  };

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Background electric sparks */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse ${
              isShocked ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.5 + Math.random() * 1}s`,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10 px-4">
        {/* 404 Title */}
        <div className="relative mb-8">
          <h1
            className={`text-8xl md:text-9xl font-bold text-white transition-all duration-300 ${
              isShocked
                ? "text-yellow-400 drop-shadow-[0_0_20px_rgba(255,255,0,0.7)] animate-pulse"
                : "text-white"
            }`}
          >
            404
          </h1>
          {isShocked && (
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-yellow-300 opacity-50 animate-ping">
              404
            </div>
          )}
        </div>

        {/* Caveman Character */}
        <div className="relative mx-auto mb-8 w-32 h-32">
          <div
            className={`w-24 h-32 mx-auto relative transition-all duration-300 ${
              isShocked ? "animate-bounce scale-110" : ""
            }`}
          >
            {/* Head */}
            <div
              className={`w-16 h-16 rounded-full bg-amber-600 mx-auto mb-2 relative ${
                isShocked ? "bg-yellow-300" : ""
              } transition-colors duration-200`}
            >
              <div className="absolute -top-2 left-2 w-12 h-6 bg-amber-800 rounded-t-xl"></div>

              {/* Eyes */}
              <div
                className={`absolute top-4 left-3 w-2 h-2 bg-black rounded-full ${
                  isShocked ? "animate-spin" : ""
                }`}
              ></div>
              <div
                className={`absolute top-4 right-3 w-2 h-2 bg-black rounded-full ${
                  isShocked ? "animate-spin" : ""
                }`}
              ></div>

              {/* Mouth */}
              <div
                className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                  isChewing
                    ? "w-3 h-2 bg-amber-900 rounded-full animate-pulse"
                    : isShocked
                    ? "w-4 h-4 bg-black rounded-full"
                    : "w-2 h-1 bg-amber-900 rounded-full"
                }`}
              ></div>
            </div>

            {/* Body */}
            <div
              className={`w-12 h-16 bg-amber-700 mx-auto rounded-b-lg ${
                isShocked ? "bg-yellow-400" : ""
              } transition-colors duration-200`}
            >
              {/* Arms */}
              <div
                className={`absolute top-8 -left-2 w-6 h-3 bg-amber-600 rounded-full transform ${
                  isChewing
                    ? "rotate-12 animate-pulse"
                    : isShocked
                    ? "rotate-45"
                    : "rotate-0"
                } transition-transform duration-300`}
              ></div>
              <div
                className={`absolute top-8 -right-2 w-6 h-3 bg-amber-600 rounded-full transform ${
                  isChewing
                    ? "-rotate-12 animate-pulse"
                    : isShocked
                    ? "-rotate-45"
                    : "rotate-0"
                } transition-transform duration-300`}
              ></div>
            </div>
          </div>

          {/* Wire */}
          <div
            className={`absolute top-12 right-8 w-8 h-1 bg-gray-600 transform rotate-45 ${
              isChewing ? "animate-pulse" : ""
            }`}
          >
            <div
              className={`w-full h-full bg-gradient-to-r from-gray-600 to-gray-400 ${
                isShocked ? "bg-yellow-400 shadow-yellow-400 shadow-md" : ""
              } transition-all duration-200`}
            ></div>
          </div>

          {/* Electric sparks with Lucide icons */}
          {isShocked && (
            <>
              <div className="absolute -top-2 -left-2 text-yellow-400 animate-ping">
                <Bolt size={16} />
              </div>
              <div
                className="absolute -top-2 -right-2 text-red-400 animate-ping"
                style={{ animationDelay: "0.2s" }}
              >
                <Skull size={16} />
              </div>
              <div
                className="absolute -bottom-2 left-4 text-orange-400 animate-ping"
                style={{ animationDelay: "0.4s" }}
              >
                <Flame size={16} />
              </div>
              <div
                className="absolute -bottom-2 right-4 text-yellow-300 animate-ping"
                style={{ animationDelay: "0.6s" }}
              >
                <ZapOff size={16} />
              </div>
            </>
          )}
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-300 text-lg mb-2">
            {isChewing && "Our caveman is still learning about technology..."}
            {isShocked && "ZZZZAP! That wire had more juice than expected!"}
            {!isChewing &&
              !isShocked &&
              "Maybe stick to stone tablets next time?"}
          </p>
          <p className="text-gray-400">
            The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Home Button */}
        <button
          onClick={handleGoHome}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Go Home
        </button>

        {/* Fun Fact */}
        <div className="mt-8 text-gray-500 text-sm max-w-md mx-auto">
          <p>
            💡 Fun fact: Early humans discovered electricity by accident too,
            but they didn't have circuit breakers!
          </p>
        </div>
      </div>

      {/* Lightning effect overlay */}
      {isShocked && (
        <div className="absolute inset-0 bg-white opacity-10 animate-pulse pointer-events-none"></div>
      )}
    </div>
  );
};

export default NotFound;
