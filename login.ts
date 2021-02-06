import { fromEvent, merge } from "rxjs";

// 取元素
let emailInput: HTMLInputElement;
emailInput = document.getElementById("email") as HTMLInputElement;
let passwordInput: HTMLInputElement;
passwordInput = document.getElementById("password") as HTMLInputElement;
let buttonElement: HTMLButtonElement;
buttonElement = document.getElementById("submit") as HTMLButtonElement;

// 建立可觀察的物件Observable
const emailValidation$ = fromEvent<InputEvent>(emailInput, "keyup");
const passwordValidation$ = fromEvent<InputEvent>(passwordInput, "keyup");
const inputsValidation$ = merge(emailValidation$, passwordValidation$);

inputsValidation$.subscribe(() => {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (email && password) {
    buttonElement.disabled = false;
  } else {
    buttonElement.disabled = true;
  }
});