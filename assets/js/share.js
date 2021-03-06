(function() {
	var supportsShare = "share" in navigator;

	if (!supportsShare) {
		document.documentElement.classList.add("noShare");
		return;
	}

	var shareButton = document.querySelector(".post-share");
	var canonicalUrl = document
		.querySelector("link[rel=canonical]")
		.getAttribute("href");
	var title = document.querySelector("title").innerText;

	shareButton.addEventListener("click", function(event) {
		navigator
			.share({
				title: title,
				url: canonicalUrl
			})
			.then(() => {
				console.log("Thanks for sharing!");
			})
			.catch(console.error);
	});
})();
