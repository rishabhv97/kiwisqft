import React from 'react';
import { Property } from '../../../types';
import { TrendingUp, Users, CheckCircle, AlertCircle, DollarSign, FileText } from 'lucide-react';

interface AdminDashboardProps {
  properties: Property[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ properties }) => {
  // Calculated Stats
  const totalProperties = properties.length;
  const verifiedProperties = properties.filter(p => p.isVerified).length;
  const pendingReview = properties.filter(p => p.status === 'Pending' || p.status === 'Under Review').length;
  
  const mockLeadsCount = 128;
  const mockRevenue = "₹ 12.5 L";

  const StatCard = ({ title, value, subtext, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      {subtext && <p className="text-xs text-gray-400 flex items-center gap-1">{subtext}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 1. Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Properties" 
          value={totalProperties} 
          subtext={`${properties.length - 2} Active Listings`} 
          icon={FileText} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Verified Properties" 
          value={verifiedProperties} 
          subtext={`${totalProperties > 0 ? ((verifiedProperties/totalProperties)*100).toFixed(0) : 0}% Verification Rate`} 
          icon={CheckCircle} 
          color="bg-brand-green" 
        />
        <StatCard 
          title="Total Leads" 
          value={mockLeadsCount} 
          subtext={<><span className="text-green-600 font-bold">+12</span> today</>} 
          icon={Users} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Est. Revenue" 
          value={mockRevenue} 
          subtext="From commissions & ads" 
          icon={DollarSign} 
          color="bg-brand-brown" 
        />
      </div>

      {/* 2. Pending Actions & Analytics Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
           <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
             <AlertCircle size={18} className="text-orange-500" /> Pending Actions
           </h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
                 <span className="text-sm font-medium text-orange-800">{pendingReview} Properties pending review</span>
                 <button className="text-xs font-bold bg-white text-orange-600 px-3 py-1 rounded border border-orange-200 hover:bg-orange-100">Review</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                 <span className="text-sm font-medium text-blue-800">12 New Leads unassigned</span>
                 <button className="text-xs font-bold bg-white text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100">Assign</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                 <span className="text-sm font-medium text-gray-700">3 Agents Verification Pending</span>
                 <button className="text-xs font-bold bg-white text-gray-600 px-3 py-1 rounded border border-gray-300 hover:bg-gray-100">View</button>
              </div>
           </div>
        </div>

        {/* Mini Analytics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp size={18} className="text-brand-green" /> Engagement Overview
                </h3>
                <select className="text-xs border-gray-200 rounded p-1 bg-gray-50">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>
            
            {/* Mock Chart Visualization using Flexbox bars */}
            <div className="flex items-end justify-between h-40 gap-2 mb-4 px-2">
                {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                    <div key={i} className="w-full bg-brand-lightGreen/50 rounded-t-lg relative group hover:bg-brand-green transition-colors" style={{height: `${h}%`}}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h*12} Views
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
                 <div>
                    <p className="text-xs text-gray-500 uppercase">Property Views</p>
                    <p className="text-lg font-bold text-gray-800">4,250</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase">Enquiries</p>
                    <p className="text-lg font-bold text-gray-800">328</p>
                 </div>
                 <div>
                    <p className="text-xs text-gray-500 uppercase">Conversion</p>
                    <p className="text-lg font-bold text-brand-green">7.8%</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;