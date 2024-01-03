// CurrencyDropdown.js
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const CurrencyDropdown = () => {
  const { dispatch, currency } = useContext(AppContext);

  const handleCurrencyChange = (event) => {
    const selectedCurrency = currency.options.find(option => option.code === event.target.value);

    console.log('Selected Currency:', selectedCurrency);

    if (selectedCurrency) {
      console.log('Dispatching CHG_CURRENCY:', selectedCurrency);
      dispatch({
        type: 'CHG_CURRENCY',
        payload: {
            code: selectedCurrency.code,
            symbol: selectedCurrency.symbol,
            options: currency.options, // Assuming you want to keep the same options
          },
        });
      } else {
        console.error('Selected Currency not found');
      }
    };

  return (
    <div className='alert alert-secondary'>
      <span>Currency: </span>
      <select onChange={handleCurrencyChange} value={currency.code}>
        {currency.options.map(option => (
          <option key={option.code} value={option.code}>
            {option.name} ({option.symbol})
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyDropdown;
