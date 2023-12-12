import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import {
	getAuth,
	onAuthStateChanged,
	updatePassword,
	deleteUser,
	EmailAuthProvider,
	reauthenticateWithCredential,
	signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
	getFirestore,
	collection,
	query,
	where,
	getDocs,
	deleteDoc,
	doc,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyDWY38JJj04fa5wZotBLtYVmfk3hC4effI",
	authDomain: "yourlibrary-25f98.firebaseapp.com",
	projectId: "yourlibrary-25f98",
	storageBucket: "yourlibrary-25f98.appspot.com",
	messagingSenderId: "188512431713",
	appId: "1:188512431713:web:c48e8a94e6a87ee4594420",
	measurementId: "G-QFHGSFZN4K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// get Firebase Auth
const auth = getAuth(app);
const db = getFirestore(app);

// Flag to logout state
let isLoggingOut = false;

// Check currently logged in user
onAuthStateChanged(auth, (currentUser) => {
	if (currentUser) {
		// Display email of currently logged in user
		document.getElementById("current-user-id").textContent =
			currentUser.email;
		initializePageContent();
		let isLoggingOut = false;
	} else if (!isLoggingOut) {
		alert("Access is restricted to members only.");
		window.location.href = "../index.html"; // redirectin to login page
	}
});

document
	.getElementById("password-change-form")
	.addEventListener("submit", function (e) {
		e.preventDefault();

		// Get elements and inputs
		const currentPasswordInput =
			document.getElementById("current-password");
		const newPasswordInput = document.getElementById("new-password");
		const confirmNewPasswordInput = document.getElementById(
			"confirm-new-password"
		);

		// Error message element
		const currentPasswordError = document.getElementById(
			"current-password-error"
		);
		const newPasswordError = document.getElementById("new-password-error");
		const confirmNewPasswordError = document.getElementById(
			"confirm-new-password-error"
		);

		// Reset error message
		currentPasswordError.style.display = "none";
		newPasswordError.style.display = "none";
		confirmNewPasswordError.style.display = "none";

		const currentPassword = currentPasswordInput.value;
		const newPassword = newPasswordInput.value;
		const confirmNewPassword = confirmNewPasswordInput.value;

		let hasError = false; // A flag indicating whether there was an error

		// Check whether the new password matches the password confirm
		if (newPassword !== confirmNewPassword) {
			confirmNewPasswordError.textContent =
				"It does not match new password";
			confirmNewPasswordError.style.display = "block";
			hasError = true;
		}

		// Check the length of your new password (at least 6 characters)
		if (newPassword.length < 6) {
			newPasswordError.textContent =
				"Password should be at least 6 characters";
			newPasswordError.style.display = "block";
			hasError = true;
		}

		// Make sure your new password is the same as your current password
		if (newPassword === currentPassword) {
			newPasswordError.textContent =
				"New password should be different with current password";
			newPasswordError.style.display = "block";
			hasError = true;
		}

		// If there are no errors and the user is logged in
		if (!hasError && auth.currentUser) {
			// Generate credentials using EmailAuthProvider
			const credential = EmailAuthProvider.credential(
				auth.currentUser.email,
				currentPassword
			);

			// Re-authenticate with current password
			reauthenticateWithCredential(auth.currentUser, credential)
				.then(() => {
					// Re-authentication successful, password change
					updatePassword(auth.currentUser, newPassword)
						.then(() => {
							alert("Password successfully changed.");
							location.reload();
						})
						.catch((error) => {
							console.error(
								"Error occurred while changing password:",
								error
							);
							alert("Error occurred while changing password");
						});
				})
				.catch((error) => {
					console.error("Reauthentication error:", error);
					currentPasswordError.textContent = ""; // reset
					switch (error.code) {
						case "auth/too-many-requests":
							currentPasswordError.textContent =
								"Too many login attempts. Please try again later.";
							break;
						case "auth/invalid-credential":
							currentPasswordError.textContent =
								"Incorrect password";
							break;
					}
					currentPasswordError.style.display = "block";
				});
		}
	});

// Account deletion event listener
document
	.getElementById("delete-account-button")
	.addEventListener("click", function () {
		const confirmation = confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);

		if (confirmation) {
			const user = auth.currentUser;

			// Delete a book report written by a user
			const reviewsRef = collection(db, "bookReviews");
			const q = query(reviewsRef, where("uid", "==", user.uid));

			getDocs(q)
				.then((querySnapshot) => {
					querySnapshot.forEach((docSnapshot) => {
						deleteDoc(doc(db, "bookReviews", docSnapshot.id));
					});

					// Deleting your account after all book reports have been deleted
					deleteUser(user)
						.then(() => {
							alert("Account deleted successfully.");
						})
						.catch((error) => {
							console.error("Account deletion error:", error);
							alert("Account deletion error");
						});
				})
				.catch((error) => {
					console.error("Error deleting user reviews:", error);
					alert("Error deleting user reviews");
				});
		}
	});

// logout function
function logout() {
	isLoggingOut = true; // logout flag
	signOut(auth)
		.then(() => {
			// success to logout
			alert("Logout success");
			window.location.href = "../index.html"; // go to login page
		})
		.catch((error) => {
			// logout error
			console.error("Logout Error:", error);
			alert("Logout Error");
			isLoggingOut = false; // reset flag
		});
}

function initializePageContent() {
	const loadingCover = document.getElementById("loadingCover");
	if (loadingCover) {
		loadingCover.classList.add("hidden");
		setTimeout(() => {
			loadingCover.style.display = "none";
		}, 500); // CSS transition
	}
}

// logout btn event listener
document.getElementById("logout-button").addEventListener("click", logout);
