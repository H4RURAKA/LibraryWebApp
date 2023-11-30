//책 검색버튼 클릭시
document
	.getElementById("book-search-button")
	.addEventListener("click", function () {
		var query = document.getElementById("book-search-input").value;
		searchBook(query);
	});

//책 받아오는 카카오api (kakao developers 나와있는대로)
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

// 전역 변수로 선택된 책 제목 저장
let selectedBookTitle = "";

//책 출력
function displayResults(data) {
	var resultsContainer = document.getElementById("book-search-results");
	resultsContainer.innerHTML = ""; // 이전 검색 결과 삭제
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

//책 클릭시
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
				displayReviewSection(bookTitle); // 독후감 섹션 표시 함수 호출
			}
		});
});

//책 선택 후 일어나는 일
function displayReviewSection(bookTitle) {
	// 검색 섹션 숨기기
	document.getElementById("Book_Search").style.display = "none";

	// 독후감 섹션 표시 및 책 제목 설정
	var reviewSection = document.getElementById("Write_Record");
	reviewSection.style.display = "block";
	reviewSection.querySelector("h3").textContent = "Selected : " + bookTitle;

	// 독후감 작성란에 초점 맞추기
	reviewSection.querySelector("textarea").focus();
}

//이모지 선택
document.addEventListener("DOMContentLoaded", function () {
	var emojis = document.querySelectorAll(".emoji");

	emojis.forEach(function (emoji) {
		emoji.addEventListener("click", function () {
			// 다른 이모지의 활성 상태를 제거
			emojis.forEach(function (e) {
				e.classList.remove("active");
			});

			// 클릭된 이모지에 'active' 클래스 추가
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

// Firestore 인스턴스 초기화
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

	// Firestore에 데이터 저장
	try {
		const docRef = await addDoc(collection(db, "bookReviews"), {
			uid: auth.currentUser.uid,
			title: bookTitle,
			emoji: activeEmoji,
			content: content,
			timestamp: new Date(),
		});
		console.log("Document written with ID: ", docRef.id);
		location.reload(); // 페이지 새로고침
		alert("Review saved successfully!");
		location.reload(); // 페이지 새로고침
	} catch (e) {
		console.error("Error adding document: ", e);
		alert("Error saving review.");
	}
});
