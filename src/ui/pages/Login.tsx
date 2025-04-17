import { useEffect, useState } from 'react';
import axiosInstance from '../axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credentialError, setCredentialError] = useState('');
  
  useEffect(() => {
    document.title = 'Notify | Login';
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } 

    if (!isValid) return;
    
    setIsLoading(true);
    axiosInstance.post('/api/auth/login', {
      email, password
    }).then((res: any) => {
      setCredentialError('');
      window.electron.setAuth({ accessToken: res.data.token, ...res.data.user });
    }).catch(err => {
      setCredentialError(err.response.data.error)
    }).finally(() => {
      setIsLoading(false);
    })
  };

  return (
    <div className="login-container">
      <h4 className="text-center mb-4">Login to Notify app</h4>
      { credentialError && <h6 className='text-center text-danger mb-2'>{ credentialError }</h6>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className={`form-control ${emailError ? 'is-invalid' : ''}`}
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className={`form-control ${passwordError ? 'is-invalid' : ''}`}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          {passwordError && <div className="invalid-feedback">{passwordError}</div>}
        </div>
        <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
          Login 
          { isLoading && <span className='spinner-border spinner-border-sm'></span>}
        </button>
      </form>
    </div>
  );
};

export default Login;