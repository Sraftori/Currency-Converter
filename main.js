const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const swapBtn = document.getElementById("swap-btn");
const convertBtn = document.getElementById("convert-btn");
const resultBox = document.getElementById("exchange-result");
const amountEntered = document.getElementById("amount-entered");
const rateResult = document.getElementById("rate-result");

async function currency() {
    try {
        const response = await fetch("https://api.frankfurter.dev/v1/currencies");
        const data = await response.json();

        fromSelect.innerHTML = "";
        toSelect.innerHTML = "";

        // Object.entries lists what's inside the array
        Object.entries(data).forEach(([code, name]) => {
            const option1 = document.createElement("option");
            option1.value = code;
            option1.textContent = `${code} - ${name}`;

            const option2 = document.createElement("option");
            option2.value = code;
            option2.textContent = `${code} - ${name}`;

            fromSelect.appendChild(option1);
            toSelect.appendChild(option2);
        });

        fromSelect.value = "USD";
        toSelect.value = "EUR";

    } catch (error) {
        console.error("Failed to find currencies:", error);
    }
} 

swapBtn.addEventListener("click", () => {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
});

convertBtn.addEventListener("click", async () => {
    let amount = amountInput.value;
    const from = fromSelect.value;
    const to = toSelect.value;

    if (amount === "" || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount greater than 0.");
        return;
    }
    
    const originalText = convertBtn.textContent;
    convertBtn.textContent = "Converting... please wait";
    convertBtn.disabled = true;

    try {
        const url = `https://api.frankfurter.dev/v1/latest?amount=${amount}&base=${from}&symbols=${to}`;
        const response = await fetch(url);
        const data = await response.json();
        const convertedRate = data.rates[to];

        resultBox.hidden = false;
        amountEntered.textContent = `${amount} ${from}`;
        
        rateResult.textContent = `${convertedRate.toFixed(2)} ${to}`;
    } catch (error) {
        console.error("Failed to convert", error);
        alert("Unable to find exchange rate. Please try again.");
    } finally {
        convertBtn.textContent = originalText;
        convertBtn.disabled = false;
    }
});

currency();