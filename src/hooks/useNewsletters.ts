import { useQuery } from "@tanstack/react-query";
import { fetchNewsletters } from "@/lib/api";

export const useNewsletters = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: () => fetchNewsletters(),
    queryKey: ["newsletters"],
  });

  return { data, isLoading, isError };
};
