function addEntry() {
    const name = document.getElementById('name').value;
    const product = document.getElementById('product').value;
    const action = document.getElementById('action').value;

    if (name && product && action) {
        const now = new Date();
        const dateTime = now.toLocaleString(); // Captura a data e hora atual

        const entry = { dateTime, name, product, action };

        // Armazena os dados no Local Storage
        let entries = JSON.parse(localStorage.getItem('productionEntries')) || [];
        entries.push(entry);
        localStorage.setItem('productionEntries', JSON.stringify(entries));

        document.getElementById('productionForm').reset();
        alert('Apontamento adicionado com sucesso.');
    } else {
        alert('Por favor, preencha todos os campos.');
    }
}

function loadEntries() {
    let entries = JSON.parse(localStorage.getItem('productionEntries')) || [];
    const table = document.getElementById('productionTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Limpa a tabela antes de carregar os dados

    entries.forEach((entry, index) => {
        const newRow = table.insertRow();

        const cell0 = newRow.insertCell(0);
        const cell1 = newRow.insertCell(1);
        const cell2 = newRow.insertCell(2);
        const cell3 = newRow.insertCell(3);
        const cell4 = newRow.insertCell(4);

        cell0.innerHTML = `<input type="checkbox" data-index="${index}">`;
        cell1.innerHTML = entry.dateTime;
        cell2.innerHTML = entry.name;
        cell3.innerHTML = entry.product;
        cell4.innerHTML = entry.action;
    });
}

function deleteSelectedRows() {
    let entries = JSON.parse(localStorage.getItem('productionEntries')) || [];
    let deletedEntries = JSON.parse(localStorage.getItem('deletedEntries')) || [];
    const table = document.getElementById('productionTable').getElementsByTagName('tbody')[0];
    const checkboxes = table.querySelectorAll('input[type="checkbox"]:checked');

    checkboxes.forEach(checkbox => {
        const index = checkbox.getAttribute('data-index');
        const deletedEntry = entries.splice(index, 1)[0];
        deletedEntries.push(deletedEntry);
    });

    localStorage.setItem('productionEntries', JSON.stringify(entries));
    localStorage.setItem('deletedEntries', JSON.stringify(deletedEntries));

    loadEntries();
    loadDeletedEntries();
}

function loadDeletedEntries() {
    let deletedEntries = JSON.parse(localStorage.getItem('deletedEntries')) || [];
    const table = document.getElementById('deletedTable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Limpa a tabela antes de carregar os dados

    deletedEntries.forEach(entry => {
        const newRow = table.insertRow();

        const cell1 = newRow.insertCell(0);
        const cell2 = newRow.insertCell(1);
        const cell3 = newRow.insertCell(2);
        const cell4 = newRow.insertCell(3);

        cell1.innerHTML = entry.dateTime;
        cell2.innerHTML = entry.name;
        cell3.innerHTML = entry.product;
        cell4.innerHTML = entry.action;
    });
}

function exportToExcel() {
    const table = document.getElementById('productionTable');
    const rows = table.rows;

    let csvContent = "data:text/csv;charset=utf-8,";
    for (let row of rows) {
        let cols = row.querySelectorAll('td, th');
        let rowContent = [];
        for (let col of cols) {
            rowContent.push(col.textContent);
        }
        csvContent += rowContent.join(",") + "\n";
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "production_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Chama a função loadEntries e loadDeletedEntries na página de visualização
if (window.location.pathname.includes('view.html')) {
    window.onload = () => {
        loadEntries();
        loadDeletedEntries();
    };
}
