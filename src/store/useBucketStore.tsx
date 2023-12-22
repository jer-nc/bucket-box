import { Bucket } from '@/lib/app';
import { create } from 'zustand';


interface BucketStore {
    buckets: Bucket[];
    setBuckets: (buckets: Bucket[]) => void;
    currentBucketRegion: string;
    setCurrentBucketRegion: (region: string) => void;
}

export const useBucketStore = create<BucketStore>((set) => ({
    buckets: [],
    setBuckets: (buckets) => set({ buckets }),
    currentBucketRegion: '',
    setCurrentBucketRegion: (region) => set({ currentBucketRegion: region }),
}));
