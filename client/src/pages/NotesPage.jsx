// client\src\pages\NotesPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { getWorkoutByDate, saveWorkout, removeExerciseFromWorkout } from "../utils/workoutStorage";

/**
 * NotesPage
 * Allows users to write workout details for a selected date.
 * Supports adding exercises, viewing exercise GIFs, and managing workout details.
 * Preserves content when navigating between notes and exercise selection.
 */
export default function NotesPage() {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

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
      setExercises(workout.exercises || []);
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
      exercises,
    };

    // Save functionality
    saveWorkout(entry);
    setSaved(true);

    // Redirect to "/tracker" after a brief confirmation
    setTimeout(() => {
      navigate("/tracker");
    }, 1000);
  };

  const handleAddExercise = () => {
    // Note: We don't save here — user can add exercises and navigation back will reload from storage
    localStorage.setItem("selectedDate", date);
    navigate("/exercises");
  };

  const handleRemoveExercise = (exerciseId) => {
    removeExerciseFromWorkout(date, exerciseId);
    setExercises(exercises.filter(e => e.id !== exerciseId));
  };

  const handleImageError = (exerciseId) => {
    setImageErrors((prev) => new Set([...prev, exerciseId]));
  };

  const formattedDate = date ? new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }) : "";

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const slideUp = {
    hidden: { y: "100%" },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    },
    hover: {
      y: -4,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <motion.div
          className="max-w-md w-full bg-white border border-stone-200 rounded-2xl p-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            className="text-3xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
          >
            ∅
          </motion.p>
          <p className="text-stone-700 font-medium mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/tracker")}
            className="w-full bg-stone-900 text-white py-3 rounded-full hover:bg-stone-700 transition-all font-medium"
          >
            ← Back to Tracker
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-['DM_Sans',sans-serif] overflow-x-hidden">
      <Navbar variant="product" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ x: -4 }}
          onClick={() => navigate("/tracker")}
          className="text-xs tracking-[0.2em] uppercase text-stone-400 hover:text-stone-900 transition-colors mb-12 flex items-center gap-2 group"
        >
          <span>←</span> Back to Calendar
        </motion.button>

        <motion.div
          className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 md:p-10 shadow-sm"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.header
            className="mb-8 sm:mb-10 text-center md:text-left"
            variants={fadeUp}
          >
            <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-stone-400 mb-2 font-medium">Training Session For</p>
            <div className="hero-line overflow-hidden">
              <motion.h1
                className="font-['DM_Serif_Display'] text-2xl sm:text-3xl md:text-4xl text-stone-900"
                variants={slideUp}
              >
                {formattedDate}
              </motion.h1>
            </div>
          </motion.header>

          <div className="space-y-8">
            {/* Input field for "Workout Title" */}
            <motion.div variants={fadeUp}>
              <label className="block text-xs text-stone-500 mb-2 tracking-wide uppercase">
                Workout Title
              </label>
              <motion.input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chest Day"
                whileFocus={{ borderColor: "#1c1917" }}
                className="w-full border-b border-stone-200 bg-transparent py-3 text-2xl sm:text-3xl md:text-4xl text-stone-900 
                           font-['DM_Serif_Display'] placeholder-stone-200 focus:outline-none focus:border-stone-900 transition-colors"
              />
            </motion.div>

            {/* Textarea for "Workout Notes" */}
            <motion.div variants={fadeUp}>
              <label className="block text-xs text-stone-500 mb-2 tracking-wide uppercase">
                Workout Notes
              </label>
              <motion.textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="List exercises, weight, reps..."
                rows={12}
                whileFocus={{ borderColor: "#1c1917" }}
                className="w-full border border-stone-200 bg-white rounded-xl sm:rounded-2xl px-4 sm:px-6 py-4 sm:py-6 text-sm sm:text-base text-stone-700 
                           placeholder-stone-300 focus:outline-none focus:border-stone-900 transition-colors resize-none
                           min-h-[300px] sm:min-h-[450px] leading-relaxed"
              />
            </motion.div>

            {/* Selected Exercises Section */}
            {exercises && exercises.length > 0 && (
              <motion.div variants={fadeUp}>
                <label className="block text-xs text-stone-500 mb-4 tracking-wide uppercase">
                  Selected Exercises ({exercises.length})
                </label>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={staggerContainer}
                >
                  <AnimatePresence mode="popLayout">
                    {exercises.map((exercise) => (
                      <motion.div
                        key={exercise.id}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover="hover"
                        layout
                        className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden hover:border-stone-900 transition-all flex flex-col"
                      >
                        {/* Exercise Media Preview */}
                        <motion.div
                          className="w-full bg-stone-100 overflow-hidden aspect-video flex items-center justify-center"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.3 }}
                        >
                          {exercise.gifUrl && exercise.gifUrl.trim() !== "" && !imageErrors.has(exercise.id) ? (
                            <motion.img
                              src={exercise.gifUrl}
                              alt={exercise.name}
                              className="w-full h-full object-cover"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              onError={() => handleImageError(exercise.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-stone-100">
                              <div className="text-center">
                                <motion.p
                                  className="text-stone-400 text-2xl mb-1"
                                  animate={{ rotate: [0, 10, -10, 0] }}
                                  transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                  🏋️
                                </motion.p>
                                <p className="text-stone-400 text-xs uppercase tracking-wide font-medium">
                                  Exercise
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>

                        {/* Exercise Details */}
                        <div className="p-4 flex flex-col flex-grow">
                          <h4 className="font-['DM_Serif_Display'] text-base md:text-lg text-stone-900 mb-2 capitalize">
                            {exercise.name}
                          </h4>

                          <div className="space-y-1 text-xs text-stone-500 mb-4 flex-grow">
                            {exercise.target && (
                              <p>
                                <span className="uppercase tracking-wide">Target:</span>{" "}
                                <span className="text-stone-700 capitalize">{exercise.target}</span>
                              </p>
                            )}
                            {exercise.equipment && (
                              <p>
                                <span className="uppercase tracking-wide">Equipment:</span>{" "}
                                <span className="text-stone-700 capitalize">{exercise.equipment}</span>
                              </p>
                            )}
                            {exercise.bodyPart && (
                              <p>
                                <span className="uppercase tracking-wide">Body Part:</span>{" "}
                                <span className="text-stone-700 capitalize">{exercise.bodyPart}</span>
                              </p>
                            )}
                          </div>

                          <motion.button
                            onClick={() => handleRemoveExercise(exercise.id)}
                            whileHover={{ scale: 1.05, color: "#1c1917" }}
                            whileTap={{ scale: 0.95 }}
                            className="text-xs text-stone-500 hover:text-stone-700 font-medium uppercase tracking-wide transition-colors"
                          >
                            ✕ Remove
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {/* Add Exercise Button */}
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.02, backgroundColor: "#1c1917", color: "#ffffff" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddExercise}
              className="w-full bg-stone-100 text-stone-900 text-sm py-4 rounded-full transition-all font-medium border border-stone-200 hover:border-stone-900"
            >
              + Add Your Exercise
            </motion.button>

            {/* Save Button */}
            <motion.button
              variants={fadeUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              animate={saved ? { backgroundColor: "#44403c" } : {}}
              className={`w-full text-sm py-4 rounded-full transition-all font-medium
                         ${saved ? "bg-stone-700 text-stone-300" : "bg-stone-900 text-white hover:bg-stone-700 shadow-lg shadow-stone-200/50"}`}
            >
              {saved ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Saved ✓
                </motion.span>
              ) : (
                "Save Workout"
              )}
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}