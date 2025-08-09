var tiles = [];

class TileGroup {
  constructor({
    id,
    name,
    color = 0
  }) {
    this.id = id;
    this.name = name;
    this.color = color;
  }
}

var tileGroups = [
  new TileGroup({ id: 1, name: 'Default', color: 'transparent' }),
  new TileGroup({ id: 2, name: 'Japan', color: '#b2fdf3ff' }),
  new TileGroup({ id: 3, name: 'Canada', color: '#ffaab8ff' }),
  new TileGroup({ id: 4, name: 'India', color: '#FFA500' }),
  new TileGroup({ id: 5, name: 'USA', color: '#dc6262ff' }),
  new TileGroup({ id: 6, name: 'UK', color: '#f8ea4bff' }),
  new TileGroup({ id: 7, name: 'Australia', color: '#51d951ff' }),
  new TileGroup({ id: 8, name: 'Germany', color: '#d4a8ffff' }),
  new TileGroup({ id: 9, name: 'China', color: '#5872f4ff' }),
  new TileGroup({ id: 10, name: 'Russia', color: '#b2fe8eff' }),
  new TileGroup({ id: 11, name: 'Egypt', color: '#fafcb1ff' }),
];

class Tile {
  constructor({
    id,
    name,
    type = 'property',
    price = 1000,
    group = 1,
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.price = price;
    this.color = tileGroups[group-1].color;
    this.group = group;
    this.owner = null; // player ID or object
    this.houses = 0; // 0 to 4, 5 means hotel
    this.mortgaged = false;
  }

  addHouse() {
    if (this.houses < maxHouses) {
      this.houses++;
      return true; // Successfully added a house
    }
    else 
    {
      return false; // Cannot add more than 9 houses
    }
  }

  getRent() {
    return this.price*config.rent * (1 + (config.rentIncrement * this.houses)) || 0;
  }


  // Display as HTML (optional)
  toHTML() {

    function cssToRGBA(color, alpha = 0.2) {
    let el = document.createElement("div");
    el.style.color = color;
    document.body.appendChild(el);

    // Get computed RGB value from browser
    let rgb = getComputedStyle(el).color;
    document.body.removeChild(el);

    // Extract numbers
    let match = rgb.match(/\d+/g).map(Number);
    return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`;
  }
  
    
  


    const div = document.createElement('div');
    div.className = 'tile';
    div.id = `T${this.id}`;
    div.setAttribute('onclick', `selectTile(${this.id})`);
    if(this.owner)
    {
      div.style.backgroundColor = cssToRGBA(players[this.owner - 1].color, 0.15);

    }
    const groupName = tileGroups[this.group-1].name !== 'Default' ? tileGroups[this.group-1].name : '';
    let houses = '';
    const hotels = Math.floor(this.houses/config.houseToHotel);
    
    for (let i = 0; i < hotels; i++) {
      houses += `<fa class="fa fa-hotel"></fa>`;
    }

    for (let i = 0; i < (this.houses - hotels*config.houseToHotel); i++) {
      houses += `<fa class="fa fa-home"></fa>`;
    }

    
    const owner = this.owner ? `<div class="tile-owner" style="color: ${players[this.owner - 1].color}"><fa class="fa fa-${players[this.owner - 1].icon}"></fa></div>` : '';

    let playersOnTile = '';
    
    let tileID = this.id;

    players.forEach(function(p){
      if(p.position == tileID && !p.out)
      {
        playersOnTile+= `<fa class="fa fa-${p.icon}" style="color: ${p.color}"></fa>`
      }
    });

    let s = ``;

    if(this.mortgaged)
    {
      s = `style="text-decoration: line-through; color: red;"`;
    }

    div.innerHTML = `
      <div class="tile-row"><div class="tile-name" ${s}>${this.name}</div>${owner}</div>
      <div class="tile-price tile-row">
      </div>
      <div class="tile-middle tile-row">
      <div class="players-on-tile tile-row">${playersOnTile}
      </div>
      </div>
      <div class="tile-houses tile-row">
      ${houses}
      </div>
      <div class="tile-group tile-row" style="background-color: ${this.color};">
      ${groupName}
      </div>

    `;
    return div;
  }
}

var tiles = [];



// Helper to shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Always add Go tile first (group 1 = Default)
tiles.push(new Tile({
  id: 1,
  name: 'Go',
  type: 'special',
  group: 1,
  position: 1
}));



// Add all city tiles to a temp array, no for loops, explicit calls only
let cityTiles = [];
let id = 2;

// Japan (group 2)
cityTiles.push(new Tile({ id: id++, name: 'Tokyo', group: 2, type: 'place', price: 1500}));
//cityTiles.push(new Tile({ id: id++, name: 'Osaka', group: 2, type: 'place', price: 1000 }));
cityTiles.push(new Tile({ id: id++, name: 'Kyoto', group: 2, type: 'place', price: 1200 }));


// Canada (group 3)
cityTiles.push(new Tile({ id: id++, name: 'Toronto', group: 3, type: 'place', price: 1800}));
//cityTiles.push(new Tile({ id: id++, name: 'Vancouver', group: 3, type: 'place', price: 1200 }));
cityTiles.push(new Tile({ id: id++, name: 'Montreal', group: 3, type: 'place' , price: 1000}));

// India (group 4)
cityTiles.push(new Tile({ id: id++, name: 'Mumbai', group: 4, type: 'place', price: 2000}));
cityTiles.push(new Tile({ id: id++, name: 'Delhi', group: 4, type: 'place' , price: 2500}));
cityTiles.push(new Tile({ id: id++, name: 'Bangalore', group: 4, type: 'place', price: 2000 }));
//cityTiles.push(new Tile({ id: id++, name: 'Chennai', group: 4, type: 'place' , price: 1200}));

// USA (group 5)
cityTiles.push(new Tile({ id: id++, name: 'New York', group: 5, type: 'place' , price: 3000}));
cityTiles.push(new Tile({ id: id++, name: 'Los Angeles', group: 5, type: 'place', price: 2000}));
cityTiles.push(new Tile({ id: id++, name: 'Chicago', group: 5, type: 'place' , price: 1800}));
//cityTiles.push(new Tile({ id: id++, name: 'San Francisco', group: 5, type: 'place' , price: 1200}));

// UK (group 6)
cityTiles.push(new Tile({ id: id++, name: 'London', group: 6, type: 'place' , price: 1500}));
cityTiles.push(new Tile({ id: id++, name: 'Manchester', group: 6, type: 'place' , price: 1000}));
//cityTiles.push(new Tile({ id: id++, name: 'Liverpool', group: 6, type: 'place' , price: 900}));

// Australia (group 7)
cityTiles.push(new Tile({ id: id++, name: 'Sydney', group: 7, type: 'place' , price: 1000}));
cityTiles.push(new Tile({ id: id++, name: 'Melbourne', group: 7, type: 'place' , price: 600}));

// Germany (group 8)
cityTiles.push(new Tile({ id: id++, name: 'Berlin', group: 8, type: 'place' , price: 1000}));
cityTiles.push(new Tile({ id: id++, name: 'Munich', group: 8, type: 'place' , price: 700}));

// China (group 9)
cityTiles.push(new Tile({ id: id++, name: 'Beijing', group: 9, type: 'place', price: 3000 }));
cityTiles.push(new Tile({ id: id++, name: 'Schenzen', group: 9, type: 'place', price: 2000 }));
cityTiles.push(new Tile({ id: id++, name: 'Guangzhou', group: 9, type: 'place', price: 1500 }));

// Russia (group 10)
cityTiles.push(new Tile({ id: id++, name: 'Moscow', group: 10, type: 'place', price: 1500 }));
cityTiles.push(new Tile({ id: id++, name: 'St Petersburg', group: 10, type: 'place', price: 1200 }));

// Egypt (group 11)
cityTiles.push(new Tile({ id: id++, name: 'Cairo', group: 11, type: 'place', price: 1000 }));
cityTiles.push(new Tile({ id: id++, name: 'Alexandria', group: 11, type: 'place', price: 500 }));



// Randomly distrbuted tiles
tilesR = cityTiles;

tilesR.push(new Tile({
  id: id++,
  name: 'Chance', 
  type: 'special',
  group: 1,
}));

tilesR.push(new Tile({
  id: id++,
  name: 'Chance', 
  type: 'special',
  group: 1,
}));
tilesR.push(new Tile({
  id: id++,
  name: 'Jail', 
  type: 'special',
  group: 1,
}));

// Shuffle all city tiles
shuffle(tilesR);

// Reassign ids and positions for city tiles starting from 2
tilesR.forEach((tile, idx) => {
  tile.id = idx + 2;
});

function generateTiles(){



// Add city tiles after Go tile
tiles = [tiles[0], ...tilesR];

  let top = "";

  for (let i = 0; i < tiles.length; i++) {
      top+= tiles[i].toHTML().outerHTML;
  }
  jQuery(".tiles").html(top);

}