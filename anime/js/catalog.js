import { getAnime } from "./api.js";

const content = document.querySelector(".content");

const ageRati = {
  g: { label: "0+", color: "rgba(46, 204, 113, 1.0)" }, // G — для всех
  pg: { label: "6+", color: "rgba(241, 196, 15, 1.0)" }, // PG — детям с 6 лет
  pg_13: { label: "12+", color: "rgba(230, 126, 34, 1.0)" }, // PG-13 — с 12 лет
  r: { label: "16+", color: "rgba(231, 76, 60, 1.0)" }, // R — с 16 лет
  r_plus: { label: "18+", color: "rgba(52, 73, 94, 1.0)" }, // R+ — только взрослым
  rx: { label: "18+", color: "rgba(52, 73, 94, 1.0)" }, // RX — только взрослым
  none: { label: "-", color: "rgba(149, 165, 166,1.0)" },
};

export function createCatalogPage() {
  content.innerHTML = "";

  let obj = `
    
      <div class="container catalog">
    <aside class="side-bar">
        <div class="block">1</div>
    </aside>
    <div class="catalog__content">
        <div class="block">
            <div class = "card__grid catalog"></div>
        </div>
    </div>
  </div>
    
    `;
  content.insertAdjacentHTML("beforeend", obj);




  async function getRandom(limit) {
    try {
      const animeList = await getAnime("", limit, "", "random", "");
      for (let i = 0; i < animeList.length; i++) {
        let anime = animeList[i];

        const poster =
          anime.poster?.mainUrl ||
          anime.poster?.originalUrl ||
          "../img/placeholder-1080x1920.png";

        let name = anime.russian || anime.english || anime.japanese;

        const colorRati =
          anime.score >= 5 ? "rgba(39, 174, 96,1.0)" : "rgba(192, 57, 43,1.0)";

        let obj = `
              <div class="card" data-id=${anime.id}>
                <div class="card__img">
                <img src="${poster}" alt="${name}">
                <p class="anime__rati" style = "background: ${colorRati};">${anime.score}</p>
                <p class="age__rati" style = "background: ${ageRati[anime.rating].color}">${ageRati[anime.rating].label}</p>
                
                </div>
                <div class=" card__body">
                
                <span class= "card__title">${name}</span>
                <span class = "card__type">
                </div>
              </div>
            `;
        document.querySelector(".catalog__content .block .card__grid").insertAdjacentHTML("beforeend", obj);
      }
    } catch (error) {
      console.error(error);
    }
  }

  getRandom(50)



}
