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

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

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

  const handleImageError = (exerciseId) => {
    setImageErrors(prev => new Set(prev).add(exerciseId));
  };

  const handleRemoveExercise = (exerciseId) => {
    const updatedExercises = removeExerciseFromWorkout(date, exerciseId);
    setExercises(updatedExercises);
  };

  const handleSave = () => {
    const workoutData = {
      date,
      title,
      notes,
      exercises
    };
    saveWorkout(workoutData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddExercise = () => {
    localStorage.setItem("returnToNotes", "true");
    navigate("/exercises");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-32 px-4 max-w-2xl mx-auto">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="space-y-8 md:space-y-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Date Display */}
            <motion.div variants={fadeUp} className="text-center">
              <p className="text-xs text-stone-500 tracking-wide uppercase mb-2">
                Workout for
              </p>
              <p className="text-2xl md:text-3xl font-['DM_Serif_Display'] text-stone-900">
                {date}
              </p>
            </motion.div>

            {/* Workout Title */}
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
                           min-h-75 sm:min-h-112.5 leading-relaxed"
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
                        <div className="p-4 flex flex-col grow">
                          <h4 className="font-['DM_Serif_Display'] text-base md:text-lg text-stone-900 mb-2 capitalize">
                            {exercise.name}
                          </h4>

                          <div className="space-y-1 text-xs text-stone-500 mb-4 grow">
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
          </motion.div>
        </div>
      </main>
    </div>
  );
}