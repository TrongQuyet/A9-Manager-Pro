
import React, { useState } from 'react';
import { Transaction, TransactionType, AppState } from '../types';
import { CATEGORIES } from '../constants';
import { 
  PlusCircle, ShieldAlert, Edit2, Trash2, UserCheck, AlertTriangle, 
  Eye, X, Calendar, Tag, FileText, User, CreditCard, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';

interface Props {
  state: AppState;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  isAdmin: boolean;
}

const TransactionManagement: React.FC<Props> = ({ state, onAddTransaction, onUpdateTransaction, onDeleteTransaction, isAdmin }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);
  
  const [newTx, setNewTx] = useState({
    type: 'INCOME' as TransactionType,
    amount: 0,
    description: '',
    category: CATEGORIES.INCOME[0],
    recipient: '',
    date: new Date().toISOString().split('T')[0],
    memberId: state.members[0]?.id || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    onAddTransaction(newTx);
    setNewTx({
      ...newTx,
      amount: 0,
      description: '',
      recipient: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddModal(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editingTx) return;
    onUpdateTransaction(editingTx);
    setEditingTx(null);
  };

  const handleTypeChange = (type: TransactionType) => {
    setNewTx({
      ...newTx,
      type,
      category: CATEGORIES[type][0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">Quản lý giao dịch Trùm A9</h3>
        {isAdmin ? (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <PlusCircle size={18} />
            <span className="whitespace-nowrap font-semibold">Tạo giao dịch</span>
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
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-32">Ngày</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mô tả / Danh mục</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Người thực hiện/hưởng</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Số tiền</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[...state.transactions].reverse().map((tx) => {
                const member = state.members.find(m => m.id === tx.memberId);
                return (
                  <tr 
                    key={tx.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTx(tx)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap font-medium">
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
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                            {member?.name ? member.name.charAt(0) : '?'}
                          </div>
                          <span className="text-xs font-medium text-gray-700">{member?.name || 'Ẩn danh'}</span>
                        </div>
                        {tx.recipient && (
                          <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg w-fit">
                            <UserCheck size={12} />
                            <span className="text-[11px] font-bold uppercase tracking-tight">{tx.recipient}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className={`px-6 py-4 font-bold whitespace-nowrap text-base ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN')} đ
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end space-x-1">
                        <button onClick={() => setSelectedTx(tx)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Xem chi tiết"><Eye size={16} /></button>
                        {isAdmin && (
                          <>
                            <button onClick={() => setEditingTx(tx)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Sửa"><Edit2 size={16} /></button>
                            <button onClick={() => setDeletingTxId(tx.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa"><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {state.transactions.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">Chưa có giao dịch nào được ghi nhận.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className={`p-8 ${selectedTx.type === 'INCOME' ? 'bg-emerald-600' : 'bg-red-600'} text-white text-center relative`}>
              <button 
                onClick={() => setSelectedTx(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
                {selectedTx.type === 'INCOME' ? <ArrowUpCircle size={32} /> : <ArrowDownCircle size={32} />}
              </div>
              <h3 className="text-3xl font-black">{selectedTx.type === 'INCOME' ? '+' : '-'}{selectedTx.amount.toLocaleString('vi-VN')} đ</h3>
              <p className="text-white/80 font-medium mt-1">{selectedTx.category}</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><Calendar size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Thời gian</p>
                    <p className="text-gray-900 font-bold">{new Date(selectedTx.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><FileText size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nội dung</p>
                    <p className="text-gray-900 font-semibold">{selectedTx.description}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><User size={18} /></div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Người thực hiện</p>
                    <p className="text-gray-900 font-semibold">
                      {state.members.find(m => m.id === selectedTx.memberId)?.name || 'Ẩn danh'}
                    </p>
                  </div>
                </div>

                {selectedTx.recipient && (
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-500"><UserCheck size={18} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Người thụ hưởng</p>
                      <p className="text-emerald-600 font-bold">{selectedTx.recipient}</p>
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedTx(null)}
                className={`w-full py-3 text-white font-bold rounded-xl transition-all shadow-lg ${selectedTx.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100' : 'bg-red-600 hover:bg-red-700 shadow-red-100'}`}
              >
                Hoàn tất xem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 bg-emerald-50">
              <h3 className="text-xl font-bold text-emerald-900">Thêm giao dịch mới</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex p-1 bg-gray-100 rounded-xl">
                <button type="button" onClick={() => handleTypeChange('INCOME')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${newTx.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}>Thu nhập (+)</button>
                <button type="button" onClick={() => handleTypeChange('EXPENSE')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${newTx.type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>Chi tiêu (-)</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Số tiền (VND)</label>
                  <input required type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={newTx.amount} onChange={(e) => setNewTx({...newTx, amount: Number(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ngày</label>
                  <input required type="date" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={newTx.date} onChange={(e) => setNewTx({...newTx, date: e.target.value})}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Danh mục</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={newTx.category} onChange={(e) => setNewTx({...newTx, category: e.target.value})}>
                  {CATEGORIES[newTx.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mô tả nội dung</label>
                <input required type="text" placeholder="Ví dụ: Đóng quỹ tháng 5..." className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={newTx.description} onChange={(e) => setNewTx({...newTx, description: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Người nộp/chi</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none" value={newTx.memberId} onChange={(e) => setNewTx({...newTx, memberId: e.target.value})}>
                    {state.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Người hưởng</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none" value={newTx.recipient} onChange={(e) => setNewTx({...newTx, recipient: e.target.value})}>
                    <option value="">-- Không chọn / Khác --</option>
                    {state.members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
                <button type="submit" className={`flex-1 py-2 text-white font-bold rounded-xl transition-colors ${newTx.type === 'INCOME' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>Lưu giao dịch</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTx && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b border-gray-100 bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900">Sửa giao dịch</h3>
            </div>
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Số tiền (VND)</label>
                  <input required type="number" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingTx.amount} onChange={(e) => setEditingTx({...editingTx, amount: Number(e.target.value)})}/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ngày</label>
                  <input required type="date" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingTx.date} onChange={(e) => setEditingTx({...editingTx, date: e.target.value})}/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Danh mục</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingTx.category} onChange={(e) => setEditingTx({...editingTx, category: e.target.value})}>
                  {CATEGORIES[editingTx.type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mô tả</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={editingTx.description} onChange={(e) => setEditingTx({...editingTx, description: e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Người thực hiện</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none" value={editingTx.memberId} onChange={(e) => setEditingTx({...editingTx, memberId: e.target.value})}>
                    {state.members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Người hưởng</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none" value={editingTx.recipient} onChange={(e) => setEditingTx({...editingTx, recipient: e.target.value})}>
                    <option value="">-- Không chọn / Khác --</option>
                    {state.members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setEditingTx(null)} className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-xl transition-colors">Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingTxId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-gray-900">Xóa giao dịch?</h3>
              <p className="text-gray-500 mt-2">Hành động này sẽ thay đổi số dư quỹ ngay lập tức. Bạn có chắc chắn?</p>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button onClick={() => setDeletingTxId(null)} className="flex-1 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Hủy</button>
              <button onClick={() => { onDeleteTransaction(deletingTxId); setDeletingTxId(null); }} className="flex-1 py-2 bg-red-600 text-white font-bold hover:bg-red-700 rounded-xl transition-colors shadow-lg">Xóa ngay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
