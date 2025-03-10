import React, { useState, useEffect, useRef } from "react";
// Note: We'll use the same CSS file as CreateAccount
import "./CreateAccount.css";

const LogIn: React.FC = () => {
  // State for login fields
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [inputError, setInputError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  // State for submission attempts (for rate limiting)
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Ref for the content wrapper to scroll to top
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  // Fetch CSRF token on component mount
  useEffect(() => {
    // In a real app, this would be an API call to get a CSRF token
    const fetchCsrfToken = async () => {
      try {
        // Simulating an API call
        // const response = await fetch('/api/csrf-token');
        // const data = await response.json();
        // setCsrfToken(data.token);

        // For demo, we'll use a random string
        setCsrfToken(`token-${Math.random().toString(36).substring(2)}-${Date.now()}`);
      } catch (error) {
        console.error("Failed to fetch CSRF token");
        setErrorMessage("Security setup failed. Please try again later.");
      }
    };

    fetchCsrfToken();
  }, []);

  // Input sanitizer to prevent XSS
  const sanitizeInput = (input: string): string => {
    // This is a basic sanitization - in production use a library like DOMPurify
    return input.replace(/[<>&"']/g, (match) => {
      switch (match) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return match;
      }
    });
  };

  // Validators
  const validateInput = (value: string): boolean => {
    // Check if input is empty
    if (!value.trim()) {
      setInputError("Please enter your email or phone number");
      return false;
    }

    // Check if input looks like an email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Check if input looks like a phone number
    const phoneRegex = /^[6-9]\d{8}$/;

    if (!emailRegex.test(value) && !phoneRegex.test(value)) {
      setInputError("Please enter a valid email or phone number");
      return false;
    }

    setInputError("");
    return true;
  };

  // Rate limiting check
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;

    // If more than 5 attempts in 1 minute, rate limit
    if (submitAttempts >= 5 && timeSinceLastSubmit < 60000) {
      setIsRateLimited(true);
      setTimeout(() => setIsRateLimited(false), 60000 - timeSinceLastSubmit);
      return false;
    }

    // Reset counter after 1 minute
    if (timeSinceLastSubmit > 60000) {
      setSubmitAttempts(1);
    } else {
      setSubmitAttempts(prev => prev + 1);
    }

    setLastSubmitTime(now);
    return true;
  };

  // Input handlers
  const handleEmailOrPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setEmailOrPhone(sanitizedValue);
    if (sanitizedValue) {
      validateInput(sanitizedValue);
    } else {
      setInputError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const handleLogin = async () => {
    // Check for rate limiting
    if (!checkRateLimit()) {
      setErrorMessage("Too many attempts. Please try again later.");
      return;
    }

    // Validate input
    if (!validateInput(emailOrPhone)) {
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password");
      return;
    }

    try {
      // In a real app, we would submit to an API with the CSRF token
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-CSRF-Token': csrfToken
      //   },
      //   body: JSON.stringify({
      //     emailOrPhone,
      //     password: '********', // Never log or send the actual password in logs
      //     rememberMe
      //   })
      // });

      // For demo purposes, just simulate a successful login
      console.log("Login submitted with the following data:");
      console.log({
        emailOrPhone,
        password: "********", // NEVER log the actual password
        rememberMe,
        csrfToken
      });

      // Show success message or redirect
      setErrorMessage("");
      alert("Login successful!");

    } catch (error) {
      // Generic error message that doesn't expose implementation details
      setErrorMessage("Login failed. Please check your credentials and try again.");
    }
  };

  const isLoginButtonDisabled = !emailOrPhone || !password || !!inputError || isRateLimited;

  return (
    <div className="create-account-container">
      <div className="content-wrapper" ref={contentWrapperRef}>
        <div className="header-section">
          <h1 className="title">Login to Your Account</h1>
          <p className="subtitle">
            Welcome back! Enter your credentials to access your account.
          </p>
        </div>

        {errorMessage && (
          <div className="global-error-message" role="alert">
            {errorMessage}
          </div>
        )}

        <form className="form-section" onSubmit={(e) => e.preventDefault()}>
          {/* CSRF token hidden field */}
          <input type="hidden" name="_csrf" value={csrfToken} />

          <div className="input-group">
            <label htmlFor="emailOrPhone">Email or Phone Number</label>
            <input 
              type="text" 
              id="emailOrPhone" 
              placeholder="crazyinvestor@gmail.com or 671231240"
              className={`form-input ${inputError ? 'input-error' : ''}`}
              value={emailOrPhone}
              onChange={handleEmailOrPhoneChange}
              required
              aria-invalid={!!inputError}
              aria-describedby={inputError ? "input-error" : undefined}
            />
            {inputError && <p id="input-error" className="error-message">{inputError}</p>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={handlePasswordChange}
              className="form-input"
              required
            />
          </div>

          <div className="terms-checkbox">
            <input 
              type="checkbox" 
              id="rememberMeCheckbox" 
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            <label htmlFor="rememberMeCheckbox">
              Remember me on this device
            </label>
          </div>

          {isRateLimited && (
            <div className="rate-limit-message">
              Too many attempts. Please try again later.
            </div>
          )}

          <button 
            type="button" 
            className="next-button"
            onClick={handleLogin}
            disabled={isLoginButtonDisabled}
            style={{ opacity: isLoginButtonDisabled ? 0.6 : 1 }}
          >
            Login
          </button>
        </form>

        <div className="signup-section">
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
        </div>

        <div className="terms-section">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LogIn;