const isLoggedIn = localStorage.getItem("globalbits");
    const username = localStorage.getItem("gbits_id");
    const btc = localStorage.getItem("btc")
    const eth = localStorage.getItem("eth")

    const loginEndpoint = 'https://globalbits-server.onrender.com';

  if (isLoggedIn === "true" && username && btc) {
    document.getElementById("user2").innerText = username;
    document.getElementById("user").innerText = `Hi, ${username}`;
    document.getElementById("ref").innerHTML =`https://globalbits.com/?ref=${username} `
  }else{

    fetch(`${loginEndpoint}/dashboard/${username}`) // Replace URL with your API endpoint
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      //return response.json();
      return response.json();

    })
    .then(data => {
      // Once data is fetched, handle and display it
      displayUserData(data);
      console.log("log is",data)

    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }

  function displayUserData(res) {
      if (isLoggedIn === "true" && username) {
        const data = JSON.parse(res.data)
        document.getElementById("user").innerText = username;
        document.getElementById("ref").innerHTML =`https://globalbits.com/?ref=${username} `
        document.getElementById("balance").innerText = `$${data.balance}.00`;
        document.getElementById("deposits").innerText = `$${data.deposits}.00`;
        document.getElementById("withdrawals").innerText = `$${data.withdrawals}.00`;
      } else {
        // Redirect to the login.html page if the user is not logged in
        window.location.href = "login.html";
      }
  
    }