(() => {
    const password = document.querySelector("#password");
    const passwordToggle = document.querySelector(".password-toggle");

    if (!password || !passwordToggle) return;

    passwordToggle.addEventListener("click", () => {
        const isVisible = password.type === "text";
        password.type = isVisible ? "password" : "text";
        passwordToggle.textContent = isVisible ? "Show" : "Hide";
        passwordToggle.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
        passwordToggle.setAttribute("aria-pressed", String(!isVisible));
    });
})();
