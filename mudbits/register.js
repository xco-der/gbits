
//+++++++++++++++++++++++++++++++++++++++ REGISTER USER ++++++++++++++++++++++++++++++++++++++++++++++++++++++

const register_btn = document.getElementById('cr');

document.getElementById('register').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    iziToast.info({
      title: 'Info',
      message: 'Please wait while an account is being created for you',
      position: 'topRight'
    })
    // Get form data
    const formData = new FormData(this);

    register_btn.disabled = true;

    // Simulated endpoint for login (replace this with your actual endpoint)
    const loginEndpoint = 'http://127.0.0.1:8000';
    console.log(JSON.stringify({
      'username': formData.get('username'), 
      'password': formData.get('password'),
      "email": formData.get("email"),
      "fullname": formData.get("fullname"),
      "code": formData.get('code'),
      "bitcoin_wallet": formData.get('bitcoin_wallet'),
      "ether_wallet": formData.get('ether_wallet'),
    }))
   
    
    // Simulated login request
    fetch(`${loginEndpoint}/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'username': formData.get('username'), 
        'password': formData.get('password'),
        "email": formData.get("email"),
        "fullname": formData.get("fullname"),
        "code": formData.get('code'),
        "bitcoin_wallet": formData.get('bitcoin_wallet'),
        "ether_wallet": formData.get('ether_wallet'),
      })
    })
    .then(response => {
      if (!response.ok) {
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong, please try again',
          position: 'topRight'
        })
        login_btn.disabled = false;

        throw new Error('Signup failed.');
      }
      return response.json();
    })
    .then(data => {
      // Simulated successful login
      console.log('Login successful:', data);
      // Store the authentication status in localStorage
      localStorage.setItem("globalbits", "true");
      localStorage.setItem("gbits_id", formData.get('username'));
      localStorage.setItem("btc", formData.get('bitcoin_wallet'));
      localStorage.setItem("eth", formData.get('ether_wallet'));


      
      iziToast.info({
        title: 'Info',
        message: 'Account Created Succesfully',
        position: 'topRight'
      })

        // Redirect to the dashboard upon successful login
      window.location.href = 'login.html';
    })

  });
  


