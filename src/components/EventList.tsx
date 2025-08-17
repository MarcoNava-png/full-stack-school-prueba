"use client";

type Event = {
  id: number;
  title: string;
  description: string;
  startTime: Date;
};

const mockEvents: Event[] = [
  {
    id: 1,
    title: "Reunión de docentes",
    description: "Revisión de planes académicos.",
    startTime: new Date("2025-07-16T09:00:00"),
  },
  {
    id: 2,
    title: "Acto cívico escolar",
    description: "Ceremonia semanal en el patio principal.",
    startTime: new Date("2025-07-16T11:00:00"),
  },
];

const EventList = ({ dateParam }: { dateParam?: string }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const startOfDay = new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = new Date(date.setHours(23, 59, 59, 999));

  const eventsToday = mockEvents.filter(
    (event) =>
      event.startTime >= startOfDay && event.startTime <= endOfDay
  );

  return eventsToday.map((event) => (
    <div
      key={event.id}
      className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
    >
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-gray-600">{event.title}</h1>
        <span className="text-gray-300 text-xs">
          {event.startTime.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </span>
      </div>
      <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
    </div>
  ));
};

export default EventList;
