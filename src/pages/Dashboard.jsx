import React from 'react'
import { Box } from '@mui/material'
import Restaurant from '../components/common/Restaurant'

function Dashboard() {
  const user = localStorage.getItem('role')
  

  return (
    <Box>
      {user === 'service' && (
        <Restaurant />
      )}
    </Box>
  )
}

export default Dashboard