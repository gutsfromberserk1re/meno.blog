async function fetchArticles() {
  try {
    const res = await fetch('./articles/articles.json');
    if (!res.ok) throw new Error('Failed to fetch articles');
    const articles = await res.json();
    return articles;
  } catch (e) {
    console.error(e);
    return [];
  }
}

function pickRandomIndices(length, n, exclude = []) {
  const indices = [];
  while (indices.length < n && indices.length < length) {
    const r = Math.floor(Math.random() * length);
    if (!indices.includes(r) && !exclude.includes(r)) {
      indices.push(r);
    }
  }
  return indices;
}

function createArticleHTML(article) {
  const imgSrc = article.images && article.images.length > 0
    ? article.images[Math.floor(Math.random() * article.images.length)]
    : 'https://placekitten.com/400/200';

  return `
    <article>
      <div>
        <h3>${article.title}</h3>
        <p>${article.summary}</p>
      </div>
      <img src="${imgSrc}" alt="${article.title} image" />
    </article>
  `;
}

function createFeaturedHTML(article) {
  const imgSrc = article.images && article.images.length > 0
    ? article.images[Math.floor(Math.random() * article.images.length)]
    : 'https://placekitten.com/800/400';

  return `
    <h1>${article.title}</h1>
    <p>${article.summary}</p>
    <img src="${imgSrc}" alt="${article.title} image" />
  `;
}

async function renderArticles() {
  const articles = await fetchArticles();
  if (articles.length === 0) return;

  const featuredIndex = Math.floor(Math.random() * articles.length);
  const featured = articles[featuredIndex];
  document.getElementById('featured-article').innerHTML = createFeaturedHTML(featured);

  const middleIndices = pickRandomIndices(articles.length, 3, [featuredIndex]);
  const middleHTML = middleIndices.map(i => createArticleHTML(articles[i])).join('');
  document.getElementById('middle-articles').innerHTML = middleHTML;

  const excludeIndices = [featuredIndex, ...middleIndices];
  const moreIndices = pickRandomIndices(articles.length, 4, excludeIndices);
  const moreHTML = moreIndices.map(i => {
    const art = articles[i];
    const imgSrc = art.images && art.images.length > 0
      ? art.images[Math.floor(Math.random() * art.images.length)]
      : 'https://placekitten.com/600/300';
    return `
      <article>
        <div>
          <h4>${art.title}</h4>
          <p>${art.summary}</p>
        </div>
        <img src="${imgSrc}" alt="${art.title} image" />
      </article>
    `;
  }).join('');
  document.getElementById('more-articles').innerHTML = moreHTML;
}

// Initial render
renderArticles();

// Toggle dark/light mode on single click
document.getElementById('logo').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});
