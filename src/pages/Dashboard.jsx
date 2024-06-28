import React from 'react'
import { Box } from '@mui/material'
import Restaurant from '../components/common/Restaurant'
import FoodProduction from './FoodProduction'
import InventoryTracker from './InventoryTracker'

function Dashboard() {
  const user = localStorage.getItem('role')
  

  return (
    <Box>
      {user === 'service' && (
        <Restaurant />
      )}
      {user === 'food production' && (
        <FoodProduction />
      )}
      {user === 'procurement' &&(
        <InventoryTracker />
      )}
    </Box>
  )
}

export default Dashboard