import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    role: 'Buyer' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
            role: formData.role, // This triggers the trigger we made in SQL
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        alert('Signup successful! You can now log in.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Create Account</h2>
        {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full p-3 border rounded"
            onChange={e => setFormData({...formData, name: e.target.value})} />
          
          <input type="email" placeholder="Email" required className="w-full p-3 border rounded"
            onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <input type="tel" placeholder="Phone" required className="w-full p-3 border rounded"
            onChange={e => setFormData({...formData, phone: e.target.value})} />

          <select className="w-full p-3 border rounded bg-white"
            onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="Buyer">I am a Buyer/Tenant</option>
            <option value="Seller">I am a Seller/Landlord</option>
            <option value="Broker">I am a Real Estate Agent</option>
          </select>

          <input type="password" placeholder="Password" required className="w-full p-3 border rounded"
            onChange={e => setFormData({...formData, password: e.target.value})} />

          <button type="submit" disabled={loading} className="w-full bg-brand-green text-white font-bold py-3 rounded hover:bg-emerald-800 transition">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="text-center mt-4 text-sm">
             <Link to="/login" className="text-brand-green hover:underline">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;