let Base_URL = "https://pokeapi.co/api/v2/pokemon/";


let pokemonCache = [];

let icons = {
  bug: "icons/bug.svg",
  dark: "icons/dark.svg",
  dragon: "icons/dragon.svg",
  electric: "icons/electric.svg",
  fairy: "icons/fairy.svg",
  fighting: "icons/fighting.svg",
  fire: "icons/fire.svg",
  flying: "icons/flying.svg",
  ghost: "icons/ghost.svg",
  grass: "icons/grass.svg",
  ground: "icons/ground.svg",
  ice: "icons/ice.svg",
  normal: "icons/normal.svg",
  poison: "icons/poison.svg",
  psychic: "icons/psychic.svg",
  rock: "icons/rock.svg",
  steel: "icons/steel.svg",
  water: "icons/water.svg",
};

 function init() {
  loadPokemonlist();

}

async function loadPokemonlist(limit = 20) {
  try {
    const listResp = await fetch(`${Base_URL}?limit=${limit}`);
    if (!listResp.ok) {
      console.error("Could not fetch pokemon list", listResp.status);
      return;
    }

    let listJson;
    try {
      listJson = await listResp.json();
    } catch (err) {
      console.error("Failed to parse pokemon list JSON", err);
      return;
    }

    for (let listIndex = 0; listIndex < listJson.results.length; listIndex++) {
      const entry = listJson.results[listIndex];
      await loadDataFromUrl(entry.url, listIndex);

    }
  } catch (err) {
    console.error("Unexpected error in loadPokemonCardsFromList", err);
  }
}

async function loadDataFromUrl(url, pokemonindex) {
  const response = await fetch(url);
  const data = await response.json();

  
  pokemonCache[pokemonindex] = data;

  const name = data.forms[0].name;
  const pic = data.sprites.front_default;
  document.getElementById("main").innerHTML += pokemonCardTemplate(name, pic, pokemonindex);

  insertCardTypes(pokemonindex, data.types);
}

function insertCardTypes(pokemonindex, types) {
  const cardFooter = document.getElementById(`card-footer-${pokemonindex}`);
  if (!cardFooter) return;

  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const typeName = types[typeIndex].type.name;
    const img = document.createElement("img");
    img.src = icons[typeName];
    img.classList.add("type-icon");
    cardFooter.appendChild(img);
  }
}

function insertOverlayTypes(pokemonindex, types) {
  const overlayTypes = document.getElementById(`overlay-types-id-${pokemonindex}`);
  if (!overlayTypes) return;

  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const typeName = types[typeIndex].type.name;
    const img = document.createElement("img");
    img.src = icons[typeName];
    img.classList.add("type-icon");
    overlayTypes.appendChild(img.cloneNode(true));
  }
}

function addCardOverlay(pokemonindex, pic, name) {
  const contentRef = document.getElementById("overlay");
  contentRef.innerHTML = cardOverlay(pokemonindex, pic, name);
  contentRef.classList.remove("display-none");


  data = pokemonCache[pokemonindex];
  
    insertOverlayTypes(pokemonindex, data.types);
}

function closeOverlay(){
  let overlay = document.getElementById("overlay");
  overlay.classList.add("display-none");
}

async function loadStats(pokemonindex) {
  try {
    if (pokemonCache[pokemonindex] ) {
   
      renderStatsTab(pokemonindex, pokemonCache[pokemonindex]);
    } else {
     
      const statsResp = await fetch(`${Base_URL}/${pokemonindex}`);
      if (!statsResp.ok) {
        console.error("Failed to fetch stats", statsResp.status);
        return;
      }
      const statsRespJSON = await statsResp.json();
      
      pokemonCache[pokemonindex] = statsRespJSON;

      renderStatsTab(pokemonindex, statsRespJSON);
      
    }
  } catch (err) {
    console.error("Error in loadStats:", err);
  }
}


function renderStatsTab(pokemonindex, statsRespJSON) {
  
   let statsTabRef = document.getElementById("overlay-tab-stats");
   statsTabRef.innerHTML = overlayStats(pokemonindex, statsRespJSON)
   console.log(statsRespJSON);
}





