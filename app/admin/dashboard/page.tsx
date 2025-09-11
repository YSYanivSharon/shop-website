"use client";

import { useState, useEffect } from "react";
import { UserEvent } from "@/lib/types";
import { getUserById, getLatestUserEvents } from "@/lib/persist-module";
import { Input } from "@headlessui/react";

const eventTemplates = [
  "logged in",
  "signed up",
  "logged out",
  "added {0} of {1} to their cart",
  "set the amount of {0} to {1} in their cart",
  "removed {0} from their cart",
  "added {0} to their wishlist",
  "removed {0} from their wishlist",
  "bought {0} items for ₪{1}",
];

function formatString(template: string, details: string[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    return typeof details[index] !== "undefined" ? details[index] : match;
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
  const [filterQuery, setFilterQuery] = useState<string>("");

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
      <div className="flex justify-end mb-5 p-1">
        <p>Filter:</p>
        <div className="size-2" />
        <Input
          className="bg-gray-200 dark:bg-gray-700 rounded-md"
          value={filterQuery}
          type="text"
          onChange={(e) => {
            setFilterQuery(e?.target.value);
          }}
        />
      </div>
      <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-md">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left w-auto whitespace-nowrap">
              Date
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left w-auto whitespace-nowrap">
              User
            </th>
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left w-full">
              Message
            </th>
          </tr>
        </thead>
        <tbody>
          {events
            .filter((event) => getEmail(event.userId).startsWith(filterQuery))
            .map((event) => (
              <tr
                key={event.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 w-auto whitespace-nowrap">
                  {new Date(event.date).toLocaleString()}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 w-auto whitespace-nowrap">
                  {getEmail(event.userId)}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 w-full">
                  {getEventMessage(event)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
