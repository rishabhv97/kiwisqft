import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Import Supabase
import { useAuth } from '../context/AuthContext'; // Import Auth
import { Property, ListingType, PropertyType, ConstructionStatus, FurnishedStatus, ListedBy, Facing, ParkingType, ViewType, OwnershipType, BrokerageType } from '../types';
import { Sparkles, Upload, Loader2, CheckCircle, Home, Building2, UserCheck, ArrowRight, TrendingUp, DollarSign, BedDouble, ChevronDown, Plus, Check, Info, FileText, AlertCircle } from 'lucide-react';

interface PostPropertyProps {
  onAddProperty: (property: Property) => void;
  isAdmin?: boolean; // Add optional prop for admin usage
}

const PostProperty: React.FC<PostPropertyProps> = ({ onAddProperty }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the logged-in user

  const [step, setStep] = useState<'selection' | 'form'>('selection');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const documentOptions = [
      'Sale Deed / Ownership Title', 'Occupancy Certificate (OC)', 'Completion Certificate (CC)', 
      'RERA Registration', 'Possession Letter'
  ];

  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment' as PropertyType,
    listingType: 'sale' as ListingType,
    ownershipType: 'Freehold' as OwnershipType,
    city: '',
    location: '',
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    additionalRooms: [] as string[],
    carpetArea: '',
    builtUpArea: '',
    superBuiltUpArea: '',
    floor: '',
    totalFloors: '',
    furnishedStatus: 'Unfurnished' as FurnishedStatus,
    constructionStatus: 'Ready to Move' as ConstructionStatus,
    yearBuilt: new Date().getFullYear().toString(),
    facing: 'North-East' as Facing,
    exitFacing: 'South-West' as Facing,
    amenitiesInput: '',
    parkingSpaces: '1',
    parkingType: 'Covered' as ParkingType,
    views: [] as ViewType[],
    reraApproved: false,
    hasShowcase: false,
    has3DVideo: false,
    documents: [] as string[],
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

  // Helper: Handle Input Changes
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
        const rooms = prev.additionalRooms.includes(room) ? prev.additionalRooms.filter(r => r !== room) : [...prev.additionalRooms, room];
        return { ...prev, additionalRooms: rooms };
    });
  };

  const handleDocumentToggle = (doc: string) => {
    setFormData(prev => {
        const docs = prev.documents.includes(doc) ? prev.documents.filter(d => d !== doc) : [...prev.documents, doc];
        return { ...prev, documents: docs };
    });
  };

  const handleViewChange = (view: ViewType) => {
    setFormData(prev => {
        const views = prev.views.includes(view) ? prev.views.filter(v => v !== view) : [...prev.views, view];
        return { ...prev, views };
    });
  };

  // Helper: Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Limit size to 2MB
      if (file.size > 2 * 1024 * 1024) {
        alert("File size too big! Please select an image under 2MB.");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // MAIN SUBMIT FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("You must be logged in to post a property.");
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      let finalImageUrl = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1073&q=80'; // Default fallback

      // 1. Upload Image to Supabase Storage
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('property-images')
          .upload(filePath, imageFile);

        if (uploadErr) throw uploadErr;

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      // 2. Prepare Data for Database
      // Note: We only insert fields that match your Database columns.
      // Extra fields are ignored for now unless you added them to the DB.
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        location: formData.location,
        city: formData.city,
        type: formData.type,
        listing_type: formData.listingType,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area: parseFloat(formData.superBuiltUpArea || formData.builtUpArea || formData.carpetArea || '0'),
        image_url: finalImageUrl,
        owner_id: user.id,
        amenities: formData.amenitiesInput.split(',').map(s => s.trim()).filter(Boolean),
        status: 'Pending', // Needs Admin Approval
        is_featured: false
      };

      


      // 3. Insert into Supabase
      const { error: dbError } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (dbError) throw dbError;

      alert("Property Posted Successfully! It will appear after Admin Approval.");
      navigate('/'); 

    } catch (error: any) {
      console.error("Error posting property:", error);
      setUploadError(error.message || "Failed to post property.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SELECTION SCREEN ---
  if (step === 'selection') {
    return (
      <div className="min-h-screen bg-brand-green py-12 px-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">How would you like to sell?</h1>
        <p className="text-brand-lightGreen text-center mb-12 max-w-2xl">Choose the method that suits you best.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => navigate('/find-agent')}>
            <div className="w-24 h-24 bg-brand-lightGreen rounded-full flex items-center justify-center mb-8"><UserCheck size={48} className="text-brand-green" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sell with an Expert</h2>
            <button className="mt-auto bg-brand-green text-white font-bold py-4 px-10 rounded-xl w-full flex items-center justify-center gap-2">Find an Agent <ArrowRight size={20} /></button>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 flex flex-col items-center text-center shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => setStep('form')}>
             <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-8"><Home size={48} className="text-blue-600" /></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">List it Yourself</h2>
            <button className="mt-auto bg-white text-gray-900 border-2 border-gray-200 font-bold py-4 px-10 rounded-xl w-full flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600">Post Property <ArrowRight size={20} /></button>
          </div>
        </div>
      </div>
    );
  }

  // --- FORM SCREEN ---
  return (
    <div className="min-h-screen bg-brand-beige py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-brand-green/10">
          <div className="bg-brand-brown p-8 text-center text-white relative">
            <button onClick={() => setStep('selection')} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white flex items-center gap-1 text-sm font-medium">← Back</button>
            <h1 className="text-3xl font-bold mb-2">Post Your Property</h1>
            <p className="text-brand-lightGreen/80">Detailed listings attract 3x more buyers.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-10">
            {uploadError && <div className="bg-red-50 text-red-600 p-4 rounded flex items-center gap-2"><AlertCircle size={20} />{uploadError}</div>}

            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2"><Home className="text-brand-green" size={24} /><h2 className="text-xl font-bold text-gray-800">Property Details</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Property Title *</label>
                   <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. Luxury 3BHK in Sector 150"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Listing Type</label>
                  <select name="listingType" value={formData.listingType} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                    <option value="sale">Sell</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full p-3 border rounded-lg"/>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Locality / Sector *</label>
                   <input type="text" name="location" required value={formData.location} onChange={handleChange} className="w-full p-3 border rounded-lg"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Builder Floor">Builder Floor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Room Config */}
            <div>
               <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2"><BedDouble className="text-brand-green" size={24} /><h2 className="text-xl font-bold text-gray-800">Rooms & Area</h2></div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                      <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(n => (<button key={n} type="button" onClick={() => handlePillSelect('bedrooms', n)} className={`w-10 h-10 rounded-full border ${formData.bedrooms === n ? 'bg-brand-green text-white' : 'bg-white'}`}>{n}</button>))}
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                      <div className="flex gap-2">
                          {[1, 2, 3, 4].map(n => (<button key={n} type="button" onClick={() => handlePillSelect('bathrooms', n)} className={`w-10 h-10 rounded-full border ${formData.bathrooms === n ? 'bg-brand-green text-white' : 'bg-white'}`}>{n}</button>))}
                      </div>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Area (sq.ft) *</label>
                  <input type="number" name="superBuiltUpArea" required value={formData.superBuiltUpArea} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="e.g. 1500"/>
               </div>
            </div>

            {/* Price */}
            <div>
               <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2"><DollarSign className="text-brand-green" size={24} /><h2 className="text-xl font-bold text-gray-800">Price Details</h2></div>
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Price (₹) *</label>
                  <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full p-3 border rounded-lg text-lg" placeholder="e.g. 5000000"/>
               </div>
            </div>

            {/* Image & Desc */}
            <div>
               <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-2"><Sparkles className="text-brand-green" size={24} /><h2 className="text-xl font-bold text-gray-800">Photos & Description</h2></div>
               
               <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                          {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="h-40 object-cover rounded-lg mb-4" />
                          ) : (
                            <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          )}
                          <span className="text-brand-green font-bold">{imagePreview ? 'Change Image' : 'Click to Upload Image'}</span>
                          <span className="text-xs text-gray-500 mt-1">Max 2MB</span>
                      </label>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-3 border rounded-lg" placeholder="Describe the property..."></textarea>
               </div>
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amenities (Comma separated)</label>
                  <input type="text" name="amenitiesInput" value={formData.amenitiesInput} onChange={handleChange} className="w-full p-3 border rounded-lg" placeholder="Gym, Pool, Park..."/>
               </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
              <button type="button" onClick={() => navigate('/')} className="px-6 py-3 border rounded-lg text-gray-700 font-medium">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-brand-green text-white rounded-lg font-bold hover:bg-emerald-800 transition-all flex items-center gap-2">
                {isSubmitting ? <><Loader2 className="animate-spin" /> Publishing...</> : <><CheckCircle /> Post Property</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProperty;