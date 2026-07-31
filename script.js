// ===============================
// Expense Tracker Pro
// Part 1
// ===============================

// Elements
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const date = document.getElementById("date");
const category = document.getElementById("category");
const type = document.getElementById("type");

const form = document.getElementById("transactionForm");

const list = document.getElementById("list");

const search = document.getElementById("search");

const filter = document.getElementById("filter");

const themeBtn = document.getElementById("themeBtn");

const exportCSV = document.getElementById("exportCSV");

// Array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Load Data
displayTransactions();

updateSummary();

// Form Submit
form.addEventListener("submit", function (e) {

    e.preventDefault();

    if (
        text.value.trim() === "" ||
        amount.value === "" ||
        date.value === "" ||
        category.value === ""
    ) {

        alert("Please fill all fields.");

        return;
    }

    const transaction = {

        id: Date.now(),

        description: text.value.trim(),

        amount: Number(amount.value),

        date: date.value,

        category: category.value,

        type: type.value

    };

    transactions.push(transaction);

    saveTransactions();

    displayTransactions();

    updateSummary();

    form.reset();

});

function displayTransactions(data = transactions) {

    list.innerHTML = "";

    if (data.length === 0) {

        list.innerHTML = "<p>No Transactions Found</p>";

        return;

    }

    data.forEach(function (transaction) {

        const li = document.createElement("li");

        li.innerHTML = `

        <div class="transaction-details">

            <h3>${transaction.description}</h3>

            <p><strong>₹${transaction.amount}</strong></p>

            <p>${transaction.category}</p>

            <p>${transaction.date}</p>

            <p>${transaction.type}</p>

        </div>

        <div class="transaction-buttons">

            <button
            class="edit-btn"
            onclick="editTransaction(${transaction.id})">

            Edit

            </button>

            <button
            class="delete-btn"
            onclick="deleteTransaction(${transaction.id})">

            Delete

            </button>

        </div>

        `;

        list.appendChild(li);

    });

}
function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function(transaction){

        if(transaction.type === "income"){
            totalIncome += transaction.amount;
        }else{
            totalExpense += transaction.amount;
        }

    });

    const totalBalance = totalIncome - totalExpense;

    balance.innerText = "₹" + totalBalance;
    income.innerText = "₹" + totalIncome;
    expense.innerText = "₹" + totalExpense;

}

function deleteTransaction(id){

    transactions = transactions.filter(function(transaction){

        return transaction.id !== id;

    });

    saveTransactions();

    displayTransactions();

    updateSummary();

}

function editTransaction(id){

    const transaction = transactions.find(function(item){

        return item.id === id;

    });

    if(!transaction){

        return;

    }

    text.value = transaction.description;

    amount.value = transaction.amount;

    date.value = transaction.date;

    category.value = transaction.category;

    type.value = transaction.type;

    transactions = transactions.filter(function(item){

        return item.id !== id;

    });

    saveTransactions();

    displayTransactions();

    updateSummary();

}

function saveTransactions(){

    localStorage.setItem(

        "transactions",

        JSON.stringify(transactions)

    );

}
// ===============================
// Search Functionality
// ===============================

search.addEventListener("keyup", function () {

    const keyword = search.value.toLowerCase().trim();

    const filteredTransactions = transactions.filter(function (transaction) {

        return (
            transaction.description.toLowerCase().includes(keyword) ||
            transaction.category.toLowerCase().includes(keyword)
        );

    });

    displayTransactions(filteredTransactions);

});

// ===============================
// Filter Functionality
// ===============================

filter.addEventListener("change", function () {

    const value = filter.value;

    if (value === "all") {

        displayTransactions(transactions);

    } else {

        const filteredTransactions = transactions.filter(function (transaction) {

            return transaction.type === value;

        });

        displayTransactions(filteredTransactions);

    }

});

// ===============================
// Dark Mode
// ===============================

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.innerText = "☀️ Light Mode";

    } else {

        themeBtn.innerText = "🌙 Dark Mode";

    }

});

// ===============================
// Export CSV
// ===============================

exportCSV.addEventListener("click", function () {

    let csv =
        "Description,Amount,Category,Date,Type\n";

    transactions.forEach(function (transaction) {

        csv +=
            transaction.description + "," +
            transaction.amount + "," +
            transaction.category + "," +
            transaction.date + "," +
            transaction.type + "\n";

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "transactions.csv";

    a.click();

    window.URL.revokeObjectURL(url);

});
// ===============================
// Expense Pie Chart
// ===============================

let expenseChart = null;

function updateChart() {

    const categoryTotals = {};

    transactions.forEach(function(transaction) {

        if (transaction.type === "expense") {

            if (categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] += transaction.amount;

            } else {

                categoryTotals[transaction.category] = transaction.amount;

            }

        }

    });

    const labels = Object.keys(categoryTotals);

    const values = Object.values(categoryTotals);

    const canvas = document.getElementById("expenseChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (expenseChart) {

        expenseChart.destroy();

    }

    expenseChart = new Chart(ctx, {

        type: "pie",

        data: {

            labels: labels,

            datasets: [{

                data: values,

                backgroundColor: [
                    "#3498db",
                    "#2ecc71",
                    "#f39c12",
                    "#9b59b6",
                    "#e74c3c",
                    "#1abc9c",
                    "#34495e",
                    "#e67e22"
                ]

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    position: "right"

                }

            }

        }

    });

}



function refreshUI() {

    displayTransactions();

    updateSummary();

    updateChart();

}



refreshUI();