const nav = document.querySelector(".nav"),
  searchIcon = document.querySelector("#searchIcon"),
  navOpenBtn = document.querySelector(".navOpenBtn"),
  navCloseBtn = document.querySelector(".navCloseBtn");
searchIcon.addEventListener("click", () => {
  nav.classList.toggle("openSearch");
  nav.classList.remove("openNav");
  if (nav.classList.contains("openSearch")) {
    return searchIcon.classList.replace("uil-search", "uil-times");
  }
  searchIcon.classList.replace("uil-times", "uil-search");
});
navOpenBtn.addEventListener("click", () => {
  nav.classList.add("openNav");
  nav.classList.remove("openSearch");
  searchIcon.classList.replace("uil-times", "uil-search");
});
navCloseBtn.addEventListener("click", () => {
  nav.classList.remove("openNav");
});

const urlForPhNumber =
  "https://raw.githubusercontent.com/ThantZ-cloud/emergency-phone-number-for-myanmar/refs/heads/main/emergencyPhNumber.json";

let phNumbers; //may be underfine if wifi speed is low or disconnected to internet

// const autoCompleteInputTag =
//   document.getElementsByClassName("autoCompleteInput")[0];

fetch(urlForPhNumber)
  .then((response) => {
    const responseData = response.json();

    return responseData;
  })
  .then((phNumberFromGithubServer) => {
    phNumbers = phNumberFromGithubServer;
    console.log("arrive data ", phNumbers);
    autoCompleteInputTag.disabled = false;
  })
  .catch((error) => {
    console.log("inside catch", error);
  });

let filterProucts = [];
const autoCompleteInputTag =
  document.getElementsByClassName("autoCompleteInput")[0];

const resultContainerTag =
  document.getElementsByClassName("resultContainer")[0];

autoCompleteInputTag.addEventListener("keyup", (event) => {
  resultContainerTag.style.display = "block";
  resultContainerTag.style.backgroundColor = "none";
  if (event.key === "Backspace") {
    indexToSelect = -1;
  }
  if (
    //must cursor in input tag
    event.key === "ArrowDown" ||
    event.key === "ArrowUp" ||
    event.key === "Enter"
  ) {
    navigateAndSelectProduct(event.key);

    return;
  }
  resultContainerTag.innerHTML = "";

  const searchText = event.target.value.toLowerCase();
  if (searchText === "") {
    return;
  }

  filterProucts = phNumbers.filter((product) => {
    return product.title.toLowerCase().includes(searchText);
  });

  const hasProductToShow = filterProucts.length > 0; //
  if (hasProductToShow) {
    for (let i = 0; i < filterProucts.length; i++) {
      const productContainerTag = document.createElement("div");
      productContainerTag.id = filterProucts[i].id;
      productContainerTag.classList.add("productContainer");

      const productNameTag = document.createElement("div");
      productNameTag.classList.add("productName");
      productNameTag.append(filterProucts[i].title);

      const productImageTag = document.createElement("div");
      productImageTag.classList.add("phNumber");
      productImageTag.append(filterProucts[i].phNumber);

      productContainerTag.append(productNameTag, productImageTag);
      resultContainerTag.append(productContainerTag);
    }
  }
});

let indexToSelect = -1;
const navigateAndSelectProduct = (key) => {
  if (key === "ArrowDown") {
    if (indexToSelect === filterProucts.length - 1) {
      indexToSelect = -1;
      deselectProduct();
      return;
    }
    indexToSelect += 1;

    const productItemContainerToSelect = selectProduct(indexToSelect);
    if (indexToSelect > 0) {
      deselectProduct();
    }
    productItemContainerToSelect.classList.add("selected");
  } else if (key === "ArrowUp") {
    if (indexToSelect === -1) {
      indexToSelect = filterProucts.length - 1;
      const productItemContainerToSelect = selectProduct(indexToSelect);
      productItemContainerToSelect.classList.add("selected");

      return;
    }

    if (indexToSelect === 0) {
      deselectProduct();
      indexToSelect = -1;
      return;
    }

    indexToSelect -= 1;
    deselectProduct();
    const productItemContainerToSelect = selectProduct(indexToSelect);
    productItemContainerToSelect.classList.add("selected");
  } else {
    if (indexToSelect >= 0 && indexToSelect < filterProucts.length) {
      const selectedProduct = filterProucts[indexToSelect];

      // Show in alert
      alert(`Selected Product:
            \nName: ${selectedProduct.title}
            \nPhone: ${selectedProduct.phNumber}`);

      // const resultContainer =  document.getElementsByClassName("resultContainer")[0];
      // console.log(resultContainer)
      // resultContainer.style.display = "none";
      // const enteredProduct = document.createElement("div");
      // enteredProduct.classList.add("enteredProduct");
    }
  }
};

const selectProduct = (index) => {
  const productIdToSelect = filterProucts[index].id.toString();
  const productItemContainerToSelect =
    document.getElementById(productIdToSelect);
  productItemContainerToSelect.style.backgroundColor = "#E4E4E4";
  // productItemContainerToSelect.style.borderRadius = "7px";
  productItemContainerToSelect.style.borderLeft = "4px solid green";
  // productItemContainerToSelect.style.backgroundColor = "green";
  //  productItemContainerToSelect.style.color = "white";

  return productItemContainerToSelect;
};

const deselectProduct = () => {
  const productToDeselect = document.getElementsByClassName("selected")[0];
  productToDeselect.style.backgroundColor = "white";
  productToDeselect.style.borderLeft = "none";
  // productToDeselect.style.color = "black";
  productToDeselect.classList.remove("selected");
};
