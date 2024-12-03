document.addEventListener('DOMContentLoaded', initTableData);

async function initTableData() {
  try {
    // Replace with your API endpoint
    const response = await fetch('http://localhost:1337/api/tower-controls');
    const respJson = await response.json();
    const controls = respJson.data[0].values;

    // Populate the table with data
    const tableBody = document.getElementById('dynamicTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    controls.forEach((item, index) => {
      const newRow = tableBody.insertRow();

      // Create cells
      const cell1 = newRow.insertCell(0);
      const cell2 = newRow.insertCell(1);
      const cell3 = newRow.insertCell(2);
      const cell4 = newRow.insertCell(3);

      // Populate cells
      cell1.className = 'row-number'; // Assign a class to update later
      cell1.innerHTML = index + 1; // Row number
      cell2.innerHTML = `<input type="text" class="border rounded-md px-3 py-2 w-24" value="${item.state}" placeholder="ex: 1001">`;
      cell3.innerHTML = `<input type="number" class="border rounded-md px-3 py-2 w-20" value="${item.delay}" placeholder="ms">`;
      cell4.innerHTML = `<button class="text-red-600" onclick="deleteRow(this)">Delete</button>`;
    });
  } catch (error) {
    console.error('Error initializing table data:', error);
    alert('Failed to load initial table data. Please try again later.');
  }
}

function addRow() {
    const table = document.getElementById('dynamicTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Create cells
    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);

    // Populate cells
    cell1.className = 'row-number'; // Assign a class to update later
    cell1.innerHTML = table.rows.length; // Row number
    cell2.innerHTML = `<input type="text" class="border rounded-md px-3 py-2 w-24" placeholder="ex: 1001">`;
    cell3.innerHTML = `<input type="number" class="border rounded-md px-3 py-2 w-20" placeholder="ms">`;
    cell4.innerHTML = `<button class="text-red-600" onclick="deleteRow(this)">Delete</button>`;
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    const table = row.parentNode;

    // Remove the row
    table.removeChild(row);

    // Update row numbers
    updateRowNumbers();
}

function updateRowNumbers() {
    const rows = document.querySelectorAll('#dynamicTable tbody tr');
    rows.forEach((row, index) => {
      row.querySelector('.row-number').innerHTML = index + 1;
    });
}



function sendTableData() {
    const rows = document.querySelectorAll('#dynamicTable tbody tr');
    const data = [];

    rows.forEach(row => {
      const state = row.querySelector('input[type="text"]').value.trim();
      const delay = row.querySelector('input[type="number"]').value.trim();

      if (state && delay) { // Only include rows with valid input
        data.push({
          state: state,
          delay: parseInt(delay, 10)
        });
      }
    });

    // Check if data is present
    if (data.length === 0) {
      alert("No valid data to send.");
      return;
    }

    window.ws.send(JSON.stringify({
      type: "controlPut",
      values: data
    }));

    alert("Controls sent successfully");
}