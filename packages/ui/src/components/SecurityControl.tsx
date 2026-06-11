import React, { useState } from 'react';

export default function SecurityControl({ currentRole, onRoleChange }: { currentRole: 'Investor' | 'Entrepreneur'; onRoleChange: (role: 'Investor' | 'Entrepreneur') => void; }) {
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [is2FASerified, setIs2FAVerified] = useState(false);

  // Simple Password Strength Logic
  const getStrength = (pass: string) => {
    if (!pass) return { label: 'Empty', color: 'bg-slate-800', width: 'w-0' };
    if (pass.length < 5) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3' };
    if (pass.length < 8) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getStrength(password);

  const verifyOTP = () => {
    if (otp === '1234') {
      setIs2FAVerified(true);
      alert("2FA Verification Successful! Full Dashboard Access Granted.");
    } else {
      alert("Galat OTP! Demo verification ke liye '1234' type karein.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl text-white space-y-4">
      <h3 className="font-bold text-lg text-indigo-400 border-b border-slate-800 pb-3 flex items-center gap-2">
        🛡️ Security & Access Gate
      </h3>

      {/* Role Selection (Investor vs Entrepreneur) */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch System View Role</label>
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button 
            onClick={() => onRoleChange('Investor')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${currentRole === 'Investor' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            💼 Investor
          </button>
          <button 
            onClick={() => onRoleChange('Entrepreneur')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${currentRole === 'Entrepreneur' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            🚀 Entrepreneur
          </button>
        </div>
      </div>

      {/* Password Strength Meter */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Test Password Security</label>
        <input 
          type="password" 
          placeholder="Type mock password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white"
        />
        <div className="space-y-1">
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden flex">
            <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
          </div>
          <p className="text-[10px] text-right text-slate-400 font-medium">Strength: <span className="text-white">{strength.label}</span></p>
        </div>
      </div>

      {/* 2FA Verification Mockup */}
      <div className="space-y-1.5 pt-1">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Multi-Step 2FA Validation</label>
        {!is2FASerified ? (
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter OTP (Try 1234)" 
              value={otp}
              maxLength={4}
              onChange={e => setOtp(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 tracking-widest text-center text-white"
            />
            <button onClick={verifyOTP} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
              Verify
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-2 rounded-lg text-center font-medium flex items-center justify-center gap-1.5">
            <span>✅</span> 2FA Shield Active
          </div>
        )}
      </div>
    </div>
  );
}