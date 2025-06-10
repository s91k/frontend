import { useState, useEffect } from "react";

export const useNewsletters = async () => {
  const [newslettersData, setNewslettersData] = useState([]);
  const url = "http://localhost:3000/api/newsletters";

  useEffect(() => {

    const fetchNewsletters = async () => {
        try {
          const response = await fetch(url);
    
          if (response) {
            const result = await response.json();
    
            if (result) {
                console.log(result)
              return result;
            }
          }
        } catch (err) {
          console.log(err);
        }
    }

    fetchNewsletters();
  }, []);
};
