const apiKey = "77aaa40707ae48e6913523b88e3bf60c";
const main = document.querySelector("main");
const loader = document.querySelector(".loader");
const appName = document.querySelector(".app-name h2");
const sourceSelector = document.querySelector("#sourceSelector");
const defaultSource = "techcrunch";

function scrollDetect() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    appName.innerText = "L";
    sourceSelector.style.width = "50px";
  } else {
    appName.innerText = "Laži";
    sourceSelector.style.width = "auto";
  }
}

async function updateSource() {
  const res = await fetch("https://newsapi.org/v1/sources");
  const json = await res.json();

  sourceSelector.innerHTML = json.sources
    .map(src => `<option value="${src.id}">${src.name}</option>`)
    .join("\n");
}

async function updateNews(source = defaultSource) {
  const res = await fetch(
    `https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`
  );
  const json = await res.json();

  console.log("res = await fetch", res);
  console.log(".json()", json);

  // console.log("dzej", json);

  loader.style.display = "none";

  main.innerHTML = json.articles
    .map(article => {
      if (article.title.length > 60) {
        return `
      <div class="article article--long">
        <a href="${article.url}">
          <h2>${article.title.substring(0, 60)}</h2>
          <img src="${article.urlToImage}">
          <p>${article.description}</p>
        </a>
      </div>
      `;
      }
      return `
        <div class="article">
          <a href="${article.url}">
            <h2>${article.title}</h2>
            <img src="${article.urlToImage}">
            <p>${article.description}</p>
          </a>
        </div>
        `;
    })
    .join("\n");
}

// events
window.addEventListener("load", async () => {
  updateNews();
  await updateSource();
  sourceSelector.value = defaultSource;
  sourceSelector.addEventListener("change", async e => {
    updateNews(e.target.value);
    document
      .querySelectorAll(".article")
      .forEach(e => e.parentNode.removeChild(e));
    loader.style.display = "block";
  });

  if ("serviceWorker" in navigator) {
    try {
      // swp was used for plugin
      navigator.serviceWorker.register("swp.js");
      console.log("swp registered");
    } catch (error) {
      console.log("swp registration failed");
    }
  }
});
window.addEventListener("scroll", () => {
  scrollDetect();
});
