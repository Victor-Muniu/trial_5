import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Creditors = () => {
  const [data, setData] = useState([]);


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/creditors');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, []);
  

  return (
    <div></div>
  );
};

export default Creditors;
