import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

export default function DocumentChamber() {
  const [docFile, setDocFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [status, setStatus] = useState('Draft'); // States: Draft, In Review, Signed
  const sigCanvas = useRef({});

  // File Upload handling aur status change
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileType(file.type);
      setDocFile(URL.createObjectURL(file));
      setStatus('In Review'); // Upload hote hi automated status update
    }
  };

  // Signature ko verify aur status ko 'Signed' karna
  const saveSignature = () => {
    if (sigCanvas.current.isEmpty()) {
      alert("Pehle sign canvas par apna signature draw karein!");
      return;
    }
    setStatus('Signed');
    alert("Mubarak ho! Document successfully sign ho chuka hai.");
  };

  // Canvas saaf karne ke liye
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-xl text-gray-800">
      
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-4 mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-600">
          <span>💼</span> Document Processing Chamber
        </h2>
        
        {/* Dynamic Status Badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Document Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
            status === 'Draft' ? 'bg-gray-100 text-gray-600 border border-gray-300' :
            status === 'In Review' ? 'bg-amber-100 text-amber-700 border border-amber-300' : 
            'bg-emerald-100 text-emerald-700 border border-emerald-300 animate-bounce'
          }`}>
            {status}
          </span>
        </div>
      </div>

      {/* File Uploading Interface */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Deal ya Contract Document Upload Karein:</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <span className="text-3xl mb-1">📤</span>
              <p className="text-sm text-gray-500 font-medium">Click to upload (PDF, PNG, JPG)</p>
            </div>
            <input type="file" accept="application/pdf, image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Preview Section */}
      {docFile && (
        <div className="mb-6 border rounded-xl overflow-hidden shadow-inner bg-gray-50 p-2">
          <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Live Preview Chamber</p>
          <div className="h-80 w-full bg-white border rounded flex items-center justify-center">
            {fileType.includes('pdf') ? (
              <iframe src={docFile} title="PDF Contract Preview" className="w-full h-full" />
            ) : (
              <img src={docFile} alt="Contract Preview" className="max-h-full max-w-full object-contain" />
            )}
          </div>
        </div>
      )}

      {/* E-Signature Pad Grid Section */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
          ✒️ E-Signature Mockup Pad
        </h3>
        <p className="text-xs text-gray-500 mb-3">Niche box ke andar apna signature mouse ya touch screen se draw karein:</p>
        
        {/* Signature Canvas Board */}
        <div className="bg-white border border-gray-300 rounded-lg inline-block p-1 shadow-sm">
          <SignatureCanvas 
            ref={sigCanvas}
            penColor="navy"
            canvasProps={{ 
              width: 500, 
              height: 160, 
              className: 'sigCanvas bg-slate-50 cursor-crosshair rounded' 
            }}
          />
        </div>

        {/* Buttons Controls */}
        <div className="flex gap-3 mt-3">
          <button onClick={saveSignature} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md">
            Apply Digital Signature
          </button>
          <button onClick={clearSignature} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
            Clear Canvas
          </button>
        </div>
      </div>

    </div>
  );
}