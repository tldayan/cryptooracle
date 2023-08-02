
import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"

export default function Exchanges() {

    const [exchangesData, setExchangesData] = useState([])

    useEffect(() => {
        const fetchExchangesData = async() => {
            const response = await fetch("https://api.coingecko.com/api/v3/exchanges", {
                method : "GET",
                headers : {
                    accept : "application/json"
                }   
            })
            const data = await response.json()
            setExchangesData(data)
        }
        
    fetchExchangesData()
    },[])  




  return (
    <>
    <Link to="/" className='back_button'>&#10094; Back to Home</Link>
    <div className='title_container'>
            <h1 className='highlights_title'>Top Cryptocurrency Exchanges</h1>
            <p className='highlights_info'>CryptoOrcle ranks and scores exchanges based on traffic, liquidity, trading volumes, and confidence</p>
        </div>
    <div className='exchanges_list_container'>
        { !exchangesData.length ? <div className="load_animation"></div> : <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Trust Score</th>
                    <th>Established Country</th>
                    <th>Established Year</th>
                    <th>Volume 24h</th>
                    <th>Website</th>
                </tr>
            </thead>
            <tbody>
                {exchangesData.map(eachExchange => {
                    return <tr key={eachExchange.trust_score_rank}>
                        <td>{eachExchange.trust_score_rank}</td>
                        <td className='exchange_name'><div className="exchange_name_container"><img loading='lazy' className='trending_icons' src={eachExchange.image} alt="" />{eachExchange.name}</div></td>
                        <td><p className='score' style={{backgroundColor : eachExchange.trust_score < 7 ? "rgb(255, 0, 0)" : eachExchange.trust_score < 9 ? "orangered": "#00ff9d" }}>{(eachExchange.trust_score)}</p></td>
                        <td>{eachExchange.country ? eachExchange.country : "N/A"}</td>
                        <td className='year'>{eachExchange.year_established ? eachExchange.year_established : "N/A"}</td>
                        <td className='green'>${(eachExchange.trade_volume_24h_btc).toFixed(2)}</td>
                        <td><Link target='blank' className='exchange_links' to={eachExchange.url}>{eachExchange.url.length > 35 ? `${eachExchange.url.slice(0,35)}...` : eachExchange.url}</Link></td>
                    </tr>
                })}
            </tbody>
        </table>}
    </div>
    </>
  )
}
