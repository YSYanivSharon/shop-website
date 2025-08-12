"use client";

import { logout } from "@/app/components/user-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    logout();
    router.replace("/");
  }, [router]);

  return null;
}
