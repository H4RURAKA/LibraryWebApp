//menu btn javascript (common file)
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
