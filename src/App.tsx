
import './App.css'
import Loader from './Utils/Services/Loader/Loader';
import { RouterProvider } from 'react-router-dom';
import router from './router';
function App() {

  return (
    <>
      <Loader />
      <RouterProvider router={router}/>
    </>
  )
}

export default App
