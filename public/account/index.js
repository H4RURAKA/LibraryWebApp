import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import {
	getAuth,
	onAuthStateChanged,
	updatePassword,
	deleteUser,
	EmailAuthProvider,
	reauthenticateWithCredential,
	signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyDWY38JJj04fa5wZotBLtYVmfk3hC4effI",
	authDomain: "yourlibrary-25f98.firebaseapp.com",
	projectId: "yourlibrary-25f98",
	storageBucket: "yourlibrary-25f98.appspot.com",
	messagingSenderId: "188512431713",
	appId: "1:188512431713:web:c48e8a94e6a87ee4594420",
	measurementId: "G-QFHGSFZN4K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firebase Auth 가져오기
const auth = getAuth(app);
const db = getFirestore(app);

// 로그아웃 상태 플래그
let isLoggingOut = false;
let isWithdrawal = false;

// 현재 로그인한 사용자 확인
onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		// 현재 로그인한 사용자의 이메일 표시
		document.getElementById("current-user-id").textContent =
			currentUser.email;
		initializePageContent();
		let isLoggingOut = false;
	} else if (!isLoggingOut || !isWithdrawal) {
		alert("Access is restricted to members only.");
		window.location.href = "../index.html"; // 로그인 페이지로 리다이렉트
	}
});

document
	.getElementById("password-change-form")
	.addEventListener("submit", function (e) {
		e.preventDefault();

		// 요소 및 입력값 가져오기
		const currentPasswordInput =
			document.getElementById("current-password");
		const newPasswordInput = document.getElementById("new-password");
		const confirmNewPasswordInput = document.getElementById(
			"confirm-new-password"
		);

		// 오류 메시지 요소
		const currentPasswordError = document.getElementById(
			"current-password-error"
		);
		const newPasswordError = document.getElementById("new-password-error");
		const confirmNewPasswordError = document.getElementById(
			"confirm-new-password-error"
		);

		// 오류 메시지 초기화
		currentPasswordError.style.display = "none";
		newPasswordError.style.display = "none";
		confirmNewPasswordError.style.display = "none";

		const currentPassword = currentPasswordInput.value;
		const newPassword = newPasswordInput.value;
		const confirmNewPassword = confirmNewPasswordInput.value;

		let hasError = false; // 오류가 있는지 여부를 나타내는 플래그

		// 새 비밀번호와 확인 비밀번호 일치 여부 확인
		if (newPassword !== confirmNewPassword) {
			confirmNewPasswordError.textContent =
				"It does not match new password";
			confirmNewPasswordError.style.display = "block";
			hasError = true;
		}

		// 새 비밀번호 길이 확인 (최소 6자 이상)
		if (newPassword.length < 6) {
			newPasswordError.textContent =
				"Password should be at least 6 characters";
			newPasswordError.style.display = "block";
			hasError = true;
		}

		// 새 비밀번호가 현재 비밀번호와 같은지 확인
		if (newPassword === currentPassword) {
			newPasswordError.textContent =
				"New password should be different with current password";
			newPasswordError.style.display = "block";
			hasError = true;
		}

		// 오류가 없고, 사용자가 로그인한 경우
		if (!hasError && auth.currentUser) {
			// EmailAuthProvider를 사용하여 인증 정보 생성
			const credential = EmailAuthProvider.credential(
				auth.currentUser.email,
				currentPassword
			);

			// 현재 비밀번호로 재인증
			reauthenticateWithCredential(auth.currentUser, credential)
				.then(() => {
					// 재인증 성공, 비밀번호 변경
					updatePassword(auth.currentUser, newPassword)
						.then(() => {
							alert("Password successfully changed.");
							// 추가적인 성공 처리 로직
						})
						.catch((error) => {
							console.error("비밀번호 변경 중 오류 발생:", error);
							// 오류 메시지 처리
						});
				})
				.catch((error) => {
					console.error("Reauthentication error:", error);
					currentPasswordError.textContent = ""; // 초기화
					switch (error.code) {
						case "auth/too-many-requests":
							currentPasswordError.textContent =
								"Too many login attempts. Please try again later.";
							break;
						case "auth/invalid-credential":
							currentPasswordError.textContent =
								"Incorrect password";
							break;
						// 기타 오류 코드 처리
					}
					currentPasswordError.style.display = "block";
				});
		}
	});

// 계정 삭제 이벤트 리스너
document
	.getElementById("delete-account-button")
	.addEventListener("click", function () {
		const confirmation = confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);

		if (confirmation) {
			isWithdrawal = true;
			const user = auth.currentUser;

			// 사용자가 작성한 독후감 삭제
			const reviewsRef = collection(db, "bookReviews");
			const q = query(reviewsRef, where("uid", "==", user.uid));

			getDocs(q)
				.then((querySnapshot) => {
					querySnapshot.forEach((docSnapshot) => {
						deleteDoc(doc(db, "bookReviews", docSnapshot.id));
					});

					// 모든 독후감이 삭제된 후 계정 삭제
					deleteUser(user)
						.then(() => {
							alert("Account deleted successfully.");
							// 계정 삭제 후 처리 로직 (예: 로그인 페이지로 리다이렉트)
						})
						.catch((error) => {
							console.error("Account deletion error:", error);
							isWithdrawal = false;
						});
				})
				.catch((error) => {
					console.error("Error deleting user reviews:", error);
					isWithdrawal = false;
				});
		}
	});

// 로그아웃 함수 정의
function logout() {
	isLoggingOut = true; // 로그아웃 중 플래그
	signOut(auth)
		.then(() => {
			// 로그아웃 성공 시 처리
			console.log("Logout success");
			alert("Logout success");
			window.location.href = "../index.html"; // 로그인 페이지
		})
		.catch((error) => {
			// 로그아웃 에러 처리
			console.error("Logout Error:", error);
			isLoggingOut = false; // 플래그 초기화
		});
}

function initializePageContent() {
	const loadingCover = document.getElementById("loadingCover");
	if (loadingCover) {
		loadingCover.classList.add("hidden");
		setTimeout(() => {
			loadingCover.style.display = "none";
		}, 500); // CSS transition 시간에 맞춰서 지연
	}
}

// 로그아웃 버튼 이벤트 리스너
document.getElementById("logout-button").addEventListener("click", logout);
