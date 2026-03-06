import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAxios(axiosParams) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (params = axiosParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios(params);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (axiosParams) {
      fetchData();
    }
  }, []);

  return { data, error, loading, refetch: fetchData };
}
