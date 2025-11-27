// src/App.tsx
import CartContainer from './components/CartContainer';
import { useAppSelector } from './app/hooks';

function App() {
  const amount = useAppSelector((state) => state.cart.amount);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 헤더 */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow">
        <h1 className="text-2xl font-bold">Ohtani Ahn</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-2xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full px-1.5 py-0.5">
              {amount}
            </span>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6">
        <CartContainer />
      </main>
    </div>
  );
}

export default App;
