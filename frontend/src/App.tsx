import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CommandPalette } from "@/components/CommandPalette";
import { MagicCursor } from "@/components/MagicCursor";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import JobPostings from "./pages/JobPostings";
import Interviews from "./pages/Interviews";
import Candidates from "./pages/Candidates";
import CandidateDetails from "./pages/CandidateDetails";
import DashboardSettings from "./pages/DashboardSettings";
import HomeFeed from "./pages/HomeFeed";
import CreatePost from "./pages/CreatePost";
import ProfilePage from "./pages/ProfilePage";
import Features from "./pages/Features";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import EditorialShowcase from "./pages/EditorialShowcase";
import JobsList from "./JobsList";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CommandPalette />
          <MagicCursor />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/editorial" element={<EditorialShowcase />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/features" element={<Features />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/jobs" element={<ProtectedRoute><DashboardLayout><JobPostings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/interviews" element={<ProtectedRoute><DashboardLayout><Interviews /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/candidates" element={<ProtectedRoute><DashboardLayout><Candidates /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/candidates/:id" element={<ProtectedRoute><DashboardLayout><CandidateDetails /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardLayout><DashboardSettings /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/feed" element={<ProtectedRoute><DashboardLayout><HomeFeed /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/create" element={<ProtectedRoute><DashboardLayout><CreatePost /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />
            <Route path="/dashboard/profile/:username" element={<ProtectedRoute><DashboardLayout><ProfilePage /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;



