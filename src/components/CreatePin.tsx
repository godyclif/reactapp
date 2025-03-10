import React, { useState, useRef, useEffect } from 'react';
import './PinStyles.css';
import './CreateAccount.css';

enum PinStage {
  CREATE = 'create',
  CONFIRM = 'confirm',
}

interface PinFlowProps {
  onPinConfirmed: (pin: string) => void;  // Callback for when PIN is confirmed and ready to save to DB
}

const PinFlow: React.FC<PinFlowProps> = ({ onPinConfirmed }) => {
  const [stage, setStage] = useState<PinStage>(PinStage.CREATE);
  const [createPin, setCreatePin] = useState<string[]>(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize refs arrays
  if (inputRefs.current.length !== 4) {
    inputRefs.current = Array(4).fill(null);
  }

  // Initialize button refs for numbers 0-9 and backspace
  if (buttonRefs.current.length !== 11) {
    buttonRefs.current = Array(11).fill(null);
  }

  // Focus the first input on component mount
  useEffect(() => {
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
  }, [stage]);

  const currentPin = stage === PinStage.CREATE ? createPin : confirmPin;
  const setCurrentPin = stage === PinStage.CREATE ? setCreatePin : setConfirmPin;

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newPin = [...currentPin];
      newPin[index] = value;
      setCurrentPin(newPin);
    }
  };

  const handleNumberClick = (num: number) => {
    // Find first empty slot
    const emptyIndex = currentPin.findIndex(digit => digit === '');

    if (emptyIndex !== -1) {
      const newPin = [...currentPin];
      newPin[emptyIndex] = num.toString();
      setCurrentPin(newPin);

      // Set active button for animation
      setActiveButton(num);

      // Remove highlight after 1 second
      setTimeout(() => {
        setActiveButton(null);
      }, 1000);
    }
  };

  const handleBackspaceClick = () => {
    // Find the last non-empty slot
    const lastFilledIndex = [...currentPin].reverse().findIndex(digit => digit !== '');

    if (lastFilledIndex !== -1) {
      const actualIndex = currentPin.length - 1 - lastFilledIndex;
      const newPin = [...currentPin];
      newPin[actualIndex] = '';
      setCurrentPin(newPin);

      // Set active button for animation
      setActiveButton(10); // Use 10 for backspace

      // Remove highlight after 1 second
      setTimeout(() => {
        setActiveButton(null);
      }, 1000);
    }
  };

  const handleGoClick = () => {
    // Only proceed if all digits are filled
    if (currentPin.every(digit => digit !== '')) {
      const pinValue = currentPin.join('');

      if (stage === PinStage.CREATE) {
        // Move to confirm stage
        setStage(PinStage.CONFIRM);
        setErrorMessage('');
      } else {
        // Check if confirmation PIN matches the original PIN
        const originalPinValue = createPin.join('');

        if (pinValue === originalPinValue) {
          // PINs match, we can proceed
          console.log('PIN confirmed:', pinValue);
          // Call the callback to save the PIN to the database
          onPinConfirmed(pinValue);
        } else {
          // PINs don't match, show error and reset confirmation
          setErrorMessage('PINs don\'t match. Please try again.');
          setConfirmPin(['', '', '', '']);
        }
      }
    } else {
      setErrorMessage('Please enter a complete 4-digit PIN');
    }
  };

  // Function to determine if a button should have the highlight class
  const isButtonHighlighted = (buttonValue: number) => {
    return activeButton === buttonValue;
  };

  return ( 
    <div className="create-account-container">
      <div className="content-wrapper">
        <div className="header-section">
          <h1 className="title">
            {stage === PinStage.CREATE ? 'Create a Security PIN' : 'Confirm Your PIN'}
          </h1>
          <p className="subtitle">
            {stage === PinStage.CREATE 
              ? 'Create a secure PIN to safely access your account and initiate Transactions.'
              : 'Please re-enter your PIN to confirm.'}
          </p>
        </div>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}

        <div className="pin-container">
          <div className="pin-input-container">
            {currentPin.map((digit, index) => (
              <div key={index} className="pin-input-box">
                <input
                  ref={el => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  readOnly
                  tabIndex={-1} // Prevents focus via keyboard tabbing
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  className="pin-input"
                />
                {digit && <span className="pin-mask">*</span>}
              </div>
            ))}
          </div>

          <div className="pin-keypad">
            <div className="pin-keypad-row">
              <button 
                ref={el => buttonRefs.current[1] = el}
                onClick={() => handleNumberClick(1)}
                className={isButtonHighlighted(1) ? 'button-highlight' : ''}
              >1</button>
              <button 
                ref={el => buttonRefs.current[2] = el}
                onClick={() => handleNumberClick(2)}
                className={isButtonHighlighted(2) ? 'button-highlight' : ''}
              >2</button>
              <button 
                ref={el => buttonRefs.current[3] = el}
                onClick={() => handleNumberClick(3)}
                className={isButtonHighlighted(3) ? 'button-highlight' : ''}
              >3</button>
            </div>
            <div className="pin-keypad-row">
              <button 
                ref={el => buttonRefs.current[4] = el}
                onClick={() => handleNumberClick(4)}
                className={isButtonHighlighted(4) ? 'button-highlight' : ''}
              >4</button>
              <button 
                ref={el => buttonRefs.current[5] = el}
                onClick={() => handleNumberClick(5)}
                className={isButtonHighlighted(5) ? 'button-highlight' : ''}
              >5</button>
              <button 
                ref={el => buttonRefs.current[6] = el}
                onClick={() => handleNumberClick(6)}
                className={isButtonHighlighted(6) ? 'button-highlight' : ''}
              >6</button>
            </div>
            <div className="pin-keypad-row">
              <button 
                ref={el => buttonRefs.current[7] = el}
                onClick={() => handleNumberClick(7)}
                className={isButtonHighlighted(7) ? 'button-highlight' : ''}
              >7</button>
              <button 
                ref={el => buttonRefs.current[8] = el}
                onClick={() => handleNumberClick(8)}
                className={isButtonHighlighted(8) ? 'button-highlight' : ''}
              >8</button>
              <button 
                ref={el => buttonRefs.current[9] = el}
                onClick={() => handleNumberClick(9)}
                className={isButtonHighlighted(9) ? 'button-highlight' : ''}
              >9</button>
            </div>
            <div className="pin-keypad-row">
              <div className="empty-space"></div>
              <button 
                ref={el => buttonRefs.current[0] = el}
                onClick={() => handleNumberClick(0)}
                className={isButtonHighlighted(0) ? 'button-highlight' : ''}
              >0</button>
              <button 
                ref={el => buttonRefs.current[10] = el}
                onClick={handleBackspaceClick}
                className={`backspace-btn ${isButtonHighlighted(10) ? 'button-highlight' : ''}`}
              >←</button>
            </div>
          </div>

          <button onClick={handleGoClick} className="go-button">
            {stage === PinStage.CREATE ? 'Next' : 'Confirm'}
          </button>

          <div className="terms-section">
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Example of how to use the component in your app
const PinSetupPage: React.FC = () => {
  const handlePinConfirmed = (pin: string) => {
    // This is where you would send the PIN to your database
    console.log('PIN confirmed and ready to be saved:', pin);
    // Example API call:
    // api.savePIN(pin).then(() => {
    //   // Navigate to next screen or show success message
    // });
    alert(`PIN ${pin} confirmed successfully! Ready to save to the database.`);
  };

  return <PinFlow onPinConfirmed={handlePinConfirmed} />;
};

export default PinSetupPage;