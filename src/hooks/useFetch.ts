import axios from "axios";
import { useEffect, useState } from "react"

const useFetch = (endpoint: string) => {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    const fetchData = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get(endpoint);
            setData(response.data.results);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [endpoint]);
    return { data, isLoading }
}

export default useFetch;