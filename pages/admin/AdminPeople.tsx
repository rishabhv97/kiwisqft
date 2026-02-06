import React, { useState } from 'react';
import { Lead } from '../../types';
import { Phone, Mail } from 'lucide-react';

const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h4 className="font-bold text-gray-900">{lead.name}</h4>
                <div className="flex gap-2 text-xs mt-1">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{lead.interest}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{lead.source}</span>
                </div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                lead.status === 'New' ? 'bg-green-100 text-green-700' :
                lead.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700'
            }`}>{lead.status}</span>
        </div>
        <div className="space-y-1 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-2"><Phone size={14}/> {lead.phone}</div>
            <div className="flex items-center gap-2"><Mail size={14}/> {lead.email}</div>
        </div>
        <div className="flex gap-2 border-t border-gray-100 pt-3">
             <button className="flex-1 py-1.5 text-xs font-bold bg-brand-green text-white rounded hover:bg-emerald-800">Call Now</button>
             <button className="flex-1 py-1.5 text-xs font-bold bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50">View Details</button>
        </div>
    </div>
);

const AdminPeople: React.FC = () => {
  // MOCK DATA
  const [leads] = useState<Lead[]>([
    { id: '1', name: 'Rahul Sharma', phone: '+91 9876543210', email: 'rahul@test.com', interest: 'Buy', source: 'Website', status: 'New', date: '2023-10-24' },
    { id: '2', name: 'Priya Singh', phone: '+91 9876543211', email: 'priya@test.com', interest: 'Rent', source: 'Instagram', status: 'Contacted', date: '2023-10-23' },
    { id: '3', name: 'Amit Verma', phone: '+91 9876543212', email: 'amit@test.com', interest: 'Sell', source: 'Referral', status: 'Closed', date: '2023-10-20' },
    { id: '4', name: 'Sneha Gupta', phone: '+91 9876543213', email: 'sneha@test.com', interest: 'Buy', source: 'Ads', status: 'Follow-up', date: '2023-10-25' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-2">
         <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Column 1: New */}
            <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-bold text-gray-700 mb-4 flex justify-between">New Leads <span className="bg-white px-2 rounded-full text-xs py-0.5 border">2</span></h3>
                <div className="space-y-3">
                    {leads.filter(l => l.status === 'New').map(lead => <LeadCard key={lead.id} lead={lead} />)}
                    <div className="p-3 bg-white border border-dashed border-gray-300 rounded text-center text-xs text-gray-400 cursor-pointer hover:border-brand-green hover:text-brand-green">+ Add Manual Lead</div>
                </div>
            </div>
                {/* Column 2: Contacted */}
                <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="font-bold text-gray-700 mb-4 flex justify-between">In Progress <span className="bg-white px-2 rounded-full text-xs py-0.5 border">1</span></h3>
                <div className="space-y-3">
                    {leads.filter(l => l.status === 'Contacted' || l.status === 'Follow-up').map(lead => <LeadCard key={lead.id} lead={lead} />)}
                </div>
            </div>
                {/* Column 3: Closed */}
                <div className="bg-gray-50 p-4 rounded-xl opacity-80">
                <h3 className="font-bold text-gray-700 mb-4 flex justify-between">Closed <span className="bg-white px-2 rounded-full text-xs py-0.5 border">1</span></h3>
                <div className="space-y-3">
                    {leads.filter(l => l.status === 'Closed').map(lead => <LeadCard key={lead.id} lead={lead} />)}
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminPeople;