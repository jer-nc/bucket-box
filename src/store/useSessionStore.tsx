import { create } from 'zustand';


interface UserSessionState {
    currentProfile: string;
    profiles: string[];
    setCurrentProfile: (profile: string) => void;
    setProfiles: (newProfiles: string[]) => void;
    changeProfile: (selectedProfile: string) => void;
}

export const useUserSessionStore = create<UserSessionState>((set) => ({
    currentProfile: "AWS Profile",
    profiles: [],
    setCurrentProfile: (profile) => set({ currentProfile: profile }),
    setProfiles: (newProfiles) => set({ profiles: newProfiles }),
    changeProfile: (selectedProfile) => {
        set({ currentProfile: selectedProfile });
        localStorage.setItem("aws-profile", selectedProfile);
    },
}));