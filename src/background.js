import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(function () {
  browser.storage.local.set({ pokemons: [] })
})

browser.runtime.onMessage.addListener((request, sender) => {
  switch (request.message) {
    case 'Create element':
      const name = request.params.pokemon
      fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
        .then(response => response.json())
        .then(pokemon => {
          browser.runtime.sendMessage({
            message: 'element',
            params: {
              number: pokemon.id,
              name: pokemon.name,
              stats: pokemon.stats,
              types: pokemon.types,
              sprites: pokemon.sprites,
            },
          })
        })
        .catch(error => console.log(error))
      break
    default:
      console.error('Request not handled', request)
  }
})
