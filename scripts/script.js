let Base_URL = "https://pokeapi.co/api/v2/pokemon/";

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
    
    let data = await response.json();
    let name = data.forms[0].name;
    let pic = data.sprites.front_default;
    document.getElementById("main").innerHTML += pokemonCardTemplate(name, pic, pokemonindex);
    insertTypes(pokemonindex, data);
}

function insertTypes(pokemonindex, data) {
  let types = data.types;
  let cardFooter = document.getElementById(`card-footer-${pokemonindex}`);

  for (let indexTypes = 0; indexTypes < types.length; indexTypes++) {
    let typeName = types[indexTypes].type.name;
    let typeIcon = document.createElement("img");

    typeIcon.src = icons[typeName];
    typeIcon.classList.add("type-icon");
    cardFooter.appendChild(typeIcon);
  }
}

function addCardOverlay(pokemonindex, pic) {

  
   let contentRef = document.getElementById("overlay");
  contentRef.innerHTML = cardOverlay(pokemonindex, pic);
  contentRef.classList.remove("display-none");
  
}

function closeOverlay(){
  let overlay = document.getElementById("overlay");
  overlay.classList.add("display-none");
}
