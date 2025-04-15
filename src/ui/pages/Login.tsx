import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must be at least 8 characters, include 1 digit and 1 special character'
      );
      isValid = false;
    }

    if (!isValid) return;
    
    // Add your login logic here (e.g., API call)
    console.log({ email, password, rememberMe });
    window.electron.storeTokens('accessToken', 'refreshToken');
    window.location.href = '/preferences'; // or use useNavigate
  };

  return (
    <div className="login-container">
      <h2 className="text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          {emailError && <div className="text-danger">{emailError}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          {passwordError && <div className="text-danger">{passwordError}</div>}
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember me
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        {/* <div className="text-center mt-3">
          <a href="#" className="text-decoration-none">
            Forgot Password?
          </a>
        </div> */}
      </form>
    </div>
  );
};

export default Login;