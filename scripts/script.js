let Base_URL = "https://pokeapi.co/api/v2/pokemon/1"

function init() {
    pokemonCardTemplate();
    loadData();
    
}

async function loadData(path= "") {
    let response = await fetch(Base_URL + path + ".json");
    let responseToText = await response.text();
    console.log(responseToText);
    
}