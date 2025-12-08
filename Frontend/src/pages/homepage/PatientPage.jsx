import { useState, useEffect } from "react";
import Header from "../../components/headers/Header";

function PatientPage() {
  const [userName, setUserName] = useState("Loading...");

  // Fetching user data
  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const data = await fetch("http://localhost:3000/api/user/homepage", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const res = await data.json();
        setUserName(res.message); // ✅ backend sends { message: userName }
      } catch (err) {
        console.error("Fetch error:", err);
        setUserName("Error");
      }
    }

    fetchData();
  }, []);

  // ✅ Proper Conditional Rendering
  if (userName === "Error") {
    return (
      <div className="w-full min-h-screen flex  flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600">
          User Not Found
        </h1>
        <br></br>
        <a href="/login">Login-here</a>
      </div>
    );
  }

  return (
    <>
      <Header avtar={userName.charAt(0)} />

      {/* HERO SECTION */}
      <section className="w-full min-h-[60vh] bg-gradient-to-r from-blue-500 to-blue-700 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-white text-3xl sm:text-4xl font-bold mb-3">
          Welcome, {userName} 👋
        </h1>
        <p className="text-blue-100 text-base sm:text-lg max-w-xl">
          Book appointments, consult expert doctors, and manage your health —
          all in one place.
        </p>

        <div className="mt-6 flex gap-4">
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Book Appointment
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-blue-600 transition">
            View Doctor
          </button>
        </div>
      </section>

      {/* DOCTOR CATEGORIES */}
      <section className="w-full py-12 px-6 bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          Doctor Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            "General Physician",
            "Cardiologist",
            "Dermatologist",
            "Pediatrician",
            "Neurologist",
            "Orthopedic",
            "Psychiatrist",
            "Gynecologist",
          ].map((category, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer text-center"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                {category.charAt(0)}
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-700">
                {category}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* DOCTOR LIST */}
      <section className="w-full py-14 px-6 bg-white">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-800">
          Popular Doctors
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {[
            {
              name: "Dr. Ananya Sharma",
              category: "Cardiologist",
              price: 700,
              rating: 4.8,
              image: "https://randomuser.me/api/portraits/women/44.jpg",
            },
            {
              name: "Dr. Rohan Verma",
              category: "Dermatologist",
              price: 500,
              rating: 4.6,
              image: "https://randomuser.me/api/portraits/men/32.jpg",
            },
            {
              name: "Dr. Neha Kapoor",
              category: "Pediatrician",
              price: 450,
              rating: 4.7,
              image: "https://randomuser.me/api/portraits/women/68.jpg",
            },
            {
              name: "Dr. Arjun Mehta",
              category: "Orthopedic",
              price: 800,
              rating: 4.9,
              image: "https://randomuser.me/api/portraits/men/54.jpg",
            },
          ].map((doc, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border shadow-sm hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={doc.image}
                alt={doc.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {doc.name}
                </h3>

                <p className="text-sm text-blue-600 font-medium mb-1">
                  {doc.category}
                </p>

                <div className="flex items-center justify-between mt-2 mb-3">
                  <span className="text-sm text-gray-600">
                    ⭐ {doc.rating}
                  </span>

                  <span className="text-sm font-semibold text-green-600">
                    ₹{doc.price}
                  </span>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default PatientPage;
