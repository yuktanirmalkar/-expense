const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

form.addEventListener('submit', addTransaction);


function addTransaction(e) {
  e.preventDefault();
  if (text.value.trim() === '' || amount.value.trim() === '' || date.value.trim() === '') {
    alert('Please add text, amount, and date');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = '';
    amount.value = '';
    date.value = '';
  }
}


function generateID() {
  return Math.floor(Math.random() * 100000000);
}


function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span> <span>${formatDate(transaction.date)}</span>
    <button class="edit-btn" onclick="editTransaction(${transaction.id})"></button>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})"></button>
`;

  list.appendChild(item);
}


function editTransaction(id) {
  const transaction = transactions.find(t => t.id === id);
  text.value = transaction.text;
  amount.value = transaction.amount;
  date.value = transaction.date;

  removeTransaction(id);
}


function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();

}


function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}


function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
}


function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();
