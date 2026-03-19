function pokemonCardTemplate(name, pic, pokemonId) {
  return `<div class="card" id="card-${pokemonId}" onclick="addCardOverlay(${pokemonId}, '${pic}', '${name}')">
    <div id="card-header"><h3>${name}</h3></div>
    <img src="${pic}" class="pokemon-img">
    <div id="card-footer-${pokemonId}"></div>
  </div>`;
}

function cardOverlay(pokemonId, pic, name) {
    return `
    <section id="overlay-header"><h3>${name}</h3>
    <div onclick="closeOverlay()" class="close-overlay">✖</div>
    </section>
    <img src="${pic}" class="overlay-img" >
    <div id="overlay-types-id-${pokemonId}"></div>
    <section id="overlay-footer" class="overlay-footer">
    <div class="footer-navbar">
    <nav onclick="loadStats(${pokemonId})" id="overlay-tab-stats" class="overlay-tab-stats tab">stats</nav>
    <nav onclick="loadCombatStats(${pokemonId})" id="overlay-tab-combat" class="overlay-tab-combat tab">combat</nav>
    <nav onclick="renderEvoChain(${pokemonId})" id="overlay-tab-evochain" class="overlay-tab-evochain tab">evo chain</nav>
    </div>
    <div class="info-space" id="info-space">
    </div>
    <div class="arrows" >
                       <img onclick="prevPokemon(${pokemonId})" id="arrowLeft" src="assets/imgs/arrow-left.png" class="imgArrow">
                       <img onclick="nextPokemon(${pokemonId})" id="arrowRight" src="assets/imgs/arrow-right.png" class="imgArrow">   
                    </div>
    </section>`
}

function overlayStats(statsRespJSON) {
    return `
    <p>height:  ${statsRespJSON.height}</p>
    <p>weight:  ${statsRespJSON.weight}</p>
   `
}

function overlayCombat(combatStats) {
    return `
    <p>health:  ${combatStats[0].base_stat}</p>
    <p>attack:  ${combatStats[1].base_stat}</p>
    <p>defense:  ${combatStats[2].base_stat}</p>
   `
}

function overlayEvoChain(name,imgSrc) {
    return `
    <img src="${imgSrc}">
   `
}
