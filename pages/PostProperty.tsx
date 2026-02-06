import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generatePropertyDescription } from '../services/geminiService';
import { Property, ListingType, PropertyType, ConstructionStatus, FurnishedStatus, ListedBy, Facing, ParkingType, ViewType, OwnershipType, BrokerageType } from '../types';
import { Sparkles, Upload, Loader2, CheckCircle, Home, Building2, Car, Eye, ShieldCheck, Video, UserCheck, ArrowRight, TrendingUp, DollarSign, BedDouble, Ruler, ChevronDown, Plus, Check, Info, FileText } from 'lucide-react';

interface PostPropertyProps {
  onAddProperty: (property: Property) => void;
}

const PostProperty: React.FC<PostPropertyProps> = ({ onAddProperty }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'selection' | 'form'>('selection');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const documentOptions = [
      'Sale Deed / Ownership Title',
      'Society/Authority Transfer Letter',
      'Occupancy Certificate (OC)',
      'Completion Certificate (CC)',
      'Encumbrance Certificate (EC)',
      'Property Tax Receipts',
      'NOC from Society/Builder',
      'RERA Registration',
      'Allotment Letter',
      'Possession Letter'
  ];

  const [formData, setFormData] = useState({
    // Basic
    title: '',
    type: 'Apartment' as PropertyType,
    listingType: 'sale' as ListingType,
    ownershipType: 'Freehold' as OwnershipType,
    city: '',
    location: '',
    
    // Rooms
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    additionalRooms: [] as string[],
    
    // Area
    carpetArea: '',
    builtUpArea: '',
    superBuiltUpArea: '',
    
    // Physical Specs
    floor: '',
    totalFloors: '',
    furnishedStatus: 'Unfurnished' as FurnishedStatus,
    constructionStatus: 'Ready to Move' as ConstructionStatus,
    yearBuilt: new Date().getFullYear().toString(),
    facing: 'North-East' as Facing,
    exitFacing: 'South-West' as Facing, // New
    
    // Amenities & Features
    amenitiesInput: '',
    parkingSpaces: '1',
    parkingType: 'Covered' as ParkingType,
    views: [] as ViewType[],
    reraApproved: false,
    hasShowcase: false,
    has3DVideo: false,
    
    // Legal Documents
    documents: [] as string[],

    // Price & Brokerage
    price: '',
    priceNegotiable: false,
    allInclusivePrice: true,
    taxExcluded: false,
    brokerageType: 'None' as BrokerageType,
    brokerageAmount: '',
    brokerageNegotiable: false,
    listedBy: 'Owner' as ListedBy,

    description: '',
  });

  const additionalRoomOptions = ['Pooja Room', 'Study Room', 'Servant Room', 'Others'];
  const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Furnished'];

  // Helper to convert number to Indian currency words
  const numToWords = (n: number) => {
    if (!n) return '';
    const inCrores = n / 10000000;
    if (inCrores >= 1) {
       const crores = Math.floor(inCrores);
       const lakhs = Math.floor((n % 10000000) / 100000);
       return `${crores} Crore ${lakhs > 0 ? lakhs + ' Lakh' : ''}`;
    }
    const inLakhs = n / 100000;
    if (inLakhs >= 1) {
        const lakhs = Math.floor(inLakhs);
        const thousands = Math.floor((n % 100000) / 1000);
        return `${lakhs} Lakh ${thousands > 0 ? thousands + ' Thousand' : ''}`;
    }
    return n.toLocaleString('en-IN');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePillSelect = (field: 'bedrooms' | 'bathrooms' | 'balconies', value: number) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoomToggle = (room: string) => {
    setFormData(prev => {
        const rooms = prev.additionalRooms.includes(room)
            ? prev.additionalRooms.filter(r => r !== room)
            : [...prev.additionalRooms, room];
        return { ...prev, additionalRooms: rooms };
    });
  };

  const handleDocumentToggle = (doc: string) => {
    setFormData(prev => {
        const docs = prev.documents.includes(doc)
            ? prev.documents.filter(d => d !== doc)
            : [...prev.documents, doc];
        return { ...prev, documents: docs };
    });
  };

  const handleViewChange = (view: ViewType) => {
    setFormData(prev => {
        const views = prev.views.includes(view) 
            ? prev.views.filter(v => v !== view)
            : [...prev.views, view];
        return { ...prev, views };
    });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.location || !formData.type) {
      alert("Please fill in Title, Type and Location first.");
      return;
    }

    setIsGenerating(true);
    const amenities = formData.amenitiesInput.split(',').map(s => s.trim()).filter(Boolean);
    const features = [
        ...amenities,
        formData.furnishedStatus,
        formData.constructionStatus,
        `${formData.bedrooms} BHK`,
        formData.facing + ' Facing',
        `${formData.superBuiltUpArea || formData.builtUpArea} sqft`
    ];
    
    try {
      const description = await generatePropertyDescription(
        formData.title,
        formData.type,
        formData.location,
        features
      );
      setFormData(prev => ({ ...prev, description }));
    } catch (error) {
      console.error(error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const priceNum = parseInt(formData.price) || 0;
    const brokerageAmt = parseInt(formData.brokerageAmount) || 0;
    // Fallback area logic
    const primaryArea = parseInt(formData.superBuiltUpArea) || parseInt(formData.builtUpArea) || parseInt(formData.carpetArea) || 0;

    const newProperty: Property = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      price: priceNum,
      location: formData.location,
      city: formData.city,
      type: formData.type,
      listingType: formData.listingType,
      bedrooms: formData.bedrooms,
      bathrooms: formData.bathrooms,
      balconies: formData.balconies,
      
      area: primaryArea,
      carpetArea: parseInt(formData.carpetArea) || undefined,
      builtUpArea: parseInt(formData.builtUpArea) || undefined,
      superBuiltUpArea: parseInt(formData.superBuiltUpArea) || undefined,

      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80', // Placeholder
      amenities: formData.amenitiesInput.split(',').map(s => s.trim()).filter(Boolean),
      ownerContact: 'Hidden for Demo',
      datePosted: new Date().toISOString(),
      isFeatured: true,
      
      constructionStatus: formData.constructionStatus,
      furnishedStatus: formData.furnishedStatus,
      listedBy: formData.listedBy,
      ownershipType: formData.ownershipType,
      facing: formData.facing,
      exitFacing: formData.exitFacing,
      floor: parseInt(formData.floor) || 0,
      totalFloors: parseInt(formData.totalFloors) || 0,
      reraApproved: formData.reraApproved,
      parkingSpaces: parseInt(formData.parkingSpaces) || 0,
      parkingType: formData.parkingType,
      yearBuilt: parseInt(formData.yearBuilt) || new Date().getFullYear(),
      hasShowcase: formData.hasShowcase,
      has3DVideo: formData.has3DVideo,
      views: formData.views,
      additionalRooms: formData.additionalRooms,
      documents: formData.documents,
      
      priceNegotiable: formData.priceNegotiable,
      allInclusivePrice: formData.allInclusivePrice,
      taxExcluded: formData.taxExcluded,
      
      brokerageType: formData.brokerageType,
      brokerageAmount: brokerageAmt,
      brokerageNegotiable: formData.brokerageNegotiable,
    };

    setTimeout(() => {
      onAddProperty(newProperty);
      setIsSubmitting(false);
      navigate(newProperty.listingType === 'sale' ? '/buy' : '/rent');
    }, 1500);
  };

  // Calculations for display
  const areaForCalculation = parseInt(formData.superBuiltUpArea) || parseInt(formData.builtUpArea) || parseInt(formData.carpetArea) || 0;
  const pricePerSqFt = areaForCalculation > 0 && formData.price ? Math.round(parseInt(formData.price) / areaForCalculation) : 0;
  const priceInWords = numToWords(parseInt(formData.price) || 0);

  // Handle manual rate change (Price per sq.ft)
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (val === '') {
          // Optional: handle clearing logic if needed
          return;
      }
      
      const rate = parseInt(val) || 0;
      if (areaForCalculation > 0) {
          const newPrice = rate * areaForCalculation;
          setFormData(prev => ({ ...prev, price: newPrice.toString() }));
      }
  };


  // 1. SELECTION SCREEN
  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-brand-green py-12 px-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
          How would you like to sell?
        </h1>
        <p className="text-brand-lightGreen text-center mb-12 max-w-2xl">
           Choose the method that suits you best. Get expert help or do it yourself.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          {/* Option 1: Agent */}
          <div 
            className="bg-white rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer" 
            onClick={() => navigate('/find-agent')}
          >
            <div className="w-24 h-24 bg-brand-lightGreen rounded-full flex items-center justify-center mb-8 group-hover:bg-brand-green transition-colors duration-300">
              <UserCheck size={48} className="text-brand-green group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sell with an Expert</h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Partner with top-rated local agents. Get better valuation, professional marketing, and hassle-free negotiation.
              <span className="block mt-3 font-semibold text-brand-green flex items-center justify-center gap-2">
                 <TrendingUp size={18} /> Properties sell for 15% more
              </span>
            </p>
            <button className="mt-auto bg-brand-green text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-2 w-full justify-center text-lg">
              Find an Agent <ArrowRight size={20} />
            </button>
          </div>

          {/* Option 2: Self */}
          <div 
            className="bg-white rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer" 
            onClick={() => setStep('form')}
          >
             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-300">
              <Home size={48} className="text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">List it Yourself</h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Take full control of your sale. Create a professional listing in minutes and connect directly with thousands of buyers.
              <span className="block mt-3 font-semibold text-blue-600">
                 Free to post • Zero Commission
              </span>
            </p>
            <button className="mt-auto bg-white text-gray-900 border-2 border-gray-200 font-bold py-4 px-10 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all flex items-center gap-2 w-full justify-center text-lg">
              Post Property <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <p className="text-brand-lightGreen/80 text-center mt-12 max-w-2xl text-sm">
          Answer a few questions to connect with a partner agent or explore other selling options — all in 3 minutes with no commitment.
        </p>
      </div>
    );
  }

  // 2. FORM SCREEN
  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-green/10">
          <div className="bg-brand-brown p-8 text-center text-white relative">
            <button 
                onClick={() => setStep('selection')}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium"
            >
                ← Back
            </button>
            <h1 className="text-3xl font-bold mb-2">Post Your Property</h1>
            <p className="text-brand-lightGreen/80">Detailed listings attract 3x more buyers.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            
            {/* SECTION 1: BASIC DETAILS & LOCATION */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                 <Home className="text-brand-green" size={24} />
                 <h2 className="text-xl font-bold text-gray-800">Property Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I want to</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['sale', 'rent'].map((t) => (
                         <button
                           key={t}
                           type="button"
                           onClick={() => setFormData(prev => ({ ...prev, listingType: t as ListingType }))}
                           className={`flex-1 py-2 text-sm font-semibold rounded-md capitalize transition-all ${formData.listingType === t ? 'bg-white shadow-sm text-brand-green' : 'text-gray-500'}`}
                         >
                            {t}
                         </button>
                    ))}
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Ownership Type</label>
                   <select 
                    name="ownershipType" 
                    value={formData.ownershipType} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none bg-white"
                   >
                    <option value="Freehold">Freehold</option>
                    <option value="Leasehold">Leasehold</option>
                    <option value="Co-operative society">Co-operative society</option>
                    <option value="Power of Attorney">Power of Attorney</option>
                   </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none bg-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Builder Floor">Builder Floor</option>
                    <option value="Residential Land">Residential Land</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Studio">Studio / 1 RK</option>
                  </select>
                </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Listed By</label>
                   <select 
                    name="listedBy" 
                    value={formData.listedBy} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none bg-white"
                   >
                    <option value="Owner">Owner</option>
                    <option value="Agent">Agent</option>
                    <option value="Builder">Builder</option>
                   </select>
                </div>

                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                   <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Noida"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>
                 <div className="md:col-span-2">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Locality / Area</label>
                   <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Sector 62"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>
              </div>
            </div>

            {/* SECTION 2: ROOM CONFIGURATION */}
            <div>
               <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                 <BedDouble className="text-brand-green" size={24} />
                 <h2 className="text-xl font-bold text-gray-800">Room Details</h2>
              </div>

               <div className="space-y-6">
                    {/* Pills Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button 
                                        key={n} type="button"
                                        onClick={() => handlePillSelect('bedrooms', n)}
                                        className={`w-10 h-10 rounded-full font-semibold border transition-all ${formData.bedrooms === n ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'}`}
                                    >
                                        {n}{n===5 ? '+' : ''}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4].map(n => (
                                    <button 
                                        key={n} type="button"
                                        onClick={() => handlePillSelect('bathrooms', n)}
                                        className={`w-10 h-10 rounded-full font-semibold border transition-all ${formData.bathrooms === n ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'}`}
                                    >
                                        {n}{n===4 ? '+' : ''}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Balconies</label>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3].map(n => (
                                    <button 
                                        key={n} type="button"
                                        onClick={() => handlePillSelect('balconies', n)}
                                        className={`w-10 h-10 rounded-full font-semibold border transition-all ${formData.balconies === n ? 'bg-brand-green text-white border-brand-green' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green'}`}
                                    >
                                        {n}{n===3 ? '+' : ''}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Area Details - Stacked Layout */}
                    <div>
                        <label className="block text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                             Add Area Details <span className="text-gray-400 font-normal text-sm">(At least one area type is mandatory)</span>
                        </label>
                        <div className="flex flex-col gap-4 mt-4">
                            {/* Carpet Area */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center bg-white hover:border-brand-green transition-colors">
                                <div className="flex-1 relative">
                                    <label className="absolute top-2 left-3 text-xs font-medium text-gray-500">Carpet Area</label>
                                    <input 
                                        type="number" 
                                        name="carpetArea" 
                                        value={formData.carpetArea} 
                                        onChange={handleChange} 
                                        className="w-full pt-7 pb-2 px-3 outline-none text-gray-800 font-medium" 
                                    />
                                </div>
                                <div className="border-l border-gray-200 px-4 py-4 bg-gray-50 flex items-center gap-2 text-gray-600 text-sm font-medium min-w-[100px] justify-between cursor-pointer">
                                    sq.ft. <ChevronDown size={14} />
                                </div>
                            </div>

                            {/* Built-up Area */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center bg-white hover:border-brand-green transition-colors">
                                <div className="flex-1 relative">
                                    <label className="absolute top-2 left-3 text-xs font-medium text-gray-500">Built-up Area</label>
                                    <input 
                                        type="number" 
                                        name="builtUpArea" 
                                        value={formData.builtUpArea} 
                                        onChange={handleChange} 
                                        className="w-full pt-7 pb-2 px-3 outline-none text-gray-800 font-medium" 
                                    />
                                </div>
                                <div className="border-l border-gray-200 px-4 py-4 bg-gray-50 flex items-center gap-2 text-gray-600 text-sm font-medium min-w-[100px] justify-between cursor-pointer">
                                    sq.ft. <ChevronDown size={14} />
                                </div>
                            </div>

                            {/* Super Built-up Area */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center bg-white hover:border-brand-green transition-colors">
                                <div className="flex-1 relative">
                                    <label className="absolute top-2 left-3 text-xs font-medium text-gray-500">Super built-up Area</label>
                                    <input 
                                        type="number" 
                                        name="superBuiltUpArea" 
                                        value={formData.superBuiltUpArea} 
                                        onChange={handleChange} 
                                        className="w-full pt-7 pb-2 px-3 outline-none text-gray-800 font-medium" 
                                    />
                                </div>
                                <div className="border-l border-gray-200 px-4 py-4 bg-gray-50 flex items-center gap-2 text-gray-600 text-sm font-medium min-w-[100px] justify-between cursor-pointer">
                                    sq.ft. <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Rooms */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Other rooms <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <div className="flex flex-wrap gap-3">
                            {additionalRoomOptions.map(room => {
                                const isSelected = formData.additionalRooms.includes(room);
                                return (
                                    <button
                                        key={room}
                                        type="button"
                                        onClick={() => handleRoomToggle(room)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm transition-all ${
                                            isSelected 
                                                ? 'bg-sky-50 border-sky-200 text-gray-900 font-medium' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                    >
                                        {isSelected ? <Check size={16} className="text-sky-600" /> : <Plus size={16} className="text-gray-400" />}
                                        {room}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Furnishing - Moved from Section 3 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <div className="flex flex-wrap gap-3">
                            {furnishingOptions.map(option => {
                                const isSelected = formData.furnishedStatus === option;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, furnishedStatus: option as FurnishedStatus }))}
                                        className={`px-6 py-2.5 rounded-full border text-sm transition-all ${
                                            isSelected 
                                                ? 'bg-sky-50 border-sky-200 text-gray-900 font-medium' 
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
               </div>
            </div>

            {/* SECTION 3: FEATURES & AMENITIES */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                 <Building2 className="text-brand-green" size={24} />
                 <h2 className="text-xl font-bold text-gray-800">Features & Amenities</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 {/* Furnishing Removed from here */}
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Construction Status</label>
                   <select 
                    name="constructionStatus" 
                    value={formData.constructionStatus} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
                   >
                    <option value="Ready to Move">Ready to Move</option>
                    <option value="Under Construction">Under Construction</option>
                    <option value="New Launch">New Launch</option>
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Year Built (Age)</label>
                   <input
                    type="number"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Floor No.</label>
                        <input type="number" name="floor" value={formData.floor} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Floors</label>
                        <input type="number" name="totalFloors" value={formData.totalFloors} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" />
                    </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Facing (Entry)</label>
                   <select 
                    name="facing" 
                    value={formData.facing} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
                   >
                    <option value="North-East">North-East</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                   </select>
                </div>
                
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Facing (Exit) - Vaastu</label>
                   <select 
                    name="exitFacing" 
                    value={formData.exitFacing} 
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
                   >
                    <option value="North-East">North-East</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                   </select>
                </div>
              </div>

              {/* Parking & Views */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
                   <div className="flex gap-2">
                        <input type="number" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleChange} className="w-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="Qty" />
                        <select name="parkingType" value={formData.parkingType} onChange={handleChange} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white">
                            <option value="Covered">Covered</option>
                            <option value="Open">Open</option>
                        </select>
                   </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                    {['Road', 'Park', 'Corner'].map((view) => (
                        <label key={view} className="flex items-center gap-1 cursor-pointer px-3 py-1 bg-gray-50 rounded border hover:border-brand-green">
                        <input 
                            type="checkbox" 
                            checked={formData.views.includes(view as ViewType)}
                            onChange={() => handleViewChange(view as ViewType)}
                            className="accent-brand-green" 
                        />
                        <span className="text-sm text-gray-700">{view}</span>
                        </label>
                    ))}
                    </div>
                </div>
              </div>

               {/* Checkboxes Row */}
               <div className="flex flex-wrap gap-6 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="reraApproved" checked={formData.reraApproved} onChange={handleChange} className="accent-brand-green w-5 h-5" />
                        <span className="text-gray-700 font-medium">RERA Approved</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="hasShowcase" checked={formData.hasShowcase} onChange={handleChange} className="accent-brand-green w-5 h-5" />
                        <span className="text-gray-700 font-medium">Virtual Showcase</span>
                    </label>
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="has3DVideo" checked={formData.has3DVideo} onChange={handleChange} className="accent-brand-green w-5 h-5" />
                        <span className="text-gray-700 font-medium">3D Video</span>
                    </label>
               </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (Comma separated)</label>
                <input
                  type="text"
                  name="amenitiesInput"
                  value={formData.amenitiesInput}
                  onChange={handleChange}
                  placeholder="Gym, Pool, Security, Garden, Lift, Power Backup..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                />
              </div>

              {/* NEW SECTION: LEGAL DOCUMENTS */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                 <div className="flex items-center gap-2 mb-4">
                     <FileText className="text-brand-green" size={20} />
                     <h3 className="text-lg font-bold text-gray-800">Legal Documents Available</h3>
                 </div>
                 <p className="text-sm text-gray-500 mb-4">Select the documents you have to build trust with buyers.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {documentOptions.map(doc => {
                        const isSelected = formData.documents.includes(doc);
                        return (
                            <label key={doc} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-green-50 border-brand-green' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-brand-green border-brand-green' : 'border-gray-300 bg-white'}`}>
                                    {isSelected && <Check size={14} className="text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden" 
                                    checked={isSelected}
                                    onChange={() => handleDocumentToggle(doc)}
                                />
                                <span className="text-sm text-gray-700 font-medium">{doc}</span>
                            </label>
                        )
                    })}
                 </div>
              </div>
            </div>

            {/* SECTION 4: PRICE DETAILS */}
            <div>
               <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                 <DollarSign className="text-brand-green" size={24} />
                 <h2 className="text-xl font-bold text-gray-800">Price Details</h2>
              </div>
              
              <div className="space-y-6 mb-8">
                    {/* Expected Price Input */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center bg-white hover:border-brand-green transition-colors">
                        <div className="flex-1 relative">
                            <label className="absolute top-2 left-3 text-xs font-medium text-gray-500">₹ Expected Price</label>
                            <input 
                                type="number" 
                                name="price" 
                                value={formData.price} 
                                onChange={handleChange} 
                                className="w-full pt-7 pb-2 px-3 outline-none text-gray-800 font-medium text-lg" 
                                placeholder="Enter total price"
                            />
                        </div>
                    </div>
                    
                    {/* Helper Text */}
                    {formData.price && (
                        <p className="text-sm font-bold text-gray-700">
                            {priceInWords} {pricePerSqFt > 0 && <span className="text-gray-500 font-normal">(₹ {pricePerSqFt.toLocaleString()} per sq.ft.)</span>}
                        </p>
                    )}

                    {/* Price per sq.ft Input (Editable) */}
                    <div className="border border-gray-300 rounded-lg overflow-hidden flex items-center bg-white hover:border-brand-green transition-colors">
                        <div className="flex-1 relative">
                            <label className="absolute top-2 left-3 text-xs font-medium text-gray-500">₹ Price per sq.ft.</label>
                            <input 
                                type="number" 
                                value={pricePerSqFt > 0 ? pricePerSqFt : ''}
                                onChange={handleRateChange}
                                className="w-full pt-7 pb-2 px-3 outline-none text-gray-800 font-medium" 
                                placeholder="Enter rate"
                                disabled={areaForCalculation === 0}
                            />
                        </div>
                    </div>

                    {/* Based on Area Dropdown (Visual) */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        Based on <span className="font-bold text-brand-green flex items-center cursor-pointer">Super built-up Area <ChevronDown size={14}/></span>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex flex-col gap-4 mt-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${formData.allInclusivePrice ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                                {formData.allInclusivePrice && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" name="allInclusivePrice" checked={formData.allInclusivePrice} onChange={handleChange} className="hidden" />
                            <span className="text-gray-800 font-medium flex items-center gap-1">All inclusive price <Info size={14} className="text-gray-400"/></span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${formData.priceNegotiable ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                                {formData.priceNegotiable && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" name="priceNegotiable" checked={formData.priceNegotiable} onChange={handleChange} className="hidden" />
                            <span className="text-gray-800">Price Negotiable</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${formData.taxExcluded ? 'bg-blue-600 border-blue-600' : 'border-gray-400 bg-white'}`}>
                                {formData.taxExcluded && <Check size={14} className="text-white" />}
                            </div>
                            <input type="checkbox" name="taxExcluded" checked={formData.taxExcluded} onChange={handleChange} className="hidden" />
                            <span className="text-gray-800">Tax and Govt. charges excluded</span>
                        </label>
                    </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-800 mb-3">Do you charge brokerage?</label>
                  <div className="flex gap-2 mb-4">
                      {(['Fixed', 'Percentage of Price', 'None'] as BrokerageType[]).map(type => (
                          <button
                            key={type} type="button"
                            onClick={() => setFormData(p => ({...p, brokerageType: type}))}
                            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${formData.brokerageType === type ? 'bg-white border-blue-500 text-blue-600 shadow-sm' : 'border-transparent text-gray-500 hover:bg-gray-200'}`}
                          >
                              {type}
                          </button>
                      ))}
                  </div>
                  
                  {formData.brokerageType !== 'None' && (
                      <div className="space-y-3">
                          <input 
                            type="number" 
                            name="brokerageAmount" 
                            value={formData.brokerageAmount} 
                            onChange={handleChange}
                            placeholder={formData.brokerageType === 'Fixed' ? "Enter Amount (₹)" : "Enter Percentage (%)"}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white"
                          />
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" name="brokerageNegotiable" checked={formData.brokerageNegotiable} onChange={handleChange} className="accent-brand-green w-4 h-4" />
                            <span className="text-gray-600 text-sm">Brokerage Negotiable</span>
                        </label>
                      </div>
                  )}
              </div>
            </div>

            {/* SECTION 5: MEDIA & DESCRIPTION */}
            <div>
               <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2">
                 <Sparkles className="text-brand-green" size={24} />
                 <h2 className="text-xl font-bold text-gray-800">Media & Description</h2>
              </div>

                <div className="md:col-span-2 mb-6">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                   <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Luxury 3BHK Apartment in Sector 150"
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                   />
                </div>

              <div className="relative mb-6">
                <div className="flex justify-between items-center mb-1">
                   <label className="block text-sm font-medium text-gray-700">Description</label>
                </div>
                
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                  placeholder="What makes your property unique?"
                ></textarea>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="absolute bottom-3 right-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-2 px-3 rounded-md flex items-center gap-1 transition-colors disabled:opacity-50 shadow-md"
                >
                  {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                  {isGenerating ? 'Magic Writing...' : 'AI Write'}
                </button>
              </div>

               {/* Fake Image Upload UI */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-8 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-lightGreen transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-brand-green" />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-800">Click to upload property images</p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
            </div>


            <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
              <button 
                type="button" 
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-3 bg-brand-green text-white rounded-lg font-bold hover:bg-emerald-800 transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-brand-green/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Posting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} /> Post Property
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProperty;