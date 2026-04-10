import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkoutByDate, saveWorkout } from "../utils/workoutStorage";

/**
 * NotesPage
 * Allows users to write workout details for a selected date.
 * Strictly follows Part 2 and Part 6 (edge cases) requirements.
 */
export default function NotesPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Get selectedDate from localStorage
    const storedDate = localStorage.getItem("selectedDate");
    if (!storedDate) {
      setError("No date selected. Please go back to the calendar and select a date.");
      return;
    }
    setDate(storedDate);

    // Pre-fill if data exists
    const workout = getWorkoutByDate(storedDate);
    if (workout) {
      setTitle(workout.title || "");
      setNotes(workout.notes || "");
    }
  }, []);

  const handleSave = () => {
    // Prevent saving empty title
    if (!title.trim()) {
      alert("Please enter a workout title.");
      return;
    }

    // Create entry object
    const entry = {
      date,
      title,
      notes,
    };

    // Save functionality
    saveWorkout(entry);
    setSaved(true);
    
    // Redirect to "/tracker" after a brief confirmation
    setTimeout(() => {
      navigate("/tracker");
    }, 1000);
  };

  const formattedDate = date ? new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-10 text-center">
          <p className="text-3xl mb-4">∅</p>
          <p className="text-stone-700 font-medium mb-6">{error}</p>
          <button
            onClick={() => navigate("/tracker")}
            className="w-full bg-stone-900 text-white py-3 rounded-full hover:bg-stone-700 transition-all font-medium"
          >
            ← Back to Tracker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-['DM_Sans',sans-serif]">
      <Navbar variant="product" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <button
          onClick={() => navigate("/tracker")}
          className="text-xs tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors mb-12 flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Calendar
        </button>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm">
          <header className="mb-8 sm:mb-10 text-center md:text-left">
            <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-stone-400 mb-2 font-medium">Training Session For</p>
            <h1 className="font-['DM_Serif_Display'] text-2xl sm:text-3xl md:text-4xl text-stone-900">{formattedDate}</h1>
          </header>

          <div className="space-y-8">
            {/* Input field for "Workout Title" */}
            <div>
              <label className="block text-xs text-stone-500 mb-2 tracking-wide uppercase">
                Workout Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chest Day"
                className="w-full border-b border-stone-200 bg-transparent py-3 text-2xl sm:text-3xl md:text-4xl text-stone-900 
                           font-['DM_Serif_Display'] placeholder-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>

            {/* Textarea for "Workout Notes" */}
            <div>
              <label className="block text-xs text-stone-500 mb-2 tracking-wide uppercase">
                Workout Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="List exercises, weight, reps..."
                rows={12}
                className="w-full border border-stone-200 bg-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-6 text-sm sm:text-base text-stone-700 
                           placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors resize-none
                           min-h-[300px] sm:min-h-[450px] leading-relaxed"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`w-full text-sm py-4 rounded-full transition-all font-medium
                         ${saved ? "bg-stone-700 text-stone-300" : "bg-stone-900 text-white hover:bg-stone-700 shadow-lg shadow-stone-200/50"}`}
            >
              {saved ? "Saved ✓" : "Save Workout"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
