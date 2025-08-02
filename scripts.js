const logo = document.getElementById("logo");
let isLight = false;

logo.addEventListener("dblclick", () => {
  isLight = !isLight;
  document.body.classList.toggle("light", isLight);
});

// Utility: shuffle array
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function loadArticles() {
  try {
    // Adjust the path to your actual JSON location
    const response = await fetch("/articles/articles.json");
    if (!response.ok) throw new Error("Failed to load articles");
    const articles = await response.json();

    if (!articles.length) return;

    // Pick featured article (for example, first in array)
    const featured = articles[0];

    // Shuffle remaining articles
    const remaining = articles.slice(1);
    shuffleArray(remaining);

    // Pick 3 random middle articles
    const middleArticles = remaining.slice(0, 3);

    // Bottom articles = all remaining after middle
    const bottomArticles = remaining.slice(3);

    renderFeatured(featured);
    renderMiddle(middleArticles);
    renderBottom(bottomArticles);
  } catch (err) {
    console.error("Error loading articles:", err);
  }
}

function renderFeatured(article) {
  const container = document.getElementById("featured-article");
  container.innerHTML = `
    <h1><a href="${article.link}" style="color:#ff6b35; text-decoration:none;">${article.title}</a></h1>
    <p>${article.summary}</p>
  `;
}

function renderMiddle(articles) {
  const container = document.getElementById("middle-articles");
  container.innerHTML = "";
  articles.forEach((article) => {
    const div = document.createElement("div");
    div.className = "middle-article";
    div.innerHTML = `
      <h3><a href="${article.link}" style="color:#ff6b35; text-decoration:none;">${article.title}</a></h3>
      <p>${article.summary}</p>
    `;
    container.appendChild(div);
  });
}

function renderBottom(articles) {
  const container = document.getElementById("bottom-scroll");
  container.innerHTML = "";
  articles.forEach((article) => {
    const div = document.createElement("div");
    div.className = "scroll-article";
    div.innerHTML = `
      <h4><a href="${article.link}" style="color:#ff6b35; text-decoration:none;">${article.title}</a></h4>
      <p>${article.summary}</p>
    `;
    container.appendChild(div);
  });
}

loadArticles();
