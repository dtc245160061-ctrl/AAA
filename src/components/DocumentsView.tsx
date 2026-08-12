import React, { useState } from 'react';
import { 
  Search, 
  FileText, 
  Download, 
  Plus
} from 'lucide-react';

interface DocumentsViewProps {
  onOpenQuickAction: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  onOpenQuickAction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const documents = [
    { id: 'DOC-9081', name: 'Signed_Lease_Agreement_PH-2401.pdf', category: 'Contracts', entity: 'PH-2401 (Alexander Vance)', date: '2023-01-15', size: '2.4 MB' },
    { id: 'DOC-9080', name: 'Signed_Lease_Agreement_SV-2001.pdf', category: 'Contracts', entity: 'SV-2001 (Sophia Chen)', date: '2023-08-01', size: '2.2 MB' },
    { id: 'DOC-9079', name: 'Resident_ID_Verification_Vance.pdf', category: 'Resident IDs', entity: 'Alexander Vance', date: '2023-01-10', size: '1.1 MB' },
    { id: 'DOC-9078', name: 'June_2026_Rent_Roll_Statement.pdf', category: 'Reports & Audit', entity: 'Grand Tower Residence', date: '2026-06-01', size: '3.8 MB' },
    { id: 'DOC-9077', name: 'Otis_Elevator_Safety_Inspection.pdf', category: 'Regulations', entity: 'Building Mechanicals', date: '2026-06-08', size: '1.5 MB' },
    { id: 'DOC-9076', name: 'Building_Rules_and_Bylaws_2026.pdf', category: 'Regulations', entity: 'All Residents', date: '2026-01-01', size: '850 KB' },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.entity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || doc.category.toLowerCase().includes(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 text-left relative z-10 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <span className="text-[11px] font-mono-tech uppercase tracking-widest text-slate-400 font-medium block">
            PROPERTY DOCUMENT REPOSITORY / AUDIT & COMPLIANCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif-editorial text-white mt-1">
            Documents Library
          </h1>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="px-4 py-2.5 text-xs font-mono-tech font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload Document</span>
        </button>
      </div>

      {/* Filter Bar (Liquid Glass) */}
      <div className="liquid-glass p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by file name, resident, or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/60 font-mono-tech"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80 text-xs font-mono-tech">
          {['all', 'contracts', 'ids', 'reports', 'regulations'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                categoryFilter === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="liquid-glass p-6 overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono-tech text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4">Document File Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Associated Entity</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4">File Size</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{doc.name}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2.5 py-1 text-[10px] uppercase rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {doc.category}
                  </span>
                </td>
                <td className="py-4 px-4 text-slate-300">{doc.entity}</td>
                <td className="py-4 px-4 text-slate-400">{doc.date}</td>
                <td className="py-4 px-4 text-slate-400">{doc.size}</td>
                <td className="py-4 px-4 text-right">
                  <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 ml-auto">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
