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
