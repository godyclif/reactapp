import React, { useState, useEffect } from "react";
import "./CreateAccount.css";

const CreatePassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if passwords match whenever either password field changes
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        setPasswordsMatch(true);
        setErrorMessage("");
      } else {
        setPasswordsMatch(false);
        setErrorMessage("Passwords do not match");
      }
    } else {
      setPasswordsMatch(false);
      setErrorMessage("");
    }
  }, [password, confirmPassword]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };

  const handleCreateAccount = () => {
    if (passwordsMatch && termsAccepted) {
      console.log("Account created successfully");
      // Add your account creation logic here
    }
  };

  const isButtonDisabled = !passwordsMatch || !termsAccepted || !password || !confirmPassword;

  return (
    <div className="create-account-container">
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="title">Create an Account</h1>
          <p className="subtitle">
            Create a secure password to safely access your account.
          </p>
        </div>

        <form className="form-section">
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Re-Enter Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="form-input"
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          <div className="terms-checkbox">
            <input 
              type="checkbox" 
              id="termsCheckbox" 
              checked={termsAccepted}
              onChange={handleTermsChange}
            />
            <label htmlFor="termsCheckbox">
              By clicking this you accept to our <a href="#" className="terms-link">Terms & Conditions</a>
            </label>
          </div>

          <button 
            type="button" 
            className="next-button"
            onClick={handleCreateAccount}
            disabled={isButtonDisabled}
            style={{ opacity: isButtonDisabled ? 0.6 : 1 }}
          >
            Create My Account
          </button>
        </form>

        <div className="terms-section">
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;