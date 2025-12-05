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
    <nav id="overlay-tab-stats" class="overlay-tab-stats"></nav>
    <nav id="overlay-tab-combat" class="overlay-tab-combat"></nav>
    <nav id="overlay-tab-evochain" class="overlay-tab-evochain"></nav>
    <p></p>
    <p></p>
    <p></p>
    </div>`
}

function overlayStats() {
    return `
    <p>${height}</p>
    <p>${weight}</p>
   `
}

function overlayCombat() {
    return `
    <p>${health}</p>
    <p>${attack}</p>
    <p>${defense}</p>
   `
}

function overlayEvoChain() {
    return `
    <img>
    <img>
    <img>
   `
}
