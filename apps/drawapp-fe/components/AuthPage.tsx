"use client";

import { useState } from "react";

export function AuthPage({ isSignin }: { isSignin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <div className="p-6 bg-white rounded-xl shadow-lg w-80 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-center text-gray-900">
          {isSignin ? "Sign In" : "Sign Up"}
        </h2>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          {isSignin ? "Don't have an account? " : "Already have an account? "}
          <a href="#" className="text-blue-600 hover:underline">
            {isSignin ? "Sign Up" : "Sign In"}
          </a>
        </p>
      </div>
    </div>
  );
}
