/**
 * Utility for managing workout logs in localStorage.
 * Aligned with specific user requirements for Notes and Titles.
 */

const STORAGE_KEY = 'fitmart_workout_logs';

/**
 * Retrieves all stored workout logs.
 */
export const getWorkoutLogs = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

/**
 * Alias for getWorkoutLogs as requested.
 */
export const getWorkouts = getWorkoutLogs;

/**
 * Retrieves workout data for a specific date (YYYY-MM-DD).
 */
export const getWorkoutByDate = (date) => {
  const logs = getWorkoutLogs();
  return logs[date] || null;
};

/**
 * Saves a workout entry.
 * Expects: { date, title, notes }
 */
export const saveWorkout = (entry) => {
  const { date, title, notes } = entry;
  const logs = getWorkoutLogs();
  logs[date] = { title, notes };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

/**
 * Removes a workout entry for a date.
 */
export const deleteWorkout = (date) => {
  const logs = getWorkoutLogs();
  delete logs[date];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

/**
 * Formats data specifically for FullCalendar events list.
 */
export const getAllWorkoutEvents = () => {
  const logs = getWorkoutLogs();
  return Object.keys(logs).map(date => ({
    title: logs[date].title || 'Logged Workout',
    date: date, // FullCalendar can use 'date' or 'start'
    allDay: true,
  }));
};
