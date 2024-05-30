import React from 'react'
import { Box } from '@mui/material'
import Room from '../components/Room'
import Home from './Home'
function Dashboard() {
  const user = localStorage.getItem('role')
  

  return (
    <Box>
      {user === 'front_office' && (
        <Room />
      )}
      {user === 'accounting' && (
        <Home />
      )}
    </Box>
  )
}

export default Dashboard