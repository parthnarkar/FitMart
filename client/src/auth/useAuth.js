import { useEffect, useState } from "react";
import { auth } from "./firebase";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { user };
};