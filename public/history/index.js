import {
	getFirestore,
	query,
	collection,
	where,
	orderBy,
	getDocs,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import {
	getAuth,
	onAuthStateChanged,
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
const db = getFirestore(app);

function displayUserReviews() {
	const currentUser = auth.currentUser;
	if (!currentUser) return;

	const reviewsRef = collection(db, "bookReviews");
	const q = query(
		reviewsRef,
		where("uid", "==", currentUser.uid),
		orderBy("timestamp", "desc")
	);

	getDocs(q)
		.then((querySnapshot) => {
			const reviewsContainer = document.getElementById(
				"user-reviews-container"
			);
			reviewsContainer.innerHTML = ""; // 기존 리뷰 초기화

			querySnapshot.forEach((doc) => {
				const review = doc.data();
				const reviewElement = document.createElement("div");
				reviewElement.innerHTML = `
          <h3>${review.title}</h3>
          <p>${review.emoji} - ${review.content}</p>
          <small>${review.timestamp.toDate().toLocaleString()}</small>
        `;
				reviewsContainer.appendChild(reviewElement);
			});
		})
		.catch((error) => {
			console.error("Error fetching reviews:", error);
		});
}

onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		// 사용자가 로그인한 경우 리뷰 표시
		displayUserReviews();
	} else {
		// 로그인하지 않은 경우 처리
		window.location.href = "../index.html"; // 로그인 페이지로 리다이렉트
	}
});
