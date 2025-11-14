import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMoneyModal = ({ isOpen, onClose }: AddMoneyModalProps) => {
  const { addMoney } = useAppContext();
  const [amount, setAmount] = useState('');

  const handleAdd = () => {
    const value = parseFloat(amount);
    if (value > 0) {
      addMoney(value);
      toast.success(`₹${value} added to wallet!`);
      setAmount('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-[380px] bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Add Money</h2>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 gradient-bg text-white py-3 rounded-lg font-semibold"
          >
            Add Money
          </button>
        </div>
      </div>
    </div>
  );
};

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal = ({ isOpen, onClose }: SubscriptionModalProps) => {
  const { user } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = async () => {
    if (!user) {
      toast.error('Please login to purchase a subscription');
      return;
    }

    setIsProcessing(true);
    try {
      // Calculate expiry date (30 days from now)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Update user role to subscribed
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'subscribed' })
        .eq('user_id', user.id);

      if (roleError) throw roleError;

      // Update profile with subscription expiry date
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ subscription_expires_at: expiryDate.toISOString() } as any)
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast.success('Smart Commuter Pass purchased successfully!');
      onClose();
      
      // Reload the page to refresh the user role and subscription data
      window.location.reload();
    } catch (error) {
      console.error('Error purchasing subscription:', error);
      toast.error('Failed to purchase subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-[420px] bg-white dark:bg-gray-800 rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Upgrade Your Experience</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 p-6 rounded-2xl border-2 border-primary/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-2xl dark:text-white">Smart Commuter Pass</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Premium travel experience</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">₹499</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">per month</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-5">
            <div className="flex items-start space-x-3">
              <i className="fas fa-history text-primary mt-1"></i>
              <div>
                <p className="font-semibold text-sm dark:text-white">Complete Travel History</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Track all your trips with detailed analytics</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <i className="fas fa-chart-line text-primary mt-1"></i>
              <div>
                <p className="font-semibold text-sm dark:text-white">Smart Comparison System</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Compare prices across all ride providers in real-time</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <i className="fas fa-walking text-primary mt-1"></i>
              <div>
                <p className="font-semibold text-sm dark:text-white">Move-to-Earn Rewards</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Earn up to 20% discount based on your daily steps</p>
              </div>
            </div>
            
            <div className="bg-white/50 dark:bg-gray-900/50 p-3 rounded-lg mt-4">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Step-based Discount Tiers:</p>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <p><i className="fas fa-check text-green-500 mr-2"></i>5,000 steps = 5% off</p>
                <p><i className="fas fa-check text-green-500 mr-2"></i>10,000 steps = 10% off</p>
                <p><i className="fas fa-check text-green-500 mr-2"></i>15,000+ steps = 20% off</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleBuy}
            disabled={isProcessing}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Activate Pass Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const Wallet = () => {
  const navigate = useNavigate();
  const { appState, userRole, subscriptionExpiresAt, user } = useAppContext();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const isSubscriptionActive = () => {
    if (!subscriptionExpiresAt || userRole !== 'subscribed') return false;
    return new Date(subscriptionExpiresAt) > new Date();
  };

  const formatExpiryDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleCancelSubscription = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: 'normal' })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Subscription cancelled. You are now a normal user.');
      setShowCancelModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
    }
  };

  return (
    <div>
      <header className="p-5 gradient-bg text-white shadow-lg rounded-b-3xl relative">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">My Wallet</h1>
          <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <i className="fas fa-history"></i>
          </button>
        </div>
        <div className="text-center">
          <p className="text-sm opacity-90">Current Balance</p>
          <p className="text-4xl font-extrabold mt-1">₹{appState.wallet.balance.toFixed(2)}</p>
        </div>
        <button
          onClick={() => setShowAddMoney(true)}
          className="w-full bg-white text-primary font-bold py-3 rounded-lg mt-4 shadow-lg flex items-center justify-center"
        >
          <i className="fas fa-plus-circle mr-2"></i>Add Money
        </button>
      </header>

      <div className="p-5 space-y-5">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/transaction-history')}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center"
          >
            <i className="fas fa-history text-2xl text-primary mb-2"></i>
            <p className="text-xs dark:text-gray-200">History</p>
          </button>
          <button className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
            <i className="fas fa-exchange-alt text-2xl text-primary mb-2"></i>
            <p className="text-xs dark:text-gray-200">Transfer</p>
          </button>
          <button className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
            <i className="fas fa-qrcode text-2xl text-primary mb-2"></i>
            <p className="text-xs dark:text-gray-200">Scan & Pay</p>
          </button>
        </div>

        {/* Commuter Pass */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
          <h3 className="font-bold text-lg mb-2">Commuter Pass</h3>
          <p className="text-sm opacity-90 mb-4">
            {isSubscriptionActive() 
              ? 'Access to smart comparison, travel history, and move-to-earn features' 
              : 'Get exclusive discounts on all rides'}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-75">Current Plan</p>
              <p className="font-bold">
                {isSubscriptionActive() ? 'Smart Commuter Pass' : 'Normal'}
              </p>
              {isSubscriptionActive() && (
                <p className="text-xs opacity-75 mt-1">
                  Active until {formatExpiryDate(subscriptionExpiresAt)}
                </p>
              )}
            </div>
            {isSubscriptionActive() ? (
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-white/20 border border-white px-4 py-2 rounded-lg font-semibold text-sm"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={() => setShowSubscription(true)}
                className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-lg dark:text-white">Recent Transactions</h2>
            <button
              onClick={() => navigate('/transaction-history')}
              className="text-primary text-sm font-semibold"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {appState.wallet.history.slice(0, 5).map((transaction, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      transaction.amount > 0
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    <i
                      className={`fas ${
                        transaction.amount > 0 ? 'fa-arrow-down text-green-600' : 'fa-arrow-up text-red-600'
                      }`}
                    ></i>
                  </div>
                  <div>
                    <p className="font-semibold dark:text-white">{transaction.details}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <p
                  className={`font-bold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AddMoneyModal isOpen={showAddMoney} onClose={() => setShowAddMoney(false)} />
      <SubscriptionModal isOpen={showSubscription} onClose={() => setShowSubscription(false)} />
      
      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-[380px] bg-white dark:bg-gray-800 rounded-2xl p-6 mx-4">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Cancel Subscription</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to cancel your Smart Commuter Pass? You will lose access to:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 mb-6 space-y-2">
              <li>Smart comparison system</li>
              <li>Travel history</li>
              <li>Move-to-earn discounts</li>
            </ul>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold"
              >
                Keep Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
