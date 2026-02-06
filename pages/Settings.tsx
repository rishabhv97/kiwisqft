import React, { useState } from 'react';
import { User, Lock, Bell, Shield, LogOut, Camera, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'privacy';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Mock User State
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    bio: 'Real estate enthusiast and property investor.',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
    twoFactor: true,
    notifications: {
        email: true,
        push: false,
        sms: true,
        promos: false
    },
    privacy: {
        profileVisible: true,
        showActivity: false
    }
  });

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        setIsSaving(false);
        alert('Settings saved successfully!');
    }, 1000);
  };

  const handleLogout = () => {
    if(window.confirm('Are you sure you want to log out?')) {
        navigate('/');
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Management', icon: User },
    { id: 'security', label: 'Password & Security', icon: Lock },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'privacy', label: 'Privacy Settings', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings & Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-72 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                    <nav className="flex flex-col p-2 gap-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as SettingsTab)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                    activeTab === item.id 
                                    ? 'bg-brand-green text-white shadow-md' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                                {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-75" />}
                            </button>
                        ))}
                        
                        <div className="h-px bg-gray-100 my-2"></div>
                        
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
                    
                    {/* PROFILE MANAGEMENT */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <User className="text-brand-green" /> Profile Management
                            </h2>
                            
                            <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
                                <div className="relative group cursor-pointer self-center md:self-start">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="text-white" size={20} />
                                    </div>
                                </div>
                                <div className="flex-1 w-full space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input 
                                                type="text" 
                                                value={user.name} 
                                                onChange={(e) => setUser({...user, name: e.target.value})}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input 
                                                type="tel" 
                                                value={user.phone}
                                                onChange={(e) => setUser({...user, phone: e.target.value})}
                                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={user.email}
                                            onChange={(e) => setUser({...user, email: e.target.value})}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-gray-50" 
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea 
                                            rows={3} 
                                            value={user.bio}
                                            onChange={(e) => setUser({...user, bio: e.target.value})}
                                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PASSWORD & SECURITY */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Lock className="text-brand-green" /> Password & Security
                            </h2>

                            <div className="space-y-6 max-w-2xl">
                                <div>
                                    <h3 className="text-md font-semibold text-gray-900 mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="text-md font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div>
                                            <p className="font-medium text-gray-800">Secure your account</p>
                                            <p className="text-sm text-gray-500">Require a code when signing in from a new device.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={user.twoFactor} 
                                                onChange={() => setUser({...user, twoFactor: !user.twoFactor})}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeTab === 'notifications' && (
                         <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Bell className="text-brand-green" /> Notification Preferences
                            </h2>

                            <div className="space-y-4 max-w-2xl">
                                {[
                                    { key: 'email', title: 'Email Notifications', desc: 'Receive updates on your property listings via email.' },
                                    { key: 'push', title: 'Push Notifications', desc: 'Get real-time alerts on your browser or mobile device.' },
                                    { key: 'sms', title: 'SMS Alerts', desc: 'Get important messages directly to your phone number.' },
                                    { key: 'promos', title: 'Marketing & Promotions', desc: 'Receive offers, newsletters and survey requests.' }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.title}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                checked={(user.notifications as any)[item.key]}
                                                onChange={() => setUser({
                                                    ...user, 
                                                    notifications: { 
                                                        ...user.notifications, 
                                                        [item.key]: !(user.notifications as any)[item.key] 
                                                    }
                                                })}
                                                className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green accent-brand-green"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PRIVACY */}
                    {activeTab === 'privacy' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <Shield className="text-brand-green" /> Privacy Settings
                            </h2>

                            <div className="space-y-6 max-w-2xl">
                                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Your contact details are shared only with verified agents or sellers when you explicitly show interest in a property.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-800">Public Profile</p>
                                            <p className="text-sm text-gray-500">Allow others to see your profile and listed properties.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={user.privacy.profileVisible} 
                                                onChange={() => setUser({...user, privacy: {...user.privacy, profileVisible: !user.privacy.profileVisible}})}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-800">Show Activity Status</p>
                                            <p className="text-sm text-gray-500">Let others see when you were last active.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={user.privacy.showActivity} 
                                                onChange={() => setUser({...user, privacy: {...user.privacy, showActivity: !user.privacy.showActivity}})}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-green"></div>
                                        </label>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100">
                                        <button className="text-red-600 text-sm font-semibold hover:underline">
                                            Request Account Deletion
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">Permanently remove your account and all associated data.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SAVE BUTTON */}
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-brand-green text-white px-8 py-3 rounded-lg font-bold hover:bg-emerald-800 transition-colors shadow-lg shadow-brand-green/20 flex items-center gap-2"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                            {!isSaving && <Check size={18} />}
                        </button>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;