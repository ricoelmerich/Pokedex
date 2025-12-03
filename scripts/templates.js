function pokemonCardTemplate(name, pic, pokemonindex) {
  return `<div class="card" onclick="addCardOverlay(${pokemonindex}, '${pic}', '${name}')">
    <div id="card-header">${name}</div>
    <img src="${pic}" class="pokemon-img">
    <div id="card-footer-${pokemonindex}"></div>
  </div>`;
}

function cardOverlay(pokemonindex, pic, name) {
    return `<div>
    <section id="overlay-header">${name}
    <div onclick="closeOverlay()" class="closeOverlay">✖</div>
    </section>
    <img src="${pic}" class="overlay-img" >
    <div id="overlay-types-id-${pokemonindex}"></div>
    <div id="overlay-footer"><nav></nav>
    <p></p>
    <p></p>
    <p></p>
    </div>
    </div>`
}