const OMDB_API_KEY = "thewdb";
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsEl = document.getElementById("results");
const loading = document.getElementById("loading");
const noResults = document.getElementById("noResults");

async function searchMovies(query) {
  if (!query.trim()) return;
  resultsEl.innerHTML = "";
  noResults.classList.add("d-none");
  loading.style.display = "block";

  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`);
    const data = await res.json();

    loading.style.display = "none";

    if (data.Response === "False") {
      noResults.classList.remove("d-none");
      return;
    }

    const movies = data.Search.slice(0, 9);
    for (const m of movies) {
      const detailRes = await fetch(`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${m.imdbID}`);
      const detail = await detailRes.json();
      console.log(detail)
      displayMovie(detail);
    }
  } catch (err) {
    loading.style.display = "none";
    console.error(err);
    alert("Error fetching data. Please check console.");
  }
}

function displayMovie(movie) {
  const col = document.createElement("div");
  col.className = "col-12 col-sm-6 col-md-4 col-lg-3";

  const card = document.createElement("div");
  card.className = "card h-100 shadow-sm";

  if (movie.Poster !== "N/A") {
    card.innerHTML = `
      <img src="${movie.Poster}" class="card-img-top poster" alt="${movie.Title}">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-1">${movie.Title}</h5>
        <p class="small muted mb-2">${movie.Year} • ${movie.Genre}</p>
        <p class="text-truncate small muted mb-3">${movie.Plot}</p>
        <div class="mt-auto">
          <span class="badge bg-light text-dark rating-badge">⭐ IMDb: ${movie.imdbRating}</span>
        </div>
      </div>
      <div class="card-footer bg-transparent border-0">
        <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" class="small">View on IMDb</a>
      </div>`;
  } else {
    card.innerHTML = `
      <div class="no-poster"><div>No Poster</div></div>
      <div class="card-body d-flex flex-column">
        <h5 class="card-title mb-1">${movie.Title}</h5>
        <p class="small muted mb-2">${movie.Year}</p>
        <p class="text-truncate small muted mb-3">${movie.Plot}</p>
        <div class="mt-auto">
          <span class="badge bg-light text-dark rating-badge">⭐ IMDb: ${movie.imdbRating}</span>
        </div>
      </div>`;
  }

  col.appendChild(card);
  resultsEl.appendChild(col);
}

searchBtn.addEventListener("click", () => searchMovies(searchInput.value));
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchMovies(searchInput.value);
});