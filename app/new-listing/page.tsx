'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const materialOptions = ["PLA", "PETG", "ABS", "TPU", "Nylon", "Resin"];

export default function NewListingPage() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [form, setForm] = useState({
    name: "",
    make_model: "",
    description: "",
    materials: [],
    volumeX: "",
    volumeY: "",
    volumeZ: "",
    pricePerHour: ""
  });

  const toggleMaterial = (material) => {
    setForm(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const build_volume = `${form.volumeX}x${form.volumeY}x${form.volumeZ} mm`;
    const { error } = await supabase.from("printers").insert({
      name: form.name,
      make_model: form.make_model,
      description: form.description,
      materials: form.materials,
      build_volume,
      price_per_hour: parseFloat(form.pricePerHour),
      clerk_user_id: user?.id || null,
    });

    if (error) {
      console.error("Insert error:", error.message);
      alert("❌ Failed to submit listing.");
    } else {
      alert("✅ Printer listing submitted!");
      router.push("/my-printers");
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto text-gray-900 dark:text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">🆕 New Printer Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow border dark:border-gray-700">
        <div>
          <label className="block mb-1 font-medium">Printer Name</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Make & Model</label>
          <input name="make_model" value={form.make_model} onChange={handleChange} required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
        </div>
        <div>
          <label className="block mb-2 font-medium">Supported Materials</label>
          <div className="flex flex-wrap gap-2">
            {materialOptions.map(mat => (
              <button
                type="button"
                key={mat}
                onClick={() => toggleMaterial(mat)}
                className={`px-3 py-1 rounded-full text-sm border ${form.materials.includes(mat) ? 'bg-blue-500 text-gray-900 dark:text-white border-blue-500' : 'bg-gray-200 dark:bg-gray-600 dark:text-gray-900 dark:text-white'}`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Build Volume (mm)</label>
          <div className="flex gap-2">
            <input name="volumeX" value={form.volumeX} onChange={handleChange} required placeholder="Width" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
            <input name="volumeY" value={form.volumeY} onChange={handleChange} required placeholder="Depth" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
            <input name="volumeZ" value={form.volumeZ} onChange={handleChange} required placeholder="Height" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Price Per Hour ($)</label>
          <input type="number" name="pricePerHour" value={form.pricePerHour} onChange={handleChange} required step="0.01" className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700" />
        </div>
        <button type="submit" className="bg-blue-600 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-blue-700">Submit Listing</button>
      </form>
    </main>
  );
}
