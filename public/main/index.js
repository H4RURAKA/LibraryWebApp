document.addEventListener("mousemove", (e) => {
	// Mouse position for entire page
	const mouseX = e.clientX;
	const mouseY = e.clientY;

	document.querySelectorAll(".left-banner").forEach((banner) => {
		// Position and size information for each left-banner
		const rect = banner.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Calculate the angle between mouse position and left-banner center
		const angle =
			(Math.atan2(mouseY - centerY, mouseX - centerX) * 180) / Math.PI;

		// Set gradient direction for left-banner
		if (banner.classList.contains("left-banner-2")) {
			banner.style.background = `linear-gradient(${angle}deg, #fccb90 0%, #d57eeb 100%)`;
		} else if (banner.classList.contains("left-banner-1")) {
			banner.style.background = `linear-gradient(${angle}deg, #30cfd0 0%, #330867 100%)`;
		} else if (banner.classList.contains("left-banner-3")) {
			banner.style.background = `linear-gradient(${angle}deg, #96fbc4 0%, #f9f586 100%)`;
		}
	});
});
