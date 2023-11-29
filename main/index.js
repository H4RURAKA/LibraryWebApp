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

document.addEventListener("DOMContentLoaded", function () {
	var startX, endX;
	var minSwipeDistance = 30; // 스와이프를 감지하기 위한 최소 거리
	var navigation = document.getElementById("navigation");
	var overlay = document.getElementById("overlay");

	document.addEventListener("touchstart", function (e) {
		startX = e.touches[0].pageX;
	});

	document.addEventListener("touchmove", function (e) {
		endX = e.touches[0].pageX;
	});

	document.addEventListener("touchend", function (e) {
		if (endX - startX > minSwipeDistance) {
			navigation.classList.add("open");
			overlay.style.display = "block";
		}
	});
});
