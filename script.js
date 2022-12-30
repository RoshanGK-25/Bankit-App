'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};
 
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false){
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${ type }</div>
      <div class="movements__value">${ mov } €</div>
    </div>`;
     containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}
const CalcDisplayBalance = function(acc){
  // Calculate Balance also assign property to accounts
  acc.balance = acc.movements.reduce((acc, mov) =>  acc + mov , 0);
  labelBalance.textContent = `${acc.balance} €`;
}
const calcDisplaySummary = function(acc){
  // Calculate Diposit
  const deposit = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov ,0);
  console.log(deposit)
  labelSumIn.textContent = `${deposit} €`;
  // Calculate Withdrew
  const withdrew = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov ,0);
  console.log(withdrew);
  labelSumOut.textContent = `${Math.abs(withdrew)} €`;
  // Calculate Interest
  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate ) / 100)
  .filter((int, i, arr) => {
    console.log(arr);
    return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest} €`;
}


const updateUI = function(acc){
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance

  CalcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
}

// console.log( containerMovements.innerHTML );

//-------------MAP IMPLIMENTATION IN BANKIST APP-------------

// Generate UserName
const createUserName = function(accs){
  accs.forEach(function(acc) {
    acc.userName = acc.owner
    .toLowerCase()
    .split(" ")
    .map(name => name[0])
    .join('');
  });
}
createUserName(accounts);

// Event hander
let currentAccount;
// Login MOdule
btnLogin.addEventListener('click', function(e){
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value)
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)){
  console.log('LOGIN');
  // Display UI and Message
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;
  }

  //
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  // Update UI
  updateUI(currentAccount);
  
});

// Amount trasfer Module
btnTransfer.addEventListener('click', function(e) {
  //prevent form from submitting
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';


  // Checking amount is greter than balance
  if(
    amount > 0 && 
    receiverAcc &&
    currentAccount.balance >= amount && 
    receiverAcc.userNmae !== currentAccount.userName 
  )
    {
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      console.log('trasfer valid');
      updateUI(currentAccount);
    }
    
});

// Loan Module
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // add movements
    currentAccount.movements.push(amount);
    // update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

// Account close Module
btnClose.addEventListener('click', function(e) {
  e.preventDefault();
  if( currentAccount.userName === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value) ){
    // currentAccount.pop()
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    console.log(index)
    accounts.splice(index, 1);
    console.log(accounts);
    containerApp.style.opacity = '0';
    labelWelcome.textContent = `Log in to get started`;
  }
  inputClosePin.value = inputCloseUsername.value = '';
})

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
  console.log('sorted', sorted);
});


///////////////////////////////////////
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const checkDogs = (dogsJulia, dogsKate) =>{
//   const dogsJuliaCorrected = dogsJulia.slice()
//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   console.log(dogsJuliaCorrected);
//   const dogs = dogsJuliaCorrected.concat(dogsKate)
//   dogs.forEach(function(dogAge, i){
//     if(dogAge <= 3){
//       console.log(`"Dog number ${ i+1 } is an adult, and is ${ dogAge } years old puppy `)
//     }
//     else{
//       console.log(`"Dog number ${ i+1 } is an adult, and is ${ dogAge } years old adult dog`)
//     }
//   });
// }
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);


//-------------MAP METHODS-------------

// const eurToUsd = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 30, 1300];

// const movementUsd = movements.map(function(mov){
//   return mov * eurToUsd;
// });
// const movementUsd = movements.map(mov => mov * eurToUsd);
// console.log(movements);
// console.log(movementUsd);

// const movementsUsdFor = [];
// for(let mov of movements){
//   movementsUsdFor.push(mov * eurToUsd);
// }
// console.log(movementsUsdFor);

// const movementsDescription = movements.map((mov, i) => {
//   return `Movements ${i+1} : you ${ mov > 0 ? 'Diposited' : 'withdrew'} ${Math.abs(mov)}.`
// });
// const movementsDescription = movements.map((mov, i) => 
//   `Movements ${i+1} : you ${ mov > 0 ? 'Diposited' : 'withdrew'} ${Math.abs(mov)}.`
// );
// console.log(movementsDescription);

///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀*/

// const calcAverageHumanAge = dogAge.forEach(function(){

// });
// const calcAverageHumanAge = function(dogAge){
//   dogAge.forEach(function(dog){
//     if(dog <= 2){
//       return 2 * dog;
//     }
//     else{
//       return 16 + dog * 4;
//     }
//   });
// }
// const calcAverageHumanAge = (dogsAge) => {
//   const humanAge = dogsAge.map(function(age){
//     if(age <= 2){
//       return 2 * age;
//     }
//     else{ 
//       return 16 + age * 4;
//     }
//   });
//   console.log(humanAge);
// }




// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀*/

// const calcAverageHumanAge = ages => {
//   const avgHumanAge = ages
//   .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//   .filter(age => age > 18)
//   .reduce((acc, age) => acc+age,0)/ages.length;
//   console.log(avgHumanAge);
// }


// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);