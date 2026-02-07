import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Property } from './types';

// Components
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';

// Context
import { AuthProvider, useAuth, ProtectedRoute } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Listings from './pages/Listings';
import PostProperty from './pages/PostProperty';
import PropertyDetails from './pages/PropertyDetails';
import FindAgent from './pages/FindAgent';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';

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

  // 1. Fetch properties from Supabase on load (For Home & Admin)
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
          listingType: p.listing_type,
          
          // --- UPDATED: Handle Multiple Images ---
          images: p.images || [], 
          
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          balconies: p.balconies,
          
          // --- UPDATED: Handle Area Fields ---
          area: p.area,
          carpetArea: p.carpet_area,
          builtUpArea: p.built_up_area,
          superBuiltUpArea: p.super_built_up_area,
          
          amenities: p.amenities || [],
          ownerContact: p.owner_contact,
          datePosted: p.created_at,
          isFeatured: p.is_featured,
          status: p.status,
          ownerId: p.owner_id,
          
          // --- UPDATED: Handle New Fields ---
          constructionStatus: p.construction_status,
          furnishedStatus: p.furnished_status,
          listedBy: p.listed_by,
          ownershipType: p.ownership_type,
          facing: p.facing_entry,
          exitFacing: p.facing_exit,
          floor: p.floor_no,
          totalFloors: p.total_floors,
          parkingSpaces: p.parking_spaces,
          yearBuilt: p.year_built,
          
          additionalRooms: p.additional_rooms || [],
          views: p.views || [],
          documents: p.available_documents || [],
          
          priceNegotiable: p.price_negotiable,
          allInclusivePrice: p.is_all_inclusive_price,
          taxExcluded: p.is_tax_excluded,
          pricePerSqft: p.price_per_sqft,
          
          brokerageType: p.brokerage_type,
          brokerageAmount: p.brokerage_amount,
          
          hasShowcase: p.is_virtual_showcase,
          has3DVideo: p.is_3d_video,
          reraApproved: p.rera_approved,
          parkingType: p.parking_type
        }));
        setProperties(mappedProperties);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-brand-green font-bold">Loading Kiwi Sqft...</div>;

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          {/* Home still needs props because it renders Featured items immediately */}
          <Route path="/" element={<Home featuredProperties={properties.filter(p => p.isFeatured && p.status === 'Approved')} />} />
          
          {/* Listings now fetch their own data, so we removed the 'properties' prop */}
          <Route path="/buy" element={<Listings type="sale" />} />
          <Route path="/rent" element={<Listings type="rent" />} />
          
          <Route path="/property/:id" element={<PropertyDetails />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* User Routes */}
          {/* PostProperty now handles everything internally, removed props */}
          <Route path="/sell" element={<PostProperty />} />
          <Route path="/find-agent" element={<FindAgent />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
             <Route index element={<AdminDashboard properties={properties} />} />
             <Route path="properties" element={<PropertyManagement properties={properties} setProperties={setProperties} />} />
             {/* Admin version of PostProperty also doesn't need props now */}
             <Route path="post-property" element={<PostProperty />} />
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