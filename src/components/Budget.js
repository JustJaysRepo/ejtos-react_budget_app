import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Budget = () => {
  const { budget,currency, dispatch } = useContext(AppContext);

  return (
    <div className='alert alert-secondary'>
      <span>Budget: {currency.symbol}{budget}</span>
      <input
        type="number"
        step="10"
        value={budget}
        onChange={(event) => dispatch({ type: 'SET_BUDGET', payload: parseInt(event.target.value) })}
      />
    </div>
  );
};

export default Budget;
