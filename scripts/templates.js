function pokemonCardTemplate(name, pic, pokemonindex) {
    return `<div class="card" onclick="addCardOverlay(${pokemonindex}, '${pic}')">
    <div id="card-header">${name}</div>
    <img src="${pic}" class="pokemon-img">
    <div id="card-footer-${pokemonindex}"></div>
    </div>`
}

function cardOverlay(pokemonindex, pic) {
    return `<div>
    <div id="overlay-header">
    <div onclick="closeOverlay()" class="closeOverlay">✖</div>
    </div>
    <img src="${pic}" class="overlayImg" >
    <div id="overlay-footer"><nav></nav>
    <p></p>
    <p></p>
    <p></p>
    </div>
    </div>`
}