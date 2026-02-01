
import React, { useState } from 'react';
import { User, ArrowRight, Sprout } from 'lucide-react';

interface NameInputScreenProps {
  onSubmit: (name: string) => void;
}

const NameInputScreen: React.FC<NameInputScreenProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (name.trim().length < 2) {
      setError('Tên phải có ít nhất 2 ký tự!');
      return;
    }
    if (name.trim().length > 15) {
      setError('Tên không được quá 15 ký tự!');
      return;
    }
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#e0f2fe] flex flex-col items-center justify-center p-4">
       {/* Background Decoration */}
       <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/soil.png')] pointer-events-none" />
       
       <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border-2 border-white animate-in zoom-in duration-500">
              
              <div className="flex flex-col items-center mb-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg mb-4 animate-bounce">
                      <User className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Danh Tính</h2>
                  <p className="text-slate-500 text-sm mt-2">
                      Nhập tên của bạn để ghi danh vào bảng xếp hạng Garden Tycoon.
                  </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="relative">
                      <input 
                          type="text" 
                          value={name}
                          onChange={(e) => {
                              setName(e.target.value);
                              setError('');
                          }}
                          placeholder="Ví dụ: Nông Dân Pro"
                          className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl py-4 px-12 text-lg font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                          autoFocus
                      />
                      <Sprout className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                  </div>

                  {error && (
                      <div className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg animate-pulse">
                          {error}
                      </div>
                  )}

                  <button 
                      type="submit"
                      disabled={!name.trim()}
                      className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      <span>Bắt Đầu Hành Trình</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
              </form>

              <div className="mt-6 text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Chỉ cần nhập 1 lần duy nhất
                  </p>
              </div>
          </div>
       </div>
    </div>
  );
};

export default NameInputScreen;
