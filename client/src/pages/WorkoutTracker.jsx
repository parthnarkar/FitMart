import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import WorkoutCalendar from "../components/WorkoutCalendar";

/**
 * WorkoutTracker Page
 * Dedicated page for the fitness calendar.
 * Maintains FitMart's editorial layout and minimalism.
 */
export default function WorkoutTracker() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 font-['DM_Sans',sans-serif]">
      <Navbar variant="home" />

      <main className="max-w-7xl mx-auto px-5 lg:px-10 py-16">
        {/* Navigation / Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <button
              onClick={() => navigate("/home")}
              className="text-xs tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors mb-4 flex items-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
            </button>
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2 font-medium">Personal Progress</p>
            <h1 className="font-['DM_Serif_Display'] text-4xl md:text-5xl lg:text-6xl text-stone-900 leading-tight">
              Workout tracker
            </h1>
          </div>
          
          <p className="text-sm text-stone-500 max-w-xs leading-relaxed md:text-right">
            Plan your sessions, log your PRs, and visualize your consistency in one minimalist view.
          </p>
        </div>

        {/* The Calendar Component */}
        <section className="fade-in show">
          <WorkoutCalendar />
        </section>
      </main>
    </div>
  );
}
