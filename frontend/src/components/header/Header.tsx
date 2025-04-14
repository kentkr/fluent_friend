import './Header.css'


function Header() {
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
            <button className='big-button'>
              <a href='/login'>
                <p className='nav-content'>Login</p>
              </a>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header

