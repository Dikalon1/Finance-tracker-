import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';

const CategoryList: React.FC = () => {
  const { categories, addCategory, addSubCategory } = useFinance();
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'expense' | 'income'>('expense');
  
  const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    addCategory({
      name: newCatName,
      type: newCatType,
      subCategories: [],
    });
    setNewCatName('');
    setIsAddingCat(false);
  };

  const handleAddSubCategory = (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    if (!newSubName) return;
    addSubCategory(categoryId, { name: newSubName });
    setNewSubName('');
    setAddingSubTo(null);
    setExpandedCats(prev => ({ ...prev, [categoryId]: true }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Categories</h2>
        <button
          onClick={() => setIsAddingCat(!isAddingCat)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Category</span>
        </button>
      </div>

      {isAddingCat && (
        <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Health"
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value as 'expense' | 'income')}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddingCat(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Category
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['expense', 'income'].map((type) => (
          <div key={type} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 capitalize">{type}s</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {categories.filter(c => c.type === type).length === 0 ? (
                <div className="p-8 text-center text-slate-500">No {type} categories found.</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {categories.filter(c => c.type === type).map((cat) => (
                    <div key={cat.id} className="p-1">
                      <div 
                        className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => toggleExpand(cat.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={type === 'expense' ? 'text-red-500' : 'text-green-500'}>
                            {expandedCats[cat.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          </div>
                          <span className="font-medium text-slate-800">{cat.name}</span>
                          <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                            {cat.subCategories.length} subgroups
                          </span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setAddingSubTo(cat.id);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      {expandedCats[cat.id] && (
                        <div className="pl-12 pr-4 pb-3 space-y-2">
                          {cat.subCategories.map((sub) => (
                            <div key={sub.id} className="flex items-center space-x-2 text-slate-600 text-sm py-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                              <span>{sub.name}</span>
                            </div>
                          ))}
                          
                          {addingSubTo === cat.id ? (
                            <form 
                              onSubmit={(e) => handleAddSubCategory(e, cat.id)}
                              className="mt-2 flex space-x-2"
                              onClick={e => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={newSubName}
                                onChange={(e) => setNewSubName(e.target.value)}
                                placeholder="Subgroup name"
                                className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                autoFocus
                              />
                              <button type="submit" className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">
                                Add
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setAddingSubTo(null)}
                                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                            </form>
                          ) : cat.subCategories.length === 0 && (
                            <p className="text-xs text-slate-400 italic">No subgroups yet.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
