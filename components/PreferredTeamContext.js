import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "worldCupHubPreferredTeam";

const PreferredTeamContext = createContext({
  preferredTeam: null,
  setPreferredTeam: () => {},
  clearPreferredTeam: () => {},
});

export function PreferredTeamProvider({ children }) {
  const [preferredTeam, setPreferredTeamState] = useState(null);

  useEffect(() => {
    try {
      const savedTeam = window.localStorage.getItem(STORAGE_KEY);

      if (savedTeam) {
        setPreferredTeamState(JSON.parse(savedTeam));
      }
    } catch (error) {
      console.error("Unable to load preferred team", error);
    }
  }, []);

  const setPreferredTeam = (team) => {
    setPreferredTeamState(team);

    try {
      if (team) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch (error) {
      console.error("Unable to save preferred team", error);
    }
  };

  const value = useMemo(
    () => ({
      preferredTeam,
      setPreferredTeam,
      clearPreferredTeam: () => setPreferredTeam(null),
    }),
    [preferredTeam]
  );

  return (
    <PreferredTeamContext.Provider value={value}>
      {children}
    </PreferredTeamContext.Provider>
  );
}

export function usePreferredTeam() {
  return useContext(PreferredTeamContext);
}
