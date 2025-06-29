import './Header.css'
import { useAuth } from '../authprovider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import BuyMeCoffee from '../buymecoffee/BuyMeCoffee'; 
import {useState} from 'react';

function Header() {
  const { loggedIn, loading, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const logoutThenNavigate = (): void => {
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <header className='header'>
      <nav className='nav-bar'>
        {/* left */}
        <div className='logo-container'>
          <a href='/'>
            <img src='ff_light.png' className='logo'/>
          </a>
        </div>
        {/* center and right */}
        <div className='center-right'>
          {/* center */}
          <div className='flex justify-center items-center'>
            <a href='/chat'>
              <p className='nav-content'>Chat</p>
            </a>
            <a href='/journal'>
              <p className='nav-content'>Journal</p>
            </a>
          </div>
          {/* right */}
          <div className='flex'>
            <BuyMeCoffee />
            {loading ? (
              <button className='big-button' disabled>
                <p>Login</p>
              </button>
            ) : loggedIn ? (
              <button className='big-button' onClick={logoutThenNavigate}>
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

