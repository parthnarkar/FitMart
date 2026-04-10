import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // ← required for dateClick
import Navbar from "../components/Navbar";
import { getWorkouts } from "../utils/workoutStorage";

/**
 * TrackerPage
 * Displays a calendar where users can pick a date to log workouts.
 * dateClick requires @fullcalendar/interaction plugin.
 */
export default function TrackerPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const logs = getWorkouts();
    const workoutEvents = Object.keys(logs).map(date => ({
      title: logs[date].title,
      date: date,
    }));
    setEvents(workoutEvents);
  }, []);

  const handleDateClick = (info) => {
    console.log("Clicked date:", info.dateStr); // debug log
    localStorage.setItem("selectedDate", info.dateStr);
    navigate("/notes");
  };

  const handleEventClick = (arg) => {
    const dateStr = arg.event.startStr.split("T")[0]; // strip time if present
    console.log("Clicked event date:", dateStr);
    localStorage.setItem("selectedDate", dateStr);
    navigate("/notes");
  };

  return (
    <div className="min-h-screen bg-stone-50 font-['DM_Sans',sans-serif]">
      <Navbar variant="home" />

      <main className="max-w-7xl mx-auto px-5 lg:px-10 py-16">
        <header className="mb-12 text-center md:text-left">
          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2 font-medium">Personal Progress</p>
          <h1 className="font-['DM_Serif_Display'] text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
            Workout tracker
          </h1>
        </header>

        <section className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <style>{`
            .fc {
              --fc-button-bg-color: transparent;
              --fc-button-border-color: #e7e5e3;
              --fc-button-hover-bg-color: #f5f5f4;
              --fc-button-active-bg-color: #1c1917;
              --fc-button-active-border-color: #1c1917;
              --fc-button-text-color: #44403c;
              --fc-border-color: #f5f5f4;
              --fc-today-bg-color: #fafaf9;
              font-family: 'DM Sans', sans-serif;
            }
            .fc .fc-toolbar-title {
              font-family: 'DM Serif Display', serif;
              font-size: 1.25rem;
              color: #1c1917;
            }
            @media (min-width: 640px) {
              .fc .fc-toolbar-title { font-size: 1.5rem; }
            }
            .fc .fc-toolbar {
              flex-wrap: wrap;
              gap: 0.75rem;
            }
            .fc .fc-button-primary { border-radius: 9999px; font-size: 0.75rem; padding: 0.4rem 0.8rem; }
            @media (min-width: 640px) {
              .fc .fc-button-primary { font-size: 0.85rem; padding: 0.6rem 1rem; }
            }
            .fc .fc-button-primary:not(:disabled).fc-button-active { color: white; }
            .fc-event {
              cursor: pointer;
              background-color: #1c1917;
              border: none;
              border-radius: 6px;
              padding: 4px 10px;
              font-size: 0.75rem;
              font-weight: 500;
              color: white;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              transition: transform 0.2s ease, background 0.2s ease;
              margin: 2px 4px;
            }
            .fc-event:hover {
              background-color: #44403c;
              transform: translateY(-1px);
            }
            .fc-event-title {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .fc-daygrid-day { transition: background-color 0.2s ease; }
            .fc-daygrid-day:hover { background-color: #f5f5f4; cursor: pointer; }
            /* Ensure the day cell is fully clickable */
            .fc-daygrid-day-frame { cursor: pointer; }
          `}</style>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            aspectRatio={window.innerWidth < 768 ? 0.8 : 1.5}
            selectable={true}
          />

          <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900 animate-pulse"></span>
            <p className="text-[10px] text-stone-400 uppercase tracking-widest">Click any date to log a workout</p>
          </div>
        </section>
      </main>
    </div>
  );
}
