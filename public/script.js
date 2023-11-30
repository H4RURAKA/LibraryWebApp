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

document.getElementById("email").addEventListener("input", function () {
	var email = this.value;
	var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var emailError = document.getElementById("email-error");

	if (!emailRegex.test(email)) {
		emailError.style.display = "block";
		emailError.textContent = "Invalid email format"; // 오류 메시지 설정
	} else {
		emailError.style.display = "none";
	}
});

document.getElementById("login-email").addEventListener("input", function () {
	var email = this.value;
	var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	var emailError = document.getElementById("login-email-error");

	if (!emailRegex.test(email)) {
		emailError.style.display = "block";
		emailError.textContent = "Invalid email format"; // 오류 메시지 설정
	} else {
		emailError.style.display = "none";
	}
});

//-----------------------------------------------------------------

// Import Firebase 인증 관련 함수
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
		// 입력 값 가져오기
		const email = document.getElementById("email").value;
		const password = document.getElementById("password").value;
		const confirmPassword =
			document.getElementById("confirm-password").value;

		// 오류 메시지 요소
		const emailError = document.getElementById("email-error");
		const passwordError = document.getElementById("password-error");

		if (password === confirmPassword) {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					// 회원가입 성공
					alert("Registration successful! Welcome."); // 성공 메시지
					location.reload(); // 페이지 새로고침
				})
				.catch((error) => {
					// 오류 메시지 초기화
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
						// 기타 오류 코드 추가
					}
				});
		} else {
			passwordError.style.display = "block";
			passwordError.textContent = "Passwords do not match.";
		}
	});

// 로그인 처리
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
			console.log("Login Successful:", userCredential.user);
			// 사용자 이메일을 세션 스토리지에 저장
			sessionStorage.setItem("userEmail", userCredential.user.email);

			// 메인 페이지로 리디렉션
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
				// 다른 오류 코드 처리
			}
			console.error("Login Error:", error);
		});
});
