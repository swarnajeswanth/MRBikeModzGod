// components/PageContentTransition.tsx
"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { startLoading, stopLoading } from "@/components/store/LoadingSlice";

export default function PageTransitionWrapper() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      dispatch(startLoading());
      // Simulate loading delay for demo; in real app, tie to data fetching
      setTimeout(() => {
        dispatch(stopLoading());
      }, 600);
      prevPath.current = pathname;
    }
  }, [pathname, dispatch]);

  return null; // This component doesn't render anything
}
