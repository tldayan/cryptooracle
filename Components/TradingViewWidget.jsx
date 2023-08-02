// TradingViewWidget.jsx
import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';

function TradingViewWidget() {

  const selectedCurrency = useOutletContext().currency
  const isDarkMode = useOutletContext().isDarkMode

  const container = useRef();


  useEffect(() => {

      if(selectedCurrency) {
        const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "symbols": [
            [
              "BINANCE:${selectedCurrency}USDT|ALL"
            ]
          ],
          "chartOnly": false,
  "width": "100%",
  "height": "100%",
  "locale": "en",
  "colorTheme": ${isDarkMode ? '"light"' : '"dark"'},
  "autosize": true,
  "showVolume": false,
  "showMA": false,
  "hideDateRanges": false,
  "hideMarketStatus": false,
  "hideSymbolLogo": false,
  "scalePosition": "right",
  "scaleMode": "Normal",
  "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
  "fontSize": "10",
  "noTimeScale": false,
  "valuesTracking": "1",
  "changeMode": "price-and-percent",
  "chartType": "area",
  "maLineColor": "#2962FF",
  "maLineWidth": 1,
  "maLength": 9,
  "lineWidth": 2,
  "lineType": 0,
  "dateRanges": [
    "1d|1",
    "1m|30",
    "3m|60",
    "12m|1D",
    "60m|1W",
    "all|1M"
  ],
          "dateFormat": "MMM dd, yyyy"
        }`;

      container.current.innerHTML = "";
      container.current.appendChild(script);
      
    }

    },[selectedCurrency,isDarkMode]);


  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default TradingViewWidget;
