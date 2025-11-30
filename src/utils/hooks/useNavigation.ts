"use client";

import { useRouter } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  const handleHome = () => {
    router.push('/')
  }

  return {
    handleHome,
    router
  };
};