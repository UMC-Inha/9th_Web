import './App.css';
import Parent from './Parent';
import PrimeSieve from './PrimeSieve';
export default function App() {
  return (
    <main className='flex flex-col justify-center items-center h-dvh'>
      <Parent />
      <PrimeSieve />
    </main>
  );
}