document.querySelector("#signUpForm").addEventListener("submit", async function (e) {
	e.preventDefault();

	const dataForm = new FormData(e.target);
	const newUser = Object.fromEntries(dataForm);

		try {
			const resp = await fetch('/api/session/register', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(newUser)
			});

			const info = await resp.json();

			if (resp.status === 200 || resp.status === 401) {
				window.location.href = "/home";
			
			} else {
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: info.respuesta,
				});
			}
		
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Hubo un problema al registrar usuario",
			});
		}
			
});

document.querySelector("#githubSignupButton").addEventListener("click", () => {
	window.location.href = "/api/session/github";
});