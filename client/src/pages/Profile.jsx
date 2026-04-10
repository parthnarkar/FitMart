// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthHeaders } from "../utils/getAuthHeaders";
import Navbar from "../components/Navbar";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({ name: "", phone: "", addresses: [] });
  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => { document.title = "Profile - FitMart"; }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { navigate("/auth"); return; }
      const userId = user.uid;
      setLoading(true);
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API}/api/user/profile/${userId}`, { headers, credentials: "include" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        setProfile(prev => ({ ...prev, name: data.name || user.displayName || "", phone: data.phone || "", addresses: data.addresses || [], defaultAddressId: data.defaultAddressId }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return navigate('/auth');
    setError(null);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API}/api/user/profile/${user.uid}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({ name: profile.name, phone: profile.phone, addresses: profile.addresses, defaultAddressId: profile.defaultAddressId }),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      const data = await res.json();
      setProfile(prev => ({ ...prev, ...data }));
      alert('Profile saved');
    } catch (err) {
      setError(err.message);
    }
  };

  const addAddress = () => {
    setEditingAddress({ id: `${Date.now()}`, label: 'Home', line1: '', line2: '', city: '', state: '', zip: '', country: '', phone: profile.phone || '' });
  };

  const editAddress = (a) => { setEditingAddress({ ...a }); };
  const removeAddress = (id) => {
    setProfile(prev => ({ ...prev, addresses: prev.addresses.filter(a => a.id !== id), defaultAddressId: prev.defaultAddressId === id ? undefined : prev.defaultAddressId }));
  };

  const saveEditingAddress = () => {
    if (!editingAddress) return;
    setProfile(prev => {
      const exists = prev.addresses.find(a => a.id === editingAddress.id);
      const addresses = exists
        ? prev.addresses.map(a => a.id === editingAddress.id ? editingAddress : a)
        : [...prev.addresses, editingAddress];
      return { ...prev, addresses };
    });
    setEditingAddress(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-stone-50"><Navbar variant="home" menuOpen={menuOpen} setMenuOpen={setMenuOpen} /><div className="p-8">Loading...</div></div>
  );

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar variant="home" menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 style={{ fontFamily: "'DM Serif Display', serif" }} className="text-3xl text-stone-900 mb-6">Your Profile</h1>

        {error && <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 text-red-600">{error}</div>}

        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
          <label className="block text-sm text-stone-700 mb-1">Name</label>
          <input value={profile.name} onChange={e => setProfile(prev => ({ ...prev, name: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-4" />
          <label className="block text-sm text-stone-700 mb-1">Phone</label>
          <input value={profile.phone} onChange={e => setProfile(prev => ({ ...prev, phone: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-4" />
          <div className="flex gap-3">
            <button onClick={handleSaveProfile} className="bg-stone-900 text-white px-4 py-2 rounded-full">Save Profile</button>
            <button onClick={() => navigate('/home')} className="border border-stone-200 px-4 py-2 rounded-full">Back to Shop</button>
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg text-stone-900">Addresses</h2>
          <button onClick={addAddress} className="text-sm text-stone-700 border border-stone-200 px-3 py-1 rounded-full">Add Address</button>
        </div>

        <div className="space-y-4">
          {profile.addresses.length === 0 && <div className="text-sm text-stone-500">No addresses saved.</div>}
          {profile.addresses.map(a => (
            <div key={a.id} className="bg-white border border-stone-200 rounded-2xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-stone-900">{a.label}</div>
                  <div className="text-sm text-stone-600">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</div>
                  <div className="text-sm text-stone-600">{a.city}{a.state ? `, ${a.state}` : ''} {a.zip}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <button onClick={() => editAddress(a)} className="text-sm text-stone-700 border border-stone-200 px-3 py-1 rounded-full">Edit</button>
                    <button onClick={() => removeAddress(a.id)} className="text-sm text-red-600 border border-red-100 px-3 py-1 rounded-full">Remove</button>
                  </div>
                  <label className="text-xs text-stone-500">
                    <input type="radio" checked={profile.defaultAddressId === a.id} onChange={() => setProfile(prev => ({ ...prev, defaultAddressId: a.id }))} /> Default
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {editingAddress && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setEditingAddress(null)} />
            <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl p-6 z-50">
              <h3 className="text-lg font-medium mb-3">Edit Address</h3>
              <label className="block text-sm text-stone-700 mb-1">Label</label>
              <input value={editingAddress.label} onChange={e => setEditingAddress(prev => ({ ...prev, label: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-3" />
              <label className="block text-sm text-stone-700 mb-1">Line 1</label>
              <input value={editingAddress.line1} onChange={e => setEditingAddress(prev => ({ ...prev, line1: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-3" />
              <label className="block text-sm text-stone-700 mb-1">Line 2</label>
              <input value={editingAddress.line2} onChange={e => setEditingAddress(prev => ({ ...prev, line2: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-3" />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-stone-700 mb-1">City</label>
                  <input value={editingAddress.city} onChange={e => setEditingAddress(prev => ({ ...prev, city: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-3" />
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-1">State</label>
                  <input value={editingAddress.state} onChange={e => setEditingAddress(prev => ({ ...prev, state: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-3" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-stone-700 mb-1">ZIP</label>
                  <input value={editingAddress.zip} onChange={e => setEditingAddress(prev => ({ ...prev, zip: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-3" />
                </div>
                <div>
                  <label className="block text-sm text-stone-700 mb-1">Country</label>
                  <input value={editingAddress.country} onChange={e => setEditingAddress(prev => ({ ...prev, country: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-3" />
                </div>
              </div>
              <label className="block text-sm text-stone-700 mb-1">Phone</label>
              <input value={editingAddress.phone} onChange={e => setEditingAddress(prev => ({ ...prev, phone: e.target.value }))} className="w-full border border-stone-200 rounded-md px-3 py-2 mb-4" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingAddress(null)} className="border border-stone-200 px-4 py-2 rounded-full">Cancel</button>
                <button onClick={saveEditingAddress} className="bg-stone-900 text-white px-4 py-2 rounded-full">Save Address</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
