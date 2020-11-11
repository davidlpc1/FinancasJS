const transactionsUl = document.querySelector('#transactionsUl');
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const screenError = document.querySelector('#error-screen')
const imgCloseScreenError = document.querySelector('#close-window-img')
let localHref = location.href;

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage
    .getItem('transactions') !== null 
    ? localStorageTransactions 
    : [] ;
    
const removeTransaction = ID => {
    transactions = transactions
        .filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}
const addTransactionsIntoDOM = ({ amount , name , id }) => {
    const operator = amount < 0 ? '-' : '+';
    const CSSClassList = amount < 0 ? 'minus' : 'plus';
    const li = document.createElement('li');
    const amountWithoutOperator = Math.abs(amount);

    li.classList.add(CSSClassList);
    li.innerHTML = `
    ${name} 
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>`;

    transactionsUl.append(li)
};

const getExpenses = transactionsAmounts => Math.abs(
    transactionsAmounts
        .filter( amount => amount < 0)
        .reduce((sum,value) => sum + value, 0)
        ).toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
        .filter( amount => amount > 0)
        .reduce((sum,value) => sum + value, 0)
        .toFixed(2);

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((sum,amount) => sum + amount ,0)
    .toFixed(2);

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({amount}) => amount);
    const total = getTotal(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expenseDisplay.textContent = `R$ ${expense}`;
}

const init = () => {
    transactionsUl.innerHTML = '';
    transactions.forEach(addTransactionsIntoDOM);
    updateBalanceValues();
}

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000) 

const addToTransactionsArray = (transactionName,transactionAmount) => {
    transactions.push({
        id:generateID() , 
        name: transactionName, 
        amount: Number(transactionAmount)
    });
}

const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
}

const alterScreenError = ({ height, width , valueOfTransform }) => {
    screenError.style.height = `${height}px`;
    screenError.style.width = `${width}px`;
    screenError.style.transform = `translate(${valueOfTransform}rem)`
}

const runScreenError = () => {
    let valueInScreenRun = { 
        height:230 ,
        width: 310,
        valueOfTransform: 1
    }

    alterScreenError(valueInScreenRun)
    location.href = `${localHref}#error-screen`
}

const closeScreenError = () => {
    let valueInScreenClose = { 
        height:0,
        width: 0,
        valueOfTransform: -50
    }

    alterScreenError(valueInScreenClose)
    location.href = localHref;
}

const handleFormSubmit = event => {
    event.preventDefault();

    const transactionName = inputTransactionName.value.trim();
    const transactionAmount =  inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if(isSomeInputEmpty){
        runScreenError();
        return
    }

    addToTransactionsArray(transactionName,transactionAmount)
    init();
    updateLocalStorage();
    cleanInputs();
    closeScreenError();
}

init()
imgCloseScreenError.addEventListener('click',closeScreenError)
form.addEventListener('submit',handleFormSubmit)