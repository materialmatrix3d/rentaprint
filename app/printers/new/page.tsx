'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function NewPrinterPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [formData, setFormData] = useState({
    make_model: '',
    printer_name: '',
    materials: '',
    build_volume: '',
    price_per_hour: '',
    description: '',
  });
  const [status, setStatus] = useState('');

  if (!isSignedIn) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">Please sign in to create a printer listing.</p>
        <Link href="/sign-in">
          <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Sign In</button>
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Submitting...');

    if (!isLoaded || !user) {
      setStatus('You must be logged in.');
      return;
    }

    const supabase = createClientComponentClient();
    const { error } = await supabase.from('printers').insert([{
      clerk_user_id: user.id,
      make_model: formData.make_model,
      name: formData.printer_name,
      materials: formData.materials.split(',').map(m => m.trim()),
      build_volume: formData.build_volume,
      price_per_hour: parseFloat(formData.price_per_hour),
      description: formData.description || null,
      is_available: true,
    }]);

    if (error) {
      setStatus('Error submitting printer: ' + error.message);
    } else {
      setStatus('Printer listed successfully!');
      setFormData({
        make_model: '',
        printer_name: '',
        materials: '',
        build_volume: '',
        price_per_hour: '',
        description: '',
      });
    }
  };

  const inputClass = "w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-neutral-800";

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Printer Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="make_model" value={formData.make_model} onChange={handleChange} placeholder="Creality Ender 3" required className={inputClass} />
        <input name="printer_name" value={formData.printer_name} onChange={handleChange} placeholder="Printer Nickname" required className={inputClass} />
        <input name="materials" value={formData.materials} onChange={handleChange} placeholder="PLA, PETG, ABS..." required className={inputClass} />
        <input name="build_volume" value={formData.build_volume} onChange={handleChange} placeholder="220x220x250mm" required className={inputClass} />
        <input name="price_per_hour" type="number" value={formData.price_per_hour} onChange={handleChange} placeholder="Price per hour (e.g. 5.00)" required className={inputClass} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Printer details (optional)" className={inputClass} />
        <button type="submit" className="bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded">Submit</button>
        <p className="text-sm text-gray-600">{status}</p>
      </form>
    </div>
  );
}
