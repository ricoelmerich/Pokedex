function pokemonCardTemplate(name, pic, pokemonindex) {
    return `<div class="card">
    <div id="card-header">${name}</div>
    <img src="${pic}" class="pokemon-img">
    <div id="card-footer-${pokemonindex}"></div>
    </div>`
}

function OverlayTemplate() {
    return `<div>
    <div id="overlay-header"></div>
    <img>
    <div id="overlay-footer"><nav></nav>
    <p></p>
    <p></p>
    <p></p>
    </div>
    </div>`
}