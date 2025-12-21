import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Decode token to get user info if needed, or just fetch 'me' endpoint
      // For now, we save token and fetch user details or redirect assuming patient for now (or fix redirect logic to fetch user)
      localStorage.setItem("token", token);
      
      // Use a timeout to ensure storage is set or fetch user profile immediately?
      // Better: Fetch user profile to know role.
      // But for simplicity/speed request, we'll try to fetch /me
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
          if(data.user) {
              localStorage.setItem("user", JSON.stringify(data.user));
              if(data.user.role === "Doctor") navigate("/doctor/dashboard");
              else if(data.user.role === "Admin") navigate("/admin/dashboard");
              else navigate("/patient/dashboard");
          } else {
              navigate("/login?error=fetch_failed");
          }
      })
      .catch(err => {
          console.error(err);
          navigate("/login?error=fetch_failed");
      });

    } else {
      navigate("/login?error=no_token");
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
}

export default AuthSuccess;
