import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkoutByDate, saveWorkout, deleteWorkout } from "../utils/workoutStorage";

/**
 * WorkoutNotes Page
 * A minimalist interface to log workout details for a specific date.
 * Strictly follows FitMart Design System (stone palette, DM Serif Display headings).
 */
export default function WorkoutNotes() {
  const { date } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const workout = getWorkoutByDate(date);
    if (workout) {
      setTitle(workout.title || "");
      setDetails(workout.details || "");
    }
  }, [date]);

  const handleSave = () => {
    saveWorkout(date, { title, details });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this workout entry?")) {
      deleteWorkout(date);
      setTitle("");
      setDetails("");
      navigate("/home");
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-stone-50 font-['DM_Sans',sans-serif]">
      <Navbar variant="product" />

      <main className="max-w-3xl mx-auto px-5 lg:px-10 py-16">
        {/* Back Link */}
        <button
          onClick={() => navigate("/home")}
          className="text-xs tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors mb-12 flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Routine
        </button>

        <div className="bg-white border border-stone-200 rounded-2xl p-8 md:p-10 shadow-sm transition-all duration-300">
          <header className="mb-10 border-b border-stone-100 pb-8">
            <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-2">Workout Memo</p>
            <h1 className="font-['DM_Serif_Display'] text-3xl md:text-4xl text-stone-900 leading-tight">
              {formattedDate}
            </h1>
          </header>

          <div className="space-y-8">
            {/* Title Input */}
            <div>
              <label className="block text-xs text-stone-500 mb-2 tracking-wide uppercase">
                Workout Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chest & Triceps / Morning Run"
                className="w-full border border-stone-200 bg-white rounded-lg px-4 py-3 text-sm text-stone-900 
                           placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>

            {/* Details Area */}
            <div>
              <label className="block text-xs text-stone-500 mb-2 tracking-wide uppercase">
                Training Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="List exercises, weight, and repetitions..."
                rows={10}
                className="w-full border border-stone-200 bg-white rounded-lg px-4 py-3 text-sm text-stone-900 
                           placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={handleSave}
                className="bg-stone-900 text-white text-sm px-8 py-3 rounded-full hover:bg-stone-700 
                           transition-colors font-medium min-w-[160px]"
              >
                {saved ? "Saved ✓" : "Save Workout"}
              </button>

              <button
                onClick={handleDelete}
                className="border border-stone-200 text-stone-400 text-sm px-8 py-3 rounded-full 
                           hover:bg-stone-100 hover:text-stone-700 hover:border-stone-300 transition-all font-medium"
              >
                Clear Log
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
