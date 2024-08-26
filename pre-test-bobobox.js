//Positive Case
import http from 'k6/http';
import { check, sleep } from 'k6';
import { group } from 'k6';

export let options = {
    vus: 10,
    duration: '30s',
};

export default function () {
    const url_login = 'https://www.saucedemo.com/login';
    const payload_login = JSON.stringify({
        username: 'standard_user',
        password: 'secret_sauce',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = http.post(url_login, payload_login, params);
    check(response, {
        'is status 200': (r) => r.status === 200,
    });

    sleep(1);
}

//Negative Case
export default function () {
    const url_login = 'https://www.saucedemo.com/login';
    const payload_login = JSON.stringify({
        username: 'locked_out_user',
        password: 'inipasswordsalah',
    });
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = http.post(url_login, payload_login, params);
    check(response, {
        'is status 401': (r) => r.status === 401,
        'is error message present': (r) => r.json('error') === 'Username atau Password Salah',
    });
    sleep(1); 
}



//SEPERATE//

// POSITIVE CASE of TRANSACTION

//Function Add To Cart
function addToCart() {
    const url_transaction = 'https://www.saucedemo.com/inventory';
        let response = http.post(`${url_transaction}/cart/add`, {
          product_name: 'Sauce Labs Backpack',
          quantity: 1,
        });
        check(response, {
          'Add to Cart successful': (r) => r.status === 200,
        });

        //Case Remove Cart
        let removeResponse = http.post(`${url_transaction}/cart/remove`, {
          product_name: 'Sauce Labs Backpack',
        });
      
        check(removeResponse, {
          'Remove from Cart successful': (r) => r.status === 200,
        });
      
        sleep(1);
      }

//Function Checkout Product
function checkout() {
    let response = http.get(`${url_transaction}/checkout`);
  
    check(response, {
      'Checkout page loaded': (r) => r.status === 200,
    });
  
    //Case Back To Main Menu
    let backToMainMenu = http.get(`${url_transaction}/main-menu`);
  
    check(backToMainMenu, {
      'Back To Main Menu': (r) => r.status === 200,
    });
  
    sleep(1);
  }
  
//Function Fill Information
  function fillInformation() {
    let response = http.post(`${url_transaction}/checkout/complete`, {
      first_name: 'Farhan',
      last_name: 'Sidik',
      zip_code: '40288',
    });
  
    check(response, {
      'Information submitted successfully': (r) => r.status === 200,
    });
  
    sleep(1);
  }

//Main Function
  export default function () {
    group('Add to Cart', function () {
      addToCart();
    });
  
    group('Checkout', function () {
      checkout();
    });
  
    group('Fill Information', function () {
      fillInformation();
    });
  }
  

//NEGATIVE CASE of TRANSACTION

//Function Failed Add To Cart
function addToCartInvalidProduct() {
    let response = http.post(`${url_transaction}/cart/add`, {
      product_name: 'Labs Sauce Backpack',
      quantity: 1,
    });
  
    check(response, {
      'Invalid Product Name': (r) => r.status === 400 || r.status === 404,
    });
  
    sleep(1);
  }

//Function Failed Remove Non Exist Product on Cart
  function removeNonExistentProductFromCart() {
    let response = http.post(`${url_transaction}/cart/remove`, {
    product_name: 'Labs Sauce Backpack',
    });
  
    check(response, {
      'Remove Product Failed': (r) => r.status === 400 || r.status === 404,
    });
  
    sleep(1); // Pause between actions
  }

//Function Failed Checkout Product
  function checkoutWithoutProduct() {
    let response = http.get(`${url_transaction}/checkout`);
  
    check(response, {
      'No Product on Cart, Checkout Failed': (r) => r.status === 400 || r.status === 500,
    });
  
    sleep(1); // Pause between actions
  }

//Function Fill Invalid Information
  function fillInvalidInformation() {
    let response = http.post(`${BASE_URL}/checkout/complete`, {
      first_name: '',
      last_name: 'Doe',
      zip_code: '1232312',
    });
  
    check(response, {
      'First Name Required': (r) => r.status === 400 || r.status === 422,
    });
  
    sleep(1);
  }

//Main Function Negative Case
  export default function () {
    group('Add to Cart - Invalid Product', function () {
      addToCartInvalidProduct();
    });
  
    group('Remove Non-existent Product', function () {
      removeNonExistentProductFromCart();
    });
  
    group('Checkout without Product', function () {
      checkoutWithoutProduct();
    });
  
    group('Fill Invalid Information', function () {
      fillInvalidInformation();
    });
  }
  