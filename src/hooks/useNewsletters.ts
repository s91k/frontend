import { useQuery } from "@tanstack/react-query";

const fetchNewsletters = async () => {
    const url = "http://localhost:3000/api/newsletters";
  try {
    const response = await fetch(url)

    if (response.ok) {
      const result = await response.json()
            console.log(result)
      return result;
    }
  } catch (err) {
    console.log(err)
  }
}

export const useNewsletters = () => {
    const {data, isLoading, isError} = useQuery({
        queryFn: () => fetchNewsletters(),
        queryKey: ["newsletters"]
      })

    return{ data, isLoading, isError};
};
