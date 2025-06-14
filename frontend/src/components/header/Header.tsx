import './Header.css'
import { useAuth } from '../authprovider/AuthProvider';
import { useNavigate } from 'react-router-dom';

function Header() {
  const { loggedIn, loading, logout } = useAuth()
  const navigate = useNavigate()

  const logoutTHenNavigate = (): void => {
    logout()
    navigate('/')
  }

  return (
    <header className='header'>
      <nav className='nav-bar'>
        {/* left */}
        <div>
          <a href='/'>
            <img src='ff_light.png' className='logo'/>
          </a>
        </div>
        {/* center and right */}
        <div className='center-right'>
          {/* center */}
          <div className='flex'>
            <a href='/chat'>
              <p className='nav-content'>Chat</p>
            </a>
            <a href='/journal'>
              <p className='nav-content'>Journal</p>
            </a>
          </div>
          {/* right */}
          <div>
            {loading ? (
              <button className='big-button' disabled>
                <p>Loading...</p>
              </button>
            ) : loggedIn ? (
              <button className='big-button' onClick={logoutTHenNavigate}>
                <p>Logout</p>
              </button>
            ) : (
              <button className='big-button'>
                <a href='/login'>
                  <p>Login</p>
                </a>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header

