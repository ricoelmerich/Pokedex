let Base_URL = "https://pokeapi.co/api/v2/";

let pokemonCache = [];
let levelCache = [];
let loadedCount = 0;
const loadAmount = 20;


const icons = {
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

const allTypes = [ 
  "bug",
   "dark",
   "dragon",
   "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
     "poison",
     "psychic",
     "rock",
     "steel",
     "water"
   ];

function init() {
  loadPokemonlist();
    

}

function showSpinner() {
  document.getElementById("loading-spinner").classList.remove("hidden");
}

function hideSpinner() {
  document.getElementById("loading-spinner").classList.add("hidden");
}


async function loadPokemonlist(limit = loadAmount, offset = 0) {
  showSpinner();
  try {
    const listResp = await fetch(`${Base_URL}pokemon/?limit=${limit}&offset=${offset}`);
    if (!listResp.ok) {
      console.error("Could not fetch pokemon list", listResp.status);
      return;
    }

    let listJson = await listResp.json();

    for (let listIndex = 0; listIndex < listJson.results.length; listIndex++) {
      const entry = listJson.results[listIndex];

     
      await loadDataFromUrl(entry.url);
    }

  } catch (err) {
    console.error("Unexpected error in loadPokemonlist", err);
  }

  hideSpinner();
}





async function loadDataFromUrl(url) {
  const response = await fetch(url);
  const data = await response.json();

 
  const pokemonId = data.id;

  pokemonCache[pokemonId] = data;

  const name = data.forms[0].name;
  const pic = data.sprites.front_default;

  
  document.getElementById("content").innerHTML += pokemonCardTemplate(
    name,
    pic,
    pokemonId
  );

  
  insertCardTypes(pokemonId, data.types);
  setBackGroundColor(pokemonId, data.types);

}


function insertCardTypes(pokemonId, types) {
  const cardFooter = document.getElementById(`card-footer-${pokemonId}`);
  if (!cardFooter) return;

  cardFooter.innerHTML = ""; 

  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const typeName = types[typeIndex].type.name;
    const img = document.createElement("img");
    img.src = icons[typeName];
    img.classList.add("type-icon");
    cardFooter.appendChild(img);
  }
  setBackGroundColor(pokemonId, types, false);
}

function setBackGroundColor(pokemonId, types, isOverlay) {
    let firstType = types[0].type.name;
    let overlay = document.getElementById("overlay");
    let card = document.getElementById(`card-${pokemonId}`);

    if (isOverlay) {
        
        for (let i = 0; i < allTypes.length; i++) {
            overlay.classList.remove(allTypes[i]);
        }
        overlay.classList.add(firstType);
    } else {
        if (card) {
            for (let i = 0; i < allTypes.length; i++) {
                card.classList.remove(allTypes[i]);
            }
            card.classList.add(firstType);
        }
    }
}







function addCardOverlay(pokemonId, pic, name) {
  const contentRef = document.getElementById("overlay");
  contentRef.innerHTML = cardOverlay(pokemonId, pic, name);
  contentRef.classList.remove("display-none");

  const data = pokemonCache[pokemonId];

  insertOverlayTypes(pokemonId, data.types);
  setBackGroundColor(pokemonId, data.types, true);
}


function insertOverlayTypes(pokemonId, types) {
  const overlayTypes = document.getElementById(`overlay-types-id-${pokemonId}`);
  if (!overlayTypes) return;

  overlayTypes.innerHTML = ""; 

  for (let typeIndex = 0; typeIndex < types.length; typeIndex++) {
    const typeName = types[typeIndex].type.name;
    const img = document.createElement("img");
    img.src = icons[typeName];
    img.classList.add("type-icon");
    overlayTypes.appendChild(img.cloneNode(true));
  }
}


function closeOverlay() {
  let overlay = document.getElementById("overlay");
  overlay.classList.add("display-none");
}

async function loadStats(pokemonId) {
  try {
    if (pokemonCache[pokemonId]) {
      renderStatsTab(pokemonCache[pokemonId]);
    } else {
      const statsResp = await fetch(`${Base_URL}pokemon/${pokemonId}`);
      if (!statsResp.ok) {
        console.error("Failed to fetch stats", statsResp.status);
        return;
      }
      const statsRespJSON = await statsResp.json();

      pokemonCache[pokemonId] = statsRespJSON;

      renderStatsTab(statsRespJSON);
    }
  } catch (err) {
    console.error("Error in loadStats:", err);
  }
}

function renderStatsTab(statsRespJSON) {
  let statsTabRef = document.getElementById("info-space");
  statsTabRef.innerHTML = overlayStats(statsRespJSON);
}

async function loadCombatStats(pokemonId) {
  try {
    if (pokemonCache[pokemonId].stats) {
      renderCombatTab(pokemonCache[pokemonId].stats);
    } else {
      const combatStatsResp = await fetch(`${Base_URL}pokemon/${pokemonId}`);
      if (!combatStatsResp.ok) {
        console.error("Failed to fetch stats", combatStatsResp.status);
        return;
      }
      const combatStatsRespJSON = await combatStatsResp.json();
      const combatStats = combatStatsRespJSON.stats;

      pokemonCache[pokemonId].stats = combatStats;

      renderCombatTab(combatStats);
    }
  } catch (err) {
    console.error("Error in loadCombat:", err);
  }
}

function renderCombatTab(combatStats) {
  console.log(combatStats);
  let combatTabRef = document.getElementById("info-space");
  combatTabRef.innerHTML = overlayCombat(combatStats);
}

async function loadEvoChain(pokemonId) {
  try {


    const speciesResp = await fetch(`${Base_URL}pokemon-species/${pokemonId}`);
    if (!speciesResp.ok) {
      console.error('Failed to fetch species', speciesResp.status);
      return;
    }
    const speciesJson = await speciesResp.json();

        const evoChainUrl = speciesJson.evolution_chain.url;
    if (!evoChainUrl) {
      console.error('No evolution_chain found for', pokemonId);
      return;
    }

    
    if (pokemonCache[pokemonId].chain) {
      const chain = pokemonCache[pokemonId].chain;
      const levels = countEvoForms(chain);
      renderEvoChain(chain);
    } 

      const evoChainResp = await fetch(evoChainUrl);
      if (!evoChainResp.ok) {
        console.error("Failed to fetch evoChain", evoChainResp.status);
        return;
      }
      const evoChainRespJSON = await evoChainResp.json();
      const chain = evoChainRespJSON.chain;

      pokemonCache[pokemonId].chain = chain;

      const levels = countEvoForms(chain);


      renderEvoChain(levels);
    
  } catch (err) {
    console.error("Error in loadEvoChain:", err);
  }
}



function countEvoForms(chain) {

  if (!chain) return [];

  let levels = [];
  let chainRef = [chain];

  while (chainRef.length > 0) {
    let levelSize = chainRef.length;
    let currentForms = [];

    for (let index = 0; index < levelSize; index++) {
      let levelArr = chainRef.shift();

      if (levelArr.species) {
        currentForms.push(levelArr.species);
      }

      let subLevels;
      if (levelArr.evolves_to) {
        subLevels = levelArr.evolves_to;
      } else {
        subLevels = [];
      }

      for (var indexSubLvl = 0; indexSubLvl < subLevels.length; indexSubLvl++) {
        chainRef.push(subLevels[indexSubLvl]);
      }
    } //for

    if (currentForms.length > 0) {
      levels.push(currentForms);
    }
  } //while
console.log(levels);

  return levels;
}



async function renderEvoChain(levels) {
  const infoSpace = document.getElementById("info-space");
  infoSpace.innerHTML = "";

  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    const name = levels[levelIndex][0].name;

    try {
    if (!levelCache[name]) {
      const response = await fetch(`${Base_URL}pokemon/${name}`);

      if (!response.ok) {
         console.error(`Failed to load data for ${name}. HTTP status: ${response.status}`);
      }

      const responseJSON = await response.json();
      levelCache[name] = responseJSON; 
    }
    
    const data = levelCache[name];
    const imgSrc = data.sprites.front_default;

    infoSpace.innerHTML += overlayEvoChain(name, imgSrc);
  }
  catch (err) {
     console.error(`error while processing ${name}:`, err);
  }
}
}

function loadMorePokemon() {
  loadedCount += loadAmount;
  loadPokemonlist(loadAmount, loadedCount);
}

function filterPokemon() {
    let search = document.getElementById("search").value.toLowerCase();

    
    document.getElementById("content").innerHTML = "";

    
    for (let searchIndex = 0; searchIndex < pokemonCache.length; searchIndex++) {
        let pokemon = pokemonCache[searchIndex];
        if (!pokemon) continue;

        let name = pokemon.forms[0].name.toLowerCase();

        if (name.includes(search)) {
            const pic = pokemon.sprites.front_default;

            document.getElementById("content").innerHTML += pokemonCardTemplate(
                name,
                pic,
                searchIndex
            );

            insertCardTypes(searchIndex, pokemon.types);
            
        }
    }
}
