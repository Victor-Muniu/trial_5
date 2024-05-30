import React , {useState} from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Search, MergeType, AddCircleOutline, Label, Build, 
    Apps, Notifications, HelpOutline, BedOutlined, 
    AnalyticsOutlined,
    SensorOccupied,
    Collections,
    MonetizationOn,
    Logout,
    Add,
    DataArray} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const user = localStorage.getItem('role')

const Sidebar = () => {

    const navigate = useNavigate()
    const handleClick= () => {
        navigate('/dashboard')
    }

    const handle2 = ()=> {
        navigate('/room_analysis')
    }
    const handle3 = () => {
        navigate('/occupancy_report')
    }

    const handle4 = () =>{
        navigate('/floor_wise')
    }
    
    const handle5 = () =>{
        navigate('/daily_collections')
    }
    const handle6 = () =>{
        navigate('/daily_sales')
    }
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      navigate('/')
  }
  const handle7 = () =>{
    navigate('/add_ledger')
  }

  const handle8 = () =>{
    navigate('/ledger_list')
  }
  const handle9 = () =>{
    navigate('/add_creditor')
  }
  const handle10 = () =>{
    navigate('/creditor_list')
  }
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      
      <List>
        {user === 'accounting' && (
          <>
            <ListItem onClick={handleClick} sx={{cursor: 'pointer'}}>
              <ListItemIcon >
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem  onClick={handle7} sx={{cursor: 'pointer'}}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Ledger" />
            </ListItem>
            <ListItem sx={{cursor: 'pointer'}} onClick={handle8}>
              <ListItemIcon>
                <DataArray />
              </ListItemIcon>
              <ListItemText primary='Ledger List'/>
            </ListItem>

            <ListItem  onClick={handle9} sx={{cursor: 'pointer'}}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Creditors" />
            </ListItem>
            <ListItem sx={{cursor: 'pointer'}} onClick={handle10}>
              <ListItemIcon>
                <DataArray />
              </ListItemIcon>
              <ListItemText primary='Creditors List'/>
            </ListItem>

            <ListItem sx={{cursor: 'pointer'}} onClick={handleLogout}>
              <ListItemIcon>
                <Logout/>
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItem>
          </>
        )}
        {user === 'front_office' && (
          <>
            <ListItem onClick={handleClick} sx={{ cursor: 'pointer' }}>
              <ListItemIcon>
                <BedOutlined/>
              </ListItemIcon>
              <ListItemText primary="Rooms" />
            </ListItem>
            <ListItem sx={{cursor: 'pointer'}} onClick={handle2}>
              <ListItemIcon>
                <AnalyticsOutlined />
              </ListItemIcon>
              <ListItemText primary="Room Analysis" />
            </ListItem>
            <ListItem sx={{cursor: 'pointer'}} onClick={handle3}>
                <ListItemIcon>
                    <SensorOccupied />
                </ListItemIcon>
                <ListItemText primary='Occupancy Report'/>
            </ListItem>

            <ListItem sx={{cursor: 'pointer'}} onClick={handle4}>
                <ListItemIcon>
                    <SensorOccupied />
                </ListItemIcon>
                <ListItemText primary='Occupancy FloorWise'/>
            </ListItem >

            <ListItem sx={{cursor: 'pointer'}} onClick={handle5}>
                <ListItemIcon>
                    <Collections />
                </ListItemIcon>
                <ListItemText primary='Daily Collections'/>
            </ListItem>

            <ListItem sx={{cursor: 'pointer'}} onClick={handle6}>
                <ListItemIcon>
                    <MonetizationOn/>
                </ListItemIcon>
                <ListItemText primary='Sales Report'/>
            </ListItem>
            <ListItem sx={{cursor: 'pointer'}} onClick={handleLogout}>
              <ListItemIcon>
                <Logout/>
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </ListItem>
          </>
        )}
        {user === 'food_beverage_service' && (
          <>
            <ListItem>
              <ListItemIcon>
                <Search />
              </ListItemIcon>
              <ListItemText primary="Inspection" />
            </ListItem>
          </>
        )}
        {user === 'food_beverage_production' && (
          <>
            <ListItem>
              <ListItemIcon>
                <MergeType />
              </ListItemIcon>
              <ListItemText primary="Merge" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <AddCircleOutline />
              </ListItemIcon>
              <ListItemText primary="Complement" />
            </ListItem>
          </>
        )}
        {user === 'house_keeping' && (
          <>
            <ListItem>
              <ListItemIcon>
                <Label />
              </ListItemIcon>
              <ListItemText primary="Labels" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Build />
              </ListItemIcon>
              <ListItemText primary="Adjust" />
            </ListItem>
          </>
        )}
        {user === 'banquetting' && (
          <>
            <ListItem>
              <ListItemIcon>
                <Apps />
              </ListItemIcon>
              <ListItemText primary="Apps" />
            </ListItem>
          </>
        )}
        {user === 'general_manager' && (
          <>
            <ListItem>
              <ListItemIcon>
                <Notifications />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <HelpOutline />
              </ListItemIcon>
              <ListItemText primary="Help" />
            </ListItem>
          </>
        )}
        {user === 'procurement' && (
          <>
            <ListItem>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Procurement" />
            </ListItem>
          </>
        )}
      </List>
      
    </Drawer>
  );
};

export default Sidebar;
