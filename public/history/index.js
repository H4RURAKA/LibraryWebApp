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

// 리뷰 데이터 가져오기 및 표시
function loadReviews() {
	const reviewsRef = collection(db, "bookReviews");
	const q = query(reviewsRef, orderBy("timestamp", "desc"));

	getDocs(q).then((querySnapshot) => {
		const reviewsContainer = document.getElementById("reviews-container");
		reviewsContainer.innerHTML = "";

		querySnapshot.forEach((doc) => {
			const review = doc.data();
			const reviewElement = document.createElement("div");
			reviewElement.innerHTML = `
                <h3>${review.title}</h3>
                <button onclick="showModal('${review.title}', '${
				review.content
			}')">More</button>
                <small>${review.timestamp.toDate().toLocaleString()}</small>
            `;
			reviewsContainer.appendChild(reviewElement);
		});
	});
}

// 모달 표시 함수
function showModal(title, content) {
	const modal = document.getElementById("modal");
	document.getElementById("modal-title").textContent = title;
	// 내용 추가 가능
	modal.style.display = "block";
}

// 모달 숨기기 함수
document.querySelector(".close-button").addEventListener("click", function () {
	document.getElementById("modal").style.display = "none";
});

onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		loadReviews();
	}
});
