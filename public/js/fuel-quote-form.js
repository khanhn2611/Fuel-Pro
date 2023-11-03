document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fuelQuoteForm');
    const gallonsRequestedInput = document.getElementById('gallonsRequested');
    const suggestedPriceInput = document.getElementById('suggestedPrice');
    const totalAmountDueInput = document.getElementById('totalAmountDue');
    const cityInput = document.getElementById('city'); 
    const submitMessage = document.getElementById('submitMessage'); 

    gallonsRequestedInput.addEventListener('input', calculateQuote);
    async function calculateQuote() {
        console.log('Calculating quote...'); 
        const gallonsRequested = parseFloat(gallonsRequestedInput.value);
        if (gallonsRequested) {
            // Price calculation
            console.log('Gallons requested:', gallonsRequested); 
            const pricePerGallon = await calculatePricePerGallon(gallonsRequested);
            console.log('Price per gallon:', pricePerGallon); 
            suggestedPriceInput.value = pricePerGallon.toFixed(2);
            totalAmountDueInput.value = (gallonsRequested * pricePerGallon).toFixed(2);
        }
    }

    // Function to calculate the price per gallon
    async function calculatePricePerGallon(gallonsRequested) {
        const basePrice = 1.50; 
        const city = cityInput.value; 
        const locationFactor = city === 'Texas' ? 0.02 : 0.04;
        const hasHistory = await checkClientHistory(); 

        const rateHistoryFactor = hasHistory ? 0.01 : 0.00;
        const gallonsRequestedFactor = gallonsRequested > 1000 ? 0.02 : 0.03;
        const companyProfitFactor = 0.10;

        // Calculate the margin
        const margin = basePrice * (locationFactor - rateHistoryFactor + gallonsRequestedFactor + companyProfitFactor);
        return basePrice + margin;
    }

    async function checkClientHistory() {
        return false;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        calculateQuote(); 
    
        const submitMessage = document.getElementById('submitMessage');
        if (submitMessage) {
            submitMessage.textContent = 'Quote submitted!';
            submitMessage.style.display = 'block';
        } else {
            console.error('submitMessage element not found');
        }
        const formData = {
            gallonsRequested: gallonsRequestedInput.value,
            suggestedPricePerGallon: suggestedPriceInput.value,
            totalAmountDue: totalAmountDueInput.value,
        };

        fetch('/quote', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            gallonsRequested: document.getElementById('gallonsRequested').value,
            deliveryAddress: document.getElementById('deliveryAddress').value, 
            deliveryDate: document.getElementById('deliveryDate').value, 
            suggestedPricePerGallon: document.getElementById('suggestedPrice').value,
            totalAmountDue: document.getElementById('totalAmountDue').value,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok.');
            }
        })
        .then(data => console.log(data))
    });
});
