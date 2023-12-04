// Login <-> Register : desktop & mobile

function toggleFormDesktop() {
	const hider = document.querySelector(".hider");
	const left = document.getElementById("text-left");
	const right = document.getElementById("text-right");
	const img = document.querySelector(".image-container");

	// 현재 위치를 기반으로 방향 결정
	const isLeft = hider.style.left === "-5%" || hider.style.left === "";

	if (isLeft) {
		// 오른쪽으로 이동
		hider.style.left = "55%";
		hider.style.borderRadius = "100px 10px 10px 100px";

		img.style.borderRadius = "100px 10px 0 0";

		left.style.opacity = "0%";
		right.style.opacity = "100%";

		right.style.margin = "10% 10%";
		left.style.margin = "20% 10% 10% 10%";
	} else {
		// 왼쪽으로 이동
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
	setTimeout(() => {
		formToHide.style.display = "none";
		formToShow.style.display = "block";
		setTimeout(() => {
			formToShow.style.opacity = "1";
		}, 10);
	}, 300);
}

// 화면 크기에 따라 이벤트 리스너 추가 및 제거
function checkScreenSize() {
	removeEventListeners(); // 기존 이벤트 리스너 제거

	if (mediaQuery.matches) {
		// 768px 이상일 때
		document
			.querySelector(".hider")
			.addEventListener("click", toggleFormDesktop);
		document
			.getElementById("register-link")
			.addEventListener("click", toggleFormDesktop);
		document
			.getElementById("login-link")
			.addEventListener("click", toggleFormDesktop);
		// 모든 폼 보이기
		document.querySelector(".register-form").style.display = "block";
		document.querySelector(".login-form").style.display = "block";
	} else {
		// 768px 이하일 때
		// 모바일용 토글 로직 적용
		document
			.getElementById("register-link")
			.addEventListener("click", () =>
				toggleFormMobile(
					document.querySelector(".register-form"),
					document.querySelector(".login-form")
				)
			);
		document
			.getElementById("login-link")
			.addEventListener("click", () =>
				toggleFormMobile(
					document.querySelector(".login-form"),
					document.querySelector(".register-form")
				)
			);
		// 기본적으로 로그인 폼만 표시
		document.querySelector(".register-form").style.display = "none";
		document.querySelector(".login-form").style.display = "block";
	}
}

// 기존 이벤트 리스너 제거
function removeEventListeners() {
	document
		.querySelector(".hider")
		.removeEventListener("click", toggleFormDesktop);
	document
		.getElementById("register-link")
		.removeEventListener("click", toggleFormMobile);
	document
		.getElementById("login-link")
		.removeEventListener("click", toggleFormMobile);
	document
		.getElementById("register-link")
		.removeEventListener("click", toggleFormDesktop);
	document
		.getElementById("login-link")
		.removeEventListener("click", toggleFormDesktop);
}

// 화면 사이즈용 변수
const mediaQuery = window.matchMedia("(min-width: 768px)");

// 화면 사이즈 변경 감지하여 함수 실행
mediaQuery.addEventListener("change", checkScreenSize);

// 페이지 로드 시 함수 실행
document.addEventListener("DOMContentLoaded", checkScreenSize);

// 이메일 체크

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
		// 화면이 768픽셀 미만일 때 particles.js 제거
		if (window.pJSDom && window.pJSDom.length > 0) {
			window.pJSDom.forEach(function (pJS) {
				pJS.pJS.fn.vendors.destroypJS();
			});
			window["pJSDom"] = [];
		}
	}
}

// 윈도우 로드 이벤트 리스너 추가
window.addEventListener("load", initializeParticles);

var delay = 300;
var timer = null;

// 윈도우 리사이즈 이벤트 리스너 추가
window.addEventListener("resize", function () {
	clearTimeout(timer);
	timer = setTimeout(initializeParticles, delay);
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
