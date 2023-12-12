import {
	getFirestore,
	query,
	collection,
	where,
	orderBy,
	getDocs,
	doc,
	getDoc,
	deleteDoc,
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

// Reset Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get and display review data
function loadReviews() {
	const currentUser = auth.currentUser;
	if (!currentUser) return;

	const reviewsRef = collection(db, "bookReviews");
	const q = query(
		reviewsRef,
		where("uid", "==", currentUser.uid),
		orderBy("timestamp", "desc")
	);

	getDocs(q).then((querySnapshot) => {
		const reviewsContainer = document.getElementById("reviews-container");
		reviewsContainer.innerHTML = "";

		if (querySnapshot.empty) {
			reviewsContainer.innerHTML = `<p>You have not yet written a book report.</br></br>
			>> <a href="../record/index.html" class="link">Go to write a book report now</a> <<</p>`;
			return;
		}

		querySnapshot.forEach((docSnapshot) => {
			const review = docSnapshot.data();
			const reviewElement = document.createElement("div");
			reviewElement.innerHTML = `
				<div class="review-detail">
					<h3>${review.title}</h3>
					<small>${review.timestamp.toDate().toLocaleString()}</small>
				</div>
				<span class="material-symbols-outlined" id="more-${
					docSnapshot.id
				}">double_arrow</span>
            `;
			reviewsContainer.appendChild(reviewElement);

			document
				.getElementById(`more-${docSnapshot.id}`)
				.addEventListener("click", () => {
					showDetail(docSnapshot.id);
				});
		});
	});
}

onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		loadReviews();
	}
});

// Show detail
function showDetail(docId) {
	// Get reviews for that docId from Firestore
	const docRef = doc(db, "bookReviews", docId);
	getDoc(docRef).then((docSnap) => {
		if (docSnap.exists()) {
			const review = docSnap.data();
			document.getElementById("detail-title").textContent = review.title;
			document.getElementById("detail-date").textContent =
				review.timestamp.toDate().toLocaleString();
			document.getElementById("detail-content").textContent =
				review.content;
			document.getElementById("detail-emoticon").textContent =
				review.emoji;

			document.getElementById("detail-section").style.display = "block";
			document.getElementById("reviews-container").style.display = "none";

			document.getElementById("delete-detail").onclick = () =>
				deleteReview(docId);
		} else {
			console.log("No such document!");
		}
	});
}

// event listener to close btn
document.getElementById("close-detail").addEventListener("click", function () {
	location.reload();
});

// delete review
function deleteReview(docId) {
	if (
		confirm(
			"Are you sure you want to delete this review? This action cannot be undone."
		)
	) {
		const docRef = doc(db, "bookReviews", docId);
		deleteDoc(docRef)
			.then(() => {
				alert("Review deleted successfully.");
				location.reload();
			})
			.catch((error) => {
				alert("Error deleting review.");
			});
	}
}
