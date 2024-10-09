'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Trash2, Plus, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function AdminTop4Properties() {
  const [bestProperties, setBestProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentEmail } = useAuth();

  useEffect(() => {
    fetchBestProperties();
    fetchAllProperties();
  }, []);

  async function fetchBestProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('top4', true) // Filter to only include properties where top3 is true
        .limit(3);
      
      if (error) throw error;
      setBestProperties(data);
      console.log('Best Properties:', data); // Log the fetched best properties
    } catch (error) {
      console.error('Error fetching best properties:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }

  async function fetchAllProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('top4', false); // Fetch properties that are not top3
      
      if (error) throw error;
      setAllProperties(data);
      console.log('All Properties:', data); // Log the fetched all properties
    } catch (error) {
      console.error('Error fetching all properties:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }

  async function deleteProperty(id) {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ top3: false }) // Set top3 to false instead of deleting
        .eq('id', id);

      if (error) throw error;
      fetchBestProperties();
    } catch (error) {
      console.error('Error removing property from top3:', error);
    }
  }

  async function addProperty(id) {
    if (bestProperties.length >= 3) {
      alert("You can't have more than 3 best properties.");
      return;
    }
    try {
      const { error } = await supabase
        .from('properties')
        .update({ top3: true }) // Set top3 to true for the selected property
        .eq('id', id);

      if (error) throw error;
      fetchBestProperties();
      fetchAllProperties(); // Refresh the all properties list
    } catch (error) {
      console.error('Error adding property to top3:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-green-800" />
      </div>
    );
  }

  if (currentEmail !== 'admin123@gmail.com') {
    return <div>Access Denied. Admin only.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Manage Top 3 Properties</h1>
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Current Top 3 Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {bestProperties.map((property) => (
            <div key={property.id} className="border rounded-lg shadow-sm overflow-hidden">
              <img src={property.image} alt={property.property_name} className="w-full h-40 md:h-48 object-cover" />
              <div className="p-3 md:p-4">
                <h3 className="text-lg md:text-xl font-semibold mb-2">{property.property_name}</h3>
                <p className="text-gray-600 mb-3 md:mb-4"><Home className="inline mr-1" size={16} />{property.city}</p>
                <Button
                  onClick={() => deleteProperty(property.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md flex items-center justify-center w-full text-sm md:text-base"
                >
                  <Trash2 className="mr-2" size={14} /> Remove from Top 3
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {bestProperties.length < 3 && (
        <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Add Property to Top 3</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {allProperties.map((property) => (
              <div key={property.id} className="border rounded-lg shadow-sm overflow-hidden">
                <img src={property.image} alt={property.property_name} className="w-full h-40 md:h-48 object-cover" />
                <div className="p-3 md:p-4">
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{property.property_name}</h3>
                  <p className="text-gray-600 mb-3 md:mb-4"><Home className="inline mr-1" size={16} />{property.city}</p>
                  <Button
                    onClick={() => addProperty(property.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-md flex items-center justify-center w-full text-sm md:text-base"
                  >
                    <Plus className="mr-2" size={14} /> Add to Top 3
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}