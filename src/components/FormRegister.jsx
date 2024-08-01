import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword, doSignOut} from "../firebase/auth";


const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isRegistering) {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }

      setIsRegistering(true);
      setErrorMessage("");
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        await doSignOut(); 
        navigate("/login");
      } catch (error) {
        setErrorMessage(error.message || "Failed to register");
      } finally {
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Create a New Account</h2>
        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            disabled={isRegistering}
          >
            Sign Up
          </button>
        </form>
        <div className="text-center">
          <span>
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Continue
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
