import React from 'react';
import { Check, X, Play, AlertTriangle } from 'lucide-react';
// import type { Action } from 'nexus-shared';
import type { Action } from '../types';

interface ActionCardProps {
  action: Action;
  onApprove: () => void;
  onReject: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onApprove, onReject }) => {
  const getStatusIcon = () => {
    switch (action.status) {
      case 'pending':
        return <Play size={16} className="text-yellow-500" />;
      case 'approved':
        return <Check size={16} className="text-green-500" />;
      case 'rejected':
        return <X size={16} className="text-red-500" />;
      case 'completed':
        return <Check size={16} className="text-green-500" />;
      case 'failed':
        return <AlertTriangle size={16} className="text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (action.status) {
      case 'pending':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'approved':
        return 'border-green-500/30 bg-green-500/10';
      case 'rejected':
        return 'border-red-500/30 bg-red-500/10';
      case 'completed':
        return 'border-green-500/30 bg-green-500/10';
      case 'failed':
        return 'border-red-500/30 bg-red-500/10';
    }
  };

  return (
    <div className={`border rounded-xl p-4 ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getStatusIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-200">{action.description}</p>
          {action.data && (
            <pre className="mt-2 text-xs text-gray-400 bg-gray-900 rounded p-2 overflow-x-auto">
              {JSON.stringify(action.data, null, 2)}
            </pre>
          )}
          {action.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={onApprove}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
              >
                <Check size={14} />
                Approve
              </button>
              <button
                onClick={onReject}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
              >
                <X size={14} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
