import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import WorkoutCalendar from "../components/WorkoutCalendar";

/**
 * TrackerPage
 * Dedicated page for the fitness calendar.
 * Maintains FitMart's editorial layout and minimalism.
 */
export default function TrackerPage() {
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
              className="text-xs tracking-[0.2em] uppercase text-stone-500 hover:text-stone-900 transition-all duration-300 mb-6 flex items-center gap-2 group px-4 py-2 border border-stone-200 hover:border-stone-400 rounded-full w-fit bg-white"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span> 
              <span>Back to Shop</span>
            </button>
            <div className="fade-in d1 show">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-stone-400 mb-3 font-semibold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse"></span>
                Personal Progress
              </p>
              <h1 className="font-['DM_Serif_Display'] text-4xl md:text-5xl lg:text-7xl text-stone-900 leading-[1.05] tracking-tight">
                Workout tracker
              </h1>
            </div>
          </div>
          
          <div className="fade-in d2 show max-w-sm md:text-right flex flex-col md:items-end mt-4 md:mt-0">
            <p className="text-sm text-stone-500 leading-relaxed bg-white border border-stone-100 p-4 rounded-2xl shadow-sm">
              Plan your sessions, log your PRs, and visualize your consistency in one minimalist view. Every day counts.
            </p>
          </div>
        </div>

        {/* The Calendar Component */}
        <section className="fade-in d3 show mt-8">
          <WorkoutCalendar />
        </section>
      </main>
    </div>
  );
}
