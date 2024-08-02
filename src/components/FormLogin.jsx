import React, { useState, useEffect } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { Link, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../firebase/auth";
import { useAuth } from "../contexts/authContext";

const LoginForm = ({ onClose, onRegisterClick }) => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userLoggedIn) {
      navigate("/");
      onClose();
    }
  }, [userLoggedIn, navigate, onClose]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage("");
      try {
        await doSignInWithEmailAndPassword(email, password);
        navigate("/");
        onClose();
      } catch (error) {
        setErrorMessage(error.message || "Failed to sign in");
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  const onGoogleSignIn = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage("");
      try {
        await doSignInWithGoogle();
        navigate("/");
        onClose();
      } catch (error) {
        setErrorMessage(error.message || "Failed to sign in with Google");
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold font-poppins text-center">Welcome Back</h2>
        {errorMessage && (
          <div className="text-red-500 text-center">{errorMessage}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border font-poppins rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border font-poppins rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold font-poppins text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            disabled={isSigningIn}
          >
            Sign In
          </button>
        </form>
        <div className="text-center font-poppins">
          <span>
            Don't have an account?{" "}
            <button
              onClick={onRegisterClick}
              className="text-indigo-600 hover:underline"
            >
              Sign up
            </button>
          </span>
        </div>
        <div className="relative flex items-center justify-center w-full mt-6">
          <div className="w-full border-t border-gray-300"></div>
          <span className="absolute px-3 text-gray-500 font-poppins bg-white">OR</span>
        </div>
        <button
          onClick={onGoogleSignIn}
          className="flex items-center justify-center w-full px-4 py-2 mt-4 font-semibold font-poppins text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          disabled={isSigningIn}
        >
          <GoogleIcon className="mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
