document.addEventListener('DOMContentLoaded', function () {
    const displayQuotesButton = document.getElementById('displayQuotesButton');
    const quotesTable = document.getElementById('quotesTable');

    displayQuotesButton.addEventListener('click', function () {
        fetch('/get-quote-history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (Array.isArray(data)) {
                const table = createTable(data);
                quotesTable.innerHTML = "";
                quotesTable.appendChild(table);
            } else {
                console.error('Received data is not an array:', data);
                quotesTable.innerText = 'No quotes history available.';
            }
        })
        .catch(error => {
            console.error('Error fetching quote history:', error);
            quotesTable.innerText = `Failed to load quote history: ${error.message}`;
        });
    });
    
    function createTable(quotes) {
        const table = document.createElement('table');
        table.className = 'quotes-table';
        
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        
        const headerRow = document.createElement('tr');
        ['User ID', 'Gallons Requested', 'Delivery Address', 'Delivery Date', 'Suggested Price/Gal', 'Total Amount Due'].forEach(text => {
            const th = document.createElement('th');
            th.appendChild(document.createTextNode(text));
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        
        quotes.forEach(quote => {
            const tr = document.createElement('tr');
            [
                { key: 'userId', process: data => data.toString() },
                { 
                    key: 'gallonsRequested', 
                    process: data => {
                        const num = Number(data);
                        return !isNaN(num) ? num.toFixed(2) + ' gal' : 'N/A';
                    }
                },
                { key: 'deliveryAddress', process: data => data },
                { 
                    key: 'deliveryDate', 
                    process: data => new Date(data).toLocaleDateString() 
                },
                { 
                    key: 'suggestedPricePerGallon', 
                    process: data => {
                        const num = Number(data);
                        return !isNaN(num) ? '$' + num.toFixed(2) : 'N/A';
                    }
                },
                { 
                    key: 'totalAmountDue', 
                    process: data => {
                        const num = Number(data);
                        return !isNaN(num) ? '$' + num.toFixed(2) : 'N/A';
                    }
                }
            ].forEach(({ key, process }) => {
                const td = document.createElement('td');
                td.appendChild(document.createTextNode(process(quote[key])));
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        
        table.appendChild(thead);
        table.appendChild(tbody);
        return table;
    }
});
