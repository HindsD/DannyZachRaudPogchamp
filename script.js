const isGithubPages = window.location.hostname === "hindsd.github.io";
if (isGithubPages) {
    document.querySelectorAll("a").forEach(link => {
        link.href = "/DannyZachRaudPogchamp/" + link.getAttribute("href");
    });
}