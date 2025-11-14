import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
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
  const handleBuy = (plan: string) => {
    toast.success(`${plan} plan purchased successfully!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <div className="w-full max-w-[420px] bg-white dark:bg-gray-800 rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">Choose Your Pass</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Silver', price: 299, benefits: ['5% discount on rides', 'Monthly fitness report'] },
            { name: 'Gold', price: 599, benefits: ['10% discount on rides', 'Weekly fitness report', 'Priority support'] },
            { name: 'Platinum', price: 999, benefits: ['15% discount on rides', 'Daily fitness report', '24/7 support', 'Exclusive deals'] }
          ].map((plan) => (
            <div key={plan.name} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg dark:text-white">{plan.name} Pass</h3>
                <p className="text-2xl font-bold text-primary">₹{plan.price}</p>
              </div>
              <ul className="space-y-1 mb-3">
                {plan.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                    <i className="fas fa-check text-green-500 mr-2"></i>{benefit}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleBuy(plan.name)}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold"
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Wallet = () => {
  const navigate = useNavigate();
  const { appState } = useAppContext();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);

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
          <p className="text-sm opacity-90 mb-4">Get exclusive discounts on all rides</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-75">Current Plan</p>
              <p className="font-bold">Silver</p>
            </div>
            <button
              onClick={() => setShowSubscription(true)}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm"
            >
              Upgrade
            </button>
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
    </div>
  );
};
