import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserSessionStore } from "@/store/useSessionStore"


const UserListSelect = () => {
    const { currentProfile, profiles, changeProfile } = useUserSessionStore()

    // console.log('currentProfile', currentProfile);
    // console.log('profiles', profiles);

    const handleProfileChange = (value: string) => {
       console.log('value', value)
        const selectedProfile = value;
        changeProfile(selectedProfile);
    };


    return (
        <Select onValueChange={handleProfileChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={currentProfile} defaultValue={currentProfile} />
            </SelectTrigger>
            <SelectContent className="z-[120]">
                {profiles.length === 0 && (
                    <SelectItem value="no-profile" disabled>
                        No profiles found
                    </SelectItem>
                )}
                {profiles.map((profile, index) => (
                    <SelectItem key={index} value={profile.toLowerCase()}>
                        {profile}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

    )
}

export default UserListSelect