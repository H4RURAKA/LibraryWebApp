//메뉴버튼
document.addEventListener("DOMContentLoaded", function () {
	var menuIcon = document.getElementById("menu-icon");
	var navigation = document.getElementById("navigation");
	var overlay = document.getElementById("overlay");

	menuIcon.addEventListener("click", function () {
		navigation.classList.toggle("open");
		overlay.style.display = navigation.classList.contains("open")
			? "block"
			: "none";
		menuIcon.textContent = navigation.classList.contains("open")
			? "close"
			: "menu";
	});

	overlay.addEventListener("click", function () {
		navigation.classList.remove("open");
		overlay.style.display = "none";
		menuIcon.textContent = "menu";
	});
});

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

document.addEventListener("DOMContentLoaded", function () {
	document
		.getElementById("book-search-results")
		.addEventListener("click", function (event) {
			if (event.target && event.target.nodeName == "IMG") {
				// 이미지 클릭시
				var fullText = event.target.nextElementSibling.innerHTML;
				var bookTitle = fullText.split("<br>")[0];
				displayReviewSection(bookTitle); // 독후감 섹션 표시 함수 호출
			}
		});
});

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
