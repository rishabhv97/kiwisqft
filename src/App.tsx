import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Property } from '../types';

// Components
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import PostProperty from './pages/PostProperty';
import PropertyDetails from './pages/PropertyDetails';
import FindAgent from './pages/FindAgent';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyManagement from './pages/admin/PropertyManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminPeople from './pages/admin/AdminPeople';

// --- Components for Route Protection ---

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">Checking access...</div>;
  if (!user || user.role !== 'Admin') return <Navigate to="/" />;
  return children;
};

// --- Main App Component ---

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch properties from Supabase on load
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) throw error;

      if (data) {
        // Map Database columns (snake_case) to TypeScript (camelCase)
        const mappedProperties: Property[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          location: p.location,
          city: p.city,
          type: p.type,
          listingType: p.listing_type, // Database column -> TS Property
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area,
          imageUrl: p.image_url || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80',
          amenities: p.amenities || [],
          ownerContact: p.owner_contact,
          datePosted: p.created_at,
          isFeatured: p.is_featured,
          status: p.status,
          ownerId: p.owner_id,
          // Safety defaults for optional fields
          superBuiltUpArea: p.area,
          builtUpArea: p.area,
          carpetArea: p.area,
          balconies: 0,
          totalFloors: 0,
          floor: 0,
          parkingSpaces: 0,
          views: [],
          documents: []
        }));
        setProperties(mappedProperties);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = (newProperty: Property) => {
    // We will update this in the next step to push to DB
    setProperties((prev) => [newProperty, ...prev]);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-brand-green font-bold">Loading Kiwi Sqft...</div>;

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home featuredProperties={properties.filter(p => p.isFeatured && p.status === 'Approved')} />} />
          <Route path="/buy" element={<Listings properties={properties.filter(p => p.status === 'Approved')} type="sale" />} />
          <Route path="/rent" element={<Listings properties={properties.filter(p => p.status === 'Approved')} type="rent" />} />
          <Route path="/property/:id" element={<PropertyDetails properties={properties} />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Routes */}
          <Route path="/sell" element={<PostProperty onAddProperty={handleAddProperty} isAdmin={false} />} />
          <Route path="/find-agent" element={<FindAgent />} />
          <Route path="/settings" element={<Settings />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
             <Route index element={<AdminDashboard properties={properties} />} />
             <Route path="properties" element={<PropertyManagement properties={properties} setProperties={setProperties} />} />
             <Route path="post-property" element={<PostProperty onAddProperty={handleAddProperty} isAdmin={true} />} />
             <Route path="people" element={<UserManagement />} /> 
             <Route path="leads" element={<AdminPeople />} />
             <Route path="analytics" element={<AdminDashboard properties={properties} />} />
             <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;