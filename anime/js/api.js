const url = "https://shikimori.io/api/graphql";
let animeList = [];
let oneAnime = {};

let animeNews = [];



export async function getAnime(
  name = "",
  limit = 25,
  type = "",
  sort = "id",
  status = "",
) {
  try {
    const Response = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `
                    {
                    animes(search: "${name}", limit: ${limit}, kind: "${type}", order: ${sort}, status: "${status}"){
                    id

                    name
                    english
                    russian
                    japanese

                    kind

                    rating 
                    score
                    status

                    airedOn { year month day date }
                    episodes
                    episodesAired
                    poster { id originalUrl mainUrl }
                    url
                    }
                    }
                `,
      }),
    });

    if (!Response.ok) {
      throw new Error("Ошибка сервера ");
    }
    const json = await Response.json();

    animeList = json.data.animes;
    
    return animeList;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getOneAnime(id) {
  try {
    const Response = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query($id: String!) { 
            animes(ids: $id, limit: 1) { 
    id
    malId
    name
    russian
    licenseNameRu
    english
    japanese
    synonyms
    kind
    rating
    score
    status
    episodes
    episodesAired
    duration
    airedOn { year month day date }
    releasedOn { year month day date }
    url
    season

    poster { id originalUrl mainUrl }

    fansubbers
    fandubbers
    licensors
    createdAt,
    updatedAt,
    nextEpisodeAt,
    isCensored

    genres { id name russian kind }
    studios { id name imageUrl }

    externalLinks {
      id
      kind
      url
      createdAt
      updatedAt
    }

    personRoles {
      id
      rolesRu
      rolesEn
      person { id name poster { id } }
    }
    characterRoles {
      id
      rolesRu
      rolesEn
      character { id name poster { id } }
    }

    related {
      id
      anime {
        id
        name
      }
      manga {
        id
        name
      }
      relationKind
      relationText
    }

    videos { id url name kind playerUrl imageUrl }
    screenshots { id originalUrl x166Url x332Url }

    scoresStats { score count }
    statusesStats { status count }

    description
    descriptionHtml
    descriptionSource
            } 
          }
        `,
        variables: {
          id: String(id),
        },
      }),
    });

    if (!Response.ok) {
      throw new Error("Ошибка сервера ");
    }
    const json = await Response.json();

    oneAnime = json.data.animes;
    return oneAnime;
  } catch (error) {
    console.error(error.message);
  }
}

export async function getAnimeNews() {
  const response = await fetch(
    "https://shikimori.io/api/topics?forum=news&limit=100",
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  animeNews = data;

  return animeNews;
}



export function overlay(){
 




}