document.addEventListener("DOMContentLoaded", () => {
	const navButton = document.querySelector("#navButton");
	const userNameElement = document.querySelector("#userName");

	const authenticated = document.cookie.includes("authenticated=true");
	// console.log("authenticated", authenticated)
	if (authenticated) {
		navButton.textContent = "Signout";
		const username = getCookie("username");
		if (username) {
			userNameElement.textContent = `Bienvenido, ${username}`;
		}
	} else {
		navButton.textContent = "Login";
	}

	navButton.addEventListener("click", () => {
		if (navButton.textContent === "Signout") {
			document.cookie = "authenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Elimina la cookie del nombre de usuario
			window.location.href = "/logout";
		} else {
			window.location.href = "/login";
		}
	});

	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(";").shift();
	}
});
