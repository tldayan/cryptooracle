
import React, { useCallback } from 'react'
import flame from "../assets/flame.png"
import flameDark from "../assets/flame_dark.png"
import building from "../assets/building.png"
import buildingDark from "../assets/building_dark.png"
import gauge from "../assets/gauge.png"
import gaugeDark from "../assets/gauge_dark.png"
import miniStar from "../assets/star-solid.svg"
import ListStar from "../assets/miniListStar.png"
import ListStarFilled from "../assets/miniListStar_filled.png"
import {useSelector} from "react-redux"
import {useDispatch} from "react-redux"
import {watchlistActions} from "./store/Watchlist-Slice"
import { useEffect, useState} from 'react'
import {Link, useOutletContext} from "react-router-dom"
import GaugeChart from './GaugeChart'
import CurrencyModal from './CurrencyModal'
import TableSkeleton from './TableSkeleton'
import TablePagination from './TablePagination'
import GaugeMeter from './GaugeMeter'


const CryptoList = () => {

  const {isDarkMode,lists } = useOutletContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [coinsPerPage,setCoinsPerPage] = useState(40)
  const [globalMcapPercent, setGlobalMcapPercent] = useState(0)
  const [globalMcap, setGlobalMcap] = useState("")
  const [isPositive,setIsPositive] = useState(undefined)
  const [trendingCoins, setTrendingCoins] = useState([])
  const [exchanges,setExchanges] = useState([])
  const [finalList, setFinalList] = useState([])
  const [selectedCurrency,setSelectedCurrency] = useState("USD")
  const [currencyMultiplier, setCurrencyMultiplier] = useState(1)
  const [isSelectingCurrency, setIsSelectingCurrency] = useState(true)
  const [settingCurrency,setSettingCurrency] = useState(true)
  const [sortOption,setSortOption] = useState("")

/* FETCH TRENDING COINS */
useEffect(() => {
  let isMounted = true; 

  if (localStorage.getItem("trendingCoinslocal") === null) {
    const fetchTrendingCoins = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/search/trending",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        ); 

        const data = await response.json();

        if (isMounted) { /* only sets state if the user is in the component */
          setTrendingCoins(data.coins.slice(0, 3));
          localStorage.setItem(
            "trendingCoinslocal",
            JSON.stringify(data.coins.slice(0, 3))
          );
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchTrendingCoins();
  } else {
    setTrendingCoins(JSON.parse(localStorage.getItem("trendingCoinslocal")));
  }

  return () => {
    isMounted = false; 
  };
}, []);



useEffect(() => {
  let isMounted = true; 

  if (localStorage.getItem("exchangesLocal") === null) {
    const fetchExchanges = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/exchanges",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          });

        const exchanges = await response.json();

        if (isMounted) {
          setExchanges(exchanges.slice(0, 3));
          localStorage.setItem("exchangesLocal", JSON.stringify(exchanges.slice(0, 3)));
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchExchanges();
  } else {
    setExchanges(JSON.parse(localStorage.getItem("exchangesLocal")));
  }

  return () => {
    isMounted = false; 
  };
  
}, []);



useEffect(() => {

  if(isSelectingCurrency === true) {
    document.body.style.overflow = "auto"
  } else {
    document.body.style.overflow = "hidden"
  }

  return () => {
    document.body.style.overflow = "auto";
  };

},[isSelectingCurrency])


useEffect(() => {
  let isMounted = true;

  const fetchGlobalData = async () => {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/global");
      const data = await response.json();

      if (isMounted) {
        setGlobalMcapPercent(data.data.market_cap_change_percentage_24h_usd);

        if (data.data.market_cap_change_percentage_24h_usd < 0) {
          setIsPositive(false);
        } else {
          setIsPositive(true);
        }

        const currentPrice = lists.length > 0 ? lists[0].current_price : 1;

        if (typeof currentPrice === "number") {
          const formattedGlobalMcap = "$" + (data.data.total_market_cap["btc"] * currentPrice / 1e12).toFixed(1) + "T";
          setGlobalMcap(formattedGlobalMcap);
        }
      }
    } catch (error) {
      console.error("Error fetching global data:", error);
    }
  };

  fetchGlobalData();

  return () => {
    isMounted = false;
  };
  
}, [lists]); 

  useEffect(() => {
    setFinalList(lists);
  }, [lists]);


/* PAGINATION */
const lastIndex = coinsPerPage * currentPage
const firstIndex = lastIndex - coinsPerPage 
const currentCoins = finalList.slice(firstIndex, lastIndex) 


const numberOfPages = []

  for(let i = 1; i <= Math.ceil(finalList.length / coinsPerPage); ++i){
    numberOfPages.push(i)
  }

  const maxPageButtons = 5;

  // Calculate the range of pages to be displayed in the pagination
  const calculatePageRange = () => {
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    const startPage = Math.max(currentPage - halfMaxButtons, 1);
    const endPage = Math.min(startPage + maxPageButtons - 1, numberOfPages.length);
    return { startPage, endPage };
  };

  const { startPage, endPage } = calculatePageRange();


  const [sortContainer, setSortContainer] = useState(null);
  const [rowsContainer, setRowsContainer] = useState(null);
  
  useEffect(() => {
    const sortContainerElement = document.querySelector(".sort_container");
    const rowsContainerElement = document.querySelector(".rows_container");
    setSortContainer(sortContainerElement);
    setRowsContainer(rowsContainerElement);
  }, []);
  

useEffect(() => {
  if (rowsContainer) {
    rowsContainer.classList.add("hide");
  }
}, [coinsPerPage]);

useEffect(() => {
  if(sortContainer) {
    sortContainer.classList.add("hide")
}
},[finalList])


  function openSortContainer() {
    sortContainer.classList.toggle("hide")
  }

  function openRowsContainer() {
    rowsContainer.classList.toggle("hide")
  }

  const dispatch = useDispatch()
  const watchlist = useSelector((state) => state.watchlist.watchlist)

  function addToWatchlist(selectedCurrency) {
    dispatch(watchlistActions.handleWatchlist(selectedCurrency.toLowerCase()))
  }

  const scrollToList = useCallback((e) => {
      e.preventDefault()
      window.scrollTo(0,430)
  },[])
  
  const darkOverlay = document.querySelector(".dark_overlay")
  const CurrencyModalElement = document.querySelector(".currency_modal")

  function handleCurrencySwitch() {
    CurrencyModalElement.classList.add("active")  
    darkOverlay.style.visibility = "visible"
    
    setIsSelectingCurrency(!isSelectingCurrency)
  }


  useEffect( () => {

    const fetchCurrencyMultiplier = async() => {

      try {
      const response = await fetch(`https://api.api-ninjas.com/v1/convertcurrency?have=USD&want=${selectedCurrency ? selectedCurrency : "USD"}&amount=${1}`,{
        method : "GET",  
        headers: { 'X-Api-Key': 'NMo6TT6RgMzjwbrE8PmRcw==3Mh19h3fvocH8y8i'},})

      const DATA = await response.json()

      const multiplier = DATA.new_amount
      setCurrencyMultiplier(multiplier)

    } catch (error) {
      console.log(error.message)
    }
   }
   
   fetchCurrencyMultiplier()
   setSettingCurrency(true)
   
   const updatedCurrencyLoadTimer = setTimeout(() => {
    setSettingCurrency(false)
   },1800)

   return () => clearTimeout(updatedCurrencyLoadTimer)
   
  },[selectedCurrency])

 
  function handleSort(sortSelection) {
    if(sortSelection === "Price &#9650;") {
      setSortOption("Price &#9650;")
    }else if(sortSelection === "Price &#9660;") {
      setSortOption("Price &#9660;")
    } else if(sortSelection === "Volume &#9650;") {
      setSortOption("Volume &#9650;")
    } else if(sortSelection === "Volume &#9660;") {
      setSortOption("Volume &#9660;")
    } else {
      setSortOption("")
    }
  }


  return (
    <div className="cryptolist_route">
    <div className='highlights_container'>
        <h1 className='highlights_title'>Today's Cryptocurrency Highlights</h1>
        <p className='highlights_info'>The global crypto market cap is {globalMcap}, a <span className={isPositive ? "green" : "red"}>{(globalMcapPercent).toFixed(2)}%</span> {isPositive ? "increase" : "decrease"} over the last day.</p>
    </div>
    
    <div className='main_highlights_container'>
        <div className='trending_container'>
            <h3 className='highlights_titles'><img loading='lazy' className='highlight_icons' src={isDarkMode ? flameDark : flame} alt="" /> Trending <span className='live'>Live</span></h3>
            <ul className='trending_list'>
                {trendingCoins.map((eachCoin,index) => {
                    return <Link to={`/currencies/${eachCoin.item.id}`} className='trending_line' key={index+ 1}><span className='numbering'>{index + 1}</span> <img loading='lazy' className='trending_icons' src={eachCoin.item.small} alt="" /><p className='trending_coins'>{(eachCoin.item.id).charAt(0).toUpperCase() + eachCoin.item.id.slice(1)}</p></Link>
                })}
            </ul>
            <Link onClick={(e) => scrollToList(e)} className='more_button'>View all</Link>
        </div>
        <div className='trending_container'>
          <h3 className='highlights_titles'><img loading='lazy' className='highlight_icons' src={isDarkMode ? buildingDark : building} alt="" /> Top Exchanges <span className='live'>Live</span></h3>
          <ul className='trending_list'>
            {exchanges.map((eachexchange,index) => {
              return <li className='trending_line' key={index+ 1}><span className='numbering'>{index + 1}</span> <img loading='lazy' className='trending_icons' src={eachexchange.image} alt="" /><p className='trending_exchanges'>{eachexchange.name}</p></li>
            })}
          </ul>
          <Link to="exchanges" className='more_button'>More &#x2192;</Link>
        </div>
        <div className='trending_container'>
          <h3 className='highlights_titles'><img loading='lazy' className='highlight_icons' src={isDarkMode ? gaugeDark : gauge} alt="" /> Fear & Greed Index <span className='index_tooltip_container'><span className='index_info_icon'>&#9432;</span><p className='index_info'>When the value is closer to 0, the market is in Extreme Fear, and investors have over-sold irrationally. When the value is closer to 100, the market is in Extreme Greed, indicating a likely market correction.</p></span><span className='live'>Live</span></h3>
          <GaugeMeter />
        </div>
    </div>
      <CurrencyModal isSelectingCurrency={isSelectingCurrency} setIsSelectingCurrency={setIsSelectingCurrency}  selectedCurrency={selectedCurrency} setSelectedCurrency={setSelectedCurrency} />
    <div className="list_actions">
      <div className="main_sort_container">
        <Link to="watchlist" className="watchlist_btn">
          <img loading='lazy' className='mini_star' src={miniStar} alt="" />
          Watchlist
        </Link>

        <div className="currency_container">
          <button onClick={handleCurrencySwitch} className='currency_btn'>Currency: {selectedCurrency}</button>
        </div>

        <div className="main_rows_container">
          <button onClick={openRowsContainer} className='show_rows_btn'>Show Rows: {coinsPerPage} &#9660;</button>
          <ul className='rows_container hide'>
            <li><button onClick={() => setCoinsPerPage(20)} className='rows_buttons'>20</button></li>
            <li><button onClick={() => setCoinsPerPage(40)} className='rows_buttons'>40</button></li>
            <li><button onClick={() => setCoinsPerPage(60)} className='rows_buttons'>60</button></li>
          </ul>
        </div>
        
        <div className="sort_main_container">
          <button onClick={openSortContainer} className='sort_button'>Sort</button>
          <ul className='sort_container hide'>
            <li><button onClick={() => {setFinalList([...finalList].sort((a,b) => b.current_price - a.current_price)); handleSort("Price &#9650;")}} className={`sort_buttons ${sortOption === "Price &#9650;" && "active"}`}>Price &#9650;</button></li>
            <li><button onClick={() => {setFinalList([...finalList].sort((a,b) => a.current_price - b.current_price)); handleSort("Price &#9660;")}} className={`sort_buttons ${sortOption === "Price &#9660;" && "active"}`}>Price &#9660;</button></li>
            <li><button onClick={() => {setFinalList([...finalList].sort((a,b) => b.total_volume - a.total_volume));handleSort("Volume &#9650;")}} className={`sort_buttons ${sortOption === "Volume &#9650;" && "active"}`}>Volume &#9650;</button></li>
            <li><button onClick={() => {setFinalList([...finalList].sort((a,b) => a.total_volume - b.total_volume));handleSort("Volume &#9660;")}} className={`sort_buttons ${sortOption === "Volume &#9660;" && "active"}`}>Volume &#9660;</button></li>
            <li><button onClick={() => {setFinalList([...finalList].sort((a,b) => a.market_cap_rank - b.market_cap_rank));handleSort("Price")}} className='sort_buttons'>Reset</button></li>
          </ul>
        </div>
      </div>
    </div>           
    <div className='crypto_list_container'>
  {currentCoins.length && !settingCurrency ? (
    <table>
      <thead>
        <tr>
          <th><img className='list_star' src={ListStarFilled} alt="" /></th>
          <th>#</th>
          <th>Name</th>
          <th>Price</th>
          <th>Low (24h)</th>
          <th>High (24h)</th>
          <th>24h %</th>
          <th>Market Cap <span className='mcap_tooltip_container'><span className='mcap_table_info_icon'>&#9432;</span><p className='mcap_table_info'>When the value is closer to 0, the market is in Extreme Fear, and investors have over-sold irrationally. When the value is closer to 100, the market is in Extreme Greed, indicating a likely market correction.</p></span></th>
          <th className='volume_title'>Volume <span className='volume_tooltip_container'><span className='volume_table_info_icon'>&#9432;</span><p className='volume_table_info'>A measure of how much of a cryptocurrency was traded in the last 24 hours.</p></span></th>
          <th>Circulating Supply <span className='circ_supply_tooltip_container'><span className='circsupply_table_info_icon'>&#9432;</span><p className='circsupply_table_info'>When the value is closer to 0, the market is in Extreme Fear, and investors have over-sold irrationally. When the value is closer to 100, the market is in Extreme Greed, indicating a likely market correction.</p></span></th>
        </tr>
      </thead>
      <tbody>
        {currentCoins.map(eachlist => {
          return (
            <tr key={eachlist.market_cap_rank}>
              <td><button className='watchlist_star_btn' onClick={() => addToWatchlist(eachlist.id)}><img className='list_star' src={watchlist.includes(eachlist.id.toLowerCase()) ? ListStarFilled : ListStar} alt="" /></button></td>
              <td>{eachlist.market_cap_rank}</td>
              <td className='name'><div className='name_container'><img loading='lazy' className='trending_icons' src={eachlist.image} alt="" /><abbr title={`${eachlist.name}`}><Link className='name' to={`/currencies/${eachlist.id}`}>{eachlist.name.length > 10 ? eachlist.name.slice(0, 10) + "..." : eachlist.name}</Link></abbr><span className='faded_text'>{(eachlist.symbol).toUpperCase()}</span></div></td>
              <td><span className='currency_symbol'>{selectedCurrency}</span>{(currencyMultiplier * eachlist?.current_price).toLocaleString()}</td>
              <td><span className='currency_symbol'>{selectedCurrency}</span>{(currencyMultiplier * eachlist?.low_24h).toLocaleString()}</td>
              <td><span className='currency_symbol'>{selectedCurrency}</span>{(currencyMultiplier * eachlist?.high_24h).toLocaleString()}</td>
              <td className={eachlist.price_change_percentage_24h && eachlist.price_change_percentage_24h < 0 ? "red" : "green"}>
                <span dangerouslySetInnerHTML={{ __html: eachlist.price_change_percentage_24h < 0 ? "&#8600;" : "&#8599;" }} /> {eachlist.price_change_percentage_24h && (eachlist.price_change_percentage_24h).toFixed(2)} %
              </td>
              <td><span className='currency_symbol'>{selectedCurrency}</span>{Number((currencyMultiplier * eachlist.market_cap).toFixed()).toLocaleString()}</td>
              <td className='coin_volume'>
                <span className='currency_symbol'>{selectedCurrency}</span>{eachlist.total_volume.toLocaleString()}{' '}
                <span className='coin_amount'>{(eachlist.total_volume / eachlist?.current_price).toLocaleString(undefined, { maximumFractionDigits: 0, })}{' '}{eachlist.symbol.toUpperCase()}</span>
              </td>
              <td className='circ_supply'>{eachlist.circulating_supply.toLocaleString()} <span className='faded_text'>{(eachlist.symbol).toUpperCase()}</span> {eachlist.max_supply ? <div className='bar_container'><div className='bar' style={{ width: (100 / (eachlist.max_supply / eachlist.circulating_supply)) + `%` }}></div></div> : null}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : (
    <TableSkeleton />
  )}
</div>
    {!settingCurrency && <div className="pagination_container">
        <p className="pagination_info">Results: {`${firstIndex + 1}`} - {`${lastIndex}`} of {finalList.length}</p>
        <TablePagination currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfPages={numberOfPages} startPage={startPage} endPage={endPage} />
        <p className="pagination_info">Page: {`${currentPage}`} of {`${numberOfPages.length}`}</p>
      </div>}
    </div>
  )
}

const MemoCryptoList = React.memo(CryptoList)
export default MemoCryptoList