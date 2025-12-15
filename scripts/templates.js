function pokemonCardTemplate(name, pic, pokemonindex) {
  return `<div class="card" onclick="addCardOverlay(${pokemonindex}, '${pic}', '${name}')">
    <div id="card-header">${name}</div>
    <img src="${pic}" class="pokemon-img">
    <div id="card-footer-${pokemonindex}"></div>
  </div>`;
}

function cardOverlay(pokemonindex, pic, name) {
    return `
    <section id="overlay-header">${name}
    <div onclick="closeOverlay()" class="close-overlay">✖</div>
    </section>
    <img src="${pic}" class="overlay-img" >
    <div id="overlay-types-id-${pokemonindex}"></div>
    <div id="overlay-footer">
    <nav onclick="loadStats(${pokemonindex})" id="overlay-tab-stats" class="overlay-tab-stats tab"></nav>
    <nav onclick="loadCombatStats(${pokemonindex})" id="overlay-tab-combat" class="overlay-tab-combat tab"></nav>
    <nav onclick="loadEvoChain(${pokemonindex})" id="overlay-tab-evochain" class="overlay-tab-evochain tab"></nav>
    <p></p>
    <p></p>
    <p></p>
    </div>`
}

function overlayStats(statsRespJSON) {
    return `
    <p>${statsRespJSON.height}</p>
    <p>${statsRespJSON.weight}</p>
   `
}

function overlayCombat(combatStats) {
    return `
    <p>${combatStats[0].base_stat}</p>
    <p>${combatStats[1].base_stat}</p>
    <p>${combatStats[2].base_stat}</p>
   `
}

function overlayEvoChain() {
    return `
    <img>
    <img>
    <img>
   `
}
