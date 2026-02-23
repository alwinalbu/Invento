import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import loginImage from "../assets/Login.png";
import UploadImage from "../components/UploadImage"

export const serverUrl = import.meta.env.VITE_SERVER_URL;
console.log(serverUrl,'url here');

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    imageUrl: "",
    imageFile: null,
  });
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  // Handle input change for registration form
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageUpload = (image) => {
    setForm({ ...form, imageFile: image });
  };

  // Upload image to Cloudinary
  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Invento");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dylttfesj/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const dataRes = await res.json();

      console.log("Uploaded image response:", dataRes);

      return dataRes.url; 
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };


  // Register User
  const registerUser = (updatedForm) => {
    setLoading(true);

    fetch(`${serverUrl}/register`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(updatedForm),
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }

        alert(data.message);
        navigate("/login");
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };


// Handling Submmit

const handleSubmit = async (e) => {
  e.preventDefault();

  let imageUrl = form.imageUrl; 

  if (form.imageFile) {
    imageUrl = await uploadImage(form.imageFile); 
    if (!imageUrl) return; 
  }

  const updatedForm = { ...form, imageUrl };

  registerUser(updatedForm);
};


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img className="mx-auto h-12 w-auto" src={logo} alt="Your Company" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Register your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 -space-y-px rounded-md shadow-sm">
            <div className="flex gap-4">
              <input
                name="firstName"
                type="text"
                required
                maxLength={10}
                pattern="[A-Za-z]+"
                className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="First Name"
                value={form.firstName}
                onChange={handleInputChange}
              />
              <input
                name="lastName"
                type="text"
                required
                maxLength={10}
                pattern="[A-Za-z]+"
                className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Last Name"
                value={form.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Email address"
                value={form.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <input
                name="phoneNumber"
                type="number"
                autoComplete="phoneNumber"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={handleInputChange}
              />
            </div>
            <UploadImage uploadImage={handleImageUpload} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                checked
                required
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                I Agree Terms & Conditions
              </label>
            </div>

            <div className="text-sm">
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Already Have an Account? <Link to="/login">Sign In now</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
      <div className="flex justify-center order-first sm:order-last">
        <img src={loginImage} alt="login image" />
      </div>
    </div>
  );
};

export default Register;
