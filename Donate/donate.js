const Credit = document.getElementById("Credit");
const Monthly = document.getElementById("Monthly");
const Crypto = document.getElementById("Crypto");
const Online = document.getElementById("Online");
const container1 = document.getElementById("container1");
const container2 = document.getElementById("container2");
const container3 = document.getElementById("container3");
const container4 = document.getElementById("container4");
const container5 = document.getElementById("container5");
const container6 = document.getElementById("container6");
const card = document.getElementById("card");
const nowbtn = document.getElementById("nowbtn");
container2.style.display = "block";

function CreditCard() {
  container2.style.display = "block";
  container3.style.display = "none";
  container4.style.display = "none";
  container5.style.display = "none";
  Monthly.style.color = "black";
  Credit.style.color = "blue";
  Crypto.style.color = "black";
  Online.style.color = "black";
  nowbtn.style.display = "block";
  nowbtn.textContent = "Pay Now";
}

function MonthlyPay() {
  container2.style.display = "none";
  container3.style.display = "block";
  container4.style.display = "none";
  container5.style.display = "none";
  Monthly.style.color = "blue";
  Credit.style.color = "black";
  Crypto.style.color = "black";
  Online.style.color = "black";
  nowbtn.style.display = "block";
  nowbtn.textContent = "Pay Now";
}

function crypto() {
  container2.style.display = "none";
  container3.style.display = "none";
  container4.style.display = "block";
  container5.style.display = "none";
  Monthly.style.color = "black";
  Credit.style.color = "black";
  Crypto.style.color = "blue";
  Online.style.color = "black";
  nowbtn.style.display = "block";
  nowbtn.textContent = "Connect to wallet";
}

function OnlinePay() {
  container2.style.display = "none";
  container3.style.display = "none";
  container4.style.display = "none";
  container5.style.display = "block";
  Monthly.style.color = "black";
  Credit.style.color = "black";
  Crypto.style.color = "black";
  Online.style.color = "blue";
  nowbtn.style.display = "none";
}
function Ndocument() {
  window.location.href = "../../Earthquake&Recovery/index.html";
}
let selectedCrypto = null;

function selectCrypto(button) {
  // remove previous selection
  document
    .querySelectorAll("#container4 button")
    .forEach((btn) => btn.classList.remove("selected"));

  // mark new selection
  button.classList.add("selected");
  selectedCrypto = button.innerText.trim();

  // enable connect wallet button
  document.getElementById("connectWalletBtn").disabled = false;
}

function paynow() {
  let isRadioSelected = false;
  let isPolicyAgreed = false;

  if (container2.style.display === "block") {
    isRadioSelected = document.querySelector(
      '#container2 input[name="Payment1"]:checked'
    );
    isPolicyAgreed = document.getElementById("newpay1").checked;
  } else if (container3.style.display === "block") {
    isRadioSelected = document.querySelector(
      '#container3 input[name="Payment2"]:checked'
    );
    isPolicyAgreed = document.getElementById("newpay2").checked;
  } else if (container4.style.display === "block") {
    isRadioSelected = selectedCrypto !== null;
    isPolicyAgreed = true; // or connect it to a checkbox if you also want a policy agreement
  } else if (container5.style.display === "block") {
    isRadioSelected = true;
    isPolicyAgreed = true;
  }

  if (isRadioSelected && isPolicyAgreed) {
    container6.style.display = "block";
    container1.style.display = "none";
  } else {
    if (!isPolicyAgreed) {
      alert("Please read and agree to the Terms of Policy and Privacy.");
    } else if (!isRadioSelected) {
      alert("Please select a payment option.");
    }
  }
}

function Mdocument() {
  container6.style.display = "none";
  container1.style.display = "block";
}

function text() {
  let amount = document.getElementById("number").value;
  let name = document.getElementById("name").value;

  container1.style.display = "none";
  container6.style.display = "none";
  card.style.display = "block";
  card.querySelector(
    ".h2"
  ).textContent = `Thank You ${name} for Your Donation!`;
  card.querySelector(".amount").textContent = `💵 You Donated: $${amount}`;

  const today = new Date();
  const dateText = `📅 Date: ${today.getDate()} ${today.toLocaleString(
    "default",
    { month: "short" }
  )} ${today.getFullYear()}`;
  card.querySelector(".date").textContent = dateText;
}
function back() {
  container1.style.display = "block";
  card.style.display = "none";
  document.getElementById("name").value = "";
  document.getElementById("number").value = "";
  document.getElementById("password").value = "";
}
