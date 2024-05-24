import React, { useEffect, useState } from "react";
import "./Expense.css";
import axios from "axios";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [newexp, setNewexp] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://backendexpense-3.onrender.com/home");
        setExpenses(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleAddOrUpdateExpense = async(e) => {
    e.preventDefault();

    const newOrUpdateExpense = {
      Date: date,
      Category: title,
      Amount: parseFloat(amount),
    };

    if (editingIndex !== null) {
     
      const updatedExpenses = [...expenses];
      updatedExpenses[editingIndex] = newOrUpdateExpense;
      setExpenses(updatedExpenses);
      setEditingIndex(null);
    } else {
      
      setExpenses((prevExpenses) => [...prevExpenses, newOrUpdateExpense]);
     
        try {
          const response = await axios.post("https://backendexpense-3.onrender.com/add", newOrUpdateExpense);
          setExpenses([...expenses, response.data]);
        } catch (error) {
          console.log(error);
        }
      }
    setTitle("");
    setDate("");
    setAmount("");
  };

  const handleEditExpense = (index) => {
    if (expenses.length > index && index >= 0) {
      setEditingIndex(index);
      const expense = expenses[index];
      setTitle(expense.Category);
      setDate(expense.Date);
      setAmount(expense.Amount.toString());
    } else {
      console.error("Index is out of range");
    }
  };

  const handleDeleteExpense = (index) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
  };

  const totalSum = expenses.reduce((sum, expense) => sum + expense.Amount, 0) +
    newexp.reduce((sum, expense) => sum + expense.Amount, 0);

  return (
    <div>
      <h4 className="heading"> Meedo Expense Tracker 💵</h4>
      <p className="cont">Track your Expenses with Meedo</p>
      <div className="expense-container">
        <div className="form-container">
          <div className="form">
            <form onSubmit={handleAddOrUpdateExpense}>
              <table>
                <tbody>
                  <tr>
                    <td>Date:</td>
                    <td>
                      <input
                        required
                        type="text"
                        className="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Category:</td>
                    <td>
                      <select
                        className="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Food">Food</option>
                        <option value="Travel">Travel</option>
                        <option value="Convenience Store">Convenience Store</option>
                        <option value="Shopping">Shopping</option>
                        <option value="sports">Sports</option>
                        <option value="Others">Others</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td>Amount:</td>
                    <td>
                      <input
                        required
                        type="text"
                        className="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <button className="button" type="submit">
                {editingIndex !== null ? "Update Expense" : "Add Expense"}
              </button>
            </form>
          </div>
        </div>
        <div className="table-container">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={index}>
                  <td>{expense.Date}</td>
                  <td>{expense.Category}</td>
                  <td>{expense.Amount.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEditExpense(index)} className="edit">Edit</button>
                    <button onClick={() => handleDeleteExpense(index, "expenses")} className="delete">Delete</button>
                  </td>
                </tr>
              ))}
              {newexp.map((expense, index) => (
                <tr key={index + expenses.length}>
                  <td>{expense.Date}</td>
                  <td>{expense.Category}</td>
                  <td>{expense.Amount.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleEditExpense(index)} className="edit">Edit</button>
                    <button onClick={() => handleDeleteExpense(index, "newexp")} className="delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className="total">Total Sum : <span>{totalSum.toFixed(2)}</span></h4>
        </div>
      </div>
    </div>
  );
};

export default Expense;
