import React, { useState, useEffect } from 'react';
import './index.css';

// --- Sub-Component: Errand Form ---
const ErrandForm = ({ onAddErrand }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddErrand({ 
      title, 
      description, 
      id: Date.now(), // This creates a unique number ID
    });
    
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-1 text-sm">Task Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="What needs to be done?"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-1 text-sm">Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Add details..."
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition cursor-pointer">
        Add Errand
      </button>
    </form>
  );
};

// --- Sub-Component: Errand List ---
// Notice: We "catch" onDelete here as a prop
const ErrandList = ({ errands, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Your List</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {errands.length} Items
        </span>
      </div>

      {errands.length === 0 ? (
        <p className="text-gray-500 text-center py-10 italic">No errands yet.</p>
      ) : (
        errands.map((errand) => (
          <div key={errand.id} className="flex justify-between items-center p-4 bg-white border-l-4 border-blue-500 rounded shadow-sm">
            <div>
              <h3 className="font-bold text-gray-900">{errand.title}</h3>
              <p className="text-gray-600 text-sm">{errand.description}</p>
            </div>
            {/* The important part: An arrow function that waits for the click */}
            <button 
              onClick={() => onDelete(errand.id)}
              className="ml-4 text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1 rounded transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  // LOCAL STORAGE: Load data when the app starts
  const [errands, setErrands] = useState(() => {
    const saved = localStorage.getItem('my-errands');
    return saved ? JSON.parse(saved) : [];
  });

  // LOCAL STORAGE: Save data whenever 'errands' list changes
  useEffect(() => {
    localStorage.setItem('my-errands', JSON.stringify(errands));
  }, [errands]);

  const addErrand = (newErrand) => {
    setErrands([newErrand, ...errands]);
  };

  // DELETE LOGIC: This is the function the button will trigger
  const deleteErrand = (idToDelete) => {
    // console.log("Deleting:", idToDelete); // Use this to test in the Inspect Console
    const filteredList = errands.filter(item => item.id != idToDelete);
    setErrands(filteredList);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-900 tracking-tight">ErrandRun</h1>
        </header>

        <ErrandForm onAddErrand={addErrand} />
        
        {/* We pass 'deleteErrand' into the 'onDelete' prop */}
        <ErrandList errands={errands} onDelete={deleteErrand} />
      </div>
    </div>
  );
}