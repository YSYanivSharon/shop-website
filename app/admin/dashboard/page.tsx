"use client";

import { useState, useEffect } from "react";
import { UserEvent } from "@/lib/types";
import { getUserById, getLatestUserEvents } from "@/lib/persist-module";

const eventTemplates = [
  "logged in",
  "signed up",
  "logged out",
  "added {0} of {1} to their cart",
  "set the amount of {0} to {1} in their cart",
  "removed {0} from their cart",
  "added {0} to their wishlist",
  "removed {0} from their wishlist",
];

function formatString(template: string, ...args: any[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== "undefined" ? args[index] : match;
  });
}

function getEventMessage(event: UserEvent) {
  return formatString(eventTemplates[event.eventType], event.details);
}

export default function Page() {
  const [loadedUserEmails, setLoadedUserEmails] = useState<{
    [key: number]: string;
  }>({});
  const [events, setEvents] = useState<UserEvent[]>([]);

  useEffect(() => {
    updateEvents();

    const interval = setInterval(async () => {
      updateEvents();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  async function updateEvents() {
    const newEvents = await getLatestUserEvents(1000);
    var newLoadedUserEmails = loadedUserEmails;
    var loadedNewEmails = false;

    for (const event of newEvents) {
      if (!(event.userId in newLoadedUserEmails)) {
        loadedNewEmails = true;
        newLoadedUserEmails[event.userId] =
          (await getUserById(event.userId))?.email ?? "Invalid User";
      }
    }

    if (loadedNewEmails) {
      setLoadedUserEmails(newLoadedUserEmails);
    }

    setEvents(newEvents);
  }

  function getEmail(userId: number) {
    var loadedEmail = loadedUserEmails[userId];

    if (loadedEmail) {
      return loadedEmail;
    }
    return `User ${userId}`;
  }

  return (
    <div>
      {events.map((event) => {
        return (
          <div key={event.id}>
            Date: {new Date(event.date).toLocaleString()}
            <br />
            User: {getEmail(event.userId)}
            <br />
            Message: {getEventMessage(event)}
          </div>
        );
      })}
    </div>
  );
}
