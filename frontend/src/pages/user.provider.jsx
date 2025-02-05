import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({ username: "Guest", email: "", mobile: "" });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
