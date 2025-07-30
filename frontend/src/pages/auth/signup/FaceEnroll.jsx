import React, { useRef, useEffect, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { BACKEND_URL } from '../../../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';

const FaceEnroll = ({ reference: propReference, onEnrolled }) => {
  const videoRef = useRef(null);
  const [landmarks, setLandmarks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Parse reference and email from URL query params if not passed as prop
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      reference: searchParams.get('reference'),
      email: searchParams.get('email'),
    };
  };

  const { reference, email } = getQueryParams();
  const finalReference = propReference || reference;

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

  const handleEnroll = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${BACKEND_URL}/api/face/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: finalReference, landmarks }),
      });
      const data = await res.json();
      if (res.status === 409) {
        setError(data.message || 'User already registered');
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.message || 'Enrollment failed');
      setSuccess(data.message || 'Enrollment successful!');
      // Redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      onEnrolled && onEnrolled();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Face Enrollment</h2>
      <video ref={videoRef} autoPlay playsInline width={400} height={300} style={{ borderRadius: 8, border: '1px solid #ccc' }} />
      <div style={{ margin: '1rem 0' }}>
        <button
          className="login-btn"
          onClick={handleEnroll}
          disabled={!landmarks || loading}
          style={{ maxWidth: '200px', width: '100%' }}
        >
          {loading ? 'Enrolling...' : 'Enroll Face'}
        </button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button
          className="login-btn"
          onClick={() => navigate('/signup')}
          style={{ maxWidth: '200px', width: '100%', backgroundColor: '#6c757d' }}
        >
          Return to Signup
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      {!landmarks && <div>Position your face in the camera...</div>}
    </div>
  );
};

export default FaceEnroll;
