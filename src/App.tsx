import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RegisterDoctor from '@/pages/RegisterDoctor';
import RegisterStaff from '@/pages/RegisterStaff';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Layout from './components/Layout';
import { ThemeProvider } from '@/components/ThemeProvider';
import PatientMessaging from '@/pages/PatientMessaging';
import StaffMessaging from '@/pages/StaffMessaging';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from './context/AuthProvider';
import PrivateRoute from '@/components/PrivateRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/staff" element={<RegisterStaff />} />
            <Route path="/register/doctor" element={<RegisterDoctor />} />
            <Route element={<PrivateRoute />}>
              <Route
                path="/patient-messaging"
                element={
                  <Layout>
                    <PatientMessaging />
                  </Layout>
                }
              />
              <Route
                path="/staff-messaging"
                element={
                  <Layout>
                    <StaffMessaging />
                  </Layout>
                }
              />
              <Route
                path="/"
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
