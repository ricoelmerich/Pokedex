let Base_URL = "https://pokeapi.co/api/v2/pokemon/"

function init() {
    
    loadData("1");
    
}

async function loadData(path="") {
    let response = await fetch(Base_URL + path);
    let responseAsJSON = await response.json();
   
    
    console.log(responseAsJSON);
    let name = responseAsJSON.forms[0].name
    let nameRef = document.getElementById('main');
    nameRef.innerHTML = name;
    
    pokemonCardTemplate(nameRef);
    

    
}