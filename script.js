// Login <-> Register

function toggleForm(formToShow, formToHide) {
	formToHide.style.opacity = "0";
	setTimeout(() => {
		formToHide.style.display = "none";
		formToShow.style.display = "block";
		setTimeout(() => {
			formToShow.style.opacity = "1";
		}, 10);
	}, 300);
}

document
	.getElementById("register-link")
	.addEventListener("click", function (event) {
		event.preventDefault();
		toggleForm(
			document.querySelector(".register-form"),
			document.querySelector(".login-form")
		);
	});

document
	.getElementById("login-link")
	.addEventListener("click", function (event) {
		event.preventDefault();
		toggleForm(
			document.querySelector(".login-form"),
			document.querySelector(".register-form")
		);
	});
