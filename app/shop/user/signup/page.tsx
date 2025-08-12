"use client";

import { FormEvent, useState, useContext } from "react";
import { signup, UserContext } from "@/app/components/user-provider";
import { useRouter } from "next/navigation";

export default function Page() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const user = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signup(email, password);

    if (typeof result === "string") {
      // TODO: Handle signup fails
    } else {
      router.back();
    }
  };

  // If already signed in
  if (user) {
    router.back();
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            onChange={(e) => setEmail((prev) => e.target.value)}
          />
          <input
            name="password"
            onChange={(e) => setPassword((prev) => e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
