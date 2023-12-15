// Login <-> Register : desktop & mobile

function toggleFormDesktop() {
	const hider = document.querySelector(".hider");
	const left = document.getElementById("text-left");
	const right = document.getElementById("text-right");
	const img = document.querySelector(".image-container");

	const emailError = document.getElementById("login-email-error");
	const passwordError = document.getElementById("login-password-error");

	emailError.style.display = "none";
	passwordError.style.display = "none";

	// Determine direction based on current location
	const isLeft = hider.style.left === "-5%" || hider.style.left === "";

	if (isLeft) {
		// move to right
		hider.style.left = "55%";
		hider.style.borderRadius = "100px 10px 10px 100px";

		img.style.borderRadius = "100px 10px 0 0";

		left.style.opacity = "0%";
		right.style.opacity = "100%";

		right.style.margin = "10% 10%";
		left.style.margin = "20% 10% 10% 10%";
	} else {
		// move to left
		hider.style.left = "-5%";
		hider.style.borderRadius = "10px 100px 100px 10px";

		img.style.borderRadius = "10px 100px 0 0";

		left.style.opacity = "100%";
		right.style.opacity = "0%";

		left.style.margin = "10% 10%";
		right.style.margin = "10% 10% 20% 10%";
	}
}

function toggleFormMobile(formToShow, formToHide) {
	formToHide.style.opacity = "0";

	const emailError = document.getElementById("login-email-error");
	const passwordError = document.getElementById("login-password-error");

	emailError.style.display = "none";
	passwordError.style.display = "none";

	setTimeout(() => {
		formToHide.style.display = "none";
		formToShow.style.display = "block";
		setTimeout(() => {
			formToShow.style.opacity = "1";
		}, 10);
	}, 300);
}

function mobileRegisterListener() {
	toggleFormMobile(
		document.querySelector(".register-form"),
		document.querySelector(".login-form")
	);
}

function mobileLoginListener() {
	toggleFormMobile(
		document.querySelector(".login-form"),
		document.querySelector(".register-form")
	);
}

// Add and remove event listeners based on screen size
function checkScreenSize() {
	removeEventListeners(); // remove existing event listeners

	const hider = document.querySelector(".hider");
	const registerLink = document.getElementById("register-link");
	const loginLink = document.getElementById("login-link");

	if (mediaQuery.matches) {
		// over 768px
		hider.addEventListener("click", toggleFormDesktop);
		registerLink.addEventListener("click", toggleFormDesktop);
		loginLink.addEventListener("click", toggleFormDesktop);

		document.querySelector(".login-form").style.display = "block";
		document.querySelector(".login-form").style.opacity = "1";

		document.querySelector(".register-form").style.display = "block";
		document.querySelector(".register-form").style.opacity = "1";
	} else {
		// under 768px
		registerLink.addEventListener("click", mobileRegisterListener);
		loginLink.addEventListener("click", mobileLoginListener);

		document.querySelector(".register-form").style.display = "none";
		document.querySelector(".register-form").style.opacity = "0";
		document.querySelector(".login-form").style.display = "block";
		document.querySelector(".login-form").style.opacity = "1";
	}
}

function removeEventListeners() {
	const registerLink = document.getElementById("register-link");
	const loginLink = document.getElementById("login-link");

	// remove
	registerLink.removeEventListener("click", toggleFormDesktop);
	registerLink.removeEventListener("click", mobileRegisterListener);

	loginLink.removeEventListener("click", toggleFormDesktop);
	loginLink.removeEventListener("click", mobileLoginListener);
}

// var. for screen size (compare with)
const mediaQuery = window.matchMedia("(min-width: 768px)");

// if screen size change, execute func
mediaQuery.addEventListener("change", checkScreenSize);

// when load page
document.addEventListener("DOMContentLoaded", checkScreenSize);

// check email
document.getElementById("email").addEventListener("input", function () {
	var email = this.value;
	var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var emailError = document.getElementById("email-error");

	if (!emailRegex.test(email)) {
		emailError.style.display = "block";
		emailError.textContent = "Invalid email format"; // error msg
	} else {
		emailError.style.display = "none";
	}
});

//-----------------------------------------------------------------
// particles

function initializeParticles() {
	if (window.innerWidth >= 768) {
		particlesJS("particles-js", {
			particles: {
				number: {
					value: 80,
					density: {
						enable: true,
						value_area: 800,
					},
				},
				shape: {
					type: "polygon",
					stroke: {
						width: 0,
						color: "#000000",
					},
					polygon: {
						nb_sides: 5,
					},
				},
				size: {
					value: 3,
					random: true,
					anim: {
						speed: 40,
						size_min: 0.1,
					},
				},
				line_linked: {
					enable: true,
					distance: 150,
					color: "#ffffff",
					opacity: 0.4,
					width: 1,
				},
				move: {
					enable: true,
					speed: 4,
					direction: "none",
					random: true,
					straight: false,
					out_mode: "out",
					bounce: false,
				},
			},
			interactivity: {
				detect_on: "canvas",
				events: {
					onclick: {
						enable: true,
						mode: "push",
					},
					resize: true,
				},
			},
			retina_detect: true,
		});
	} else {
		// remove when screen size is under 768px
		if (window.pJSDom && window.pJSDom.length > 0) {
			window.pJSDom.forEach(function (pJS) {
				pJS.pJS.fn.vendors.destroypJS();
			});
			window["pJSDom"] = [];
		}
	}
}

// add window load event listener
window.addEventListener("load", initializeParticles);

var delay = 300;
var timer = null;

// window resize event listener
window.addEventListener("resize", function () {
	clearTimeout(timer);
	timer = setTimeout(initializeParticles, delay);
});

//-----------------------------------------------------------------

// Import Firebase Authentication functions
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const auth = getAuth();

document
	.getElementById("register-form")
	.addEventListener("submit", function (e) {
		e.preventDefault();
		// Get input value
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const confirmPassword =
			document.getElementById("confirm-password").value;

		// error message consts
		const emailError = document.getElementById("email-error");
		const passwordError = document.getElementById("password-error");

		if (password === confirmPassword) {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// success
					alert("Registration successful! Welcome."); // 성공 메시지
					location.reload(); // reload page
				})
				.catch((error) => {
					// reset error msg
					emailError.style.display = "none";
					passwordError.style.display = "none";

					switch (error.code) {
						case "auth/email-already-in-use":
							emailError.textContent =
								"An account with this email already exists.";
							emailError.style.display = "block";
							break;
						case "auth/invalid-email":
							emailError.style.display = "block";
							emailError.textContent = "Invalid Email";
							break;
						case "auth/weak-password":
							passwordError.style.display = "block";
							passwordError.textContent =
								"Password should be at least 6 characters";
							break;
					}
				});
		} else {
			passwordError.style.display = "block";
			passwordError.textContent = "Passwords do not match.";
		}
	});

// when you login
document.getElementById("login-form").addEventListener("submit", function (e) {
	e.preventDefault();

	const email = document.getElementById("login-email").value;
	const password = document.getElementById("login-password").value;

	const emailError = document.getElementById("login-email-error");
	const passwordError = document.getElementById("login-password-error");

	emailError.style.display = "none";
	passwordError.style.display = "none";

	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			// store to session storage
			sessionStorage.setItem("userEmail", userCredential.user.email);

			// redirection to main page
			window.location.href = "./main/index.html";
		})
		.catch((error) => {
			switch (error.code) {
				case "auth/invalid-email":
				case "auth/invalid-credential":
					emailError.textContent = "Invalid email or credential.";
					emailError.style.display = "block";
					break;
				case "auth/user-disabled":
					emailError.textContent = "User account is disabled.";
					emailError.style.display = "block";
					break;
				case "auth/user-not-found":
				case "auth/wrong-password":
					passwordError.textContent = "Incorrect email or password.";
					passwordError.style.display = "block";
					break;
				case "auth/too-many-requests":
					emailError.textContent =
						"Too many login attempts. Please try again later.";
					emailError.style.display = "block";
					break;
			}
			console.error("Login Error:", error);
		});
});
