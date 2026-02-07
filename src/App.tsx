// ... imports remain the same
import { supabase } from './supabaseClient'; // Make sure to import this!

const App: React.FC = () => {
  // 1. Start with an empty array
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch from Supabase when App loads
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) throw error;

      if (data) {
        // Map Database columns (snake_case) to TypeScript (camelCase)
        const mappedProperties: Property[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          location: p.location,
          city: p.city,
          type: p.type,
          listingType: p.listing_type, // Notice the mapping!
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area,
          imageUrl: p.image_url || 'https://via.placeholder.com/400', // Fallback image
          amenities: p.amenities || [],
          ownerContact: p.owner_contact,
          datePosted: p.created_at,
          isFeatured: p.is_featured,
          status: p.status,
          ownerId: p.owner_id,
          // Default values for fields we haven't added to DB yet to prevent crashes
          superBuiltUpArea: p.area,
          builtUpArea: p.area,
          carpetArea: p.area,
          balconies: 0,
          totalFloors: 0,
          floor: 0,
          parkingSpaces: 0,
          views: [],
          documents: []
        }));
        setProperties(mappedProperties);
      }
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = (newProperty: Property) => {
    // This will be updated in the next step to push to DB
    setProperties((prev) => [newProperty, ...prev]);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Kiwi Sqft...</div>;

  return (
    <AuthProvider>
      <Router>
        {/* ... Rest of your JSX (Navbar, Routes, etc.) remains EXACTLY the same ... */}
      </Router>
    </AuthProvider>
  );
};