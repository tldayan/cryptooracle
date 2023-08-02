

import React, { useEffect, useState, useRef } from 'react'
import { Outlet,NavLink,Link } from 'react-router-dom'
import searchDark from "../assets/search_dark.svg"
import searchLight from "../assets/search_light.svg"

const MainLayout = () => {
  const hamburgerRef = useRef(null); 
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [watchlist, setWatchList] = useState([])
  const [search,setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [lists, setlists] = useState([])
  const [islogin, setIsLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [showChevron, setShowChevron] = useState(false);
  const [cryptos,setCryptos] = useState(0)
  const [exchangeCount, setExchangesCount] = useState(0)
  const [icos, setIcos] = useState(0)
  const [globalMcapPercent, setGlobalMcapPercent] = useState(0)
  const [isPositive,setIsPositive] = useState(undefined)
  const [fearIndex, setFearIndex] = useState(0)
    
    

    useEffect(() => {

        const fetchGlobalStats = async() => {

            const response = await fetch("https://api.coingecko.com/api/v3/global",{
            headers : {
              method : "GET",
              acccept : "application/json"
            }
          })
             
          const data = await response.json()

          setCryptos(data.data["active_cryptocurrencies"])
          setExchangesCount(data.data["markets"])
          setIcos(data.data["ongoing_icos"])
          setGlobalMcapPercent(data.data.market_cap_change_percentage_24h_usd)

          if((data.data.market_cap_change_percentage_24h_usd).toString().startsWith("-")) {
            setIsPositive(false)
          } else {
            setIsPositive(true)
          }
        }


        const fetchIndex = async() => {

            const response = await fetch('https://api.alternative.me/fng/?limit=1')
            const data = await response.json()
    
            setFearIndex(data.data[0]["value"] / 100)
          }
    
        fetchIndex()
        fetchGlobalStats()

        const handleScroll = () => {
          const scrollPosition = window.scrollY;
    
          if (scrollPosition > 0) {
            setShowChevron(true); // Show the "chevron_up" div if user is anywhere else but at the top
          } else {
            setShowChevron(false); // Hide the "chevron_up" div if user is at the top
          }
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
    },[])

    const signup = document.querySelector(".signup_button")

const html = document.getElementById("htmlPage")
html.classList.add("dark_mode")


function switchTheme(event) {
  event.preventDefault();

  const checkbox = event.currentTarget.querySelector('input[type="checkbox"]');
  
  checkbox.checked = !checkbox.checked

  if (html.classList.contains("light_mode")) {
    html.classList.remove("light_mode");
    html.classList.add("dark_mode");
    setIsDarkMode(false)
  } else {
    html.classList.remove("dark_mode");
    html.classList.add("light_mode")
    setIsDarkMode(true)
  }
}

  const loginSignupContainer = document.querySelector(".main_login_signup_container")
  const darkOverlay = document.querySelector(".dark_overlay")
  const bodyElement = document.querySelector("body")


function handleAuthOpen(e) {

  bodyElement.style.overflow = "hidden"
  window.scrollTo(0,0)

  darkOverlay.style.visibility = "visible"
  const ClickedButton = document.querySelector(`.${e.target.className}`)

  console.log(ClickedButton.innerText)

  if(ClickedButton.innerText === "Login") {
    setIsLogin(true)
  } else {
    setIsSignUp(true)
  }

      loginSignupContainer.style.opacity = 1
      loginSignupContainer.style.pointerEvents = "auto"
}


function handleAuthClose() {

  bodyElement.style.overflow = "visible"
  window.scrollTo(0,0)

      darkOverlay.style.visibility = "hidden"
      loginSignupContainer.style.opacity = 0
      loginSignupContainer.style.pointerEvents = "none"
      setIsLogin(false)
      setIsSignUp(false)
}


const results = document.querySelector(".search_list")
const searchField = document.querySelector('.search_field');

function expandSearchBar() {
  let currentWidth = searchField.style.width
  if (currentWidth === "100%" ) {
      searchField.style.width = "0%"
      results.style.display = "none"

  } else {
      searchField.style.width = "100%"
      results.style.display = "flex"
  }
}

useEffect(() => {

  const fetchAllCoins = async() => {

    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&locale=en", {
        method : "GET",
        headers : {
          accept : "application/json"
        }
      })
      const allCoins = await response.json()
      setlists(allCoins)

    } catch (error) {
      console.log(error.message)
    }
  }
  const timeoutID = setTimeout(() => {
        fetchAllCoins()
  },5000)

  return () => clearTimeout(timeoutID)

},[])


useEffect(() => {

  if(search === "") {
    setSearchResults([])
    return;
  }
  searchField.style.width = "100%"
  setSearchResults(lists.filter(eachCoin => (eachCoin.id).toLowerCase().includes(search.toLowerCase())))

},[search])

function closeResultList() {
  setSearchResults([])
  searchField.style.width = "0%"
}

/* HAMBURGER FUNCTIONALITY */
const mobileMenu = document.querySelector(".nav_links_container");
const hamburger = document.getElementById('hamburger');

useEffect(() => {
  // Check if the hamburgerRef.current exists before accessing its style
  if (hamburgerRef.current) {
    if (isDarkMode === false) {
      hamburgerRef.current.style.stroke = "white";
    } else {
      hamburgerRef.current.style.stroke = "black";
    }
  }
}, [isDarkMode]);
    
function openHamburger() {

    const navLinks = document.querySelector(".nav_links")
  
    hamburger.classList.toggle('open');
  
    if (hamburger.classList.contains("open")) {
      mobileMenu.style.left = "0%";
      
    } else {
      mobileMenu.style.left = "100%";
    }
  }

  function returnHome() {
    mobileMenu.style.left = "100%";
    hamburger.classList.toggle("open")
    
  }
  



  return (
    <div className='App'>
            <div className="dark_overlay"></div>
            <div className='global_info'>
                <div className="global_info_stats infinite-scroll">
                <div className="scroll-container">
                  <p>Cryptos: <span className='stats'>{(cryptos).toLocaleString()}</span></p>
                  <p>Exchanges: <span className='stats'>{(exchangeCount)}</span></p>
                  <p>24h Market Cap: <span className={isPositive ? "green" : "red"}>{(globalMcapPercent).toFixed(2)}%</span></p>
                  <p>ICOS: <span className='stats'>{icos}</span> </p>
                  <p>Fear & Greed: <span className='stats'>{(fearIndex*100).toFixed(0)}/100</span></p>
                </div>
                </div>
                <div onClick={(e) => switchTheme(e) } className="theme_toggle_container">
                  <p>Theme</p>
                  <input className="tgl tgl-ios" id="cb2" type="checkbox"/>
                  <label className="tgl-btn" htmlFor="cb2"></label>
                </div>
                <div className="login_signup_btn_container">
                  <button onClick={(e) => handleAuthOpen(e)} className="login_button">Login</button>
                  <button onClick={(e) => handleAuthOpen(e)} className="signup_button">Sign up</button>
                </div>
                
            </div>

            <div onClick={() => window.scrollTo(0,0)} className='chevron_up' style={{ opacity: showChevron ? '1' : '0',cursor: showChevron ? "pointer" : "auto" }}></div>


        <header>
          
            <nav>
                <Link to="/" className='logo'>CryptoOracle</Link>

                <div className="search_container">
                    <input
                        className='search_field'
                        type="text"
                        placeholder='Search cryptocurrencies...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className='search_list'>
                      {searchResults.map(eachCoin => {
                        return <Link onClick={closeResultList} to={`/currencies/${eachCoin.id}`} className='result' key={eachCoin.id}><img loading='lazy' className='trending_icons' src={eachCoin.image} alt="" />{(eachCoin.id).charAt(0)?.toUpperCase() + eachCoin.id.slice(1)}<span className='currency_faded_text'>{eachCoin?.symbol?.toUpperCase()}</span></Link>
                      })}
                    </div>
                    <img loading='lazy' className='search_icon' onClick={expandSearchBar} src={isDarkMode ? searchDark : searchLight} alt="" />
                </div>


                <ul className='nav_links_container'>
                    <NavLink to="/" className="nav_links" onClick={returnHome} >Markets</NavLink>
                    <NavLink to="watchlist" className="nav_links" onClick={returnHome} >Watchlist</NavLink>
                    <NavLink to="exchanges" className="nav_links" onClick={returnHome} >Exchanges</NavLink>
                    <NavLink to="about" className="nav_links" onClick={returnHome} >About</NavLink>
                </ul>

                <div className="container">
                    <div id="hamburger" onClick={openHamburger}>
                        <svg ref={hamburgerRef} width="50" height="50" viewBox="0 0 100 100">
                            <path className="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                            <path className="line line2" d="M 20,50 H 80" />
                            <path className="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                        </svg>
                    </div>
                </div>

            </nav>
            <div className="main_login_signup_container">
              <button onClick={handleAuthClose} className='close_modal_button'>&#x2716;</button>
                      <h3 className='auth_type'>{islogin ? "Login" : "Sign up"}</h3>
              <form className="login_signup_container">
                <div className="email_container">
                  <label htmlFor="user_email">Email Address</label>
                  <input type="text" name=""  placeholder='Enter email' id="user_email" required />
                </div>
                <div className="password_container">
                  <label htmlFor="user_password">Password {islogin && <span className='forgot_password'>Forgot password?</span>}</label>
                  <input type="password" name="" placeholder='Enter password' id="user_password" required />
                </div>
                <button className='loginSignup_btn'>{islogin ? "Login" : "Sign up"}</button>
                {islogin ? <Link to="/" onClick={() => setIsLogin(false)} className='no_account' >Don't have an account? Sign up.</Link> : <Link to="/" onClick={() => setIsLogin(true)} className='existing_account' >Already have an account? Log in.</Link>}
              </form>
            </div>
        </header>
        
        <main>
            <Outlet context={{isDarkMode,lists,watchlist,setWatchList}} />
        </main>
        <footer>

          <div className="footer_container">

            <p className='logo_footer'>CryptoOracle</p>

            <div className="products">
              <h3>Company</h3>
              <ul>
                <Link className='footer_links'>About us</Link>
                <Link className='footer_links'>Terms of use</Link>
                <Link className='footer_links'>Privacy Policy</Link>
                <Link className='footer_links'>Careers</Link>
                <Link className='footer_links'>Disclaimer</Link>
              </ul>
            </div>
            <div className="socials">
              <h3>Socials</h3>
              <ul>
                <Link className='footer_links'>Facebook</Link>
                <Link className='footer_links'>Twitter</Link>
                <Link className='footer_links'>Telegram</Link>
                <Link className='footer_links'>Instagram</Link>
                <Link className='footer_links'>Interactive Chat</Link>
              </ul>
            </div>
          </div>

          <p className="copyright">&copy; 2023 CryptoOracle. All rights reserved.</p>
        </footer>
    
        </div>
  )
}

const MemoMainLayout = React.memo(MainLayout)
export default MainLayout
