
import React, { useState } from 'react';
import { Transaction, TransactionType, AppState } from '../types';
import { CATEGORIES } from '../constants';
import { PlusCircle, ShieldAlert } from 'lucide-react';

interface Props {
  state: AppState;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  isAdmin: boolean;
}

const TransactionManagement: React.FC<Props> = ({ state, onAddTransaction, isAdmin }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTx, setNewTx] = useState({
    type: 'INCOME' as TransactionType,
    amount: 0,
    description: '',
    category: CATEGORIES.INCOME[0],
    date: new Date().toISOString().split('T')[0],
    memberId: state.members[0]?.id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    onAddTransaction(newTx);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Quản lý giao dịch</h3>
        {isAdmin ? (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            <span className="whitespace-nowrap">Tạo giao dịch</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm font-medium bg-gray-100 px-4 py-2 rounded-xl">
            <ShieldAlert size={16} />
            <span className="whitespace-nowrap">Chế độ Xem</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">Ngày</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mô tả / Danh mục</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-48">Người thực hiện</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap w-40">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...state.transactions].reverse().map((tx) => {
                const member = state.members.find(m => m.id === tx.memberId);
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{tx.description}</p>
                        <div className="flex">
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase tracking-wider">
                            {tx.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {member?.name.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{member?.name || 'Ẩn danh'}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 text-right font-bold whitespace-nowrap text-base ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                );
              })}
              {state.transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    Chưa có giao dịch nào được ghi nhận.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold">Thêm giao dịch mới</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setNewTx({...newTx, type: 'INCOME', category: CATEGORIES.INCOME[0]})}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${newTx.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Thu nhập (+)
                </button>
                <button 
                  type="button"
                  onClick={() => setNewTx({...newTx, type: 'EXPENSE', category: CATEGORIES.EXPENSE[0]})}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${newTx.type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                >
                  Chi tiêu (-)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền (VND)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newTx.amount}
                    onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
                  <input 
                    required
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={newTx.date}
                    onChange={(e) => setNewTx({...newTx, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <input 
                  required
                  type="text" 
                  placeholder="Nhập nội dung giao dịch..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTx.description}
                  onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTx.category}
                  onChange={(e) => setNewTx({...newTx, category: e.target.value})}
                >
                  {newTx.type === 'INCOME' 
                    ? CATEGORIES.INCOME.map(c => <option key={c} value={c}>{c}</option>)
                    : CATEGORIES.EXPENSE.map(c => <option key={c} value={c}>{c}</option>)
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Người thực hiện</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTx.memberId}
                  onChange={(e) => setNewTx({...newTx, memberId: e.target.value})}
                >
                  {state.members.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className={`flex-1 py-2 text-white font-medium rounded-xl transition-colors ${newTx.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Lưu giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
