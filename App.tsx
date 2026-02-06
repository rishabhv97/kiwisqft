

import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PostProperty from './pages/PostProperty';
import PropertyDetails from './pages/PropertyDetails';
import FindAgent from './pages/FindAgent';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyManagement from './pages/admin/PropertyManagement';
import UserManagement from './pages/admin/UserManagement';
import AdminPeople from './pages/admin/AdminPeople'; 
import { Property, User } from './types';

// Initial Mock Data (Acting as Database Seed)
const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Luxury Villa with Private Pool',
    description: 'Experience luxury living in this sprawling 4BHK villa situated in the quiet suburbs. Features a private pool, landscaped gardens, and smart home automation.',
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
  },
  {
    id: '2',
    title: 'Modern 2BHK in City Center',
    description: 'A cozy and modern apartment perfect for young professionals. Close to metro station and shopping malls.',
    price: 35000,
    location: 'Sector 18',
    city: 'Noida',
    type: 'Apartment',
    listingType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    balconies: 2,
    area: 1100,
    superBuiltUpArea: 1100,
    builtUpArea: 950,
    carpetArea: 850,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=1680&q=80',
    amenities: ['Gym', 'Parking', 'Club House', 'Lift', 'Power Backup'],
    ownerContact: '+91 98765 43211',
    datePosted: '2023-10-20',
    isFeatured: true,
    constructionStatus: 'Ready to Move',
    furnishedStatus: 'Semi-Furnished',
    listedBy: 'Owner',
    facing: 'East',
    exitFacing: 'West',
    parkingSpaces: 1,
    floor: 12,
    totalFloors: 20,
    parkingType: 'Covered',
    views: ['Road'],
    yearBuilt: 2019,
    additionalRooms: ['Store Room'],
    brokerageType: 'None',
    isVerified: false,
    status: 'Pending',
    pageViews: 450,
    leads: 5,
    ownerId: 'u3'
  },
  {
    id: '6',
    title: 'Luxury Penthouse with Terrace',
    description: 'Stunning penthouse offering breathtaking city views, private terrace garden, and exclusive elevator access.',
    price: 35000000,
    location: 'Sector 44',
    city: 'Noida',
    type: 'Penthouse',
    listingType: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    area: 4500,
    superBuiltUpArea: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
    amenities: ['Private Terrace', 'Jacuzzi', 'Concierge', 'Gym', 'Swimming Pool'],
    ownerContact: '+91 98765 43215',
    datePosted: '2023-11-01',
    isFeatured: true,
    constructionStatus: 'Ready to Move',
    furnishedStatus: 'Fully Furnished',
    listedBy: 'Agent',
    ownershipType: 'Freehold',
    facing: 'North',
    exitFacing: 'South',
    parkingSpaces: 3,
    floor: 18,
    totalFloors: 18,
    reraApproved: true,
    views: ['City', 'Park'],
    yearBuilt: 2020,
    brokerageType: 'Percentage of Price',
    brokerageAmount: 1,
    documents: ['Sale Deed', 'Occupancy Certificate (OC)', 'Completion Certificate (CC)'],
    isVerified: false,
    status: 'Draft',
    ownerId: 'u2'
  }
];

const INITIAL_USERS: User[] = [
    { id: 'admin', name: 'Super Admin', email: 'admin@kiwi.com', phone: '0000000000', role: 'Admin', joinDate: '2023-01-01', isVerified: true, status: 'Active' },
    { id: 'u1', name: 'Vaibhav Arora', email: 'vaibhav@arora.com', phone: '9876543210', role: 'Broker', joinDate: '2023-01-15', isVerified: true, status: 'Active', propertiesListed: 24, companyName: 'Arora Estates', licenseNumber: 'RERA-123' },
    { id: 'u2', name: 'John Doe', email: 'john@gmail.com', phone: '9876543211', role: 'Buyer', joinDate: '2023-05-10', isVerified: true, status: 'Active' },
    { id: 'u3', name: 'Suresh Raina', email: 'suresh@builder.com', phone: '9876543212', role: 'Seller', joinDate: '2023-08-20', isVerified: false, status: 'Active', propertiesListed: 2 },
];

const App: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home featuredProperties={properties.filter(p => p.isFeatured && p.status === 'Approved')} />} />
        <Route path="/buy" element={<Listings properties={properties.filter(p => p.status === 'Approved')} type="sale" />} />
        <Route path="/rent" element={<Listings properties={properties.filter(p => p.status === 'Approved')} type="rent" />} />
        
        {/* User Post Property Route */}
        <Route path="/sell" element={<PostProperty onAddProperty={handleAddProperty} isAdmin={false} />} />
        
        <Route path="/property/:id" element={<PropertyDetails properties={properties} />} />
        <Route path="/find-agent" element={<FindAgent />} />
        <Route path="/settings" element={<Settings />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<AdminDashboard properties={properties} />} />
           
           <Route path="properties" element={<PropertyManagement properties={properties} setProperties={setProperties} />} />
           
           <Route path="post-property" element={<PostProperty onAddProperty={handleAddProperty} isAdmin={true} />} />

           <Route path="people" element={<UserManagement users={users} setUsers={setUsers} />} />
           
           <Route path="leads" element={<AdminPeople />} />
           <Route path="analytics" element={<AdminDashboard properties={properties} />} />
           <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};


export default App;
