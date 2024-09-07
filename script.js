document.addEventListener('DOMContentLoaded', () => {
  const inventoryData = [
      { id: 1, name: 'Product A', category: 'Category 1', supplier: 'Supplier X', stock: 50 },
      { id: 2, name: 'Product B', category: 'Category 2', supplier: 'Supplier Y', stock: 30 },
      { id: 3, name: 'Product C', category: 'Category 1', supplier: 'Supplier Z', stock: 20 },
      { id: 4, name: 'Product D', category: 'Category 2', supplier: 'Supplier X', stock: 40 },
      { id: 5, name: 'Product E', category: 'Category 1', supplier: 'Supplier Y', stock: 60 },
      // Add more items as needed
  ];

  const categories = ['Category 1', 'Category 2'];
  const suppliers = ['Supplier X', 'Supplier Y', 'Supplier Z'];

  // Populate category and supplier filters
  const categoryFilter = document.getElementById('category-filter');
  const supplierFilter = document.getElementById('supplier-filter');

  categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
  });

  suppliers.forEach(supplier => {
      const option = document.createElement('option');
      option.value = supplier;
      option.textContent = supplier;
      supplierFilter.appendChild(option);
  });

  // Populate inventory table
  const tableBody = document.querySelector('#inventory-table tbody');
  function renderTable(data) {
      tableBody.innerHTML = ''; // Clear existing rows
      data.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.name}</td>
              <td>${item.category}</td>
              <td>${item.supplier}</td>
              <td class="stock-level ${item.stock < 20 ? 'low' : item.stock < 50 ? 'moderate' : 'sufficient'}">${item.stock}</td>
              <td>
                  <button class="edit-btn">Edit</button>
                  <button class="delete-btn">Delete</button>
              </td>
          `;
          tableBody.appendChild(row);
      });
  }
  renderTable(inventoryData);

  // Chart.js configuration
  const pieCtx = document.getElementById('pieChart').getContext('2d');
  new Chart(pieCtx, {
      type: 'pie',
      data: {
          labels: ['Category 1', 'Category 2'],
          datasets: [{
              data: [50, 30], // Example data
              backgroundColor: ['#6995cd', '#af72a7'], // Light Pink and Green
              hoverBackgroundColor: ['#af72a7', '#54a9a1']
          }],
      },
      options: {
          responsive: true,
          plugins: {
              legend: {
                  position: 'top',
              },
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          return `${tooltipItem.label}: ${tooltipItem.raw}`;
                      },
                  },
              },
          },
      },
  });

  const barCtx = document.getElementById('barChart').getContext('2d');
  new Chart(barCtx, {
      type: 'bar',
      data: {
          labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
          datasets: [{
              label: 'Stock Level',
              data: [50, 30, 20, 40, 60], // Example data
              backgroundColor: '#364b9e', // Bright Blue
              borderColor: '##9370a5', // Darker Blue
              borderWidth: 1,
          }],
      },
      options: {
          responsive: true,
          scales: {
              x: {
                  beginAtZero: true,
                  ticks: {
                      color: '#333',
                  },
              },
              y: {
                  beginAtZero: true,
                  ticks: {
                      color: '#333',
                  },
              },
          },
          plugins: {
              legend: {
                  position: 'top',
              },
              tooltip: {
                  callbacks: {
                      label: function(tooltipItem) {
                          return `${tooltipItem.label}: ${tooltipItem.raw}`;
                      },
                  },
              },
          },
      },
  });

  // Sorting table
  window.sortTable = (n) => {
      const table = document.getElementById("inventory-table");
      let rows, switching, i, x, y, shouldSwitch, dir, switchCount = 0;
      let switchRows = true;
      dir = "asc";
      while (switchRows) {
          switching = false;
          rows = table.rows;
          for (i = 1; i < (rows.length - 1); i++) {
              shouldSwitch = false;
              x = rows[i].getElementsByTagName("TD")[n];
              y = rows[i + 1].getElementsByTagName("TD")[n];
              if (dir == "asc") {
                  if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                      shouldSwitch = true;
                      break;
                  }
              } else if (dir === "desc") {
                  if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                      shouldSwitch = true;
                      break;
                  }
              }
          }
          if (shouldSwitch) {
              rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
              switching = true;
              switchCount++;
          } else {
              if (switchCount === 0 && dir === "asc") {
                  dir = "desc";
                  switchRows = true;
              }
          }
      }
  }

  // Pagination logic
  let currentPage = 1;
  const rowsPerPage = 5;
  const tableRows = Array.from(document.querySelectorAll('#inventory-table tbody tr'));
  let totalPages = Math.ceil(tableRows.length / rowsPerPage);

  function displayPage(page) {
      tableRows.forEach((row, index) => {
          row.style.display = (index >= (page - 1) * rowsPerPage && index < page * rowsPerPage) ? '' : 'none';
      });
      document.getElementById('page-info').textContent = `Page ${page} of ${totalPages}`;
      document.getElementById('prev-btn').disabled = page === 1;
      document.getElementById('next-btn').disabled = page === totalPages;
  }

  document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentPage > 1) {
          currentPage--;
          displayPage(currentPage);
      }
  });

  document.getElementById('next-btn').addEventListener('click', () => {
      if (currentPage < totalPages) {
          currentPage++;
          displayPage(currentPage);
      }
  });

  displayPage(currentPage);

  // Filter functionality
  categoryFilter.addEventListener('change', applyFilters);
  supplierFilter.addEventListener('change', applyFilters);

  function applyFilters() {
      const category = categoryFilter.value;
      const supplier = supplierFilter.value;

      const filteredData = inventoryData.filter(item => {
          return (category === '' || item.category === category) &&
                 (supplier === '' || item.supplier === supplier);
      });

      renderTable(filteredData);
      // Recalculate pagination
      const filteredRows = Array.from(document.querySelectorAll('#inventory-table tbody tr'));
      totalPages = Math.ceil(filteredRows.length / rowsPerPage);
      currentPage = 1;
      displayPage(currentPage);
  }
});
