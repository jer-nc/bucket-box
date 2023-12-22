import { create } from 'zustand';


interface BucketStore {
    currentBucketRegion: string;
    setCurrentBucketRegion: (region: string) => void;
}

export const useBucketStore = create<BucketStore>((set) => ({
    currentBucketRegion: '',
    setCurrentBucketRegion: (region) => set({ currentBucketRegion: region }),
}));
