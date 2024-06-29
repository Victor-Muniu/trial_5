import React, {useState, useEffect} from 'react'
import axios from 'axios'
function ProfitLoss() {
    const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-12-31`);
  const [groupBy, setGroupBy] = useState('group_name');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/profitloss');
        setData(response.data);
      } catch (error) {
        console.error('There was a problem with the axios operation:', error);
      }
    };
    getData();
  }, [])
  return (
    <div>ProfitLoss</div>
  )
}

export default ProfitLoss