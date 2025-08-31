"use client";

import { useState, useEffect } from "react";
import { UserEvent } from "@/lib/types";
import { getUserById } from "@/lib/persist-module";

const eventTexts = [
  "{0} logged in",
  "{0} signed up",
  "{0} added {1} of {2} to their cart",
];

function formatString(template: string, ...args: any[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== "undefined" ? args[index] : match;
  });
}

export default async function Page() {
  const [loadedUserEmails, setLoadedUserEmails] = useState<{
    [key: number]: string;
  }>({});
  const [events, setEvents] = useState<UserEvent[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await updateEvents();
    }, 2000);
  });

  async function updateEvents() {
    setEvents([]); // TODO: Replace with a server call
  }

  async function getEmail(userId: number) {
    const loadedEmail = loadedUserEmails[userId];

    if (loadedEmail) {
      return loadedEmail;
    }

    setLoadedUserEmails(async (curr) => {
      curr[userId] = (await getUserById(userId))?.email ?? "Invalid User";
      return curr;
    });
  }

  return <div>This is the admin panel page</div>;
}
