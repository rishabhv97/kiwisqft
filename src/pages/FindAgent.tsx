import React, { useState } from 'react';
import { Search, MapPin, Phone, Star, ShieldCheck, Building2, ChevronRight, Mail, Languages, Award } from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'Vaibhav Arora',
    role: 'Premier Agent',
    company: 'Arora Estates',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '15 Years',
    activeListings: 42,
    soldCount: 156,
    rating: 4.9,
    reviewCount: 124,
    location: 'Sector 150, Noida',
    topAreas: ['Sector 150', 'Sector 144', 'Greater Noida West'],
    languages: ['English', 'Hindi', 'Punjabi'],
    verified: true,
    email: 'vaibhav@aroraestates.com'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Luxury Specialist',
    company: 'Premium Living',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '8 Years',
    activeListings: 15,
    soldCount: 89,
    rating: 4.8,
    reviewCount: 95,
    location: 'Sector 44, Noida',
    topAreas: ['Sector 44', 'Sector 15A', 'Sector 128'],
    languages: ['English', 'Hindi'],
    verified: true,
    email: 'sarah@premiumliving.com'
  },
   {
    id: 3,
    name: 'Rajesh Kumar',
    role: 'Commercial Expert',
    company: 'Noida Realtors',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '12 Years',
    activeListings: 28,
    soldCount: 210,
    rating: 4.7,
    reviewCount: 180,
    location: 'Sector 62, Noida',
    topAreas: ['Sector 62', 'Sector 63', 'Sector 18'],
    languages: ['English', 'Hindi'],
    verified: true,
    email: 'rajesh@noidarealtors.com'
  },
  {
    id: 4,
    name: 'Priya Sharma',
    role: 'Rental Specialist',
    company: 'City Homes',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '5 Years',
    activeListings: 60,
    soldCount: 320, 
    rating: 4.6,
    reviewCount: 88,
    location: 'Sector 75, Noida',
    topAreas: ['Sector 75', 'Sector 76', 'Sector 137'],
    languages: ['English', 'Hindi'],
    verified: true,
    email: 'priya@cityhomes.com'
  },
  {
    id: 5,
    name: 'Amit Verma',
    role: 'Senior Consultant',
    company: 'Dream Spaces',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '20 Years',
    activeListings: 35,
    soldCount: 450,
    rating: 5.0,
    reviewCount: 310,
    location: 'Sector 128, Noida',
    topAreas: ['Sector 128', 'Jaypee Wish Town', 'Sector 134'],
    languages: ['English', 'Hindi'],
    verified: true,
    email: 'amit@dreamspaces.com'
  },
  {
    id: 6,
    name: 'Meera Reddy',
    role: 'Residential Agent',
    company: 'Reddy Associates',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    experience: '10 Years',
    activeListings: 18,
    soldCount: 112,
    rating: 4.5,
    reviewCount: 65,
    location: 'Greater Noida West',
    topAreas: ['Greater Noida West', 'Tech Zone 4', 'Sector 1'],
    languages: ['English', 'Telugu', 'Hindi'],
    verified: false,
    email: 'meera@reddyassociates.com'
  }
];

const FindAgent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');

  const filteredAgents = agents.filter(agent => {
    const matchesName = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        agent.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationTerm === '' || 
                            agent.location.toLowerCase().includes(locationTerm.toLowerCase()) ||
                            agent.topAreas.some(area => area.toLowerCase().includes(locationTerm.toLowerCase()));
    
    return matchesName && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Search Header */}
      <div className="bg-brand-green pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
           <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Find An Agent</h1>
           <p className="text-brand-lightGreen text-center mb-8 max-w-2xl mx-auto">
             Connect with top-rated local experts who can help you buy, sell, or rent your property with confidence.
           </p>

           <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-transparent focus-within:border-brand-green focus-within:bg-white transition-colors">
                 <Search className="text-gray-400 mr-2" size={20} />
                 <input 
                    type="text" 
                    placeholder="Search by agent name or company..." 
                    className="w-full bg-transparent outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
              <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-transparent focus-within:border-brand-green focus-within:bg-white transition-colors">
                 <MapPin className="text-gray-400 mr-2" size={20} />
                 <input 
                    type="text" 
                    placeholder="Search by locality or city..." 
                    className="w-full bg-transparent outline-none text-gray-700"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                 />
              </div>
              <button className="bg-brand-brown text-white font-bold py-3 px-8 rounded-lg hover:bg-stone-800 transition-colors">
                Search
              </button>
           </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
         <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-8 text-sm text-gray-600">
            <div><span className="font-bold text-gray-900">{agents.length}</span> Verified Agents</div>
            <div><span className="font-bold text-gray-900">500+</span> Properties Sold this month</div>
            <div><span className="font-bold text-gray-900">4.8/5</span> Average Rating</div>
         </div>
      </div>

      {/* Agent List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
         {filteredAgents.length > 0 ? (
           <div className="grid grid-cols-1 gap-6">
             {filteredAgents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow p-6 flex flex-col md:flex-row gap-6">
                   
                   {/* Left: Image & Basics */}
                   <div className="flex-shrink-0 flex flex-col items-center md:items-start md:w-48">
                      <div className="relative mb-3">
                         <img 
                          src={agent.image} 
                          alt={agent.name} 
                          className="w-32 h-32 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                         />
                         {agent.verified && (
                            <div className="absolute bottom-1 right-1 bg-brand-green text-white p-1 rounded-full border-2 border-white" title="Verified Agent">
                               <ShieldCheck size={14} />
                            </div>
                         )}
                      </div>
                      <div className="text-center md:text-left">
                         <h3 className="font-bold text-lg text-gray-900">{agent.name}</h3>
                         <p className="text-sm text-gray-500 mb-1">{agent.role}</p>
                         <p className="text-xs font-semibold text-brand-brown bg-brand-brown/5 px-2 py-0.5 rounded-full inline-block">
                           {agent.company}
                         </p>
                      </div>
                   </div>

                   {/* Middle: Stats & Bio */}
                   <div className="flex-grow border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                         <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Experience</p>
                            <p className="font-semibold text-gray-900">{agent.experience}</p>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Active Listings</p>
                            <p className="font-semibold text-gray-900">{agent.activeListings}</p>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Properties Sold</p>
                            <p className="font-semibold text-gray-900">{agent.soldCount}</p>
                         </div>
                         <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Rating</p>
                            <div className="flex items-center gap-1 font-semibold text-gray-900">
                               {agent.rating} <Star size={14} className="fill-yellow-400 text-yellow-400" />
                               <span className="text-xs font-normal text-gray-400">({agent.reviewCount})</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2 mb-4">
                         <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                            <div>
                               <span className="text-sm font-bold text-gray-700">Operating In: </span>
                               <span className="text-sm text-gray-600">{agent.topAreas.join(', ')}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <Languages size={16} className="text-gray-400 flex-shrink-0" />
                            <div>
                               <span className="text-sm font-bold text-gray-700">Speaks: </span>
                               <span className="text-sm text-gray-600">{agent.languages.join(', ')}</span>
                            </div>
                         </div>
                      </div>

                   </div>

                   {/* Right: Actions */}
                   <div className="flex flex-col gap-3 justify-center md:w-48 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                      <button className="w-full bg-brand-green text-white font-bold py-2.5 rounded-lg hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
                         <Phone size={18} /> Call Agent
                      </button>
                      <button className="w-full bg-white text-gray-700 border border-gray-300 font-bold py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                         <Mail size={18} /> Send Message
                      </button>
                      <button className="w-full text-brand-brown text-sm font-bold hover:underline flex items-center justify-center gap-1 mt-2">
                         View Profile <ChevronRight size={16} />
                      </button>
                   </div>

                </div>
             ))}
           </div>
         ) : (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Building2 className="text-gray-400" size={30} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">No agents found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
              <button 
                onClick={() => {setSearchTerm(''); setLocationTerm('');}}
                className="mt-4 px-4 py-2 bg-brand-green text-white rounded-lg text-sm font-medium hover:bg-emerald-800"
              >
                Clear Search
              </button>
           </div>
         )}
      </div>

    </div>
  );
};

export default FindAgent;