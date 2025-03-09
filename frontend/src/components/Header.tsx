import '../styles/Header.css'


function Header() {
    return (
        <header className='header'>
            <nav>
                {/*{/* left logo container */}
                <div className="flex items-center flex-shrink-0 basis-[12%] mr-6">
                  <h1 className="flex-shrink-0 text-foreground text-xl hover:text-cyan">
                    <a href="{% url 'chat:chat_view' %}">Fluent Friend</a>
                  </h1>
                    {/* hidden hamburger */}
                    <div className="block lg:hidden">
                    </div>
                    {/* container for right of logo */}
                    <div id="nav-bar" className="w-full block flex-grow hidden lg:flex lg:items-center lg:w-auto lg:visible">
                      {/* center container */}
                      <div className="flex lg:flex-grow">
                        <a className="block mt-4 mr-4 ml-2 text-foreground text-md hover:text-cyan lg:inline-block lg:mt-0" href="{% url 'chat:about_view' %}">About</a>
                      </div>
                      {/* center right container */}
                      <div className="flex flex-col lg:flex lg:flex-row lg:flex-grow lg:justify-end">
                        <div className="block inline-block mt-0 mr-4 pt-3 lg:pt-0">
                          <button className="bg-green hover:bg-cyan text-background hover:text-background px-5 py-2 rounded-full"><a href="https://docs.google.com/forms/d/e/1FAIpQLSdcfC5TZoVfbril9npP_YPQnRFUh3FWCtx6Nfr_VFx16pJEBw/viewform?usp=sf_link">Feedback</a></button>
                        </div>
                        <div className="block inline-block mt-0 mr-4 pt-3 lg:pt-0">
                          <button className="bg-green hover:bg-cyan text-background hover:text-background px-5 py-2 rounded-full hover:bg-[#87acec]"><a href="https://bmc.link/kyle.kent321">Buy me a coffee</a></button>
                        </div>
                        <div className="block inline-block mt-0 mr-4 pt-3 lg:pt-0">
                          <button className="bg-green hover:bg-cyan text-background hover:text-background px-5 py-2 rounded-full hover:bg-[#87acec]">
                            <a href="/accounts/logout/">Logout</a>
                            <a href="/accounts/login/">Login</a>
                          </button>
                        </div>
                      </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header

