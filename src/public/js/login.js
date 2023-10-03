document.querySelector("#loginForm").addEventListener("submit", async function (e) {
	e.preventDefault();

	const email = document.querySelector("#email").value;
	const password = document.querySelector("#password").value;

	try {
		await fetch('/api/session/login', {
					method: 'POST',
					redirect: 'follow',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({email: email, password: password}),
		})
		.then(response => {
			console.log(response)
			if (response.ok) 
				window.location.href = "/home";
		})
		.catch(error => {
			console.error(error);
		})

	} catch (error) {
		console.error(error);
		Swal.fire({
			icon: "error",
			title: "Oops...",
			text: "Hubo un problema al intentar iniciar sesión",
		});
	}
});
