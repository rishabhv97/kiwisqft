
import React, { useState } from 'react';
import { Property, PropertyStatus } from '../../types';
import { Check, X, Eye, Trash2, ShieldCheck, FileText, PlusCircle, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface PropertyManagementProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

const PropertyManagement: React.FC<PropertyManagementProps> = ({ properties, setProperties }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected' | 'Sold'>('All');
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);

  const handleStatusChange = (id: string, newStatus: PropertyStatus, isVerified: boolean) => {
    setProperties(prev => prev.map(p => 
        p.id === id ? { ...p, status: newStatus, isVerified: isVerified } : p
    ));
    if (selectedProp?.id === id) {
        setSelectedProp(prev => prev ? { ...prev, status: newStatus, isVerified: isVerified } : null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      setProperties(prev => prev.filter(p => p.id !== id));
      if (selectedProp?.id === id) setSelectedProp(null);
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filter === 'All') return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
           <p className="text-gray-500 text-sm">Approve user listings or post new ones.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/post-property')}
          className="bg-brand-brown text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-900 transition-colors shadow-lg shadow-brand-brown/20"
        >
            <PlusCircle size={18} /> Post New Property
        </button>
      </div>

      <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
          {['All', 'Pending', 'Approved', 'Rejected', 'Sold'].map(tab => (
              <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${filter === tab ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIST SECTION */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200 sticky top-0">
                        <tr>
                            <th className="px-6 py-4">Property</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Listed By</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProperties.map(p => (
                            <tr key={p.id} className={`hover:bg-gray-50 cursor-pointer ${selectedProp?.id === p.id ? 'bg-blue-50/50' : ''}`} onClick={() => setSelectedProp(p)}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <p className="font-bold text-gray-900 line-clamp-1">{p.title}</p>
                                            <p className="text-xs text-gray-500">ID: {p.id} • ₹{p.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${
                                        p.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                                        p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                        p.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                        'bg-gray-100 text-gray-700 border-gray-200'
                                    }`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-600">
                                    {p.listedBy}
                                    {p.ownerId === 'admin' && <span className="ml-1 text-brand-brown font-bold">(Admin)</span>}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={(e) => {e.stopPropagation(); handleDelete(p.id);}}
                                        className="p-2 rounded hover:bg-red-100 text-red-600" title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProperties.length === 0 && (
                  <div className="p-12 text-center text-gray-400">No properties found.</div>
                )}
            </div>
        </div>

        {/* DETAILS / ACTION PANEL */}
        <div className="lg:col-span-1">
            {selectedProp ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Details & Actions</h2>
                        <button onClick={() => setSelectedProp(null)}><X size={20} className="text-gray-400" /></button>
                    </div>

                    <img src={selectedProp.imageUrl} className="w-full h-40 object-cover rounded-lg mb-4" />
                    <div className="mb-4">
                        <h3 className="font-bold text-gray-800 line-clamp-2">{selectedProp.title}</h3>
                        <p className="text-sm text-gray-500">{selectedProp.location}, {selectedProp.city}</p>
                        <div className="flex gap-2 mt-2">
                             <span className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedProp.type}</span>
                             <span className="text-xs bg-gray-100 px-2 py-1 rounded">{selectedProp.area} sqft</span>
                        </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                        <h4 className="font-bold text-sm text-gray-800">Moderation</h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleStatusChange(selectedProp.id, 'Approved', true)}
                                className={`py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                                    selectedProp.status === 'Approved' 
                                    ? 'bg-green-600 text-white border-green-600' 
                                    : 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                                }`}
                            >
                                <Check size={16} /> Approve
                            </button>
                            
                            <button 
                                onClick={() => handleStatusChange(selectedProp.id, 'Rejected', false)}
                                className={`py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                                    selectedProp.status === 'Rejected' 
                                    ? 'bg-red-600 text-white border-red-600' 
                                    : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                                }`}
                            >
                                <X size={16} /> Reject
                            </button>
                        </div>

                        {selectedProp.status === 'Approved' && (
                             <button 
                                onClick={() => handleStatusChange(selectedProp.id, 'Sold', true)}
                                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-200 border border-gray-200"
                            >
                                Mark as Sold
                            </button>
                        )}
                        
                        <Link 
                            to={`/property/${selectedProp.id}`} target="_blank"
                            className="w-full py-2 bg-brand-green/10 text-brand-green rounded-lg font-bold text-sm hover:bg-brand-green/20 flex items-center justify-center gap-2"
                        >
                            <Eye size={16} /> Preview Listing
                        </Link>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-bold text-sm text-gray-800 mb-2">Documents</h4>
                        {selectedProp.documents && selectedProp.documents.length > 0 ? (
                            <ul className="text-xs text-gray-600 space-y-1">
                                {selectedProp.documents.map((d, i) => <li key={i} className="flex items-center gap-2"><FileText size={12}/> {d}</li>)}
                            </ul>
                        ) : <p className="text-xs text-gray-400 italic">No documents uploaded</p>}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                    <ShieldCheck size={48} className="mb-4 opacity-50" />
                    <p className="font-medium">Select a property to moderate.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PropertyManagement;
