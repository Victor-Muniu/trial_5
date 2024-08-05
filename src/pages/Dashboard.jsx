import React from 'react'
import { Box } from '@mui/material'
import Restaurant from '../components/common/Restaurant'
import FoodProduction from './FoodProduction'
import InventoryTracker from './InventoryTracker'
import Accounts from './Accounts'
import HouseKeeping from './HouseKeeping'
import Reception from './Reception'

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
      {user === 'accounting' &&(
        <Accounts />
      )}
      {user === 'house keeping' &&(
        <HouseKeeping />
      )}
      {user === 'front office' &&(
        <Reception />
      )}
      {user === 'admin' && (
        <Restaurant />
      )}
    </Box>
  )
}

export default Dashboard