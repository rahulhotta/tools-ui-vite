import NavBar from './Components/navBar/navBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            < NavBar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout