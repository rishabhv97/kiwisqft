import React from 'react';
import { Property } from '../types';
import { MapPin, BedDouble, Bath, Square, Heart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const formatPrice = (price: number) => {
    if (property.listingType === 'rent') {
      return `₹${price.toLocaleString()}/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const pricePerSqFt = property.area > 0 ? Math.round(property.price / property.area) : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            property.listingType === 'sale' ? 'bg-brand-brown text-white' : 'bg-brand-green text-white'
          }`}>
            For {property.listingType}
          </span>
          {property.isFeatured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-400 text-yellow-900">
              Featured
            </span>
          )}
        </div>
        <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white transition-colors">
          <Heart size={18} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white font-bold text-2xl">
              {formatPrice(property.price)}
              {property.listingType === 'sale' && pricePerSqFt > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-200">₹{pricePerSqFt.toLocaleString()}/sq.ft</span>
              )}
          </p>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-green transition-colors line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center text-gray-500 mt-1 text-sm">
            <MapPin size={14} className="mr-1 text-brand-brown" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-1 text-gray-600" title="Bedrooms">
            <BedDouble size={18} className="text-brand-green" />
            <span className="text-sm font-medium">{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600" title="Bathrooms">
            <Bath size={18} className="text-brand-green" />
            <span className="text-sm font-medium">{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600" title="Area">
            <Square size={18} className="text-brand-green" />
            <span className="text-sm font-medium">{property.area} sqft</span>
          </div>
        </div>

        <Link 
          to={`/property/${property.id}`}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-brand-green text-brand-green font-semibold hover:bg-brand-green hover:text-white transition-all duration-300"
        >
          View Details <ArrowUpRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;