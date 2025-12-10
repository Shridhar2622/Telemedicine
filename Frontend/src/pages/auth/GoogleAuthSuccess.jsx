import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error) {
      alert('Google authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token && userId && role) {
      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id: userId, role }));

      // Redirect based on role
      if (role === 'Patient') {
        navigate('/patient/homepage');
      } else if (role === 'Doctor') {
        // Check if doctor profile is completed
        checkDoctorProfile(token, navigate);
      } else {
        navigate('/');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Authenticating...</h2>
        <p>Please wait while we log you in.</p>
      </div>
    </div>
  );
}

async function checkDoctorProfile(token, navigate) {
  try {
    const res = await fetch('http://localhost:5000/api/doctor/profile/status', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    
    if (data.isProfileCompleted) {
      navigate('/doctor/dashboard');
    } else {
      navigate('/doctor/complete-profile');
    }
  } catch (error) {
    console.error('Error checking profile:', error);
    navigate('/doctor/complete-profile');
  }
}

export default GoogleAuthSuccess;
