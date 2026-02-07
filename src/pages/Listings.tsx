import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { Filter, Search, X, SlidersHorizontal, MapPin } from 'lucide-react';

interface ListingsProps {
  type: 'sale' | 'rent';
}

const Listings: React.FC<ListingsProps> = ({ type }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle

  // Filters State
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000000]); // 0 to 5 Cr
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [propertyType, setPropertyType] = useState<string>('All');

  // --- 1. FETCH DATA FUNCTION ---
  useEffect(() => {
    fetchProperties();
  }, [type, searchParams, bedrooms, propertyType, selectedCity]); // Re-run when these change

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('properties')
        .select('*')
        .eq('status', 'Approved') // Only show approved
        .eq('listing_type', type); // Sale vs Rent

      // Apply Search Term (checks Title, Location, or City)
      const search = searchParams.get('search');
      if (search) {
        query = query.or(`title.ilike.%${search}%,location.ilike.%${search}%,city.ilike.%${search}%`);
      }

      // Apply Filters
      if (bedrooms) query = query.eq('bedrooms', bedrooms);
      if (propertyType !== 'All') query = query.eq('type', propertyType);
      if (selectedCity) query = query.ilike('city', `%${selectedCity}%`);
      
      // Price Filter
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        // Map DB to Types
        const mapped: Property[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          location: p.location,
          city: p.city,
          type: p.type,
          listingType: p.listing_type,
          
          // --- FIX: Handle Multiple Images ---
          images: p.images || [], 
          
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          balconies: p.balconies,
          
          area: p.area, // Primary Display Area
          
          // Map New Fields
          carpetArea: p.carpet_area,
          builtUpArea: p.built_up_area,
          superBuiltUpArea: p.super_built_up_area,
          
          amenities: p.amenities || [],
          ownerContact: p.owner_contact,
          datePosted: p.created_at,
          isFeatured: p.is_featured,
          status: p.status,
          ownerId: p.owner_id,
          
          // Details
          furnishedStatus: p.furnished_status || 'Unfurnished',
          constructionStatus: p.construction_status || 'Ready to Move',
          floor: p.floor_no || 0,
          totalFloors: p.total_floors || 0,
          parkingSpaces: p.parking_spaces || 0,
          views: p.views || [],
          documents: p.available_documents || []
        }));
        setProperties(mapped);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Search Input
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ search: searchTerm }); // Updates URL -> Triggers useEffect
  };

  // Helper to format Price for display
  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹ ${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹ ${(price / 100000).toFixed(0)} L`;
    return `₹ ${price.toLocaleString()}`;
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 bg-white p-3 rounded-lg shadow-sm flex items-center justify-center gap-2 font-bold text-gray-700 border border-gray-200"
          >
            <Filter size={18} /> Filters
          </button>
          <div className="flex-1 bg-white p-2 rounded-lg shadow-sm border border-gray-200">
             <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full outline-none px-2 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit"><Search size={18} className="text-gray-400" /></button>
             </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- SIDEBAR FILTERS --- */}
          <div className={`lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-brand-green" /> Filters
                </h3>
                {showFilters && <button onClick={() => setShowFilters(false)} className="lg:hidden"><X size={20} /></button>}
              </div>

              {/* 1. Search (Desktop) */}
              <div className="hidden lg:block mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Location / Project</label>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input 
                    type="text" 
                    placeholder="Search Locality..." 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                </form>
              </div>

              {/* 2. Property Type */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Property Type</label>
                <div className="space-y-2">
                  {['All', 'Apartment', 'Villa', 'House', 'Plot'].map((t) => (
                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="propertyType" 
                        checked={propertyType === t}
                        onChange={() => setPropertyType(t)}
                        className="text-brand-green focus:ring-brand-green"
                      />
                      <span className="text-gray-600">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Bedrooms */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Bedrooms</label>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setBedrooms(bedrooms === bhk ? null : bhk)}
                      className={`w-10 h-10 rounded-lg border text-sm font-bold transition-all ${
                        bedrooms === bhk 
                          ? 'bg-brand-green text-white border-brand-green' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Price Range */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Max Budget</label>
                <select 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                >
                  <option value="50000000">Any Price</option>
                  <option value="5000000">Under ₹50 Lakh</option>
                  <option value="10000000">Under ₹1 Cr</option>
                  <option value="20000000">Under ₹2 Cr</option>
                  <option value="30000000">Under ₹3 Cr</option>
                </select>
              </div>

              <button 
                onClick={() => {
                  setBedrooms(null); 
                  setPropertyType('All'); 
                  setSearchTerm(''); 
                  setSearchParams({}); 
                  fetchProperties();
                }}
                className="w-full py-3 text-sm font-bold text-gray-500 hover:text-brand-green hover:bg-gray-50 rounded-xl transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* --- MAIN CONTENT (GRID) --- */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {type === 'sale' ? 'Properties for Sale' : 'Properties for Rent'}
                <span className="text-gray-400 text-lg font-normal ml-2">({properties.length} found)</span>
              </h1>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                 {[1,2,3,4].map(n => <div key={n} className="h-96 bg-gray-200 animate-pulse rounded-2xl"></div>)}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800">No Properties Found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your filters or search for a different location.</p>
                <button 
                  onClick={() => {setBedrooms(null); setPropertyType('All'); setSearchTerm(''); setSearchParams({});}}
                  className="mt-4 text-brand-green font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Listings;