function pokemonCardTemplate(name, pic) {
    return `<div>
    <div id="card-header">${name}</div>
    <img src="${pic}">
    <div id="card-footer"></div>
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