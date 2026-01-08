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
    <section id="overlay-footer" class="overlay-footer">
    <div class="footer-navbar">
    <nav onclick="loadStats(${pokemonindex})" id="overlay-tab-stats" class="overlay-tab-stats tab">stats</nav>
    <nav onclick="loadCombatStats(${pokemonindex})" id="overlay-tab-combat" class="overlay-tab-combat tab">combat</nav>
    <nav onclick="loadEvoChain(${pokemonindex})" id="overlay-tab-evochain" class="overlay-tab-evochain tab">evo chain</nav>
    </div>
    <div class="info-space" id="info-space">
    </div>


    </section>`
}

function overlayStats(statsRespJSON) {
    return `
    <p>height:${statsRespJSON.height}</p>
    <p>weight:${statsRespJSON.weight}</p>
   `
}

function overlayCombat(combatStats) {
    return `
    <p>health: ${combatStats[0].base_stat}</p>
    <p>attack: ${combatStats[1].base_stat}</p>
    <p>defense: ${combatStats[2].base_stat}</p>
   `
}

function overlayEvoChain(name,imgSrc) {
    return `
    <img src="${imgSrc}">
   
   `
}
