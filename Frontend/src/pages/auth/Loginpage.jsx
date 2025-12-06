import {useState} from "react";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

function Loginpage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    //UI state
    const [loading,setLoading]=useState(false)
    const [fieldError,setFieldError]=useState({email:"",password:""})
    const [backendError,setBackendError]=useState("");

//basic validation
function formValidator(){
    const error={
        password:"",
        email: ""
    }
    let ok=true;
    if(!email.trim())
    {
        error.email="Email is required"
        ok=false;
    }
    if(!password)
    {
        error.password="Password is required"
        ok=false;
    }

    setFieldError(error)
    return ok;

}

const handleSubmit = async (e) => {
  e.preventDefault();
  setBackendError("");

  // VALIDATION
  if (!formValidator()) return;

  setLoading(true);

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setBackendError(data.message || "Login failed, please try again.");
      return;
    }

    // ⭐ SAVE TOKEN
    localStorage.setItem("token", data.token);

    // ⭐ Redirect to homepage
    navigate("/homepage");

  } catch (error) {
    console.log("Login error:", error);
    setLoading(false);
    setBackendError("Server error. Please try again later.");
  }
};


     return (
    <div className="h-screen w-full flex">
      
      {/* LEFT POSTER SECTION */}
      <div className="hidden md:flex flex-1 bg-indigo-600 text-white items-center justify-center">
        <h1 className="text-5xl font-bold px-10 leading-tight">
          Your Health,
          <br /> Your Control.
        </h1>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-80 md:w-96 flex flex-col gap-6">
          
          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold">Log-in</h2>
            <h4 className="text-gray-500 text-sm">
              Are you new??{" "}
              <span
  className="text-indigo-600 font-semibold underline cursor-pointer"
  onClick={() => navigate("/signup")}
>
  Sign-up
</span>

            </h4>
          </div>

          {/* FORM */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="font-medium">Email</label>
              <input
                className={`border ${(fieldError.email)?"border-red-500": "border-gray-400"} rounded-md h-10 px-3 text-[16px]`}
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
              {fieldError.email && <p className="text-[13px] text-red-500">{fieldError.email}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium">Password</label>
              <input
               className={`border ${(fieldError.password)?"border-red-500": "border-gray-400"} rounded-md h-10 px-3 text-[16px]`}
                type="password"
                placeholder="Enter password"
                onChange={(e)=>setPassword(e.target.value)}
                value={password}
              />
              {fieldError.password && <p className="text-[13px] text-red-500">{fieldError.password}</p>}
            </div>

            <div className="pt-3">
              <Button value={loading ? "loging in....." : "Login"} disabled={loading} />
            </div>
           {backendError && <p className="text-[13px] text-red-500">{backendError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Loginpage
