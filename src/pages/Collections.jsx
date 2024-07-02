import React, {useState, useEffect} from 'react'
import axios from 'axios'

function Collections() {
  const [data, setData] = useState([])
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/dailycollections');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);
  return (
    <div>Collections</div>
  )
}

export default Collections