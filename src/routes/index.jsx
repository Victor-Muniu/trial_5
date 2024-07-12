import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Bar from "../pages/Bar";
import Reststaurant2 from "../pages/Reststaurant2";
import Menu from "../pages/Menu";
import Bills from "../pages/Bills";
import Podium from "../pages/Podium";
import Stock from "../pages/Stock";
import Banquetting from "../pages/Banquetting";
import Inventory from "../pages/Inventory";
import Inhouse from "../pages/Inhouse";
import CheffsLadder from "../pages/CheffsLadder";
import FoodRequisitions from "../pages/FoodRequisitions";
import ServiceRequisition from "../pages/ServiceRequisition";
import Suppliers from "../pages/Suppliers";
import Creditors from "../pages/Creditors";
import StockRequisitions from "../pages/StockRequisitions";
import GeneralLedger from "../pages/GeneralLedger";
import Expense from "../pages/Expense";
import Purchases from "../pages/Purchases";
import TrialBalance from "../pages/TrialBalance";
import ProfitLoss from "../pages/ProfitLoss";
import BankStatement from "../pages/BankStatement";
import Assets from "../pages/Assets";
import Debtors from "../pages/Debtors";
import Collections from "../pages/Collections";
import PettyCash from "../pages/PettyCash";
import Rooms from "../pages/Rooms";
import RoomReport from "../pages/RoomReport";
import LaundryService from "../pages/LaundryService";
import Reservations from "../pages/Reservations";

import AgentsAnalytics from "../pages/AgentsAnalytics";
import RoomService from "../pages/RoomService";
import OccupancyReport from "../pages/Occupancy_report";
import Menu2 from "../pages/Menu2";
import RequisitionForm from "../pages/RequisitionForm";
import BillForm from "../pages/BillForm";
import Ammenities from "../pages/Ammenities";
import HouseKeeping from "../pages/HouseKeeping";
import FrontOfficeRequisition from "../pages/FrontOfficeRequisition";
import SokoCarriageInwards from "../pages/SokoCarriageInwards";


const checkAuth = (path) => {
    const isAuthenticated = localStorage.getItem("token");
    const isProtectedRoute = path === '/dashboard' || path === '/emails';
    
    if (isProtectedRoute && !isAuthenticated) {
      return '/';
    }
  
    return null;
  };



export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <LoginPage />
          }
        ]
    },
    {
        path: "/dashboard",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />
          }
        ]
    },
    {
      path: '/bar',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element:<Bar />
        }
      ]
    },
    {
      path: '/restaurant', 
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Reststaurant2 />
        }
      ]
    },  
    {
      path: '/menu/:table_no',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Menu />
        }
      ]
    },
    {
      path: '/menu2/:table_no',
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <Menu2 />
        }
      ]
    },
    {
      path: '/bills',
      element: <MainLayout />, 
      children: [
        {
          index: true,
          element: <Bills />
        }
      ]
    },
    {
      path: '/podium',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Podium />
        }
      ]
    },
    {
      path: '/stock_movement',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Stock />
        }
      ]
    },
    {
      path: '/banquetting',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Banquetting />
        }
      ]
    },
    {
      path: '/inventory',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Inventory />
        }
      ]
    },
    {
      path: '/inhouse',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Inhouse />
        }
      ]
    },
    {
      path: '/cheffs_ladder',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <CheffsLadder />
        }
      ]
    },
    {
      path: '/food_requisition',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <FoodRequisitions />
        }
      ]
    },
    {
      path: '/service_requisition',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <ServiceRequisition />
        }
      ]
    },
    {
      path: '/suppliers',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Suppliers />
        }
      ]
    },
    {
      path: '/creditors',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Creditors />
        }
      ]
    },
    {
      path: '/stock_requisitions',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <StockRequisitions />
        }
      ]
    },
    {
      path: '/ledger',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <GeneralLedger />
        }
      ]
    },
    {
      path: '/expense',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Expense />
        }
      ]
    },
    {
      path: '/purchases',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Purchases />
        }
      ]
    },
    {
      path: '/trial_balance',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <TrialBalance />
        }
      ]
    },
    {
      path: '/profit_loss',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <ProfitLoss />
        }
      ]
    },
    {
      path: '/bank_statement',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <BankStatement />
        }
      ]
    },
    {
      path: '/collections',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Collections />
        }
      ]
    },
    {
      path: '/assets',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: < Assets />
        }
      ]
    },
    {
      path: '/debtors',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Debtors />
        }
      ]
    },
    {
      path: '/petty_cash',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <PettyCash />
        }
      ]
    },
    {
      path: '/rooms',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Rooms />
        }
      ]
    },
    {
      path: '/room_report',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <RoomReport />
        }
      ]
    },
    {
      path: '/laundry_service',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <LaundryService />
        }
      ]
    },
    {
      path: '/reservations',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Reservations />
        }
      ]
    },
    {
      path: '/reservations_analytics',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <OccupancyReport/>
        }
      ]
    },
    {
      path: '/agents_analysis',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <AgentsAnalytics />
        }
      ]
    },
    {
      path: '/room_service',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <RoomService />
        }
      ]
    },
    {
      path: '/requisition_form',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <RequisitionForm />
        }
      ]
    },
    {
      path: '/bills2',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <BillForm />
        }
      ]
    },
    {
      path: '/ammenities',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <Ammenities />
        }
      ]
    },
    {
      path: '/housekeeping_requisition',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <HouseKeeping />
        }
      ]
    },
    {
      path: '/front_requisitions',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <FrontOfficeRequisition />
        }
      ]
    },
    {
      path: '/carrage_inwards',
      element: <MainLayout />,
      children: [
        {
          index:true,
          element: <SokoCarriageInwards />
        }
      ]
    },
    
    {
      path: "*",
      element: <Navigate to={checkAuth()} replace />, 
      
    }  
])