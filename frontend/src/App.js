import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import RoutesFile from './Routes/RoutesFile';


function App() {
  return (
    <BrowserRouter>
<RoutesFile/>
    </BrowserRouter>
  );
}

export default App;
