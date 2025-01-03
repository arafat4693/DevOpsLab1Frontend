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
import { UserSearch } from 'lucide-react';
import Patient from './pages/Patient';
import SearchPage from './pages/SearchPage';
import InteractiveImageEditor from './pages/InteractiveImageEditor';
import { ImageGallery } from './pages/ImageGallery';
import EditImage from './pages/EditImage';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloak } from './lib/keycloakConfig';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ReactKeycloakProvider authClient={keycloak}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/register/staff" element={<RegisterStaff />} />
              <Route path="/register/doctor" element={<RegisterDoctor />} />
              <Route element={<PrivateRoute />}>
                <Route
                  path="/patients"
                  element={
                    <Layout>
                      <UserSearch />
                    </Layout>
                  }
                />
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
                  path="/patient/:id"
                  element={
                    <Layout>
                      <Patient />
                    </Layout>
                  }
                />
                <Route
                  path="/image/:id"
                  element={
                    <Layout>
                      <EditImage />
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
                <Route
                  path="/search"
                  element={
                    <Layout>
                      <SearchPage />
                    </Layout>
                  }
                />
                <Route
                  path="/new"
                  element={
                    <Layout>
                      <InteractiveImageEditor />
                    </Layout>
                  }
                />
                <Route
                  path="/images"
                  element={
                    <Layout>
                      <ImageGallery />
                    </Layout>
                  }
                />
              </Route>
            </Routes>
          </Router>
        </ReactKeycloakProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
