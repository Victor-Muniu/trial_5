import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { Dashboard, Report, ExpandLess, ExpandMore, Logout, PointOfSaleOutlined, MonetizationOn, Balcony, Inventory, AirlineSeatIndividualSuite, Kitchen, RequestQuote, SupervisorAccount, Contacts, ListAlt, Paid, Shop, Balance, TrendingDown, AccountBalance, Air, WebAsset, MoneyOffCsred, Collections, LocalAtm, Bed, Article, Checkroom, BookOnline, Analytics, SupportAgent, RoomService, RequestQuoteOutlined, NoteAdd, AddBusiness, Games, Recycling, Receipt, CurrencyExchange, Person3Outlined, Storefront } from '@mui/icons-material';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarWidth }) => {
  const [openTransactions, setOpenTransactions] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [openMore2, setOpenMore2] = useState(false)
  const [openMore3, setOpenMore3] = useState(false)
  const role = localStorage.getItem('role');

  const handleTransactionsClick = () => {
    setOpenTransactions(!openTransactions);
  };

  const handleMoreClick = () => {
    setOpenMore(!openMore);
  };
  const handleMoreClick2 = () => {
    setOpenMore2(!openMore2)
  }
  const handleMoreClick3 = () => {
    setOpenMore3(!openMore3)
  }
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
            <ListItemText primary="Chefs Ladder" />
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
            <ListItemText primary="Internal" />
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
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/front_requisitions')}>
                <ListItemText primary="Front Office" />
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

          <ListItem button onClick={navigateTo('/assets')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <WebAsset />
            </ListItemIcon>
            <ListItemText primary="Assets" />
          </ListItem>

          <ListItem button onClick={navigateTo('/suppliers')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <SupervisorAccount />
            </ListItemIcon>
            <ListItemText primary="Address Book" />
          </ListItem>

          <ListItem button onClick={handleMoreClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balcony />
            </ListItemIcon>
            <ListItemText primary="Banquettings" />
            {openMore ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/banquetting')}>
                <ListItemText primary="Confrences" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/banquetting_invoice')}>
                <ListItemText primary="Banqutting Invoice" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={navigateTo('/balance_sheet')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balance />
            </ListItemIcon>
            <ListItemText primary="Balance Sheet" />
          </ListItem>








          <ListItem button onClick={navigateTo('/creditors')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Contacts />
            </ListItemIcon>
            <ListItemText primary='Creditors' />
          </ListItem>

          <ListItem button onClick={navigateTo('/debtors')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <MoneyOffCsred />
            </ListItemIcon>
            <ListItemText primary="Debtors" />
          </ListItem>

          <ListItem button onClick={navigateTo('/ledger')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <ListAlt />
            </ListItemIcon>
            <ListItemText primary="General Ledger" />
          </ListItem>

          <ListItem button onClick={navigateTo('/inventory')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItem>



          <ListItem button onClick={navigateTo('/payroll')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <MonetizationOn />
            </ListItemIcon>
            <ListItemText primary="Pay Roll" />
          </ListItem>

          <ListItem button onClick={navigateTo('/payment_voucher')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <MonetizationOn />
            </ListItemIcon>
            <ListItemText primary="Payment Voucher" />
          </ListItem>

          <ListItem button onClick={navigateTo('/petty_cash')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <LocalAtm />
            </ListItemIcon>
            <ListItemText primary="Petty Cash" />
          </ListItem>


          <ListItem button onClick={navigateTo('/profit_loss')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <TrendingDown />
            </ListItemIcon>
            <ListItemText primary="Profit Loss" />
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
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/bank_statement')}>
                <ListItemText primary="Bank Statement" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/expense')}>
                <ListItemText primary="Expenses" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/purchases')}>
                <ListItemText primary="Purchases" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/collections')}>
                <ListItemText primary="Daily Collections" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={navigateTo('/sales')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <CurrencyExchange />
            </ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItem>



          <ListItem button onClick={navigateTo('/trial_balance')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balance />
            </ListItemIcon>
            <ListItemText primary="Trial Balance" />
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

          <ListItem button onClick={navigateTo('/banquetting')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Balcony />
            </ListItemIcon>
            <ListItemText primary="Banquetting" />
          </ListItem>

          <ListItem button onClick={handleMoreClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <NoteAdd />
            </ListItemIcon>
            <ListItemText primary="Bills" />
            {openMore ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/reservations_analytics')}>
                <ListItemText primary="Room Bills" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/bills')}>
                <ListItemText primary="Restaurant Bills" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={navigateTo('/stock_movement')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AddBusiness />
            </ListItemIcon>
            <ListItemText primary='Curio' />
          </ListItem>

          <ListItem button onClick={navigateTo('/room_service')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RoomService />
            </ListItemIcon>
            <ListItemText primary="Create Reservation Bill" />
          </ListItem>

          <ListItem button onClick={navigateTo('/inventory')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Inventory />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
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
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/ammenities')}>
                <ListItemText primary="Ammenities POS" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/curio_pos')}>
                <ListItemText primary="Curio POS" />
              </ListItem>

              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/bills2')}>
                <ListItemText primary="Service POS" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/reservations')}>
                <ListItemText primary="Reservations POS" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleTransactionsClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Report />
            </ListItemIcon>
            <ListItemText primary="Reports" />
            {openTransactions ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openTransactions} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/collections')}>
                <ListItemText primary="Daily Collections" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/front_requisitions')}>
                <ListItemText primary="Departent Requisition" />
              </ListItem>
            </List>
          </Collapse>



          <ListItem button onClick={navigateTo('/requisition_form')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <RequestQuoteOutlined />
            </ListItemIcon>
            <ListItemText primary="Requisition Form" />
          </ListItem>

          <ListItem button onClick={navigateTo('/rooms')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Bed />
            </ListItemIcon>
            <ListItemText primary="Rooms" />
          </ListItem>


          <ListItem button onClick={handleLogout}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      )}
      {role === 'admin' && (
        <List>
          <ListItem button onClick={navigateTo('/dashboard')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboards" />
          </ListItem>


          <ListItem button onClick={handleTransactionsClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <AccountBalance />
            </ListItemIcon>
            <ListItemText primary="Accounts" />
            {openTransactions ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>

          <Collapse in={openTransactions} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/assets')}>
                <ListItemText primary="Assets" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/suppliers')}>
                <ListItemText primary="Address Book" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/payroll')}>
                <ListItemText primary="Pay Roll" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleMoreClick}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Storefront />
            </ListItemIcon>
            <ListItemText primary="Front Office" />
            {openMore ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/ammenities')}>
                <ListItemText primary="Ammenities" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/banquetting')}>
                <ListItemText primary="Banqetting" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/stock_movement')}>
                <ListItemText primary="Curio" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/curio_pos')}>
                <ListItemText primary="Curio POS" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/collections')}>
                <ListItemText primary="Daily Collections" />
              </ListItem>
              
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/laundry_service')}>
                <ListItemText primary="Laudry Service" />
              </ListItem>
              
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/reservations_analytics')}>
                <ListItemText primary="Reservations" />
              </ListItem>

              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/rooms')}>
                <ListItemText primary="Rooms" />
              </ListItem>
              
            </List>
          </Collapse>


          <ListItem button onClick={handleMoreClick2}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Storefront />
            </ListItemIcon>
            <ListItemText primary="Procurement" />
            {openMore2 ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore2} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/inventory')}>
                <ListItemText primary="Inventory" />
              </ListItem>
              
              
            </List>
          </Collapse>

          <ListItem button onClick={handleMoreClick3}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Storefront />
            </ListItemIcon>
            <ListItemText primary="Service" />
            {openMore3 ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItem>
          <Collapse in={openMore3} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/restaurant')}>
                <ListItemText primary="Restaurant" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/bar')}>
                <ListItemText primary="Bar" />
              </ListItem>
              <ListItem button sx={{ pl: 4 }} onClick={navigateTo('/podium')}>
                <ListItemText primary="Podium" />
              </ListItem>
            </List>
          </Collapse>




          <ListItem button onClick={navigateTo('/staff')}>
            <ListItemIcon sx={{ color: 'white' }}>
              <Person3Outlined />
            </ListItemIcon>
            <ListItemText primary="Staff" />
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
