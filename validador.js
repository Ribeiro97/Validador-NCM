function validateNCM() {
    const xmlFile = document.getElementById('xmlFile').files[0];
    const csvFile = document.getElementById('csvFile').files[0];

    if (!xmlFile || !csvFile) {
        alert('Selecione um arquivo XML e um arquivo CSV.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const xmlContent = e.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');

        const items = xmlDoc.querySelectorAll('det');

        const resultArray = [];

        items.forEach(item => {
            const cprod = getItemValue(item, 'cProd');
            const xprod = getItemValue(item, 'xProd');
            const ncm = getItemValue(item, 'NCM');

            resultArray.push({ cprod, xprod, ncm });
        });

        const csvReader = new FileReader();

        csvReader.onload = function (e) {
            const csvContent = e.target.result;
            const csvLines = csvContent.split('\n');
            const csvNCMs = [];

            for (const line of csvLines) {
                const csvData = line.split(',');

                if (csvData.length > 0) {
                    const ncmFromCSV = parseFloat(csvData[0].trim());
                    csvNCMs.push(ncmFromCSV);
                }
            }

            const validProducts = [];
            const invalidProducts = [];

            resultArray.forEach(result => {
                const isValid = csvNCMs.includes(parseFloat(result.ncm));
                if (isValid) {
                    validProducts.push(result);
                } else {
                    invalidProducts.push(result);
                }
            });

            const validTableRows = validProducts.map(result => {
                return `<tr>
                            <td>${result.cprod}</td>
                            <td>${result.xprod}</td>
                            <td>${result.ncm}</td>
                        </tr>`;
            }).join('');

            const invalidTableRows = invalidProducts.map(result => {
                return `<tr>
                            <td>${result.cprod}</td>
                            <td>${result.xprod}</td>
                            <td>${result.ncm}</td>
                        </tr>`;
            }).join('');

            displayValidationResult(validTableRows, invalidTableRows);
        };

        csvReader.readAsText(csvFile);
    };

    reader.readAsText(xmlFile);
}

function getItemValue(item, tagName) {
    const tag = item.querySelector(tagName);
    return tag ? tag.textContent.trim() : 'Tag não encontrada';
}

function displayValidationResult(validTableRows, invalidTableRows) {
    const validContainer = document.getElementById('ncmInCSV');
    validContainer.innerHTML = `
        <h2>Produtos Válidos:</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Cód. Prod</th>
                        <th>Produto</th>
                        <th>NCM</th>
                    </tr>
                </thead>
                <tbody>
                    ${validTableRows || '<tr><td colspan="3">Nenhum produto válido.</td></tr>'}
                </tbody>
            </table>
        </div>`;

    const invalidContainer = document.getElementById('ncmNotInCSV');
    invalidContainer.innerHTML = `
        <h2>Produtos Inválidos:</h2>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Cód. Prod</th>
                        <th>Produto</th>
                        <th>NCM</th>
                    </tr>
                </thead>
                <tbody>
                    ${invalidTableRows || '<tr><td colspan="3">Nenhum produto inválido.</td></tr>'}
                </tbody>
            </table>
        </div>`;
}

// Adicionei este trecho para adicionar um evento de clique ao botão.
document.getElementById('submitBtn').addEventListener('click', validateNCM);
