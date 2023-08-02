import React, { useEffect, useState } from 'react'
import { useOutletContext,Link } from 'react-router-dom'
import bigStar from "../assets/big_star.png"

export default function Watchlist() {

    const watchlist = useOutletContext().watchlist/*  [bitcoin,ethereum] */
    const lists = useOutletContext().lists
    const setWatchList = useOutletContext().setWatchList

    const [watchlistCoinsData, setWatchlistCoinsData] = useState([])

    useEffect(() => {
      window.scrollTo(0, 0)
    },[])

    useEffect(() => {

        setWatchlistCoinsData(lists.filter(eachCoin => {
            if(watchlist.includes(eachCoin.id)) {
            return eachCoin
        } else {
            return;
        }
        }))

    },[watchlist])



    function RemoveFromWatchlist(currency) {

        setWatchlistCoinsData([...watchlistCoinsData].filter(eachCoin => eachCoin.id !== currency))
        setWatchList([...watchlist].filter(eachCoin => eachCoin !== currency))
    } 


  return (
    <>
          <Link to="/" className='back_button'>&#10094; Back to Home</Link>
    <div className='crypto_list_container'>
        {watchlistCoinsData.length ? <table>
          <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Price</th>
            <th>Low (24h)</th>
            <th>High (24h)</th>
            <th>24h %</th>
            <th>Market Cap</th>
            <th className='volume_title'>Volume</th>
            <th>Circulating Supply</th>
            <th>Edit</th>
          </tr>
          </thead>
          <tbody>
          {watchlistCoinsData.map(eachlist => {
            return <tr key={eachlist.market_cap_rank}>
              <td>{eachlist.market_cap_rank}</td>
              <td className='name' ><div className='name_container'><img loading='lazy' className='trending_icons' src={eachlist.image} alt="" /><Link className='name' to={`/currencies/${eachlist.id}`}>{eachlist.name}</Link><span className='faded_text'>{(eachlist.symbol).toUpperCase()}</span></div></td>
              <td>${eachlist?.current_price.toLocaleString()}</td>
              <td>{eachlist.low_24h && eachlist.low_24h.toLocaleString()}</td>
              <td>{eachlist.high_24h && eachlist.high_24h.toLocaleString()}</td>
              <td className={eachlist.price_change_percentage_24h && eachlist.price_change_percentage_24h < 0 ? "red" : "green"}><span dangerouslySetInnerHTML={{ __html: eachlist.price_change_percentage_24h < 0 ? "&#8600;" : "&#8599;" }} /> {eachlist.price_change_percentage_24h && (eachlist.price_change_percentage_24h).toFixed(2)} %</td>
              <td>${eachlist.market_cap.toLocaleString()}</td>
              <td className='coin_volume'>${eachlist.total_volume.toLocaleString()}{' '}<span className='coin_amount'>{(eachlist.total_volume / eachlist?.current_price).toLocaleString(undefined, {maximumFractionDigits: 0,})}{' '}{eachlist.symbol.toUpperCase()}</span></td>
              <td className='circ_supply'>{eachlist.circulating_supply.toLocaleString()} <span className='faded_text'>{(eachlist.symbol).toUpperCase()}</span> {eachlist.max_supply ? <div className='bar_container'><div className='bar' style={{width : (100 / (eachlist.max_supply / eachlist.circulating_supply)) + `%`}}></div></div> : null}</td>
              <td><button className='delete_btn' onClick={() => RemoveFromWatchlist(eachlist.id)}>Delete</button></td>
            </tr>
          })}
          </tbody>
        </table> : <div className='empty_watchlist_container'>
                    <img src={bigStar} alt="" />
                    <h3>Your watchlist is empty</h3>
                    <p>Start building your watchlist by clicking the button below</p>
                    <Link to="/" className='add_coins_btn'>Add Coins</Link>
                    </div>}
    </div>
    </>
    )
}
