import './App.css';
import { Provider } from 'react-redux';
import {store} from './store/store';
import AppInitializer from './components/AppInitializer';

function App() {
  return (
    <Provider store={store}>
      <AppInitializer/>
    </Provider>
  );
}

export default App;
