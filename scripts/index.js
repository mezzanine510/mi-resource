//Search API

// This API accepts POST requests and requires a HTTP Basic authorization header. The API accepts a JSON object in the request body as input. The “full text” search filter is named “q”. The field level search filters generally take the form of [property name]_[operator], where operator is “Equals”, “Matches”, “Exists”, “NotExists”, “Before”, “After”, “GreaterThan”, or “LessThan”. Maximum result set size is 2000 (search object field name “max”). You can use paging to grab more results by copying the “searchAfter” field from the previous response to the subsequent request body.

// POST = https://qcz87jizmc.execute-api.us-east-1.amazonaws.com/dev/tm/promo/search-products

const url = 'https://qcz87jizmc.execute-api.us-east-1.amazonaws.com/dev/tm/promo/search-products';
const data = {};
const loginForm = document.getElementById('loginForm');

let username;
let password;

const submitLoginForm = async (url) => {
    username = document.getElementById('username').value;
    password = document.getElementById('password').value;
    
    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        }
    }

    const response = await fetch(url, postOptions);

    if (response.status === 200) {
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('loggedIn', 'true');
        window.location.href = '/miresource/listings.html';
    }
    else {
        document.getElementById('loginError').style.display = 'block';
    }
}

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    submitLoginForm(url);
}, false);