import { create } from 'zustand';


interface BucketStore {
    currentBucketRegion: string;
    setCurrentBucketRegion: (region: string) => void;
    isRefetching: boolean;
    setIsRefetching: (isRefetching: boolean) => void;
}

export const useBucketStore = create<BucketStore>((set) => ({
    currentBucketRegion: '',
    setCurrentBucketRegion: (region) => set({ currentBucketRegion: region }),
    isRefetching: false,
    setIsRefetching: (isRefetching) => set({ isRefetching }),
}));
