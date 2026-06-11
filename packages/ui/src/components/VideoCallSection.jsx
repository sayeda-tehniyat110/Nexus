import React, { useState, useRef } from 'react';

export default function VideoCallSection() {
  const [inCall, setInCall] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [audioOn, setAudioOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  // Call shuru karne aur camera access ke liye function
  const startCall = async () => {
    setInCall(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access nahi mila:", err);
    }
  };

  // Call khatam karne ka function
  const endCall = () => {
    setInCall(false);
    setScreenSharing(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // Video Toggle (On/Off)
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoOn(videoTrack.enabled);
      }
    }
  };

  // Audio Toggle (On/Off)
  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioOn(audioTrack.enabled);
      }
    }
  };

  // Screen Share Toggle (Optional Feature)
  const toggleScreenShare = async () => {
    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        setScreenSharing(true);
        
        // Agar user browser se sharing stop karde
        screenStream.getVideoTracks()[0].onended = () => {
          if (localVideoRef.current && streamRef.current) {
            localVideoRef.current.srcObject = streamRef.current;
          }
          setScreenSharing(false);
        };
      } catch (err) {
        console.error("Screen sharing cancel ho gayi:", err);
      }
    } else {
      if (localVideoRef.current && streamRef.current) {
        localVideoRef.current.srcObject = streamRef.current;
      }
      setScreenSharing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-800">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
        <span>📽️</span> Video Calling Chamber
      </h2>

      {/* Main Video Grid */}
      <div className="relative h-[450px] bg-black rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center">
        {inCall ? (
          <>
            {/* Main Screen: Mock Remote User */}
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-2xl font-bold border-2 border-white animate-pulse">
                NX
              </div>
              <p className="mt-3 text-gray-400 font-medium">Connecting with Nexus Client...</p>
            </div>

            {/* Floating Window: Local User (Your Camera) */}
            <div className="absolute bottom-4 right-4 w-44 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-blue-500 shadow-lg">
              {videoOn ? (
                <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xs text-gray-400">
                  Camera Off
                </div>
              )}
              <div className="absolute bottom-1 left-2 bg-black bg-opacity-60 px-1.5 py-0.5 rounded text-[10px]">
                You {audioOn ? '🎙️' : '🔇'}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="text-5xl mb-3">📞</div>
            <p className="text-gray-400 mb-4">Koi call active nahi hai. Meeting shuru karne ke liye niche button dabayein.</p>
            <button onClick={startCall} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-md">
              Start Video Call
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons Bar */}
      {inCall && (
        <div className="flex justify-center items-center gap-4 mt-4 bg-gray-800 p-3 rounded-xl border border-gray-700">
          {/* Mute/Unmute */}
          <button onClick={toggleAudio} className={`p-3 rounded-full transition-colors ${audioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`} title={audioOn ? "Mute Mic" : "Unmute Mic"}>
            {audioOn ? "🎙️ Mic On" : "🔇 Mic Off"}
          </button>

          {/* Video On/Off */}
          <button onClick={toggleVideo} className={`p-3 rounded-full transition-colors ${videoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`} title={videoOn ? "Turn Camera Off" : "Turn Camera On"}>
            {videoOn ? "📷 Video On" : "🚫 Video Off"}
          </button>

          {/* Screen Share (Optional bonus feature) */}
          <button onClick={toggleScreenShare} className={`p-3 rounded-full transition-colors ${screenSharing ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
            {screenSharing ? "🖥️ Sharing Screen" : "🖥️ Share Screen"}
          </button>

          {/* Leave Call */}
          <button onClick={endCall} className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-full font-semibold transition-colors">
            🛑 End Call
          </button>
        </div>
      )}
    </div>
  );
}