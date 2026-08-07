import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchSurahMetadata, fetchAyah } from "../utils/api";

const BATCH_SIZE = 10;

export function useSurahFetcher(surahNumber) {
  // 1. Fetch Metadata
  const { data: surahMetadata, isLoading: loadingMeta } = useQuery({
    queryKey: ["surahMetadata", surahNumber],
    queryFn: () => fetchSurahMetadata(surahNumber),
  });

  // 2. Fetch Ayahs using Infinite Query
  const {
    data: ayahData,
    fetchNextPage,
    isFetchingNextPage,
    isLoading: loadingAyahs,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["ayahs", surahNumber],
    queryFn: async ({ pageParam = 0 }) => {
      if (!surahMetadata) return [];
      
      const startAyah = pageParam + 1;
      const endAyah = Math.min(pageParam + BATCH_SIZE, surahMetadata.totalAyah);
      
      if (startAyah > endAyah) return [];

      const promises = [];
      for (let i = startAyah; i <= endAyah; i++) {
        promises.push(fetchAyah(surahNumber, i));
      }
      return Promise.all(promises);
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!surahMetadata) return undefined;
      const totalFetched = allPages.flat().length;
      if (totalFetched >= surahMetadata.totalAyah) return undefined;
      return totalFetched; // Pass current length as the next pageParam
    },
    enabled: !!surahMetadata, // Wait until metadata is loaded
  });

  const ayahs = ayahData?.pages.flat() || [];

  return {
    ayahs,
    loading: loadingMeta || loadingAyahs,
    loadingMore: isFetchingNextPage,
    hasError: isError,
    surahMetadata,
    totalAyahCount: { current: surahMetadata?.totalAyah || 0 },
    currentBatchEnd: { current: ayahs.length },
    loadInitialData: () => {}, // No-op, react-query handles automatic fetching
    loadNextBatch: fetchNextPage,
    retryLoading: refetch,
  };
}
