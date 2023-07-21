import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import CreateTaskPage from './pages/CreateTaskPage';
import Report from './components/Report';
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/create-task' element={<CreateTaskPage />} />
        <Route path='/reports' element={<PrivateRoute><Report /></PrivateRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
