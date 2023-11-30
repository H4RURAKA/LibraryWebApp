import {
	getAuth,
	onAuthStateChanged,
	signOut, // 로그아웃 함수 import
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

const firebaseConfig = {
	apiKey: "AIzaSyDWY38JJj04fa5wZotBLtYVmfk3hC4effI",
	authDomain: "yourlibrary-25f98.firebaseapp.com",
	projectId: "yourlibrary-25f98",
	storageBucket: "yourlibrary-25f98.appspot.com",
	messagingSenderId: "188512431713",
	appId: "1:188512431713:web:c48e8a94e6a87ee4594420",
	measurementId: "G-QFHGSFZN4K",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 로그아웃 상태 플래그
let isLoggingOut = false;

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

// 현재 로그인한 사용자 확인
onAuthStateChanged(auth, (currentUser) => {
	if (!currentUser && !isLoggingOut) {
		// 로그인하지 않은 경우 (로그아웃이 아닌 경우)
		window.location.href = "../index.html"; // 로그인 페이지로 리다이렉트
		alert("Access is restricted to members only.");
	} else {
		// 로그인한 경우, 페이지 콘텐츠 로드 및 기타 로직 처리
		initializePageContent();
	}
});

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
