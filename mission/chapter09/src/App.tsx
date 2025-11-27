import './App.css';
import { Provider } from 'react-redux';
import StorePage from './pages/StorePage';
import { store } from './app/store';

function App() {
  return (
      <StorePage />
    )
}

export default App