import './navBar.scss';
import CommonCard from '../../Utils/CommonElements/Card/CommonCard';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className='nav_bar_container'>
      <CommonCard>
        <Link to="/" className='nav_bar'>
          <h4 className='nav_bar_logo'>
            Little Tools
          </h4>
        </Link>
      </CommonCard>
    </div>
  )
}

export default NavBar