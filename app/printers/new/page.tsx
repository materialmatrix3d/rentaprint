'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function NewPrinterPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [formData, setFormData] = useState({
    make_model: '',
    printer_name: '',
    materials: '',
    build_volume: '',
    price_per_hour: '',
    cost_per_gram: '',
    tags: '',
    description: '',
    tipping_enabled: 'false',
  });
  const [status, setStatus] = useState('');
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const checkLimit = async () => {
      if (!user?.id) return;
      const supabase = createClientComponentClient();
      const { count } = await supabase
        .from('printers')
        .select('id', { count: 'exact', head: true })
        .eq('clerk_user_id', user.id)
        .eq('is_deleted', false);
      if ((count || 0) >= 1) setLimitReached(true);
    };
    checkLimit();
  }, [user]);

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

    if (limitReached) {
      setStatus('Free listing limit reached. Upgrade to add more.');
      return;
    }

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
      cost_per_gram: parseFloat(formData.cost_per_gram) || 0,
      tags: formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      description: formData.description || null,
      tipping_enabled: formData.tipping_enabled === 'true',
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
        cost_per_gram: '',
        tags: '',
        description: '',
        tipping_enabled: 'false',
      });
    }
  };

  const inputClass = "w-full p-2 border rounded text-black bg-white dark:text-white dark:bg-neutral-800";

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create a Printer Listing</h1>
      {limitReached && (
        <p className="p-2 bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded mb-2">
          Free listing limit reached. Upgrade to add more printers.
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="make_model" value={formData.make_model} onChange={handleChange} placeholder="Creality Ender 3" required className={inputClass} />
        <input name="printer_name" value={formData.printer_name} onChange={handleChange} placeholder="Printer Nickname" required className={inputClass} />
        <input name="materials" value={formData.materials} onChange={handleChange} placeholder="PLA, PETG, ABS..." required className={inputClass} />
        <input name="build_volume" value={formData.build_volume} onChange={handleChange} placeholder="220x220x250mm" required className={inputClass} />
        <input name="price_per_hour" type="number" value={formData.price_per_hour} onChange={handleChange} placeholder="Price per hour (e.g. 5.00)" required className={inputClass} />
        <input name="cost_per_gram" type="number" value={formData.cost_per_gram} onChange={handleChange} placeholder="Cost per gram (e.g. 0.05)" required className={inputClass} />
        <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma separated)" className={inputClass} />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Printer details (optional)" className={inputClass} />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="tipping_enabled"
            checked={formData.tipping_enabled === 'true'}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                tipping_enabled: e.target.checked ? 'true' : 'false',
              }))
            }
          />
          Enable tipping
        </label>
        <button type="submit" className="bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded">Submit</button>
        <p className="text-sm text-gray-600">{status}</p>
      </form>
    </div>
  );
}
