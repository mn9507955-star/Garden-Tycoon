import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Simple Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    // Clear local storage to fix corrupted state
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#e0f2fe] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border-2 border-red-100 max-w-md w-full">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">Úi chà! Có lỗi xảy ra.</h1>
            <p className="text-slate-500 mb-6 text-sm">
              Trò chơi gặp sự cố không mong muốn. Dữ liệu lưu có thể bị hỏng hoặc có lỗi hệ thống.
            </p>
            
            <div className="bg-red-50 p-3 rounded-xl mb-6 text-left overflow-auto max-h-32">
                <code className="text-[10px] text-red-800 font-mono break-all">
                    {this.state.error?.toString() || "Unknown Error"}
                </code>
            </div>

            <button 
              onClick={this.handleReset}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Đặt lại dữ liệu & Tải lại
            </button>
            <p className="text-[10px] text-slate-400 mt-4">
              Lưu ý: Hành động này sẽ xóa toàn bộ tiến trình chơi hiện tại.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);