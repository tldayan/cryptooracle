import React, { useEffect, useState } from 'react';
import { useParams,Outlet, useOutletContext,Link } from 'react-router-dom';
import watchlist_star_nonfilled from "../assets/watchlist_star_nonfilled.png"
import watchlist_star_filled from "../assets/watchlist_star_filled.png"
import {useDispatch} from "react-redux"
import {watchlistActions} from "./store/Watchlist-Slice"
import {useSelector} from "react-redux"
export default function Currencies() {
  const dispatch = useDispatch()
  const watchlist = useSelector((state) => state.watchlist.watchlist)
  

  function addToWatchlist(selectedCurrency) {
    dispatch(watchlistActions.handleWatchlist(selectedCurrency))
  }
    const paramsData = useParams();
    const isDarkMode = useOutletContext().isDarkMode
    
    
    const selectedCurrency = paramsData.id;
    const [currency, setCurrency] = useState("")
    const current_url = window.location.href
    const [currencyData, setCurrencyData] = useState({})

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        const fetchCurrencyData = async() => {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${selectedCurrency}`, {
                method : "GET",
                headers : {
                    accept : "application/json"
                }
            })
            const data = await response.json()
            setCurrency(data.symbol?.toUpperCase())
            setCurrencyData(data)
        }
        fetchCurrencyData()

    },[selectedCurrency])


    const copyButton = document.querySelector(".copy_button")
    const bodyElement = document.querySelector("body")
    const darkOverlay = document.querySelector(".dark_overlay")
    const shareModal = document.querySelector(".share_popup_modal")

    function handleShareOpen() {
      window.scrollTo(0,0)
      darkOverlay.style.visibility = "visible"
      shareModal.style.opacity = 1
      shareModal.style.pointerEvents = "auto"
      shareModal.style.display = "flex"
      bodyElement.style.overflow = "hidden"
    }

    function handleShareClose() {
     darkOverlay.style.visibility = "hidden"
      shareModal.style.opacity = 0
      shareModal.style.pointerEvents = "none"
      shareModal.style.display = "none"
      copyButton.textContent = "Copy"
      copyButton.style.backgroundColor = "rgb(22, 80, 255)"
      bodyElement.style.overflow = "visible"
    }

      const handleCopyClick = () => {
        copyButton.textContent = "Done"
        const currentURL = window.location.href
        const tempInput = document.createElement("input")
        tempInput.value = currentURL
        document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand("copy")
        document.body.removeChild(tempInput)
        copyButton.style.backgroundColor = "#19e898"
      }

      

    return (
      <>
          <Link to="/" className='back_button'>&#10094; Back to Home</Link>
        <div className='currency_main_container'>
          
            <div className="currency_info_container">
                
                <div className='currency_stats_container'>
                <h4 className='currency_name'><img loading='lazy' className='trending_icons' src={currencyData["image"]?.thumb} alt="" />{(selectedCurrency).charAt(0)?.toUpperCase() + selectedCurrency.slice(1)} <span className='currency_faded_text'>{currencyData?.symbol?.toUpperCase()}</span></h4>
                    <p className='currency_description'>{currencyData.description?.en ? currencyData.description.en : <span className="load_animation"></span> }</p>
                    <div className='currency_buttons_container'>
                      <button onClick={() => addToWatchlist(selectedCurrency)}  className='add_to_watchlist_button'><img loading='lazy' src={watchlist.includes(selectedCurrency) ? watchlist_star_filled : watchlist_star_nonfilled} alt="" />{watchlist.includes(selectedCurrency) ? "Added to watchlist" : "Add to watchlist"}</button>
                      <button onClick={handleShareOpen} className='currency_share_button'>Share</button>
                    </div>
                    <p>Market Cap <span className='currency_mcap_tooltip_container'><span className='mcap_info_icon'>&#9432;</span><span className='mcap_info'>The total market value of a cryptocurrency's circulating supply. It is analogous to the free-float capitalization in the stock market.</span></span><span className='currency_stats'>${currencyData.market_data?.market_cap.usd && (currencyData.market_data?.market_cap.usd)?.toLocaleString()}</span></p>
                    <p>Volume <span className='currency_volume_tooltip_container'><span className='volume_info_icon'>&#9432;</span><span className='volume_info'>A measure of how much of a cryptocurrency was traded in the last 24 hours.</span></span><span className='currency_stats'>${currencyData.market_data?.total_volume.usd && (currencyData.market_data?.total_volume.usd)?.toLocaleString()}</span> </p>
                    <p>24h% <span className={`currency_stats ${currencyData.market_data?.price_change_percentage_24h > 0 ? "green" : "red"}`}>{currencyData.market_data?.price_change_percentage_24h && (currencyData.market_data?.price_change_percentage_24h).toFixed(2)}%</span></p>
                    <div className='currency_circ_supply_container'>
                        <p>Circulating Supply <span className='currency_stats'>{(currencyData.market_data?.circulating_supply)?.toLocaleString()} {(currencyData.symbol)?.toUpperCase()}{currencyData.market_data?.max_supply && <span><span className='circ_supply_bar_container'><span className='circ_supply_bar' style={{width : (100 / (currencyData.market_data?.max_supply / currencyData.market_data?.circulating_supply)) + `%`}}></span></span></span>}</span></p>
                        
                    </div>
                    <p>Total Supply <span className='currency_stats'>{(currencyData.market_data?.total_supply && currencyData.market_data?.total_supply)?.toLocaleString()} {(currencyData.symbol)?.toUpperCase()}</span></p>
                    <p>Max. supply <span className='currency_stats'>{currencyData.market_data?.max_supply ? (currencyData.market_data?.max_supply?.toLocaleString()) : `∞`} {(currencyData.symbol)?.toUpperCase()}</span></p>
                    <p>Fully Diluted Mcap <span className='currency_fully_mcap_tooltip_container'><span className='fully_mcap_info_icon'>&#9432;</span><span className='fully_mcap_info'>The maximum amount of coins that will ever exist in the lifetime of the cryptocurrency. It is analogous to the fully diluted shares in the stock market.</span></span> <span className='currency_stats'>${(currencyData.market_data?.fully_diluted_valuation.usd)?.toLocaleString()}</span></p> 
                </div>
            </div>
            <Outlet context={{currency,isDarkMode}} />
            {<div className='share_popup_modal'>
              <button onClick={handleShareClose} className='close_modal_button'>&#x2716;</button>
              <img loading='lazy' src={currencyData.image?.small} alt="" />
              <h3>Share it with your friends</h3>
              <p>The price of {currencyData.name} is ${currencyData.market_data?.current_price.usd}!</p>
              <div className='share_link_container'>
                <p>{current_url}</p>
                <button onClick={handleCopyClick} className='copy_button'>Copy</button>
              </div>
            </div>}
            <div className="dark_overlay"></div>
        </div>
        </>
    );
}
