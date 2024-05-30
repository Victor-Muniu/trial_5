import React, { useState } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ExtraPerson from './ExtraPerson';
import Laundry from './Laundry';

const Service = () => {
  const [alignment, setAlignment] = useState('Sudah Order');
  const [selectedComponent, setSelectedComponent] = useState(null); 
  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    
    switch (newAlignment) {
      case 'Extra Person Charge':
        setSelectedComponent(<ExtraPerson />);
        break;

        case 'Laundry Service':
            setSelectedComponent(<Laundry/>);
            break;
      
      default:
        setSelectedComponent(null); 
    } 

  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Extra Service
      </Typography>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="Platform"
        sx={{ marginBottom: 2 }}
      >
        <ToggleButton value="Extra Person Charge">Extra Person Charge</ToggleButton>
        <ToggleButton value="Laundry Service">Laundry Service</ToggleButton>
        <ToggleButton value="Room Service">Room Service</ToggleButton>
        <ToggleButton value="Extra Charges">Extra Charges</ToggleButton>
        <ToggleButton value="Room Swap">Room Swap</ToggleButton> 
      </ToggleButtonGroup>
      
      
      {selectedComponent}
    </Box>
  );
};

export default Service;
