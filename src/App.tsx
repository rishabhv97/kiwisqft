import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PostProperty from './pages/PostProperty';
import PropertyDetails from './pages/PropertyDetails';
import FindAgent from './pages/FindAgent';
import Settings from './pages/Settings';
import Login from './pages/Login';   // Import Login
import Signup from './pages/Signup'; // Import Signup

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyManagement from './pages/admin/PropertyManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminPeople from './pages/admin/AdminPeople'; 

import { Property } from './types';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import Auth

// Keep INITIAL_PROPERTIES for now (Phase 2 will remove this)
const INITIAL_PROPERTIES: Property[] = [
  // ... (Keep your long list of properties here, DO NOT DELETE THEM YET) ...
   {
    id: '1',
    title: 'Luxury Villa with Private Pool',
    description: 'Experience luxury living...',
    price: 45000000,
    location: 'Sector 150',
    city: 'Noida',
    type: 'Villa',
    listingType: 'sale',
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    area: 3200,
    superBuiltUpArea: 3200,
    builtUpArea: 2800,
    carpetArea: 2400,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80',
    amenities: ['Swimming Pool', 'Club House', 'Smart Home', 'Security Personnel', 'Parking'],
    ownerContact: '+91 98765 43210',
    datePosted: '2023-10-15',
    isFeatured: true,
    constructionStatus: 'Ready to Move',
    furnishedStatus: 'Fully Furnished',
    listedBy: 'Agent',
    ownershipType: 'Freehold',
    facing: 'North-East',
    exitFacing: 'South-West',
    parkingSpaces: 2,
    floor: 0,
    totalFloors: 2,
    reraApproved: true,
    hasShowcase: true,
    has3DVideo: true,
    parkingType: 'Covered',
    views: ['Park', 'Corner'],
    yearBuilt: 2021,
    additionalRooms: ['Servant Room', 'Study Room', 'Pooja Room'],
    allInclusivePrice: true,
    brokerageType: 'Fixed',
    brokerageAmount: 100000,
    documents: ['Sale Deed', 'Completion Certificate (CC)', 'Occupancy Certificate (OC)', 'Property Tax Receipts'],
    isVerified: true,
    status: 'Approved',
    pageViews: 1250,
    leads: 12,
    ownerId: 'u2'
  }
];

// Protected Route Component (Only allows Admins)
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'Admin') return <Navigate to="/" />;
  return children;
};

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);

  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
  };

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
             {/* Note: We removed the 'users' prop below because we are moving to Supabase */}
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