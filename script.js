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

$(document).ready(function () {
	// Real-time validation for Email
	$("#email").on("input", function () {
		var email = $(this).val();
		var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			$("#email").css({
				"background-color": "#ff4949",
			});
		} else {
			$("#email").css({
				border: "1px solid #00ff6e",
			});
		}
	});
	// Real-time validation for Password
	$("#password").on("input", function () {
		var password = $(this).val();
		var passwordRegex =
			/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;

		if (!passwordRegex.test(password)) {
			$("#password").css({
				border: "1px solid #ff4949",
			});
		} else {
			$("#password").css({
				border: "1px solid #00ff6e",
			});
		}
	});

	// Real-time validation for Password Confirmation
	$("#confirm-password").on("input", function () {
		var password = $("#password").val();
		var confirmPassword = $("#confirm-password").val();

		if (password !== confirmPassword) {
			$("#confirm-password").css({
				border: "1px solid #ff4949",
			});
		} else {
			$("#confirm-password").css({
				border: "1px solid #00ff6e",
			});
		}
	});
});
