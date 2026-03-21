import React, { useState } from 'react';

/**
 * Interactive AGI/ASI Framework Explorer: Prototype
 * Maps capability level to required governance intervention.
 */

const GovernanceExplorer = () => {
  const [capability, setCapability] = useState(5); // S1 to S10 scale

  const getGovernanceAction = (lvl) => {
    if (lvl < 4) return { status: 'GREEN', action: 'Standard Monitoring', control: 'Logging' };
    if (lvl < 7) return { status: 'AMBER', action: 'Soft Gating Active', control: 'GDL Logic' };
    return { status: 'RED', action: 'Continuation Refusal State', control: 'IRMI Hard Kill' };
  };

  const current = getGovernanceAction(capability);

  return (
    <div className="p-8 max-w-2xl mx-auto bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold mb-6">Interactive AGI Governance Explorer</h2>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-4">Capability Level: S{capability}</label>
        <input
          type="range" min="1" max="10" value={capability}
          onChange={(e) => setCapability(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      <div className={`p-6 rounded-lg border-2 ${
        current.status === 'RED' ? 'border-red-500 bg-red-950/20' :
        current.status === 'AMBER' ? 'border-amber-500 bg-amber-950/20' : 'border-green-500 bg-green-950/20'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Status: {current.status}</span>
          <span className="px-3 py-1 bg-slate-800 rounded text-xs">Auth: JULES-MASTER-CANON</span>
        </div>

        <div className="space-y-2">
          <p><span className="text-slate-400">Action:</span> {current.action}</p>
          <p><span className="text-slate-400">Primary Control:</span> {current.control}</p>
        </div>
      </div>
    </div>
  );
};

export default GovernanceExplorer;
