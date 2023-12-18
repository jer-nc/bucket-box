import  { useEffect } from 'react';

import { useUserSessionStore } from '@/store/useSessionStore';
import { getAllProfiles } from '@/cli-functions/getAllProfiles';

function useUserSession() {
    const { currentProfile, profiles, setCurrentProfile, setProfiles, changeProfile } = useUserSessionStore();


    async function getCurrentProfile() {
        try {
            const fetchedProfiles = await getAllProfiles();
            console.log('Fetched Profiles', fetchedProfiles);
            setProfiles(fetchedProfiles);
            return fetchedProfiles;
        } catch (error) {
            console.error("Error fetching profiles:", error);
            return [];
        }
    }

    useEffect(() => {
        const localStorageProfile = localStorage.getItem("aws-profile");

        const setProfileFromLocalStorage = () => {
            if (localStorageProfile !== null) {
                setCurrentProfile(localStorageProfile);
            } else {
                getCurrentProfile().then((fetchedProfiles) => {
                    // Setting default profile if fetchedProfiles is empty
                    const defaultProfile = fetchedProfiles.length > 0 ? fetchedProfiles[0] : "AWS Profile";
                    setCurrentProfile(defaultProfile);
                    localStorage.setItem("aws-profile", defaultProfile);
                });
            }
        };

        
        getAllProfiles().then((fetchedProfiles) => {
            setProfiles(fetchedProfiles);
        });
        
        setProfileFromLocalStorage();
    }, []);
    
    // const changeProfile = (selectedProfile: string) => {
    //     setCurrentProfile(selectedProfile);
    //     localStorage.setItem("aws-profile", selectedProfile);
    // };


    return {
        currentProfile,
        profiles,
        changeProfile
    };
}

export default useUserSession;
