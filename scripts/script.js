let Base_URL = "https://pokeapi.co/api/v2/";

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
    const listResp = await fetch(`${Base_URL}pokemon/?limit=${limit}`);
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
      let pokemonindex = listIndex+1;
      await loadDataFromUrl(entry.url, pokemonindex);
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
  document.getElementById("main").innerHTML += pokemonCardTemplate(
    name,
    pic,
    pokemonindex
  );

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
  const overlayTypes = document.getElementById(
    `overlay-types-id-${pokemonindex}`
  );
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

function closeOverlay() {
  let overlay = document.getElementById("overlay");
  overlay.classList.add("display-none");
}

async function loadStats(pokemonindex) {
  try {
    if (pokemonCache[pokemonindex]) {
      renderStatsTab(pokemonCache[pokemonindex]);
    } else {
      const statsResp = await fetch(`${Base_URL}pokemon/${pokemonindex}`);
      if (!statsResp.ok) {
        console.error("Failed to fetch stats", statsResp.status);
        return;
      }
      const statsRespJSON = await statsResp.json();

      pokemonCache[pokemonindex] = statsRespJSON;

      renderStatsTab(statsRespJSON);
    }
  } catch (err) {
    console.error("Error in loadStats:", err);
  }
}

function renderStatsTab(statsRespJSON) {
  let statsTabRef = document.getElementById("overlay-tab-stats");
  statsTabRef.innerHTML = overlayStats(statsRespJSON);
}

async function loadCombatStats(pokemonindex) {
  try {
    if (pokemonCache[pokemonindex].stats) {
      renderCombatTab(pokemonCache[pokemonindex].stats);
    } else {
      const combatStatsResp = await fetch(`${Base_URL}pokemon/${pokemonindex}`);
      if (!combatStatsResp.ok) {
        console.error("Failed to fetch stats", combatStatsResp.status);
        return;
      }
      const combatStatsRespJSON = await combatStatsResp.json();
      const combatStats = combatStatsRespJSON.stats;

      pokemonCache[pokemonindex].stats = combatStats;

      renderCombatTab(combatStats);
    }
  } catch (err) {
    console.error("Error in loadCombat:", err);
  }
}

function renderCombatTab(combatStats) {
  console.log(combatStats);
  let combatTabRef = document.getElementById("overlay-tab-combat");
  combatTabRef.innerHTML = overlayCombat(combatStats);
}

async function loadEvoChain(pokemonindex) {
  try {


    const speciesResp = await fetch(`${Base_URL}pokemon-species/${pokemonindex}`);
    if (!speciesResp.ok) {
      console.error('Failed to fetch species', speciesResp.status);
      return;
    }
    const speciesJson = await speciesResp.json();

        const evoChainUrl = speciesJson.evolution_chain.url;
    if (!evoChainUrl) {
      console.error('No evolution_chain found for', pokemonindex);
      return;
    }

    
    if (pokemonCache[pokemonindex].chain) {
      const chain = pokemonCache[pokemonindex].chain;
      const levels = countEvoForms(chain);
      evoChainTab(chain);
      return;
    } 

      const evoChainResp = await fetch(evoChainUrl);
      if (!evoChainResp.ok) {
        console.error("Failed to fetch evoChain", evoChainResp.status);
        return;
      }
      const evoChainRespJSON = await evoChainResp.json();
      const chain = evoChainRespJSON.chain;

      pokemonCache[pokemonindex].chain = chain;

      const levels = countEvoForms(chain);


      renderEvoChain(levels);
    
  } catch (err) {
    console.error("Error in loadStats:", err);
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
  

  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    let name = levels[levelIndex][0].name;


     const response = await fetch(`${Base_URL}pokemon/${name}`);
     const responseJSON = await response.json();

  pokemonCache[levelIndex].name = responseJSON;

  
  const imgSrc = responseJSON.sprites.front_default;
  document.getElementById("overlay-tab-evochain").innerHTML += overlayEvoChain(
    name,
    imgSrc
  );

  }
}
