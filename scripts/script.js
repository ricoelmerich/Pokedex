let Base_URL = "https://pokeapi.co/api/v2/pokemon/";

let icons = {
    bug: "icons/bug.svg",
    dark: "icons/dark.svg",
    dragon: "icons/dragon.svg",
    electric: "icons/electric.svg",
    fairy: "icons/fairy.svg",
    fighting: "icons/fighting.svg",
    fire: "icons/fire.svg",
    flying: "icons/flying.svg",
    ghost: "icons/ghost.svg",
    grass: "icons/grass.svg",
    ground: "icons/ground.svg",
    ice: "icons/ice.svg",
    normal: "icons/normal.svg",
    poison: "icons/poison.svg",
    psychic: "icons/psychic.svg",
    rock: "icons/rock.svg",
    steel: "icons/steel.svg",
    water: "icons/water.svg"
};

let data = "";

 async function init() {
    
   await loadData("1");
    insertTypes();
}

async function loadData(path="") {
    let response = await fetch(Base_URL + path);
    let responseAsJSON = await response.json();
    data = responseAsJSON;
    
    console.log(responseAsJSON);

    let name = responseAsJSON.forms[0].name
    let mainRef = document.getElementById('main');
    let pic = responseAsJSON.sprites.front_default;

    mainRef.innerHTML =  pokemonCardTemplate(name, pic);   
}

function insertTypes() {
    let types = data.types;
    let cardFooter = document.getElementById('card-footer');

    for (let indexTypes = 0; indexTypes < types.length; indexTypes++) {
        let typeName = types[indexTypes].type.name;
        cardFooter.innerHTML += typeName;
    }
}