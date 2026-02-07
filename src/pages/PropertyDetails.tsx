import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Property } from '../types';
import { MapPin, BedDouble, Bath, Square, Calendar, Phone, Share2, Heart, CheckCircle2, UserCheck, Ruler, Building, Compass, Layers, Home, Info, ShieldCheck } from 'lucide-react';

interface PropertyDetailsProps {
  properties: Property[];
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ properties }) => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const found = properties.find(p => p.id === id);
    if (found) setProperty(found);
  }, [id, properties]);

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const formatPrice = (price: number) => {
    if (property.listingType === 'rent') {
      return `₹${price.toLocaleString()}/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Gallery Section */}
      <div className="h-[400px] md:h-[500px] relative">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
          <Link to="/" className="text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2">
            ← Back
          </Link>
          <div className="flex gap-2">
            <button className="p-3 bg-white rounded-full text-gray-700 hover:text-red-500 shadow-lg">
              <Heart size={20} />
            </button>
            <button className="p-3 bg-white rounded-full text-gray-700 hover:text-brand-green shadow-lg">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-gray-100 flex flex-col md:flex-row gap-10">
          
          <div className="md:w-2/3">
            {/* Header Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${property.listingType === 'sale' ? 'bg-brand-brown text-white' : 'bg-brand-green text-white'}`}>
                For {property.listingType}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-600">
                {property.type}
              </span>
              {property.ownershipType && (
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-blue-50 text-blue-700">
                  {property.ownershipType}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600 mb-8">
              <MapPin size={18} className="mr-1 text-brand-brown" />
              {property.location}, {property.city}
            </div>

            {/* Key Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-8">
              <div className="text-center md:text-left">
                <span className="block text-gray-400 text-sm mb-1 flex items-center justify-center md:justify-start gap-1"><BedDouble size={14} /> Bedrooms</span>
                <span className="text-xl font-bold text-gray-900">{property.bedrooms}</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-gray-400 text-sm mb-1 flex items-center justify-center md:justify-start gap-1"><Bath size={14} /> Bathrooms</span>
                <span className="text-xl font-bold text-gray-900">{property.bathrooms}</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-gray-400 text-sm mb-1 flex items-center justify-center md:justify-start gap-1"><Compass size={14} /> Balconies</span>
                <span className="text-xl font-bold text-gray-900">{property.balconies ?? '0'}</span>
              </div>
              <div className="text-center md:text-left">
                <span className="block text-gray-400 text-sm mb-1 flex items-center justify-center md:justify-start gap-1"><Square size={14} /> Super Area</span>
                <span className="text-xl font-bold text-gray-900">{property.area} sqft</span>
              </div>
            </div>

            {/* Area Details Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Ruler size={18} className="text-brand-green" /> Area Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Carpet Area</span>
                    <span className="text-lg font-bold text-gray-900">{property.carpetArea ? `${property.carpetArea} sqft` : '-'}</span>
                 </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Built-up Area</span>
                    <span className="text-lg font-bold text-gray-900">{property.builtUpArea ? `${property.builtUpArea} sqft` : '-'}</span>
                 </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Super Built-up</span>
                    <span className="text-lg font-bold text-gray-900">{property.superBuiltUpArea ? `${property.superBuiltUpArea} sqft` : '-'}</span>
                 </div>
              </div>
            </div>

            {/* Additional Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                <div>
                   <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Property Overview</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between">
                         <span className="text-gray-600 flex items-center gap-2"><Building size={16}/> Floor</span>
                         <span className="font-medium text-gray-900">{property.floor} / {property.totalFloors}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-600 flex items-center gap-2"><Compass size={16}/> Facing</span>
                         <span className="font-medium text-gray-900">{property.facing}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-600 flex items-center gap-2"><Layers size={16}/> Furnishing</span>
                         <span className="font-medium text-gray-900">{property.furnishedStatus}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-600 flex items-center gap-2"><ShieldCheck size={16}/> RERA Status</span>
                         <span className={`font-medium ${property.reraApproved ? 'text-green-600' : 'text-gray-900'}`}>{property.reraApproved ? 'Approved' : 'Not Specified'}</span>
                      </div>
                   </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Possession & Age</h3>
                     <div className="space-y-4">
                      <div className="flex justify-between">
                         <span className="text-gray-600">Status</span>
                         <span className="font-medium text-gray-900">{property.constructionStatus}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-600">Year Built</span>
                         <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-600">Parking</span>
                         <span className="font-medium text-gray-900">{property.parkingSpaces} ({property.parkingType})</span>
                      </div>
                   </div>
                </div>
            </div>

            {/* Additional Rooms */}
            {property.additionalRooms && property.additionalRooms.length > 0 && (
                <div className="mb-8">
                     <h3 className="font-bold text-gray-900 mb-3">Additional Rooms</h3>
                     <div className="flex flex-wrap gap-2">
                        {property.additionalRooms.map(room => (
                            <span key={room} className="px-3 py-1 bg-brand-lightGreen/30 text-brand-green rounded-full text-sm font-medium border border-brand-green/20">
                                {room}
                            </span>
                        ))}
                     </div>
                </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-brand-brown mb-4">About Property</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-brand-brown mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <CheckCircle2 size={16} className="text-brand-green flex-shrink-0" />
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="md:w-1/3">
            <div className="bg-brand-beige p-6 rounded-xl border border-brand-green/10 sticky top-24">
              <div className="mb-6">
                <span className="block text-gray-500 text-sm mb-1">Total Price</span>
                <div className="text-4xl font-bold text-brand-green mb-2">{formatPrice(property.price)}</div>
                
                <div className="space-y-1 text-xs text-gray-500">
                    {property.allInclusivePrice && <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-600"/> All Inclusive Price</div>}
                    {property.priceNegotiable && <div className="flex items-center gap-1"><CheckCircle2 size={12} className="text-green-600"/> Price Negotiable</div>}
                    {property.taxExcluded && <div className="flex items-center gap-1 text-orange-600"><Info size={12}/> Tax & Govt. Charges Excluded</div>}
                </div>
              </div>

              {property.brokerageType && property.brokerageType !== 'None' && (
                  <div className="bg-white/50 p-3 rounded-lg mb-6 border border-gray-200">
                      <p className="text-xs text-gray-500 font-bold uppercase mb-1">Brokerage</p>
                      <p className="text-sm font-medium text-gray-800">
                          {property.brokerageType}: {property.brokerageType === 'Fixed' ? `₹${property.brokerageAmount}` : `${property.brokerageAmount}%`}
                          {property.brokerageNegotiable && <span className="text-xs font-normal text-green-600 ml-1">(Negotiable)</span>}
                      </p>
                  </div>
              )}

              <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                  {property.listedBy === 'Agent' ? 'AG' : property.listedBy === 'Owner' ? 'OW' : 'BD'}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{property.listedBy} Contact</p>
                  <p className="text-xs text-gray-500">Verified Identity</p>
                </div>
              </div>

              <button className="w-full bg-brand-green text-white font-bold py-3 rounded-lg mb-3 hover:bg-emerald-800 transition-colors shadow-lg shadow-brand-green/20">
                Contact {property.listedBy}
              </button>
              <button className="w-full bg-white text-brand-green border border-brand-green font-bold py-3 rounded-lg hover:bg-brand-lightGreen/20 transition-colors flex items-center justify-center gap-2 mb-3">
                <Phone size={18} /> {property.ownerContact}
              </button>
              
              <button className="w-full bg-brand-brown text-white font-bold py-3 rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md">
                <UserCheck size={18} /> Find Similar Agents
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200 text-xs text-gray-500 flex items-center gap-2">
                 <Calendar size={14} /> Posted on {new Date(property.datePosted).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;