import React, {useState, useEffect} from 'react'
import axios from 'axios'

function HouseKeeping() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/reservations');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);

  return (
    <div>HouseKeeping</div>
  )
}

export default HouseKeeping