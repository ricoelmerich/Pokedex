let Base_URL = "https://pokeapi.co/api/v2/";
let pokemonCache = [];
let levelCache = [];
let loadedCount = 0;
const loadAmount = 20;
let shownPokemon = loadAmount;
let lastSearch = "";
filteredList = null;

const icons = {
  bug: "assets/icons/bug.svg",
  dark: "assets/icons/dark.svg",
  dragon: "assets/icons/dragon.svg",
  electric: "assets/icons/electric.svg",
  fairy: "assets/icons/fairy.svg",
  fighting: "assets/icons/fighting.svg",
  fire: "assets/icons/fire.svg",
  flying: "assets/icons/flying.svg",
  ghost: "assets/icons/ghost.svg",
  grass: "assets/icons/grass.svg",
  ground: "assets/icons/ground.svg",
  ice: "assets/icons/ice.svg",
  normal: "assets/icons/normal.svg",
  poison: "assets/icons/poison.svg",
  psychic: "assets/icons/psychic.svg",
  rock: "assets/icons/rock.svg",
  steel: "assets/icons/steel.svg",
  water: "assets/icons/water.svg",
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
  "water",
];

function showSpinner() {
  document.getElementById("loading-spinner").classList.remove("display-none");
}

function hideSpinner() {
  document.getElementById("loading-spinner").classList.add("display-none");
}

async function loadPokemonlist(limit = loadAmount, offset = 0) {
  showSpinner();
  try {
    const listResp = await fetch(
      `${Base_URL}pokemon/?limit=${limit}&offset=${offset}`
    );
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
  let name = data.forms[0].name;
  name = name.charAt(0).toUpperCase() + name.slice(1);
  data.forms[0].name = name;
  pokemonCache[pokemonId] = data;
  const pic = data.sprites.front_default;
  document.getElementById("content").innerHTML += pokemonCardTemplate(name, pic, pokemonId);
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
  event.stopPropagation();
  const contentRef = document.getElementById("overlay");
  contentRef.innerHTML = cardOverlay(pokemonId, pic, name);
  contentRef.classList.remove("display-none");
  const data = pokemonCache[pokemonId];
  document.body.classList.add("overlay-open");
  insertOverlayTypes(pokemonId, data.types);
  setBackGroundColor(pokemonId, data.types, true);
  loadStats(pokemonId);
  hideArrow(pokemonId)
}

function removeOverlay(event) {
  let overlay = document.getElementById("overlay");
  if (!overlay.contains(event.target)) {
    overlay.classList.add("display-none");
    document.body.classList.remove("overlay-open");
  }
}

function nextPokemon(pokemonId) {
  pokemonId++;
  const data = pokemonCache[pokemonId];
  addCardOverlay(pokemonId, data.sprites.front_default, data.forms[0].name);
}

function prevPokemon(pokemonId) {
  pokemonId--;
  const data = pokemonCache[pokemonId];
  addCardOverlay(pokemonId, data.sprites.front_default, data.forms[0].name);
}

function hideArrow(pokemonId) {
  const leftArrow = document.getElementById("arrowLeft");
  const rightArrow = document.getElementById("arrowRight");
  if (!filteredList || filteredList.length === 0) {
    if (pokemonId <= 1) {
      leftArrow.classList.add("invisible");
    }
    if (pokemonId >= shownPokemon) {
      rightArrow.classList.add("invisible");
    }
    return;
  }
  const idx = filteredList.indexOf(pokemonId);
  if (idx === 0) {
    leftArrow.classList.add("invisible");
  }
  if (idx === filteredList.length - 1) {
    rightArrow.classList.add("invisible");
  }
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
  document.body.classList.remove("overlay-open");
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
  let combatTabRef = document.getElementById("info-space");
  combatTabRef.innerHTML = overlayCombat(combatStats);
}

async function fetchSpecies(pokemonId) {
  const resp = await fetch(`${Base_URL}pokemon-species/${pokemonId}`);
  if (!resp.ok) {
    console.error("Failed to fetch species", resp.status);
    return null;
  }
  return await resp.json();
}

async function fetchEvoChain(url) {
  const resp = await fetch(url);
  if (!resp.ok) {
    console.error("Failed to fetch evolution chain", resp.status);
    return null;
  }
  return await resp.json();
}

function getCachedChain(pokemonId) {
  if (pokemonCache[pokemonId] && pokemonCache[pokemonId].chain) {
    return pokemonCache[pokemonId].chain;
  }
  return null;
}

function renderChain(chain) {
  const levels = countEvoForms(chain);
  renderEvoChainImgs(levels);
}

async function loadEvoChain(pokemonId) {
  const cached = getCachedChain(pokemonId);
  if (cached) {
    renderChain(cached)
    return;
  }
  const species = await fetchSpecies(pokemonId);
  if (!species) return;
  const evoChainUrl = species.evolution_chain.url;
  const evoChainJson = await fetchEvoChain(evoChainUrl);
  if (!evoChainJson) return;
  const chain = evoChainJson.chain;
  pokemonCache[pokemonId].chain = chain;
  renderChain(chain);
}

async function renderEvoChain(pokemonId) {
  try {
    await loadEvoChain(pokemonId);
  } catch (error) {
    console.error(error);
  }
}

function dequeue(queue) {
  return queue.shift();
}

function getSpecies(node) {
  if (!node.species) {
    return null;
  }
  return node.species;
}

function enqueueSubLevels(list, node) {
  if (!node) {
    return;
  }
  let subLevels = node.evolves_to;
  if (!subLevels) {
    subLevels = [];
  }
  for (let i = 0; i < subLevels.length; i++) {
    list.push(subLevels[i]);
  }
}

function processLevel(queue) {
  const levelSize = queue.length;
  const current = [];
  for (let i = 0; i < levelSize; i++) {
    const node = dequeue(queue);
    const species = getSpecies(node);
    if (species) current.push(species);
    enqueueSubLevels(queue, node);
  }
  return current;
}

function countEvoForms(chain) {
  if (!chain) return [];
  const levels = [];
  const queue = [chain];
  while (queue.length > 0) {
    const current = processLevel(queue);
    if (current.length) levels.push(current);
  }
  return levels;
}

async function renderEvoChainImgs(levels) {
  const infoSpace = document.getElementById("info-space");
  infoSpace.innerHTML = "";

  for (let levelIndex = 0; levelIndex < levels.length; levelIndex++) {
    const name = levels[levelIndex][0].name;
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
}

 function loadMorePokemon() {
  let contentRef = document.getElementById("content");
  loadedCount += loadAmount;
  shownPokemon += loadAmount;
  contentRef.innerHTML = "";
  loadPokemonlist(loadAmount, loadedCount);
  document.getElementById("search").value = "";
  filteredList = null;
  renderAllPokemon();
}

function isSearchTooShort(search) {
  if (search.length > 0 && search.length < 3) {
    return true;
  }
  return false;
}

function nameMatches(pokemon, search) {
  if (!pokemon) {
    return false;
  }
  let name = pokemon.forms[0].name.toLowerCase();
  if (name.includes(search)) {
    return true;
  }
  return false;
}

function renderPokemonCard(pokemon, index, contentRef) {
  let name = pokemon.forms[0].name;
  let pic = pokemon.sprites.front_default;
  contentRef.innerHTML += pokemonCardTemplate(name, pic, index);
  insertCardTypes(index, pokemon.types);
}

function getFilteredPokemon(search) {
  let results = [];
  for (let i = 0; i < pokemonCache.length; i++) {
    let pokemon = pokemonCache[i];
    if (nameMatches(pokemon, search)) {
      results.push(i);
    }
  }
  return results;
}
function renderFilteredResults(results, contentRef) {
  contentRef.innerHTML = "";
  for (let i = 0; i < results.length; i++) {
    let index = results[i];
    let pokemon = pokemonCache[index];
    renderPokemonCard(pokemon, index, contentRef);
  }
}

function filterPokemon() {
  let search = document.getElementById("search").value.toLowerCase();
  let contentRef = document.getElementById("content");
  if (isSearchTooShort(search)) {
    alert("Bitte mindestens 3 Buchstaben eingeben.");
    return;
  }
  let results = getFilteredPokemon(search);
  filteredList = results;
  if (results.length === 0) {
    filteredList = [];
    contentRef.innerHTML = `<div class="no-results">No Pokémon found.</div>`;
    return;
  }
  renderFilteredResults(results, contentRef);
}

function renderAllPokemon() {
  let contentRef = document.getElementById("content");
  contentRef.innerHTML = "";
  for (let i = 0; i < pokemonCache.length; i++) {
    let pokemon = pokemonCache[i];
    if (pokemon) {
      renderPokemonCard(pokemon, i, contentRef);
    }
  }
}

function resetSearchIfEmpty() {
  let search = document.getElementById("search").value.toLowerCase();
  if (search.length === 0) {
    filteredList = null;
    renderAllPokemon();
  }
}

function getSearchNavigationIndex(pokemonId) {
  if (!filteredList) {
    return null;
  }

  let index = filteredList.indexOf(pokemonId);
  return index;
}




