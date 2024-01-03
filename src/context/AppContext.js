import React, { createContext, useReducer } from 'react';

// 5. The reducer - this is used to update the state, based on the action
export const AppReducer = (state, action) => {
  let budget = 0;

  switch (action.type) {
    case 'ADD_EXPENSE':
      const totalBudget = state.expenses.reduce((previousExp, currentExp) => {
        return previousExp + currentExp.cost;
      }, 0);

      const newTotalBudget = totalBudget + action.payload.cost;

      if (newTotalBudget <= state.budget) {
        const expenseExists = state.expenses.some((currentExp) => currentExp.name === action.payload.name);

        if (expenseExists) {
          const updatedExpenses = state.expenses.map((currentExp) => {
            if (currentExp.name === action.payload.name) {
              return { ...currentExp, cost: currentExp.cost + action.payload.cost };
            } else {
              return currentExp;
            }
          });

          return { ...state, expenses: updatedExpenses };
        } else {
          return { ...state, expenses: [...state.expenses, action.payload] };
        }
      } else {
        alert("Cannot increase the allocation! Out of funds");
        return { ...state };
      }

    case 'RED_EXPENSE':
      const updatedExpensesReduce = state.expenses.reduce((acc, currentExp) => {
        if (currentExp.name === action.payload.name && currentExp.cost - action.payload.cost >= 0) {
          acc.push({ ...currentExp, cost: currentExp.cost - action.payload.cost });
          budget = state.budget + action.payload.cost;
        } else {
          acc.push(currentExp);
        }
        return acc;
      }, []);

      return { ...state, expenses: updatedExpensesReduce, budget };

    case 'DELETE_EXPENSE':
      const deletedExpense = state.expenses.find((currentExp) => currentExp.id === action.payload);
      budget = state.budget + deletedExpense.cost;

      const updatedExpensesFilter = state.expenses.filter((currentExp) => currentExp.id !== action.payload);

      return { ...state, expenses: updatedExpensesFilter, budget };

    case 'SET_BUDGET':
      const newBudget = action.payload;
      const totalSpending = state.expenses.reduce((total, item) => total + item.cost, 0);

      if (newBudget < totalSpending) {
        alert("Cannot set a budget lower than the current spending");
        // Return the current state with the budget set back to its original value
        return { ...state };
      } else if (newBudget <= 20000) {
        return { ...state, budget: newBudget };
      } else {
        alert("Cannot set a budget exceeding 20000");
        // Return the current state with the budget set back to its original value
        return { ...state, budget: state.budget };
      }
    

    case 'CHG_CURRENCY':
      // Adding an event listener to change the currency
      // Here, you can perform additional logic if needed
      console.log('CHG_CURRENCY action triggered with payload:', action.payload);
  return { ...state, currency: action.payload };
     

    default:
      return state;
  }
};

// 1. Sets the initial state when the app loads
const initialState = {
  budget: 2000,
  expenses: [
    { id: "Marketing", name: 'Marketing', cost: 50 },
    { id: "Finance", name: 'Finance', cost: 300 },
    { id: "Sales", name: 'Sales', cost: 70 },
    { id: "Human Resource", name: 'Human Resource', cost: 40 },
    { id: "IT", name: 'IT', cost: 500 },
  ],
  currency: {
    code: 'GBP',  // Default currency code
    symbol: '£',  // Default currency symbol
    options: [
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'GBP', symbol: '£', name: 'British Pound' },
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
      // Add more currencies as needed
    ],
  },
};

// 2. Creates the context this is the thing our components import and use to get the state
export const AppContext = createContext();

// 3. Provider component - wraps the components we want to give access to the state
// Accepts the children, which are the nested(wrapped) components
export const AppProvider = (props) => {
  // 4. Sets up the app state. takes a reducer, and an initial state
  const [state, dispatch] = useReducer(AppReducer, initialState);

let remaining = 0;

if (state.expenses) {
  const totalExpenses = state.expenses.reduce((total, item) => {
    return (total = total + item.cost);
  }, 0);
  remaining = state.budget - totalExpenses;
}

const setCurrency = (payload) => {
  dispatch({
    type: 'CHG_CURRENCY',
    payload: payload,
  });
};

return (
  <AppContext.Provider
    value={{
      expenses: state.expenses,
      budget: state.budget,
      remaining: remaining,
      dispatch,
      currency: state.currency,
      setCurrency,
    }}
  >
    {props.children}
  </AppContext.Provider>
);
};
