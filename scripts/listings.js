window.onload = () => {
    if (sessionStorage.length === 0 || sessionStorage.loggedIn === 'false') {
        window.location.href = '/';
    }
}

// Authentication and API
const username = sessionStorage.username;
const password = sessionStorage.password;
const url = 'https://qcz87jizmc.execute-api.us-east-1.amazonaws.com/dev/tm/promo/search-products';

// Search and filter elements
const searchForm = document.getElementById('searchForm');
const searchBar = document.getElementById('searchBar');
const resultsPerPage = document.getElementById('resultsPerPage');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const productsList = document.getElementById('productList');
const nextButton = document.getElementById('nextButton');

let postBody = {};
let searchAfter = [];
let listCount = 0;

const search = (url, postOptions) => {
    fetch(url, postOptions)
    .then((response) => {
        return response.json();
    })
    .then((parsedResponse) => {
        searchAfter = parsedResponse.meta.searchAfter ? parsedResponse.meta.searchAfter : [];
        return parsedResponse.data;
    })
    .then((parsedData) => {
        populateList(parsedData);
    })
    .catch((error) => {
        console.error(error);
    });
}

const getPostOptions = () => {
    postBody.q = searchBar.value;
    postBody.max = resultsPerPage.value;
    postBody.standardWholesalePrice_GreaterThan = parseInt(minPrice.value) - 0.01;
    postBody.standardWholesalePrice_LessThan = parseInt(maxPrice.value) + 0.01;

    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        },
        body: JSON.stringify(postBody)
    }
}

const goToNextPage = () => {
    postBody.searchAfter = [...searchAfter];
    postOptions = getPostOptions();
    search(url, postOptions);
}

const populateList = (products) => {
    productList.innerHTML = '';
    
    for (let product of products) {
        const item = document.createElement('div');
        item.classList.add('card');
        item.classList.add('col-3');
        item.classList.add('m-3');
        item.style.width = '18rem';
        productList.appendChild(item);

        const image = document.createElement('img');
        image.src = '/images/table.jpg';
        image.classList.add('card-img-top');
        item.appendChild(image); 

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        item.appendChild(cardBody);

        const itemName = document.createElement('h5');
        itemName.classList.add('card-title');
        itemName.innerHTML = product.productName;
        cardBody.appendChild(itemName);

        const itemDetailList = document.createElement('ul');
        itemDetailList.classList.add('list-group');
        itemDetailList.classList.add('list-group-flush');
        item.appendChild(itemDetailList);
        
        const itemPrice = document.createElement('li');
        itemPrice.classList.add('list-group-item');
        itemPrice.innerHTML = '$' + product.standardWholesalePrice;
        itemDetailList.appendChild(itemPrice);
    }

    if (productList.childElementCount < resultsPerPage.value) {
        nextButton.disabled = true;
    }
    else {
        nextButton.disabled = false;
    }
}

// EVENT LISTENERS

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const postOptions = getPostOptions();
    search(url, postOptions);
}, false);

// Prevent min price > max price
minPrice.addEventListener('change', (event) => {
    if (!maxPrice.value) return;
    if (parseInt(minPrice.value) > parseInt(maxPrice.value)) minPrice.value = parseInt(maxPrice.value);
}, false);

// Prevent max price < min price
maxPrice.addEventListener('change', (event) => {
    if (!minPrice.value) return;
    if (parseInt(maxPrice.value) < parseInt(minPrice.value)) maxPrice.value = parseInt(minPrice.value);
}, false);

nextButton.addEventListener('click', (event) => {
    if (searchAfter.length === 0) return;
    goToNextPage();
}, false);