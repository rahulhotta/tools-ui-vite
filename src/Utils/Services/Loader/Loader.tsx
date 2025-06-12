'use client'
import './Loader.scss';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
function Loader() {
    const isLoading = useSelector((state:RootState)=> state.loader.isLoading)
  return isLoading ?(
    <div className='loaderContainer'>
        <div className="loader"></div>
    </div>
  ) : null
}

export default Loader