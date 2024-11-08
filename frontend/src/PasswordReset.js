import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPasswordForm = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { token } = useParams(); // Retrieve token from URL
  const navigate = useNavigate();

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong');
        return;
      }

      setSuccess('Password reset successful!');
      navigate('/login');
    } catch (error) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleResetSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
