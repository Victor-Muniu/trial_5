import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Dashboard, Report, Person, AttachMoney, Apps, ExpandLess, ExpandMore, Logout, PointOfSaleOutlined, MonetizationOn } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarWidth }) => {
  const [openTransactions, setOpenTransactions] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const role = localStorage.getItem('role');

  const handleTransactionsClick = () => {
    setOpenTransactions(!openTransactions);
  };

  const handleMoreClick = () => {
    setOpenMore(!openMore);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('fname');
    localStorage.removeItem('lname');
    navigate('/');
  };

  const navigateTo = (path) => () => {
    navigate(path);
  };

  return (
    <Drawer variant="permanent" sx={{
      width: sidebarWidth,
      '& .MuiDrawer-paper': {
        width: sidebarWidth,
        backgroundColor: 'black',
        color: 'white',
      },
    }}>
      {role === 'service' && (
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>
          <ListItem button onClick={handleTransactionsClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <PointOfSaleOutlined />
            </ListItemIcon>
            <ListItemText primary="POS" />
            {openTransactions ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openTransactions} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/restaurant')}>
                <ListItemText primary="Restaurant" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/bar')}>
                <ListItemText primary="Bar" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={navigateTo('/bills')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <MonetizationOn />
            </ListItemIcon>
            <ListItemText primary="Bills" />
          </ListItem>
          <ListItem button onClick={navigateTo('/reports')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Report />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button onClick={navigateTo('/employees')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Employees" />
          </ListItem>
          <ListItem button onClick={navigateTo('/vat')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText primary="VAT" />
          </ListItem>
          <ListItem button onClick={navigateTo('/my-accountant')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Person />
            </ListItemIcon>
            <ListItemText primary="My accountant" />
          </ListItem>
          <ListItem button onClick={handleMoreClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Apps />
            </ListItemIcon>
            <ListItemText primary="Apps" />
            {openMore ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/apps/more')}>
                <ListItemText primary="More (0)" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}
    </Drawer>
  );
};

export default Sidebar;
