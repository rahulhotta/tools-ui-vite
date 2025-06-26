import './navBar.scss';
import { useEffect, useState } from 'react';
import CommonCard from '../../Utils/CommonElements/Card/CommonCard';
import { Link } from 'react-router-dom';
import ThemeToggler from '../../Utils/CommonElements/ThemeToggler/ThemeToggler';
function NavBar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check if user has a saved preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      const dark = saved === 'dark';
      setIsDark(dark);
      document.body.className = dark ? 'dark' : '';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.body.className = newTheme ? 'dark' : '';
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };
  return (
    <div className='nav_bar_container'>
      <CommonCard>
        <div className='nav_bar_wrapper'>
        <Link to="/" className='nav_bar'>
          <h4 className='nav_bar_logo'>
            Little Tools
          </h4>
        </Link>
        <div>
          <ThemeToggler onClick={toggleTheme} />
        </div>

        </div>
      </CommonCard>
    </div>
  )
}

export default NavBar