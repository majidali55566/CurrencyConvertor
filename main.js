const dropdowns = document.querySelectorAll(".custom-dropdown");

const currencyInputValue = document.querySelector("#currency-input-value");
const validationMessage = document.querySelector("#validation-message");

const toDropdownOptions = document.querySelector("#ToDropdownOptions");
const fromDropDownOptions = document.querySelector("#forDropdownOptions");

const dropDownFrom = document.querySelector("#from-custom-dropdown");
const dropDownTo = document.querySelector("#to-custom-dropdown");

const selectedFromOption = document.querySelector("#option-selected-from");
const selectedToOption = document.querySelector("#option-selected-to");

const selectedFromValue = document.querySelector("#selected-value-from");
const selectedToValue = document.querySelector("#selected-value-to");

const getExchangeRateButton = document.querySelector("#getExchangeRateButton");

const convertedResult = document.querySelector("#convertedResult");

let showToDropdown = true;
let showFromDropdown = true;

document.addEventListener("DOMContentLoaded", appInit);

dropDownFrom.addEventListener("click", () => {
  if (showFromDropdown) {
    fromDropDownOptions.style.display = "block";
  } else fromDropDownOptions.style.display = "none";
  showFromDropdown = !showFromDropdown;
});
dropDownTo.addEventListener("click", () => {
  if (showToDropdown) {
    toDropdownOptions.style.display = "block";
  } else toDropdownOptions.style.display = "none";
  showToDropdown = !showToDropdown;
});

fromDropDownOptions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const clickedOption = e.target;
    selectedFromOption.textContent = clickedOption.textContent;
    selectedFromValue.value = clickedOption.textContent;
    // Hide the dropdown
    toDropdownOptions.style.display = "none";
  }
  if (selectedFromValue.value && !selectedToValue.value) {
    getExchangeRateButton.disabled = true;
  } else {
    getExchangeRateButton.disabled = false;
  }
});

toDropdownOptions.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    const clickedOption = e.target;
    selectedToOption.textContent = clickedOption.textContent;
    selectedToValue.value = clickedOption.textContent;
    // Hide the dropdown
    toDropdownOptions.style.display = "none";
  }
  if (!selectedFromValue.value && selectedToValue.value) {
    getExchangeRateButton.disabled = true;
  } else {
    getExchangeRateButton.disabled = false;
  }
});

document.addEventListener("click", (e) => {
  if (!dropDownFrom.contains(e.target)) {
    fromDropDownOptions.style.display = "none";
  }
  if (!dropDownTo.contains(e.target)) toDropdownOptions.style.display = "none";
});
function appInit() {
  url = `https://api.currencyapi.com/v3/currencies?apikey=cur_live_3P3rtAVfUUivaMMDr0xCU3fO3Gd03SdApNXIsXbN`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const currencies = data["data"];
      console.log(currencies);
      for (let currency in currencies) {
        let listItem = document.createElement("li");
        listItem.textContent = currency;
        let listItemClone = listItem.cloneNode(true); // Clone the list item
        toDropdownOptions.appendChild(listItem);
        fromDropDownOptions.appendChild(listItemClone); // Append the cloned list item
      }
    });
  if (!selectedFromValue.value && !selectedToValue.value) {
    getExchangeRateButton.disabled = true;
  }
}

getExchangeRateButton.addEventListener("click", () => {
  if (selectedFromValue.value && selectedToValue.value) {
    validateUserInput(currencyInputValue.value);
    convertToWithRespectToBaseCurrency(
      selectedFromValue.value,
      selectedToValue.value
    );
  }
});

const convertToWithRespectToBaseCurrency = async (
  baseCurrency,
  toBeConvertedToCurrancy
) => {
  url = `https://api.currencyapi.com/v3/latest?apikey=cur_live_3P3rtAVfUUivaMMDr0xCU3fO3Gd03SdApNXIsXbN&base_currency=${baseCurrency}&currencies=${toBeConvertedToCurrancy}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const currenciesExchangedRates = data["data"];
      for (const key in currenciesExchangedRates) {
        const value = currenciesExchangedRates[key].value;
        const result = getConvertCurrencyValueFor(value);
        convertedResult.innerHTML = `${currencyInputValue.value} ${baseCurrency} = ${result} ${toBeConvertedToCurrancy}`;
        console.log(Number(result.toFixed(2)));
        // console.log(result);
      }
    })
    .catch((error) => {
      console.log("Error: " + error);
    });
  // `https://api.currencyapi.com/v3/latest?apikey=cur_live_3P3rtAVfUUivaMMDr0xCU3fO3Gd03SdApNXIsXbN&base_currency=${baseCurrency}&currencies=${toBeConvertedToCurrancy}`;
};

function getConvertCurrencyValueFor(convertedIntoValue) {
  const result = currencyInputValue.value * convertedIntoValue;
  return Number(result.toFixed(2));
}

function validateUserInput(userInput) {
  if (!userInput) {
    validationMessage.textContent = "*number required";
    validationMessage.style.display = "block";
  } else {
    validationMessage.style.display = "none";
  }
  if (userInput < 0) {
    validationMessage.textContent = "invalid input";
    validationMessage.style.display = "block";
  }
}
