import browser from 'webextension-polyfill'

let input = document.getElementById('userinput')
let buttonEnter = document.getElementById('enter')
let ul = document.querySelector('ul')
var list = document.querySelectorAll('#tasks>li')

browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case 'element': {
      console.log(request.params)
      let pokeList = browser.storage.local.get('pokemons')
      pokeList.then((data) => {
        let pokemonUpdated = data.pokemons
        pokemonUpdated.push(request.params)
        browser.storage.local.set({ pokemons: pokemonUpdated })
      })
        .catch(error => console.error(error))
      input.value = ''
      createPokemon(request.params)
      updateList()
      break
    }
    default: {
      console.error('Request not handled', request)
    }
  }
})


function createPokemon(pokemon) {
  let li = document.createElement('li')
  li.setAttribute('id', pokemon.name)
  let container = document.createElement('div')
  li.appendChild(container)
  let sprite = document.createElement('img')
  sprite.setAttribute('src', pokemon.sprites.front_default)
  container.appendChild(sprite)
  let name = document.createElement('h1')
  name.appendChild(document.createTextNode(`Entrenar a ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1).toLowerCase()}`))
  container.appendChild(name)
  pokemon.types.forEach(element => {
    let kind = document.createElement('h2')
    kind.appendChild(document.createTextNode(element.type.name))
    container.appendChild(kind)
  })
  let stats = document.createElement('h3')
  stats.appendChild(document.createTextNode(`Ataque: ${pokemon.stats[1].base_stat}| Defensa: ${pokemon.stats[2].base_stat}`))
  container.appendChild(stats)
  ul.appendChild(li)
  list = document.querySelectorAll('#tasks>li')
}

function createListElement() {
  browser.runtime.sendMessage({
    message: 'Create element',
    params: {
      pokemon: input.value,
    } })
}

function updateList() {
  createButton(list.length - 1)
}

function createButton(i) {
  var button = document.createElement('button')
  button.appendChild(document.createTextNode('Delete'))
  list[i].appendChild(button)
  button.addEventListener('click', deleteItem)
}

function deleteItem() {
  let pokemons = browser.storage.local.get('pokemons')
  let deleted = this.parentElement.getAttribute('id')
  pokemons.then(data => {
    let newList = data.pokemons
    const result = newList.filter(pokemon => pokemon.name !== deleted)
    browser.storage.local.set({ pokemons: result })
  })
  this.parentElement.remove()
  this.remove()
}

function createList() {
  let database = browser.storage.local.get('pokemons')
  database.then((data) => {
    console.log(data)
    data.pokemons.forEach((element, index) => {
      createPokemon(element)
      createButton(index)
    })
  }).catch(error => console.log(error))
}


function addButtons() {
  for (var i = 0; i < list.length; i++) {
    createButton(i)
  }
}
createList()
addButtons()

buttonEnter.addEventListener('click', createListElement)
console.log('list', list)
