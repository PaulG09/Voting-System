import React, { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { BACKEND_URL } from '../../../utils/constants';
import { useNavigate, useLocation } from 'react-router-dom';

const FaceVerify = () => {
  const videoRef = useRef(null);
  const [landmarks, setLandmarks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get reference from router state
  const reference = location.state?.userReference;

  useEffect(() => {
    if (!videoRef.current) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        setLandmarks(results.multiFaceLandmarks[0]);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 400,
      height: 300,
    });
    camera.start();
    return () => camera.stop();
  }, []);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/face/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, landmarks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed');
      if (data.verified) {
        setSuccess('Face verified! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Face not recognized. Please try again.');
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Face Verification</h2>
      <video ref={videoRef} autoPlay playsInline width={400} height={300} style={{ borderRadius: 8, border: '1px solid #ccc' }} />
      <div style={{ margin: '1rem 0' }}>
        <button
          className="login-btn"
          onClick={handleVerify}
          disabled={!landmarks || loading}
          style={{ maxWidth: '200px', width: '100%' }}
        >
          {loading ? 'Verifying...' : 'Verify Face'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {!landmarks && <div>Position your face in the camera...</div>}
    </div>
  );
};

export default FaceVerify;