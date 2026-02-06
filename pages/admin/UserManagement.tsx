
import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { Search, Plus, Shield, User as UserIcon, Building2, Trash2, Edit2, X, Check, Filter } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers }) => {
  const [filterRole, setFilterRole] = useState<'All' | UserRole>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Broker Form State
  const [newBroker, setNewBroker] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    licenseNumber: ''
  });

  const handleAddBroker = (e: React.FormEvent) => {
    e.preventDefault();
    const broker: User = {
      id: `u-${Date.now()}`,
      name: newBroker.name,
      email: newBroker.email,
      phone: newBroker.phone,
      role: 'Broker',
      joinDate: new Date().toISOString().split('T')[0],
      isVerified: true, // Admin created brokers are auto-verified
      status: 'Active',
      propertiesListed: 0,
      companyName: newBroker.companyName,
      licenseNumber: newBroker.licenseNumber
    };
    
    setUsers([broker, ...users]);
    setIsModalOpen(false);
    setNewBroker({ name: '', email: '', phone: '', companyName: '', licenseNumber: '' });
    alert('Broker profile created successfully!');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
        if (u.id === id) {
            return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
        }
        return u;
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'All' || user.role === filterRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.phone.includes(searchTerm);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
           <p className="text-gray-500 text-sm">Manage Buyers, Sellers, and Brokers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-green text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-emerald-800 transition-colors shadow-lg shadow-brand-green/20"
        >
            <Plus size={18} /> Create Broker Profile
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {['All', 'Buyer', 'Seller', 'Broker', 'Admin'].map((role) => (
                <button
                    key={role}
                    onClick={() => setFilterRole(role as any)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filterRole === role ? 'bg-white text-brand-green shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {role}
                </button>
            ))}
        </div>
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
            <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-green"
            />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                        <p className="text-xs text-gray-500">{user.phone}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                    user.role === 'Broker' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    user.role === 'Seller' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                    'bg-gray-50 text-gray-700 border-gray-100'
                                }`}>
                                    {user.role === 'Admin' && <Shield size={12}/>}
                                    {user.role === 'Broker' && <Building2 size={12}/>}
                                    {user.role}
                                </span>
                                {user.companyName && (
                                    <p className="text-xs text-gray-400 mt-1">{user.companyName}</p>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {user.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                                {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {user.role !== 'Admin' && (
                                    <button 
                                        onClick={() => toggleUserStatus(user.id)}
                                        className={`text-xs font-bold px-3 py-1 rounded border transition-colors ${
                                            user.status === 'Active' 
                                            ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                            : 'border-green-200 text-green-600 hover:bg-green-50'
                                        }`}
                                    >
                                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-400">No users found.</div>
        )}
      </div>

      {/* CREATE BROKER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900">Create Broker Profile</h2>
                    <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400 hover:text-gray-600"/></button>
                </div>
                <form onSubmit={handleAddBroker} className="p-6 space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700 mb-2">
                        <strong>Note:</strong> Brokers created by Admin are automatically verified and granted access to Agent tools.
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                        <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-green" 
                            value={newBroker.name} onChange={e => setNewBroker({...newBroker, name: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                        <input required type="email" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-green" 
                            value={newBroker.email} onChange={e => setNewBroker({...newBroker, email: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                        <input required type="tel" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-green" 
                            value={newBroker.phone} onChange={e => setNewBroker({...newBroker, phone: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label>
                            <input required type="text" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-green" 
                                value={newBroker.companyName} onChange={e => setNewBroker({...newBroker, companyName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">License No.</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:border-brand-green" 
                                value={newBroker.licenseNumber} onChange={e => setNewBroker({...newBroker, licenseNumber: e.target.value})} />
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-emerald-800 transition-colors mt-4">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
