import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import NavBar from './components/NavBar.jsx';
import { lazy, Suspense } from 'react';
import Loader from './components/ui/Loader.jsx';
import { Helmet } from 'react-helmet-async';


const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const IssuesList = lazy(() => import('./pages/IssuesList.jsx'));
const IssueDetail = lazy(() => import('./pages/IssueDetail.jsx'));
const IssueForm = lazy(() => import('./pages/IssueForm.jsx'));
const AdminPanel = lazy(() => import('./pages/AdminPanel.jsx'));
const UserManagement = lazy(() => import('./pages/UserManagement.jsx'));
const DeveloperPanel = lazy(() => import('./pages/DeveloperPanel.jsx'));
const UserPanel = lazy(() => import('./pages/UserPanel.jsx'));
const UserIssuesList = lazy(() => import('./pages/UserIssuesList.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Helmet>
          <title>Issue Tracker - Manage and Track Issues Efficiently</title>
          <meta name="description" content="Issue Tracker is a comprehensive issue management system for teams to track, assign, and resolve issues efficiently. Built with React, Node.js, and MongoDB." />
          <meta name="keywords" content="issue tracker, bug tracking, project management, team collaboration, task management" />
          <meta name="author" content="Issue Tracker Team" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        </Helmet>
        <div className="min-h-screen text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950">
          <NavBar />
          <div className="max-w-6xl mx-auto p-4 ">
            <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader size="lg" /></div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute />}> 
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/issues" element={<IssuesList />} />
                  <Route path="/issues/new" element={<IssueForm mode="create" />} />
                  <Route path="/issues/:id" element={<IssueDetail />} />
                  <Route path="/issues/:id/edit" element={<IssueForm mode="edit" />} />

                  <Route element={<RoleRoute allowed={["Admin"]} />}> 
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                  </Route>
                  
                  <Route element={<RoleRoute allowed={["Developer"]} />}> 
                    <Route path="/developer" element={<DeveloperPanel />} />
                  </Route>
                  
                  <Route element={<RoleRoute allowed={["User"]} />}> 
                    <Route path="/user" element={<UserPanel />} />
                    <Route path="/user/issues" element={<UserIssuesList />} />
                  </Route>
                </Route>

                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}