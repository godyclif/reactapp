import React, { useState, useEffect } from 'react';
import { Bell, Home, FileText, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';
// Add these imports for Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTransfer, faPeopleArrows } from '@fortawesome/free-solid-svg-icons';

// Define types for our data structure
interface GraphDataPoint {
  date: string;
  value: number;
}

interface FinanceData {
  name: string;
  totalBalance: string;
  referrals: {
    amount: string;
    count: number;
  };
  taskEarnings: string;
  withdrawableBalance: string;
  graphData: GraphDataPoint[];
}

// Type for the Tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
  }>;
  label?: string;
}

// Define tab names as constants
type TabName = 'home' | 'tasks' | 'referrals' | 'withdrawal';

const FinanceApp: React.FC = () => {
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<TabName>('home');

  // Add states for withdrawal form
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('bank');

  // State for data with fallback values
  const [data, setData] = useState<FinanceData>({
    name: "NIBA GODSWILL",
    totalBalance: "648,848.00 F",
    referrals: {
      amount: "105,624.00 F",
      count: 72
    },
    taskEarnings: "107,888.00 F",
    withdrawableBalance: "480,848.00 F",
    graphData: [
      { date: 'Nov 1', value: 10 },
      { date: 'Nov 3', value: 7 },
      { date: 'Nov 5', value: 6 },
      { date: 'Nov 7', value: 7 },
      { date: 'Nov 9', value: 12 },
      { date: 'Nov 11', value: 10 },
      { date: 'Nov 13', value: 5 },
      { date: 'Nov 15', value: 3 },
      { date: 'Nov 17', value: 2 },
      { date: 'Nov 19', value: 1 },
      { date: 'Nov 21', value: 2 },
      { date: 'Nov 23', value: 6 },
      { date: 'Nov 25', value: 9 },
      { date: 'Nov 27', value: 13 },
      { date: 'Nov 29', value: 8 },
      { date: 'Dec 1', value: 5 },
      { date: 'Dec 3', value: 4 },
      { date: 'Dec 5', value: 1 }
    ]
  });

  // Function to fetch data from JSON and update periodically
  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval for periodic updates (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch data
  const fetchData = async (): Promise<void> => {
    try {
      // This would be your actual API call
      // const response = await fetch('your-api-endpoint');
      // const jsonData = await response.json();
      // setData(jsonData);

      // For demonstration, let's simulate changing data
      simulateDataUpdate();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to simulate changing data (for demo purposes)
  const simulateDataUpdate = (): void => {
    // Create a copy of the current data
    const updatedData = {...data};

    // Update the last few graph points with random values
    const newGraphData = [...updatedData.graphData];
    for (let i = newGraphData.length - 5; i < newGraphData.length; i++) {
      if (i >= 0) {
        newGraphData[i] = {
          ...newGraphData[i],
          value: Math.max(1, Math.floor(Math.random() * 14))
        };
      }
    }

    // Add a new data point
    const lastDate = newGraphData[newGraphData.length - 1].date;
    const dateParts = lastDate.split(' ');
    const newDay = parseInt(dateParts[1]) + 2;
    const newMonth = newDay > 30 ? (dateParts[0] === 'Nov' ? 'Dec' : 'Jan') : dateParts[0];
    const adjustedDay = newDay > 30 ? newDay - 30 : newDay;

    newGraphData.push({
      date: `${newMonth} ${adjustedDay}`,
      value: Math.max(1, Math.floor(Math.random() * 14))
    });

    // Remove the oldest data point if we have more than 20
    if (newGraphData.length > 20) {
      newGraphData.shift();
    }

    // Update the data
    setData({
      ...updatedData,
      graphData: newGraphData
    });
  };

  // Custom tooltip for the chart
  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip">
          <p>{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Function to handle tab changes
  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
  };

  // Home tab content
  const renderHomeTab = () => (
    <>
      {/* User Name */}
      <div className="user-name">
        {data.name}
      </div>

      {/* Total Balance */}
      <div className="balance-section">
        <div className="section-title">Total Balance</div>
        <div className="total-balance-card">
          <div className="balance-amount">{data.totalBalance}</div>
        </div>
      </div>

      {/* Referrals and Task Earnings */}
      <div className="two-column-grid">
        <div className="green-card">
          <div className="card-title">Referrals</div>
          <div className="card-amount">{data.referrals.amount}</div>
          <div className="referral-count">
            <span>{data.referrals.count}</span>
            <FontAwesomeIcon icon={faPeopleArrows} />
          </div>
        </div>

        <div className="green-card">
          <div className="card-title">Task Earnings</div>
          <div className="card-amount">{data.taskEarnings}</div>
        </div>
      </div>

      {/* Withdrawable Balance and Transactions */}
      <div className="two-column-grid">
        <div className="green-card">
          <div className="card-title">Withdraw-able Balance</div>
          <div className="card-amount">{data.withdrawableBalance}</div>
        </div>

        <div className="dark-card transaction-card">
          <FontAwesomeIcon 
            icon={faMoneyBillTransfer} 
            className="transaction-icon" 
          />
          <div className="transaction-text">Transactions</div>
        </div>
      </div>

      {/* Graph - Using Recharts for interactive graphs */}
      <div className="graph-card">
        <div className="graph-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.graphData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                angle={-45} 
                textAnchor="end" 
                height={60} 
              />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#00E0FF" 
                strokeWidth={2} 
                dot={{ r: 3, fill: "#00E0FF" }} 
                activeDot={{ r: 5 }} 
                isAnimationActive={true}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  // Tasks tab content
  const renderTasksTab = () => (
    <div className="tab-content">
      <h2 className="tab-title">Available Tasks</h2>

      <div className="task-list">
        {[1, 2, 3, 4, 5].map((task) => (
          <div key={task} className="task-card">
            <div className="task-header">
              <div className="task-title">Task #{task}</div>
              <div className="task-reward">+{(Math.random() * 1000).toFixed(2)} F</div>
            </div>
            <div className="task-description">
              Complete this task to earn rewards. This is a sample task description.
            </div>
            <button className="task-button">Start Task</button>
          </div>
        ))}
      </div>
    </div>
  );

  // Referrals tab content
  const renderReferralsTab = () => {
    // Fallback data when no backend data is available
    const referralData = {
      earnings: "105,000.00 F",
      count: 76,
      referralCode: "QXZAP",
      referralLink: "https://cmrinvest.com?ref=QXZAP",
      recentRefers: [] // This would be populated from backend
    };

    // Function to copy text to clipboard
    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          // You could add a toast notification here
          console.log('Copied to clipboard');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    };

    return (
      <div className="tab-content">
        {/* Grid layout for the top section */}
        <div className="grid-container">
          {/* Left side (Text & Earnings) */}
          <div className="left-side">
            {/* Text box */}
            <div className="text-box">
              <h2>
                Earn <span style={{ color: "#F5C084" }}>Money</span> <br /> By Refer
              </h2>
            </div>

            {/* Earnings box */}
            <div className="earnings-box">
              <p className="earnings-title">Referral Earnings</p>
              <h1 className="earnings-amount">{referralData.earnings}</h1>
              <p className="referral-count"><strong>{referralData.count} Referrals</strong></p>
            </div>
          </div>

          {/* Right side (Image) */}
          <div className="image-box">
            <img 
              src="../refer-people-image.png" 
              alt="Refer friends" 
              className="refer-people-image"
            />
          </div>
        </div>

        {/* Referral Code Section */}
        <div className="referral-code-section">
          <p className="card-title">Referral Link</p>
          <div className="referral-link-container">
            <p className="referral-link">{referralData.referralLink}</p>
            <button 
              className="copy-button"
              onClick={() => copyToClipboard(referralData.referralLink)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>

          <div className="referral-code-container">
            <p className="card-title">Referral Code</p>
            <div className="code-copy-container">
              <p className="referral-code">{referralData.referralCode}</p>
              <button 
                className="copy-button"
                onClick={() => copyToClipboard(referralData.referralCode)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button className="share-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Refers Section */}
        <div className="recent-refers-section">
          <p className="card-title">Recent Refers</p>
          <div className="recent-refers-container">
            {/* This would be populated from backend */}
            {referralData.recentRefers.length > 0 ? (
              referralData.recentRefers.map((refer, index) => (
                <div key={index} className="refer-item">
                  {/* Refer item content */}
                </div>
              ))
            ) : (
              <div className="empty-refers">
                {/* Optional: Add content for when there are no recent refers */}
              </div>
            )}
          </div>
          <div className="expand-button-container">
            <button className="expand-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Withdrawal tab content - This was missing in your original code
  const renderWithdrawalTab = () => {
    // Handle form submission
    const handleWithdrawalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Here you would typically make an API call to process the withdrawal
      alert(`Withdrawal request of ${withdrawalAmount} F via ${selectedPaymentMethod} submitted!`);
      // Reset form fields after submission
      setWithdrawalAmount('');
    };

    return (
      <div className="tab-content withdrawal-tab">
        <h2 className="tab-title">Withdraw Funds</h2>

        {/* Available Balance Card */}
        <div className="withdrawal-balance-card">
          <div className="balance-label">Available for Withdrawal</div>
          <div className="withdrawal-balance-amount">{data.withdrawableBalance}</div>
        </div>

        {/* Withdrawal Form */}
        <form className="withdrawal-form" onSubmit={handleWithdrawalSubmit}>
          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount to Withdraw</label>
            <div className="amount-input-container">
              <input
                type="text"
                id="amount"
                className="amount-input"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                required
              />
              <span className="currency-symbol">F</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div className="payment-methods">
              <div 
                className={`payment-method ${selectedPaymentMethod === 'bank' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('bank')}
              >
                <div className="payment-icon bank-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <div className="payment-name">Bank Transfer</div>
              </div>

              <div 
                className={`payment-method ${selectedPaymentMethod === 'mobile' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('mobile')}
              >
                <div className="payment-icon mobile-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </svg>
                </div>
                <div className="payment-name">Mobile Money</div>
              </div>
            </div>
          </div>

          {/* Bank Account Details Section (shown when bank transfer is selected) */}
          {selectedPaymentMethod === 'bank' && (
            <div className="bank-details">
              <div className="form-group">
                <label htmlFor="bank-name" className="form-label">Bank Name</label>
                <input
                  type="text"
                  id="bank-name"
                  className="form-input"
                  placeholder="Enter bank name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="account-number" className="form-label">Account Number</label>
                <input
                  type="text"
                  id="account-number"
                  className="form-input"
                  placeholder="Enter account number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="account-name" className="form-label">Account Name</label>
                <input
                  type="text"
                  id="account-name"
                  className="form-input"
                  placeholder="Enter account name"
                  required
                />
              </div>
            </div>
          )}

          {/* Mobile Money Details Section (shown when mobile money is selected) */}
          {selectedPaymentMethod === 'mobile' && (
            <div className="mobile-details">
              <div className="form-group">
                <label htmlFor="phone-number" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone-number"
                  className="form-input"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="provider" className="form-label">Mobile Money Provider</label>
                <select id="provider" className="form-select" required>
                  <option value="">Select provider</option>
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="orange">Orange Money</option>
                  <option value="airtel">Airtel Money</option>
                </select>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="withdrawal-submit-button">
            Withdraw Funds
          </button>

          {/* Previous Transactions Link */}
          <div className="previous-transactions">
            <a href="#" className="transactions-link">View previous transactions</a>
          </div>
        </form>

        {/* Withdrawal Information */}
        <div className="withdrawal-info">
          <div className="info-title">Important Information</div>
          <ul className="info-list">
            <li>Withdrawals are processed within 24-48 hours</li>
            <li>Minimum withdrawal amount is 5,000 F</li>
            <li>A 2% processing fee applies to all withdrawals</li>
          </ul>
        </div>
      </div>
    );
  };

  // Render the appropriate content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'tasks':
        return renderTasksTab();
      case 'referrals':
        return renderReferralsTab();
      case 'withdrawal':
        return renderWithdrawalTab();
      default:
        return renderHomeTab();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="profile-icon">
          <Users className="icon" />
        </div>

        <div className="logo">
          <span className="logo-cm">cm</span>
          <span className="logo-i">i</span>
        </div>

        <div className="notification-container">
          <Bell className="icon" />
          <div className="notification-badge">
            1
          </div>
        </div>
      </div>

      {/* Main Content - Renders based on active tab */}
      <div className="main-content">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleTabChange('home')}
        >
          <Home className="nav-icon" />
          <div className="nav-text">Home</div>
        </div>

        <div 
          className={`nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => handleTabChange('tasks')}
        >
          <FileText className="nav-icon" />
          <div className="nav-text">Tasks</div>
        </div>

        <div 
          className={`nav-item ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => handleTabChange('referrals')}
        >
          <Users className="nav-icon" />
          <div className="nav-text">Referrals</div>
        </div>

        <div 
          className={`nav-item ${activeTab === 'withdrawal' ? 'active' : ''}`}
          onClick={() => handleTabChange('withdrawal')}
        >
          <DollarSign className="nav-icon" />
          <div className="nav-text">Withdrawal</div>
        </div>
      </div>
    </div>
  );
};

export default FinanceApp;