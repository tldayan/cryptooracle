import React from 'react'
import {Link} from "react-router-dom"

export default function About() {
  

  return (
    <>
    <Link to="/" className='back_button'>&#10094; Back to Home</Link>
    <div className="about_container">
      <h2 className='about_title'>About</h2>
      <p>Welcome to CryptoOracle, your ultimate destination for comprehensive cryptocurrency information. Our platform caters to enthusiasts, traders, and investors, empowering them with the knowledge and tools necessary to navigate the ever-evolving market with confidence. To ensure accuracy, we rely on the trusted CoinGecko API for real-time updates on prices, market capitalizations, and trading volumes of thousands of cryptocurrencies. Visualizing market trends is made easy with our integration of TradingView charts, renowned for their user-friendly interface and robust charting tools. Join us at CryptoOracle and stay ahead with the latest insights and interactive resources for the fascinating world of cryptocurrencies.</p>
    </div>


  <details itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <summary itemprop="name">What is CrptoOracle?</summary>
      <div class="details-expanded" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p>CryptoOracle is a one-stop destination for all your cryptocurrency needs. It is a comprehensive platform that caters to cryptocurrency enthusiasts, traders, and investors alike</p>
    </div>
  </details>
  <details itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <summary itemprop="name">How does CryptoOracle work?</summary>
    <div class="details-expanded" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p>CryptoOracle operates as a comprehensive cryptocurrency information platform by utilizing the CoinGecko API to gather real-time and accurate data on various cryptocurrencies. This data includes crucial metrics such as prices, market capitalizations, and trading volumes for thousands of digital assets. Additionally, CryptoOracle integrates the powerful TradingView charts, renowned for their user-friendly interface and robust charting tools, to visually present market trends and historical performance of cryptocurrencies</p>
    </div>
  </details>
  <details itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <summary itemprop="name">Do i need to create an account to use CryptoOracle</summary>
      <div class="details-expanded" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p>No, you do not need to create an account to use CryptoOracle. Our website allows users to browse and watch cryptocurrencies without the requirement of creating an account.</p>
    </div>
  </details>
  <details itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <summary itemprop="name">Is CryptoOracle available in multiple languages?</summary>
      <div class="details-expanded" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p>Currently, CryptoOracle primarily supports the English language. However, we are working on expanding our language options to provide a more inclusive experience in the future.</p>
    </div>
  </details>
  </>
    
  
  )
}
