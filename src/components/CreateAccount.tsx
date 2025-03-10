import React, { useState, useEffect, useRef } from "react";
import "./CreateAccount.css";

const CreateAccount: React.FC = () => {
  // State for first step
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // State for second step
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{score: number, feedback: string}>({score: 0, feedback: ""});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  // State for submission attempts (for rate limiting)
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // State to track current step
  const [currentStep, setCurrentStep] = useState(1);

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

  useEffect(() => {
    // Validate password and check if passwords match whenever either password field changes
    if (password) {
      // Check password strength
      const strength = checkPasswordStrength(password);
      setPasswordStrength(strength);

      // Check if passwords match
      if (confirmPassword) {
        if (password === confirmPassword) {
          setPasswordsMatch(true);
          setErrorMessage("");
        } else {
          setPasswordsMatch(false);
          setErrorMessage("Passwords do not match");
        }
      }
    } else {
      setPasswordsMatch(false);
      setPasswordStrength({score: 0, feedback: ""});
      setErrorMessage("");
    }
  }, [password, confirmPassword]);

  // Scroll to top whenever step changes
  useEffect(() => {
    if (contentWrapperRef.current) {
      // Scroll the content wrapper to the top
      contentWrapperRef.current.scrollTop = 0;

      // Also ensure the window is scrolled to the top
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  // Password strength checker
  const checkPasswordStrength = (pass: string): {score: number, feedback: string} => {
    let score = 0;
    let feedback = "";

    if (pass.length < 8) {
      return { score: 0, feedback: "Password should be at least 8 characters long" };
    }

    // Length check
    score += Math.min(2, Math.floor(pass.length / 4));

    // Complexity checks
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    // Provide feedback based on score
    if (score < 3) {
      feedback = "Weak password. Try adding numbers and special characters.";
    } else if (score < 4) {
      feedback = "Moderate password. Try adding more variety.";
    } else if (score < 5) {
      feedback = "Good password.";
    } else {
      feedback = "Strong password!";
    }

    return { score, feedback };
  };

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
  const validateEmail = (emailValue: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = regex.test(emailValue);

    if (!isValid && emailValue) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const validatePhone = (phoneValue: string): boolean => {
    // Assuming Cameroon phone format
    const regex = /^[6-9]\d{8}$/;
    const isValid = regex.test(phoneValue);

    if (!isValid && phoneValue) {
      setPhoneError("Please enter a valid 9-digit phone number");
    } else {
      setPhoneError("");
    }

    return isValid;
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

  // Handlers for first step
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setFirstName(sanitizedValue);
  };

  const handleMiddleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setMiddleName(sanitizedValue);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only keep digits
    setPhoneInput(value);
    validatePhone(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  // Handlers for second step
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  // Navigation handlers
  const handleNextClick = () => {
    // Validate all fields before proceeding
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phoneInput);

    if (isEmailValid && isPhoneValid && firstName) {
      setCurrentStep(2);
    } else {
      if (!firstName) {
        setErrorMessage("Please enter your first name");
      } else if (!isEmailValid) {
        setErrorMessage("Please enter a valid email address");
      } else if (!isPhoneValid) {
        setErrorMessage("Please enter a valid phone number");
      }
    }
  };

  const handleBackClick = () => {
    setCurrentStep(1);
    setErrorMessage("");
  };

  const handleCreateAccount = async () => {
    // Check for rate limiting
    if (!checkRateLimit()) {
      setErrorMessage("Too many attempts. Please try again later.");
      return;
    }

    // Validate all inputs again
    if (passwordsMatch && termsAccepted && passwordStrength.score >= 3) {
      try {
        // In a real app, we would submit to an API with the CSRF token
        // const response = await fetch('/api/create-account', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'X-CSRF-Token': csrfToken
        //   },
        //   body: JSON.stringify({
        //     firstName,
        //     middleName,
        //     phone: phoneInput,
        //     email,
        //     password: '********' // Never log or send the actual password in logs
        //   })
        // });

        // For demo purposes, just simulate a successful account creation
        console.log("Account creation submitted with the following data:");
        console.log({
          firstName,
          middleName,
          phone: phoneInput,
          email,
          password: "********", // NEVER log the actual password
          csrfToken
        });

        // Show success message or redirect
        setErrorMessage("");
        alert("Account created successfully!");

      } catch (error) {
        // Generic error message that doesn't expose implementation details
        setErrorMessage("We couldn't create your account at this time. Please try again later.");
      }
    } else {
      if (!passwordsMatch) {
        setErrorMessage("Passwords do not match");
      } else if (passwordStrength.score < 3) {
        setErrorMessage("Please use a stronger password");
      } else if (!termsAccepted) {
        setErrorMessage("Please accept the terms and conditions");
      }
    }
  };

  const isNextButtonDisabled = !firstName || !phoneInput || !email || !!phoneError || !!emailError;
  const isCreateButtonDisabled = !passwordsMatch || !termsAccepted || !password || !confirmPassword || passwordStrength.score < 3 || isRateLimited;

  return (
    <div className="create-account-container">
      <div className="content-wrapper" ref={contentWrapperRef}>
        {/* Back button at top left */}
        {currentStep === 2 && (
          <button 
            className="back-button" 
            onClick={handleBackClick}
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        <div className="header-section">
          <h1 className="title">Create an Account</h1>
          {currentStep === 1 ? (
            <p className="subtitle">
              We're happy to have you onboard, create an account with us and start 
              earning from your little but big investments
            </p>
          ) : (
            <p className="subtitle">
              Create a secure password to safely access your account.
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="global-error-message" role="alert">
            {errorMessage}
          </div>
        )}

        {currentStep === 1 ? (
          <form className="form-section" onSubmit={(e) => e.preventDefault()}>
            {/* CSRF token hidden field */}
            <input type="hidden" name="_csrf" value={csrfToken} />

            <div className="input-group">
              <label htmlFor="firstName">First Name</label>
              <input 
                type="text" 
                id="firstName" 
                placeholder="Njini"
                className="form-input"
                value={firstName}
                onChange={handleFirstNameChange}
                required
                maxLength={50}
              />
            </div>

            <div className="input-group">
              <label htmlFor="middleName">Middle Name</label>
              <input 
                type="text" 
                id="middleName" 
                placeholder="Rosemary"
                className="form-input"
                value={middleName}
                onChange={handleMiddleNameChange}
                maxLength={50}
              />
            </div>

            <div className="input-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <div className="phone-input-container">
                <span className="country-code">+237</span>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  placeholder="671231240"
                  className={`form-input phone-input ${phoneError ? 'input-error' : ''}`}
                  value={phoneInput}
                  onChange={handlePhoneChange}
                  required
                  maxLength={9}
                  aria-invalid={!!phoneError}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                />
              </div>
              {phoneError && <p id="phone-error" className="error-message">{phoneError}</p>}
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="crazyinvestor@gmail.com"
                className={`form-input ${emailError ? 'input-error' : ''}`}
                value={email}
                onChange={handleEmailChange}
                required
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
              />
              {emailError && <p id="email-error" className="error-message">{emailError}</p>}
            </div>

            <button 
              type="button" 
              className="next-button"
              onClick={handleNextClick}
              disabled={isNextButtonDisabled}
              style={{ opacity: isNextButtonDisabled ? 0.6 : 1 }}
            >
              Next
            </button>
          </form>
        ) : (
          <form className="form-section" onSubmit={(e) => e.preventDefault()}>
            {/* CSRF token hidden field */}
            <input type="hidden" name="_csrf" value={csrfToken} />

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={handlePasswordChange}
                className={`form-input ${passwordStrength.score < 3 && password ? 'input-error' : ''}`}
                required
                minLength={8}
                aria-describedby="password-strength"
              />
              {password && (
                <div id="password-strength" className={`password-strength strength-${passwordStrength.score}`}>
                  <div className="strength-meter">
                    <div 
                      className="strength-meter-fill" 
                      style={{ width: `${Math.min(100, passwordStrength.score * 20)}%` }}
                    ></div>
                  </div>
                  <p className="strength-text">{passwordStrength.feedback}</p>
                </div>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Re-Enter Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`form-input ${!passwordsMatch && confirmPassword ? 'input-error' : ''}`}
                required
                aria-invalid={!passwordsMatch && !!confirmPassword}
              />
              {!passwordsMatch && confirmPassword && (
                <p className="error-message">Passwords do not match</p>
              )}
            </div>

            <div className="terms-checkbox">
              <input 
                type="checkbox" 
                id="termsCheckbox" 
                checked={termsAccepted}
                onChange={handleTermsChange}
              />
              <label htmlFor="termsCheckbox">
                By clicking this you accept to our <a href="/terms" className="terms-link">Terms & Conditions</a>
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
              onClick={handleCreateAccount}
              disabled={isCreateButtonDisabled}
              style={{ opacity: isCreateButtonDisabled ? 0.6 : 1 }}
            >
              Create My Account
            </button>
          </form>
        )}

        <div className="terms-section">
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
