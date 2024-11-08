import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // New state

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong');
        return;
      }
      setSuccess('Password reset link sent! Check your email.');
    } catch (error) {
      setError('Failed to connect to the server.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setError('Password must contain at least 8 characters, including a letter, a number, and a special character');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isLogin && !emailPattern.test(email)) {
      setError('Invalid email format');
      return;
    }

    const formData = isLogin
      ? { identifier: username, password }
      : { username, email, password, confirmPassword };

    try {
      const response = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Something went wrong');
        return;
      }

      const data = await response.json();

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        setSuccess('Login successful!');
        navigate('/profile');
      } else {
        setSuccess('Signup successful! Please login.');
        setIsLogin(true);
      }
    } catch (error) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('https://thumbs.dreamstime.com/z/abstract-tree-sculpture-vibrant-leaves-stacked-books-symbolic-knowledge-high-quality-photo-329782866.jpg?ct=jpeg')]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Sign Up'}</h1>
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        
        {showForgotPassword ? (
          <form onSubmit={handleForgotPasswordSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
            >
              Send Reset Link
            </button>
            <button
              type="button"
              className="mt-4 text-blue-500 hover:underline w-full"
              onClick={() => setShowForgotPassword(false)}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleFormSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mb-4 p-2 border rounded w-full"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4 p-2 border rounded w-full"
                  required
                />
              </>
            )}
            {isLogin && (
              <input
                type="text"
                placeholder="Username or Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                name="identifier"
                className="mb-4 p-2 border rounded w-full"
                required
              />
            )}
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
              required
            />
            {!isLogin && (
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mb-4 p-2 border rounded w-full"
                required
              />
            )}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label>Show Password</label>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <div className="flex items-center mt-4 justify-center">
              <button
                type="button"
                className="mr-8 text-blue-500 hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </button>
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
