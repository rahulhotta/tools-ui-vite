
import './App.css'
import Loader from './Utils/Services/Loader/Loader';
import { RouterProvider } from 'react-router-dom';
import router from './router';
function App() {

  return (
    <div className=''>
      <Loader />
      <div className='grid-background'></div>
      <div className="floating-elements">
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
        <div className="floating-circle"></div>
      </div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
