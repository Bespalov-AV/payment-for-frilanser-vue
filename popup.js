const Payment = new PaymentClass();

const table = document.getElementById('payment-table');
Payment.table = table;


const divAside = document.getElementById('aside-left');
Payment.divAside = divAside;

const divMain = document.getElementById('main');
Payment.divMain = divMain;

const ulCat= document.getElementById('ul-cat');
Payment.ulCat = ulCat;

Payment.Init();