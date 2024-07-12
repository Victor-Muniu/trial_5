import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Dashboard, Report, ExpandLess, ExpandMore, Logout, PointOfSaleOutlined, MonetizationOn, Balcony, Inventory, AirlineSeatIndividualSuite, Kitchen, RequestQuote, SupervisorAccount, Contacts, ListAlt, Paid, Shop, Balance, TrendingDown, AccountBalance, Air, WebAsset, MoneyOffCsred, Collections, LocalAtm, Bed, Article, Checkroom, BookOnline, Analytics, SupportAgent, RoomService, RequestQuoteOutlined, NoteAdd, AddBusiness, Games, Recycling } from '@mui/icons-material';

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
          <ListItem button onClick={handleMoreClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Report />
            </ListItemIcon>
            <ListItemText primary="Reports" />
            {openMore ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/podium')}>
                <ListItemText primary="Podium" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/stock_movement')}>
                <ListItemText primary="Stock" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={navigateTo('/banquetting')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balcony />
            </ListItemIcon>
            <ListItemText primary="Banquetting" />
          </ListItem>

          <ListItem button onClick={navigateTo('/bills2')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <NoteAdd />
            </ListItemIcon>
            <ListItemText primary=" Room Service bill" />
          </ListItem>

          <ListItem button onClick={navigateTo('/requisition_form')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RequestQuoteOutlined />
            </ListItemIcon>
            <ListItemText primary="Requisition Form" />
          </ListItem>


          <ListItem button onClick={navigateTo('/service_requisition')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RequestQuoteOutlined />
            </ListItemIcon>
            <ListItemText primary="Departent Requisition" />
          </ListItem>



          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}

      {role === 'food production' && (
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>

          <ListItem button onClick={navigateTo('/inventory')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
          <ListItem button onClick={navigateTo('/inhouse')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AirlineSeatIndividualSuite />
            </ListItemIcon>
            <ListItemText primary="Inhouse" />
          </ListItem>
          <ListItem button onClick={navigateTo('/cheffs_ladder')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Kitchen />
            </ListItemIcon>
            <ListItemText primary="Cheffs Ladder" />
          </ListItem>

          <ListItem button onClick={navigateTo('/banquetting')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balcony />
            </ListItemIcon>
            <ListItemText primary="Banquetting" />
          </ListItem>


          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}

      {role === 'procurement' && (
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>
          <ListItem button onClick={navigateTo('/inventory')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>
          <ListItem button onClick={navigateTo('/stock_movement')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AddBusiness />
            </ListItemIcon>
            <ListItemText primary="Transfers" />
          </ListItem>

          <ListItem button onClick={handleMoreClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RequestQuote />
            </ListItemIcon>
            <ListItemText primary="Requisition" />
            {openMore ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/food_requisition')}>
                <ListItemText primary="Food Production" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/service_requisition')}>
                <ListItemText primary="Service" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/housekeeping_requisition')}>
                <ListItemText primary="House Keeping" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={navigateTo('/suppliers')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <SupervisorAccount />
            </ListItemIcon>
            <ListItemText primary="Suppliers" />
          </ListItem>
          <ListItem button onClick={navigateTo('/creditors')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Contacts />
            </ListItemIcon>
            <ListItemText primary='Creditors' />
          </ListItem>
          <ListItem button onClick={navigateTo('/banquetting')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balcony />
            </ListItemIcon>
            <ListItemText primary="Banquetting" />
          </ListItem>
          <ListItem button onClick={navigateTo('/carrage_inwards')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Recycling />
            </ListItemIcon>
            <ListItemText primary="Carrage Inwards" />
          </ListItem>
          <ListItem button onClick={navigateTo('/stock_requisitions')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RequestQuote />
            </ListItemIcon>
            <ListItemText primary='LPO' />
          </ListItem>

          <ListItem button onClick={navigateTo('/purchases')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Shop />
            </ListItemIcon>
            <ListItemText primary="Purchases" />
          </ListItem>

          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>

        </List>
      )}

      {role === 'accounting' && (
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>
          <ListItem button onClick={navigateTo('/ledger')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="General Ledger" />
          </ListItem>
          <ListItem button onClick={navigateTo('/expense')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Paid />
            </ListItemIcon>
            <ListItemText primary="Expenses" />
          </ListItem>

          <ListItem button onClick={navigateTo('/inventory')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>

          <ListItem button onClick={navigateTo('/trial_balance')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balance />
            </ListItemIcon>
            <ListItemText primary="Trial Balance" />
          </ListItem>

          <ListItem button onClick={navigateTo('/profit_loss')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <TrendingDown />
            </ListItemIcon>
            <ListItemText primary="Profit Loss" />
          </ListItem>

          <ListItem button onClick={navigateTo('/bank_statement')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText primary="Bank Statement" />
          </ListItem>

          <ListItem button onClick={navigateTo('/assets')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <WebAsset />
            </ListItemIcon>
            <ListItemText primary="Assets" />
          </ListItem>

          <ListItem button onClick={navigateTo('/debtors')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <MoneyOffCsred />
            </ListItemIcon>
            <ListItemText primary="Debtors" />
          </ListItem>




          <ListItem button onClick={navigateTo('/purchases')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Shop />
            </ListItemIcon>
            <ListItemText primary="Purchases" />
          </ListItem>

          <ListItem button onClick={navigateTo('/suppliers')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <SupervisorAccount />
            </ListItemIcon>
            <ListItemText primary="Suppliers" />
          </ListItem>

          <ListItem button onClick={navigateTo('/collections')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Collections />
            </ListItemIcon>
            <ListItemText primary="Daily collections" />
          </ListItem>

          <ListItem button onClick={navigateTo('/petty_cash')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <LocalAtm />
            </ListItemIcon>
            <ListItemText primary="Petty Cash" />
          </ListItem>

          <ListItem button onClick={navigateTo('/creditors')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Contacts />
            </ListItemIcon>
            <ListItemText primary='Creditors' />
          </ListItem>



          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}


      {role === 'house keeping' && (
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>

          <ListItem button onClick={navigateTo('/rooms')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Bed />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
          </ListItem>

          <ListItem button onClick={navigateTo('/room_report')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Article />
            </ListItemIcon>
            <ListItemText primary="Room Report" />
          </ListItem>

          <ListItem button onClick={navigateTo('/laundry_service')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Checkroom />
            </ListItemIcon>
            <ListItemText primary="Laundry Service" />
          </ListItem>
          
          <ListItem button onClick={navigateTo('/assets')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <WebAsset />
            </ListItemIcon>
            <ListItemText primary="Assets" />
          </ListItem>



          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}

      {role === 'front office' && (
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>

          <ListItem button onClick={navigateTo('/rooms')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Bed />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
          </ListItem>

          <ListItem button onClick={navigateTo('/reservations')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <BookOnline />
            </ListItemIcon>
            <ListItemText primary="Booking Form" />
          </ListItem>

          <ListItem button onClick={navigateTo('/reservations_analytics')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Analytics />
            </ListItemIcon>
            <ListItemText primary="Room Bills" />
          </ListItem>

          <ListItem button onClick={navigateTo('/bills2')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <NoteAdd />
            </ListItemIcon>
            <ListItemText primary=" Create Bills" />
          </ListItem>

          <ListItem button onClick={navigateTo('/banquetting')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balcony />
            </ListItemIcon>
            <ListItemText primary="Banquetting" />
          </ListItem>

          <ListItem button onClick={navigateTo('/stock_movement')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AddBusiness />
            </ListItemIcon>
            <ListItemText primary="Curio" />
          </ListItem>

          <ListItem button onClick={navigateTo('/bills')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <MonetizationOn />
            </ListItemIcon>
            <ListItemText primary="Restaurant Bills" />
          </ListItem>

          <ListItem button onClick={navigateTo('/room_service')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RoomService />
            </ListItemIcon>
            <ListItemText primary="Reservation Biil" />
          </ListItem>

          <ListItem button onClick={navigateTo('/collections')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Collections />
            </ListItemIcon>
            <ListItemText primary="Daily collections" />
          </ListItem>

          <ListItem button onClick={navigateTo('/laundry_service')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Checkroom />
            </ListItemIcon>
            <ListItemText primary="Laundry Service" />
          </ListItem>

          <ListItem button onClick={navigateTo('/ammenities')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Games />
            </ListItemIcon>
            <ListItemText primary="Ammenities" />
          </ListItem>

          <ListItem button onClick={navigateTo('/agents_analysis')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <SupportAgent />
            </ListItemIcon>
            <ListItemText primary="Agent Analytics" />
          </ListItem>

          <ListItem button onClick={navigateTo('/requisition_form')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RequestQuoteOutlined />
            </ListItemIcon>
            <ListItemText primary="Requisition Form" />
          </ListItem>

          <ListItem button onClick={navigateTo('/front_requisitions')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RequestQuoteOutlined />
            </ListItemIcon>
            <ListItemText primary="Departent Requisition" />
          </ListItem>
          

          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}
      {role === 'admin' &&(
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>
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
