
// Function to fetch data and populate the table
function fetchData() {
  fetch('http://localhost:2025/getAll')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.getElementById('table-body');
      let tableRows = '';
      data.forEach(item => {
        tableRows += `<tr>
                        <td>${item.User_name}</td>
                        <td>${item.user_id}</td>
                        <td>${item.product_name}</td>
                        <td>${item.product_img}</td>
                        <td>${item.product_id}</td>
                        <td>${item.product_description}</td>
                        <td>${item.product_url}</td>
                        <td>${item.product_link}</td>
                        <td>${item.starting_price}</td>
                        <td>${item.price_range}</td>
                      </tr>`;



            
      });
      tableBody.innerHTML = tableRows;
    })
    .catch(error => console.error('Error:', error));
}

// Call the function to fetch data and populate the table
fetchData();

