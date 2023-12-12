// when click search button
document
	.getElementById("book-search-button")
	.addEventListener("click", function () {
		var query = document.getElementById("book-search-input").value;
		searchBook(query);
	});

// Book search API (KAKAO API) (kakao developers)
// https://developers.kakao.com/docs/latest/ko/daum-search/dev-guide#search-book
function searchBook(query) {
	var API_KEY = "ca61c034b0fb920c14f59b9b6761ec0d";
	var url =
		"https://dapi.kakao.com/v3/search/book?target=title&query=" +
		encodeURIComponent(query);

	fetch(url, {
		headers: {
			Authorization: "KakaoAK " + API_KEY,
		},
	})
		.then((response) => response.json())
		.then((data) => displayResults(data));
}

// Global variable for storing the selected book title
let selectedBookTitle = "";

// print book list
function displayResults(data) {
	var resultsContainer = document.getElementById("book-search-results");
	resultsContainer.innerHTML = ""; // Delete previous search results
	data.documents.forEach((book) => {
		var bookElement = document.createElement("div");
		bookElement.innerHTML = `
            <img src="${book.thumbnail}" alt="${book.title}" />
            <p>${book.title}<br/> <br/>
			<text id="authors"> by ${book.authors.join(", ")}</text> 
			</p>
        `;
		resultsContainer.appendChild(bookElement);
	});
}

// when select book by div
document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("book-search-results")
		.addEventListener("click", function (event) {
			var clickedElement = event.target;
			while (
				clickedElement &&
				!clickedElement.matches("#book-search-results div")
			) {
				clickedElement = clickedElement.parentNode;
			}

			if (clickedElement) {
				var fullText = clickedElement.querySelector("p").innerHTML;
				var bookTitle = fullText.split("<br>")[0];
				selectedBookTitle = bookTitle;
				displayReviewSection(bookTitle);
			}
		});
});

// After you select book
function displayReviewSection(bookTitle) {
	// hide search section
	document.getElementById("Book_Search").style.display = "none";

	// show record section with book title
	var reviewSection = document.getElementById("Write_Record");
	reviewSection.style.display = "block";
	reviewSection.querySelector("h3").textContent = "Selected : " + bookTitle;

	reviewSection.querySelector("textarea").focus();
}

// select emoji
document.addEventListener("DOMContentLoaded", function () {
	var emojis = document.querySelectorAll(".emoji");

	emojis.forEach(function (emoji) {
		emoji.addEventListener("click", function () {
			// inactive other emoji
			emojis.forEach(function (e) {
				e.classList.remove("active");
			});

			// add 'active' class to select emoji (100% color scale)
			emoji.classList.add("active");
		});
	});
});

import {
	getFirestore,
	collection,
	addDoc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
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

// Reset Firestore instance
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.querySelector("form").addEventListener("submit", async (e) => {
	e.preventDefault();

	const activeEmoji = document.querySelector(
		"#emoji-container .active"
	).textContent;
	const bookTitle = selectedBookTitle;
	const content = document.querySelector('textarea[name="content"]').value;

	// Store data to Firestore
	try {
		const docRef = await addDoc(collection(db, "bookReviews"), {
			uid: auth.currentUser.uid,
			title: bookTitle,
			emoji: activeEmoji,
			content: content,
			timestamp: new Date(),
		});
		console.log("Document written with ID: ", docRef.id);
		location.reload(); // reload
		alert("Review saved successfully!");
		location.reload(); // reload
	} catch (e) {
		console.error("Error adding document: ", e);
		alert("Error saving review.");
	}
});
