import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient'; // Import Client
import { User, UserRole } from '../../types';
import { Search, Shield, User as UserIcon, Building2, Trash2, X } from 'lucide-react';

// REMOVED PROPS INTERFACE
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Local state for fetched users
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'All' | UserRole>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch Users from Supabase on Load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Fetch profiles. Note: 'auth.users' is private, so we fetch from our public 'profiles' table
    const { data, error } = await supabase.from('profiles').select('*');
    
    if (data) {
      // Map DB structure to your User type
      const mappedUsers: User[] = data.map((u: any) => ({
        id: u.id,
        name: u.name || 'Unknown',
        email: u.email,
        phone: u.phone || '',
        role: u.role,
        joinDate: u.created_at,
        isVerified: u.is_verified,
        status: 'Active', // You might want to add a status column to DB later
        companyName: u.company_name
      }));
      setUsers(mappedUsers);
    }
    setLoading(false);
  };

  // ... (Keep your existing table rendering code, it works fine with the 'users' state above) ...
  // ... (Keep the Filter and Search logic, it works fine) ...
  
  return (
    <div className="space-y-6">
       {/* ... existing header ... */}
       {loading ? <p>Loading users...</p> : (
         // ... existing table code ...
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* The rest of your table implementation goes here exactly as before */}
         </div>
       )}
    </div>
  );
};

export default UserManagement;