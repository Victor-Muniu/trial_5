import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import LoginPage from "../pages/LoginPage";
import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import ReservationForm from "../pages/ReservationForm";
import RoomAnalytics from "../pages/RoomAnalytics";
import Occopancy_Report from "../pages/Occopancy_Report";
import FloorWise from "../pages/FloorWise";
import CollectionReport from "../pages/CollectionReport";
import DailySales from "../pages/DailySales";
import AddLedger from "../pages/AddLedger";
import LedgerList from "../pages/LedgerList";
import AddCreditors from "../pages/AddCreditors";
import CreditorsList from "../pages/CreditorsList";


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
        path: "/checkin",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <ReservationForm />
            }
        ]
    },
    {
        path: '/room_analysis',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <RoomAnalytics />
            }
        ]
    },
    {
        path: '/occupancy_report',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Occopancy_Report />
            }
        ]
    },
    {
        path: '/floor_wise',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <FloorWise />
            }
        ]
    },
    {
        path: '/daily_collections',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <CollectionReport />
            }
        ]
    },
    {
        path: '/daily_sales',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <DailySales />
            }
        ]
    },
    {
        path: '/add_ledger',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <AddLedger />
            }
        ]
    },
    {
        path: '/ledger_list',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <LedgerList />
            }
        ]
    },
    {
        path: '/add_creditor',
        element: <MainLayout />,
        children: [
            {
               index: true,
               element: <AddCreditors /> 
            }
        ]
    },
    {
        path: '/creditor_list',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <CreditorsList />
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to={checkAuth()} replace />
    }
])