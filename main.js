async function loadArticles() {
  const maxArticles = 20;
  const available = [];

  for (let i = 1; i <= maxArticles; i++) {
    const path = `./Articles/article${i}.html`;
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (res.ok) available.push(path);
    } catch {}
  }

  if (available.length === 0) {
    document.querySelector('#featured-article').innerHTML = '<h1>No articles found.</h1>';
    return;
  }

  available.sort((a,b)=>parseInt(b.match(/\d+/)[0]) - parseInt(a.match(/\d+/)[0]));

  const featured = available[0];
  const rest = available.slice(1).sort(()=>0.5-Math.random());
  const middle = rest.slice(0,4);
  const more = rest.slice(4,10);

  // Featured article
  try {
    const html = await fetch(featured, { cache: "no-store" }).then(r=>r.text());
    document.querySelector('#featured-article').innerHTML = html;
  } catch {
    document.querySelector('#featured-article').innerHTML = "<h1>Couldn't load featured article.</h1>";
  }

  const parseArticleHTML = (html, filePath) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const title = doc.querySelector("h1")?.innerText || doc.querySelector("h3")?.innerText || "No Title";
    const para = doc.querySelector("p")?.innerText || "";
    const imgSrc = doc.querySelector("img")?.src || "";
    const imgAlt = doc.querySelector("img")?.alt || "";

    return `
      <a href="${filePath}" class="article-link">
        <div>
          <h3>${title}</h3>
          <p>${para.slice(0, 120)}...</p>
        </div>
        ${imgSrc ? `<img src="${imgSrc}" alt="${imgAlt}">` : ""}
      </a>
    `;
  };

  const injectArticles = async (files, containerSelector) => {
    const container = document.querySelector(containerSelector);
    for (const file of files) {
      try {
        const html = await fetch(file, { cache: "no-store" }).then(r=>r.text());
        const article = document.createElement("div");
        article.innerHTML = parseArticleHTML(html, file);
        container.appendChild(article.firstElementChild);
      } catch {}
    }
  };

  await injectArticles(middle, "#middle-articles");
  await injectArticles(more, "#more-articles");
}

loadArticles();
