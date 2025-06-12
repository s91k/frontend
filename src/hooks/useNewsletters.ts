import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";


export const useNewsletters = async () => {
  const [newslettersData, setNewslettersData] = useState([]);
  const url = "http://localhost:3000/api/newsletters";

  useEffect(() => {

    const fetchNewsletters = () => {

    }

    const {data: newsletters, isLoading} = useQuery({
        queryFn: () => fetchNewsletters(),
        queryKey: ["newsletters"]
      })

      
  
    fetchNewsletters();
  }, []);
};
