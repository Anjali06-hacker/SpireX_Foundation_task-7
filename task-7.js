/*  Currency Converter
    This JavaScript file:
    1. Gets the user's input
    2. Gets exchange rates from an API
    3. Calculates the converted amount
    4. Displays the result  */
// Getting elements from the HTML
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertButton = document.getElementById("convertButton");
const result = document.getElementById("result");
const rateInfo = document.getElementById("rateInfo");
const statusMessage = document.getElementById("statusMessage");
// API URL
// The selected "from" currency will be added at the end.
const apiURL = "https://open.er-api.com/v6/latest/";
// Function to convert currency
async function convertCurrency() {
    // Get the amount entered by the user
    const amount = Number(amountInput.value);
    // Get selected currencies
    const from = fromCurrency.value;
    const to = toCurrency.value;
    // Clear previous status message
    statusMessage.textContent = "";
    // Check whether the amount is valid
    if (!amount || amount <= 0) {
        statusMessage.textContent =
            "Please enter a valid amount.";
        return;
    }
    // Show loading message
    statusMessage.textContent =
        "Getting latest exchange rate...";
    try {
        /*  Fetch exchange-rate data from the API.
            Example:
            https://open.er-api.com/v6/latest/USD
            This returns exchange rates with USD
            as the base currency.        */
        const response = await fetch(apiURL + from);
        // Check whether the API request was successful
        if (!response.ok) {
            throw new Error("Unable to connect to the API.");
        }
        // Convert API response into JavaScript object
        const data = await response.json();
        // Check API result
        if (data.result !== "success") {
            throw new Error("Exchange rate data is unavailable.");
        }
        /*  Get the exchange rate for the selected
            target currency.        */
        const exchangeRate = data.rates[to];
        // Check whether the selected currency exists
        if (!exchangeRate) {
            throw new Error("Selected currency is not supported.");
        }
        // Calculate converted amount
        const convertedAmount = amount * exchangeRate;
        // Display the converted amount
        result.textContent =
            convertedAmount.toFixed(2) + " " + to;
        // Display exchange rate
        rateInfo.textContent =
            "1 " + from + " = " +
            exchangeRate.toFixed(4) + " " + to;
        // Remove loading message
        statusMessage.textContent = "";
    } catch (error) {
        /*  If something goes wrong,
            display an error message.        */
        statusMessage.textContent =
            "Unable to get exchange rates. Please try again.";
        result.textContent = "0.00";
        rateInfo.textContent = "";
        console.error(error);
    }
}
// Run the conversion when the button is clicked
convertButton.addEventListener("click", convertCurrency);
// Also allow Enter key inside the amount field
amountInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        convertCurrency();
    }
});