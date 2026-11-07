import { getAnime } from "./api.js";
import { getOneAnime } from "./api.js";
import { getAnimeNews } from "./api.js";

const oneAnime = await getOneAnime();

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


export function createIndexPage() {
  content.innerHTML = "";

  let obj = `
    
              <div class="container">

                <div class="block" loading="lazy">
                  <h2 class="block__title">Сейчас на экране</h2>
                    <div class="card__grid ongoing">
                  </div>
                </div>

                <div class="block" loading="lazy">
                  <h2 class="block__title">Самые популярные</h2>
                    <div class="card__grid top">
                  </div>
                </div>

                                <div class="block transparent" loading="lazy">
                  <h2 class="block__title">Новости </h2>
                    <div class="card__grid news">
                  </div>
                </div>

                <div class="block" loading="lazy">
                  <h2 class="block__title">Рандомные анимешки </h2>
                    <div class="card__grid all__anime">
                  </div>
                </div>

              </div>
    
    `;
  content.insertAdjacentHTML("beforeend", obj);

  async function getOngoing() {
    try {
      const animeList = await getAnime("", 8, "", "popularity", "ongoing");

      for (let i = 0; i < animeList.length; i++) {
        let anime = animeList[i];
        let poster =
          anime.poster.mainUrl ||
          anime.poster.originalUrl ||
          "../img/placeholder-1080x1920.png";

        let name = anime.russian;

        const colorRati =
          anime.score >= 5 ? "rgba(39, 174, 96,1.0)" : "rgba(192, 57, 43,1.0)";

        let obj = `
          <div class="card" data-id="${anime.id}">
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
        document.querySelector(".ongoing").insertAdjacentHTML("beforeend", obj);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getTop(limit=8) {
    try {
      const animeList = await getAnime("", limit, "", "popularity", "");

      for (let i = 0; i < animeList.length; i++) {
        let anime = animeList[i];

        const poster =
          anime.poster?.mainUrl ||
          anime.poster?.originalUrl ||
          "../img/placeholder-1080x1920.png";

        let name = anime.russian;

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
        document.querySelector(".top").insertAdjacentHTML("beforeend", obj);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function getNews(limit = 3) {
    const animeNews = await getAnimeNews();
   

    for (let i = 0; i< limit; i++){
      
      let linki = ''

      let news = animeNews[i]

      function getImg (link){

         let htmlFooter =  news.html_footer

         if (!htmlFooter) return null;

        const doc = new DOMParser().parseFromString(link, "text/html");
        
        linki = doc.querySelector("a.b-image") || 'img/placeholder-1920x1080.png';
      }

      getImg(news.html_footer)



      let obj =`
        <div class = "card__news block">
        
        <img src = "${linki}">
        <span>${news.topic_title}</span>
        </div>



      `
      document.querySelector('.news').insertAdjacentHTML("beforeend", obj);
    }
  }

  async function getRandom(limit = 8) {
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
        document
          .querySelector(".all__anime")
          .insertAdjacentHTML("beforeend", obj);
      }
    } catch (error) {
      console.error(error);
    }
  }

  getOngoing();
  getTop();
  getNews()
  getRandom();
}


