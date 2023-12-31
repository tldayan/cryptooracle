import React from 'react';

const currencies = ["USD", "EUR", "GBP", "AUD", "BHD", "OMR", "THB", "KWD", "SEK", "NZD", "CHF", "SAR", "CAD", "QAR", "DKK"];

export default function CurrencyModal({selectingCurrency,setIsSelectingCurrency,setSelectedCurrency, closeModal, selectedCurrency }) {
  
  
  const CurrencyModalElement = document.querySelector(".currency_modal")
  const darkOverlay = document.querySelector(".dark_overlay")

  function closeModal() {
      CurrencyModalElement.classList.remove("active")
      darkOverlay.style.visibility = "hidden"
      setIsSelectingCurrency(!selectingCurrency)
  }
  
  return (
    <div className="currency_modal">
      <button onClick={closeModal} className='close_modal_button'>&#x2716;</button>
      <h3>Select Currency</h3>
      <p className='currency_notice'>Please select your preferred currency from the options below.</p>
      <div className="currencies_list">
        {currencies.map(currency => (
          <button
            key={currency}
            className={`currency ${selectedCurrency === currency ? "active" : null}`}
            onClick={() => {
              setSelectedCurrency(currency);
              closeModal();
            }}
          >
            {currency}
          </button>
        ))}
      </div>
    </div>
  );
}



