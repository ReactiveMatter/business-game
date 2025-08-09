
console.log("Initialising game ...");

// Main game logic for player with all properties and methods
class Player {
  constructor(id, name) {
    this.id = id;       
    this.name = name;
    this.money = config.initialMoney; // Starting money
    this.position = 1; // Starting position on the board
    this.color = ''; // Default color
    this.icon = 'user'; // Fa icon code for player
    this.out = false;
    this.bail = false;
  }
}        

var players = [];

var currentPlayerID = 1; // Current player
var selectedTileID = 0; // Tile selected by player
var rolled = false;
var onBail = false;
var canRoll = true;
var messages = []; // Messages for game console

jQuery(document).ready(function(){
    // Show setup modal on game start
    showSetupModal();
});


function showModal(title, content)  {
         // Only add modal HTML if not already present


    closeModal();
    if (!document.getElementById('gameModal')) {
        const modalHtml = `
<div id="gameModal" style="display:none;position:fixed;z-index:9999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;">
  <div style="background:#fff;padding:24px;border-radius:12px;max-width:500px;width:95vw;box-shadow:0 2px 16px #0003;position:relative;">
    <h2 style="margin-top:0;font-size:1.5em;margin-bottom:16px;color:#2d3436;">${title}</h2>
    <div class="modal-content">${content}</div>
    <button id="closeGameModal" style="position:absolute;top:8px;right:12px;font-size:1.5em;background:none;border:none;cursor:pointer;color:#636e72;transition:color 0.2s;" onclick="closeModal()">&times;</button>
  </div>
</div>`;    
//append modal HTML to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    // Show the modal
    document.getElementById('gameModal').style.display = 'flex';

}


}


function closeModal() {

        //Remove game modal if it exists
    if (document.getElementById('gameModal')) {
        document.getElementById('gameModal').remove();
    }
}



// Bootstrap modal for config and player setup
function showSetupModal() {
    // Only add modal HTML if not already present

    //hide other body elements
    jQuery('.board').hide();

    if (!document.getElementById('setupModal')) {
        const faIcons = [
            'user', 'car', 'bicycle', 'rocket', 'anchor', 'bomb', 'bug', 'cat', 'chess-knight', 'cloud',
            'dog', 'dragon', 'feather', 'fish', 'frog', 'ghost', 'hippo', 'horse', 'kiwi-bird', 'lemon'
        ];
        const colors = [
            'red', 'green', 'blue', 'orange', 'purple', 'teal', 'brown', 'pink', 'black', 'gray',
            '#e67e22', '#1abc9c', '#9b59b6', '#f1c40f', '#34495e', '#2ecc71', '#e84393', '#636e72', '#fdcb6e', '#00b894'
        ];
        let iconOptions = faIcons.map(icon => `<option value="${icon}">${icon.replace(/-/g, ' ')}</option>`).join('');
        let colorOptions = colors.map(color => `<option value="${color}" style="background:${color};color:#fff">${color}</option>`).join('');
        let modalHtml = `
<div id="setupModal" style="display:none;position:fixed;z-index:9999;left:0;top:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);justify-content:center;align-items:center;">
  <div style="background:#fff;padding:24px 24px 12px 24px;border-radius:12px;max-width:500px;width:95vw;box-shadow:0 2px 16px #0003;position:relative;display:flex;flex-direction:column;">
    <h2 style="margin-top:0;font-size:1.5em;margin-bottom:16px;color:#2d3436;letter-spacing:1px;">Add Players</h2>
    <form id="setupForm" style="display:flex;flex-direction:column;gap:8px;">
      <div id="playerList" style="display:flex;flex-direction:column;gap:8px;">
        <label style="font-weight:500;margin-bottom:4px;display:block;color:#636e72;">Players</label>
        <div class="player-entry" style="display:flex;gap:8px;align-items:center;margin-bottom:4px;">
          <input type="text" class="player-name" placeholder="Name" required style="flex:1 1 0;padding:6px 8px;border:1px solid #dfe6e9;border-radius:4px;font-size:1em;background:#f9f9f9;" />
          <select class="player-color" style="flex:1 1 0;padding:6px 8px;border:1px solid #dfe6e9;border-radius:4px;font-size:1em;background:#f9f9f9;">${colorOptions}</select>
          <select class="player-icon" style="flex:1 1 0;padding:6px 8px;border:1px solid #dfe6e9;border-radius:4px;font-size:1em;background:#f9f9f9;">${iconOptions}</select>
        </div>
        <button type="button" id="addPlayerBtn" style="margin-top:8px;padding:6px 18px;border-radius:4px;border:none;font-size:1em;cursor:pointer;background:#b2bec3;color:#222;transition:background 0.2s;">Add Player</button>
      </div>
      <div style="margin-top:16px;text-align:right;">
        <button type="button" id="startGameBtn" style="padding:6px 18px;border-radius:4px;border:none;font-size:1em;cursor:pointer;background:#0984e3;color:#fff;transition:background 0.2s;">Start Game</button>
      </div>
    </form>
    <button id="closeSetupModal" style="position:absolute;top:8px;right:12px;font-size:1.5em;background:none;border:none;cursor:pointer;color:#636e72;transition:color 0.2s;">&times;</button>
  </div>
</div>`;
        // Remove any previous modal if present (for hot reloads)
        if(document.getElementById('setupModal')) document.getElementById('setupModal').remove();
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    // Show the modal
    document.getElementById('setupModal').style.display = 'flex';

    // Add player entry on button click
    document.getElementById('addPlayerBtn').onclick = function() {
        const playerList = document.getElementById('playerList');
        const faIcons = [
            'user', 'car', 'bicycle', 'rocket', 'anchor', 'bomb', 'bug', 'cat', 'chess-knight', 'cloud',
            'dog', 'dragon', 'feather', 'fish', 'frog', 'ghost', 'hippo', 'horse', 'kiwi-bird', 'lemon'
        ];
        const colors = [
            'red', 'green', 'blue', 'orange', 'purple', 'teal', 'brown', 'pink', 'black', 'gray',
            '#e67e22', '#1abc9c', '#9b59b6', '#f1c40f', '#34495e', '#2ecc71', '#e84393', '#636e72', '#fdcb6e', '#00b894'
        ];
        let iconOptions = faIcons.map(icon => `<option value="${icon}">${icon.replace(/-/g, ' ')}</option>`).join('');
        let colorOptions = colors.map(color => `<option value="${color}" style="background:${color};color:#fff">${color}</option>`).join('');
        const div = document.createElement('div');
        div.className = 'player-entry';
        div.style.display = 'flex';
        div.style.gap = '8px';
        div.style.alignItems = 'center';
        div.style.marginBottom = '4px';
        div.innerHTML = `<input type="text" class="player-name" placeholder="Name" required style="flex:1 1 0;padding:6px 8px;border:1px solid #dfe6e9;border-radius:4px;font-size:1em;background:#f9f9f9;" /><select class="player-color" style="flex:1 1 0;padding:6px 8px;border:1px solid #dfe6e9;border-radius:4px;font-size:1em;background:#f9f9f9;">${colorOptions}</select><select class="player-icon" style="flex:1 1 0;padding:6px 8px;border:1px solid #dfe6e9;border-radius:4px;font-size:1em;background:#f9f9f9;">${iconOptions}</select>`;
        playerList.insertBefore(div, document.getElementById('addPlayerBtn'));
    };

    // Start game on button click
    document.getElementById('startGameBtn').onclick = function() {
        // Only add players
        players = [];
        const entries = document.querySelectorAll('#playerList .player-entry');
        entries.forEach(function(el, i) {
            let name = el.querySelector('.player-name').value;
            let color = el.querySelector('.player-color').value;
            let icon = el.querySelector('.player-icon').value;
            if(name && color && icon) {
                players.push(Object.assign(new Player(i+1, name), { color, icon }));
            }
        });
        if(players.length < 2) {
            showModal('Warning', 'Add at least 2 players!');
            return;
        }
        // Remove all player entries except the first for next game setup
        const allEntries = document.querySelectorAll('#playerList .player-entry');
        allEntries.forEach((el, idx) => { if(idx > 0) el.remove(); });
        document.querySelector('#playerList .player-entry input').value = '';
        document.getElementById('setupModal').style.display = 'none';
        jQuery('.board').show(); // Show the board
        updateBoard();
    };

    // Close modal on X click
    document.getElementById('closeSetupModal').onclick = function() {
        document.getElementById('setupModal').style.display = 'none';
    };
}


function updateBoard(){
    generateTiles();
    updatePlayerBoard();
    updateselectedTileID();
    updateGameConsole();
    generateGameOptions();

    jQuery(`#T${players[currentPlayerID - 1].position}`).css({
            'box-shadow':  `0px 0px 5px 5px ${players[currentPlayerID - 1].color}`,
            'transition': 'box-shadow 0.1s ease-in-out'

        });

    console.log("Board updated");

}

function diceAnimation(die1, die2, time) {
    const dice1 = $('.dice:first-child');
    const dice2 = $('.dice:nth-child(2)');

    // Reset transforms so new rotation triggers
    [dice1, dice2].forEach(die => {
        die.css('transform', 'none');
        void die[0].offsetWidth; // force reflow
    });

    // Reset instantly so animation can replay
    dice1.css({ 'transition': 'none', 'transform': 'rotate(0deg)' });
    dice2.css({ 'transition': 'none', 'transform': 'rotate(0deg)' });

    // Apply new rotation
    dice1.css({
        'transform': `rotate(360deg)`,
        'transition': `transform ${time}s ease-in-out`
    });
    dice2.css({
        'transform': `rotate(360deg)`,
        'transition': `transform ${time}s ease-in-out`
    });

    // Randomly change face numbers during animation
    let interval = setInterval(() => {
        dice1.html(Math.floor(Math.random() * 6) + 1);
        dice2.html(Math.floor(Math.random() * 6) + 1);
    }, 100);

    // Stop after animation time
    setTimeout(() => {
        clearInterval(interval);
        dice1.html(die1);
        dice2.html(die2);
    }, time * 1000);
}

// helper sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function rollDice() {
    rolled = true;
    let die1 = Math.floor(Math.random() * 6) + 1;
    let die2 = Math.floor(Math.random() * 6) + 1;
    let total = die1 + die2;
    diceAnimation(die1, die2, 1); 
    await sleep(1500); // wait for dice animation to finish
    // showModal(`Dice rolled!`, `You rolled ${die1} and ${die2} for a total of ${total}`);
    canRoll = false; // Disable rolling until next turn 
    generateGameOptions();
    messages.push(`Rolled: ${die1} and ${die2} <br> Total: ${total}`);

    if(tiles[players[currentPlayerID-1].position-1].name.toLowerCase()== 'jail' && !players[currentPlayerID-1].bail)
    {
        if(total != 2)
        {
            messages.push(`You are in jail! You need to roll 2.`);
        }
        else 
        {   
            messages.push(`You are free now`);
            await updatePosition(currentPlayerID, total);
        }
    }
    else 
    {
        await updatePosition(currentPlayerID, total);
        messages.push(`You have moved to ${tiles[players[currentPlayerID-1].position-1].name}`);
        if(tiles[players[currentPlayerID-1].position-1].name.toLowerCase()== 'jail')
        {
            messages.push(`You are in jail!`);
            players[currentPlayerID - 1].bail = false;
        }
        else if(total == 2 || total == 12)
        {
           
            messages.push(`You have rolled a double. You can roll again.`);
            canRoll = true;
        }

        if(tiles[players[currentPlayerID-1].position-1].name.toLowerCase()== 'chance')
        {
           
            messages.push(`You have landed on chance!`);
            executeChance();
        }




        if(tiles[players[currentPlayerID-1].position-1].owner && !tiles[players[currentPlayerID-1].position-1].mortgaged && tiles[players[currentPlayerID-1].position-1].owner != currentPlayerID)
        {
            //pay rent

            if(players[currentPlayerID-1].money >= tiles[players[currentPlayerID-1].position-1].getRent())
            {
                messages.push(`You have landed on ${tiles[players[currentPlayerID-1].position-1].name} owned by ${players[tiles[players[currentPlayerID-1].position-1].owner-1].name}. You have paid a rent of ${tiles[players[currentPlayerID-1].position-1].getRent()} to ${players[tiles[players[currentPlayerID-1].position-1].owner-1].name}.`);
            }
            else if(getNetWorth(currentPlayerID) > tiles[players[currentPlayerID-1].position-1].getRent())
            {   
                showModal(`Less money`,`You have to raise money to pay rent. Else you will be declared are bankrupt!`);
                messages.push(`You have landed on ${tiles[players[currentPlayerID-1].position-1].name} owned by ${players[tiles[players[currentPlayerID-1].position-1].owner-1].name}. You have paid a rent of ${tiles[players[currentPlayerID-1].position-1].getRent()} to ${players[tiles[players[currentPlayerID-1].position-1].owner-1].name}. 
                You money is in negative, raise money, else you will declared bankrupt!`);

            }   
            else 
            {
                showModal(`No money!`,`You do not have enough money to pay rent. You are bankrupt!`);
            }
            let rent = tiles[players[currentPlayerID-1].position-1].getRent();
            players[currentPlayerID-1].money -= rent;
            players[tiles[players[currentPlayerID-1].position-1].owner - 1].money += rent;

        }

        
    }

    updateBoard();
    
}


//Update the position of player with id pid after adding total;
async function updatePosition(pid, total)
{   
      for (let i = 0; i < total; i++) {
        players[pid - 1].position++;

        if (players[pid - 1].position > tiles.length) {
            players[pid - 1].position = 1;
            players[pid-1].money += config.incomeAfterRound;
        }
        generateTiles();

        jQuery(`#T${players[pid - 1].position}`).css({
            'box-shadow': `0px 0px 5px 5px ${players[pid - 1].color}`,
            'transition': 'box-shadow 0.1s ease-in-out'

        });

        if(i < total-1)
        {
            await sleep(200); // wait 300ms before next move
        }
        
    }
   
    // players[pid - 1].position += total;

    // // Player has passed the start
    // if(players[pid - 1].position > tiles.length)
    // {
    //     players[pid-1].money += config.incomeAfterRound;
    //     players[pid - 1].position = players[pid - 1].position - tiles.length;
    // }
    
    selectedTileID = players[pid - 1].position;
   // updateBoard();

}


function updatePlayerBoard(){
    let h = `<div class="header">Players</div>`;
    players.forEach(function(player) {
        if( !player.out)
        {
            let a = ``;
            if(player.id == currentPlayerID)
            {
                a = 'active';
            }
            h+= `<div class="player-info ${a}"><fa class="fa fa-${player.icon}" style="color:${player.color}"></fa><div class="name">${player.name}</div><div class="money">${player.money}</div></div>`;
    
        }
    });

    jQuery(".player-board").html(h);

    updateNetWorth();

}

function updateGameConsole(){


    let consoleContent = `<div class="header">Game Console</div>`;        
    messageHTML = ``;
    messages.forEach(function(msg) {
    messageHTML += `<div class="flex-row">${msg}</div>`;
   } );
    
    consoleContent+=`<div class="message flex">${messageHTML}</div>`;

    jQuery(".game").html(consoleContent);
}

function selectTile(tileId) {
    selectedTileID = tileId;
    updateselectedTileID();
}

function updateselectedTileID() {
    let t = '';
    t += `<div class="header">Selected Tile</div>`;
    if (selectedTileID > 0) {
        let tile = tiles.find(t => t.id === selectedTileID);
        if(tile.type === 'special') {
            
            if(tile.name.toLowerCase() == 'go')
            {
                t += `<div>This is the starting point.</div>`;
                t += `Income after each round: ${config.incomeAfterRound}`;
                jQuery(".selected-tile").html(t);
                return;
            }
            else if (tile.name.toLowerCase() == 'jail')
            {
                t += `<div>If you are in jail you need doube 1s to be free. Or pay ${config.bailAmount} to set yourself free</div>`;
                jQuery(".selected-tile").html(t);
                return;
            }
            else if (tile.name.toLowerCase() == 'chance')
            {
                t += `<div>Chance, sometimes good sometimes bad.</div>`;
                jQuery(".selected-tile").html(t);
                return;
            }
            else 
            {
                t += ``;
                jQuery(".selected-tile").html(t);
                return;
            }   

        }
        const groupName = tileGroups[tile.group-1].name !== 'Default' ? tileGroups[tile.group-1].name : '';
        let houses = '';
        const hotels = Math.floor(tile.houses/config.houseToHotel);
        for (let i = 0; i < hotels; i++) {
            houses += `<fa class="fa fa-hotel"></fa>`;
        }
        for (let i = 0; i < (tile.houses - hotels*config.houseToHotel); i++) {
            houses += `<fa class="fa fa-home"></fa>`;
        }
        t_owner = players.find(p => p.id === tile.owner);
        let ownerBadge = t_owner ? `<div class="tile-owner" style="color: ${t_owner.color}"><fa class="fa fa-${t_owner.icon}"></fa></div>` : '';
        let s = ``;   
        if(tile.mortgaged)
        {
        s = `style="text-decoration: line-through; color: red;"`;
        }
        
        t += `<div class="tile-row"><div class="tile-name" ${s}>${tile.name}</div>${ownerBadge}</div>`;
        t += `<div class="tile-price tile-row"><div>Price: ${tile.price} </div><div>Rent: ${tile.getRent()}</div></div>`;
        t += `<div class="tile-houseprice tile-row"><div>House buy price: ${Math.floor(tile.price*config.houseCost)} </div><div> House sell price: ${Math.floor(tile.price*config.houseCost*config.houseDepreciation)}</div></div>`;
        t += `<div class="tile-houseprice tile-row"><div>Mortgage value: ${Math.floor(tile.price*config.mortgageRate)} </div></div>`;
  
        if(t_owner)
        {
            if(tile.mortgaged)
            {
                t += `<div class="tile-price tile-row"><div>Owned by: ${t_owner.name}  (<span style="color:red">Mortgaged</span>)</div></div>`;
            }
            else 
            {
                t += `<div class="tile-price tile-row"><div>Owned by: ${t_owner.name}</div></div>`;

            }
        }
        else
        {
         t += `<div class="tile-price tile-row"><div>Owned by: None</div></div>`;

        }
        
        currentPlayerPosition = players.find(p => p.id === currentPlayerID).position;

        let options = ``;
        if(tile.owner === currentPlayerID) {
            
            if(tile.mortgaged) {
                options += `<button class="option" onclick="unmortgage(${tile.id})">Unmortgage</button>`;
            }
            else{

                //check if player has all tiles in group
                let groupTiles = tiles.filter(t => t.group === tile.group && t.owner === currentPlayerID);
                let allTilesInGroup = tiles.filter(t => t.group === tile.group);

                if(groupTiles.length === allTilesInGroup.length && players[currentPlayerID-1].money > Math.floor(tile.price * config.houseCost)) {
                    
                    options += `<button class="option" onclick="buyHouse(${tile.id})">Buy House</button>`;
                }

                if(tile.houses > 0 )
                {
                  options += `<button class="option" onclick="sellHouse(${tile.id})">Sell House</button>`;

                }
                options += `<button class="option" onclick="mortgage(${tile.id})">Mortgage</button>`;
            }
        }

        if(currentPlayerPosition === tile.id && !tile.owner  && players[currentPlayerID-1].money >= tile.price)
        {
            options += `<button class="option" onclick="buyTile(${tile.id})">Buy</button>`;
        }
        
        t += `<div class="selected-tile-options">${options}</div>`;
         t += `<div class="tile-middle tile-row"></div>`;
        t += `<div class="tile-houses tile-row">${houses}</div>`;
        // t += `<div class="tile-type">Type: ${tile.type}</div>`;
        t += `<div class="tile-group tile-row" style="background-color: ${tile.color};">${groupName}</div>`;

    } else {
        t += `<div class="tile-info">No tile selected</div>`;
    }
    jQuery(".selected-tile").html(t);
}


function generateGameOptions() {
    let optionsContent = `<div class="header">Player Options</div>`;
    
    let bailOption = ``;
    

    if(canRoll == true)
    {   
        optionsContent  += `<div class="dices"><div class="dice">0</div><div class="dice">0</div></div>`;
        if(tiles[players[currentPlayerID-1].position-1].name.toLowerCase()== 'jail')
        {
        
        if(getNetWorth(currentPlayerID) > config.bailAmount)
        {
            
            optionsContent  += `<button class="option" id="roll-dice" onclick="payBail()">Pay bail and roll</button>`

        }
        }

        optionsContent += `<button class="option" id="roll-dice" onclick="rollDice()">Roll dice</button>`;

    }

    // optionsContent += `<button class="option" id="quitGame" onclick="quitGame(${currentPlayerID})">Quit game</button>`;
    optionsContent+=`<div style="flex-grow: 1;"></div>`;

    if(!canRoll)
    {
        optionsContent += `<button class="option" id="next" onclick="gameNext()">Next</button>`;
    }   
    
    jQuery(".game-options").html(optionsContent);
}

function payBail()
{
    players[currentPlayerID - 1].bail = true;
    
    if(players[currentPlayerID - 1].money >= config.bailAmount) {
    players[currentPlayerID - 1].money -= config.bailAmount;
    }
    else {
        showModal(`Less money`,`You do not have enough money to pay bail.`);;
    }

    rollDice();
}

function gameNext()
{
   

    if(getNetWorth(currentPlayerID) < 0 || players[currentPlayerID - 1].money < 0 )
    {
        showModal(players[currentPlayerID - 1].name + ' is bankrupt!', `${players[currentPlayerID - 1].name} has been declared bankrupt. All of your assets will be sold now been declared bankrupt. You cannot continue the game.`);
        
          //release assets of current player and remove from game
    
    tiles.forEach(function(tile) {
        if(tile.owner === currentPlayerID) {
            tile.owner = null; // Remove ownership
            tile.houses = 0; // Remove houses
            tile.mortgaged = false; // Unmortgage the tile
        }
    });

    //remove player from game
    players[currentPlayerID - 1].out = true;


    
    }

    let activeIds = [];
    players.forEach(function(p){
        if(!p.out)
        {
            activeIds.push(p.id);
        }
        
    })

    console.log(activeIds);

    if(activeIds.length == 1)
    {
        showModal("Game over", `${players[activeIds[0]-1].name} has won the game`);
    }
    else
    {   
        do{
                currentPlayerID = currentPlayerID + 1;
                if(currentPlayerID > players.length)
                {
                    currentPlayerID = 1;
                }
            }
            while(players[currentPlayerID - 1].out)
            

        
    }

    

 

    canRoll = true;
    selectedTileID = players[currentPlayerID - 1].position;
    messages = [];
    updateBoard();

}

// Buy tile by currentPlayer
function buyTile(tid) {
    let tile = tiles.find(t => t.id === tid);
    let player = players[currentPlayerID - 1];
    if (!tile.owner && player.money >= tile.price) {
        player.money -= tile.price;
        tile.owner = player.id;
        messages.push(`You have purchased  ${tile.name} for ${tile.price}`);
        updateBoard();
    } else {
        showModal('Cannot buy tile', 'Not enough money or already owned.');
    }
}

// Buy house on a tile
function buyHouse(tid) {
    let tile = tiles[tid - 1];
    let player = players[currentPlayerID - 1];
    let housePrice = Math.floor(tile.price * config.houseCost); // 25% of property value
    if (tile.owner === player.id && player.money >= housePrice && tile.houses < config.maxHouses) {
        player.money -= housePrice;
        tile.houses++;
        updateBoard();
    }

   
}

// Sell house on a tile
function sellHouse(tid) {
    let tile = tiles.find(t => t.id === tid);
    let player = players[currentPlayerID - 1];
    sellPrice = Math.floor(tile.price * config.houseCost * config.houseDepreciation); // 50% of house value when sold
    if (tile.owner === player.id && tile.houses > 0) {
        player.money += sellPrice;
        tile.houses--;
        updateBoard();
    } 
}

// Mortgage a tile
function mortgage(tid) {
    let tile = tiles.find(t => t.id === tid);
    let player = players[currentPlayerID - 1];
    if (tile.owner === player.id && !tile.mortgaged) {
        player.money += Math.floor(tile.price * config.mortgageRate);
        tile.mortgaged = true;
        messages.push(`You have mortgaged ${tile.name} and received ${Math.floor(tile.price * config.mortgageRate)}`);
        updateBoard();
    } 
}

// Unmortgage a tile
function unmortgage(tid) {
    let tile = tiles.find(t => t.id === tid);
    let player = players[currentPlayerID - 1];
    let unmortgageCost = tile.price;
    if (tile.owner === player.id && tile.mortgaged && player.money >= unmortgageCost) {
        player.money -= unmortgageCost;
        tile.mortgaged = false;
        messages.push(`You have unmortgaged ${tile.name} for ${unmortgageCost}`);
        updateBoard();
    } 
}

// Quit game for a player
function quitGame(pid) {

}




function getNetWorth(pid) {
    let player = players[pid - 1];
    let netWorth = player.money;

    mortgagedTiles = [];

    tiles.forEach(function(tile) {
        if (tile.owner === pid ) {
            if (!tile.mortgaged) {
                if(tile.houses > 0) {
                    netWorth += Math.floor(tile.price * config.houseCost * config.houseDepreciation * tile.houses);
                }
                netWorth += Math.floor(tile.price * config.mortgageRate);  
        }
        else 
        {
            mortgagedTiles.push(tile);
        }
        }
    }); 

    mortgagedTiles.sort((a, b) => a.price - b.price); // Sort by price for better display
    // Recursive check if the realisable networth can allow the player to unmortgage and sell houses

    // mortgagedTiles.forEach(function(tile) {
    //     if(netWorth >= Math.floor(tile.price))
    //         {
    //             netWorth -= Math.floor(tile.price);
    //             if(tile.houses > 0) {
    //                 netWorth += Math.floor(tile.price * config.houseCost * config.houseDepreciation * tile.houses);
    //         }
    //     }
    //     else {
    //         return 0;
    //     }

    // });

    return netWorth;

}


    

function updateNetWorth(){

    let h = `<div class="header">Net worth</div>`;
    p = structuredClone(players);
    p.forEach(function(player) {
        p[player.id - 1].netWorth = getNetWorth(player.id);
    });

    p.sort((a, b) => b.netWorth - a.netWorth); // Sort players by net worth
    p.forEach(function(player) {
        if(!player.out)
        {
            h+= `<div class="player-info"><fa class="fa fa-${player.icon}" style="color:${player.color}"></fa><div class="name">${player.name}</div><div class="money">${player.netWorth}</div></div>`;

        }

    });

    h+=`<p>Net worth is calculated as the total liquid money a player can realise by selling all their assets.</p>`;


    jQuery(".player-networth").html(h);

}

// Execute a random chance for the current player
function executeChance() {
    if (players.length === 0) return;
    const player = players[currentPlayerID - 1];
    const chanceScenarios = [
        {
            text: 'Advance to Go',
            action: function() {
                player.position = 1;
                player.money += config.incomeAfterRound; // Collect income after passing Go};
                messages.push(`You have advanced to go and earned ${config.incomeAfterRound}`);
            }
        },
        {
            text: 'Bank pays you dividend of 500',
            action: function() {
                messages.push(`You have earned 500`);
                player.money += 500;
            }
        },
        {
            text: 'Go to Jail. Move directly to Jail. Do not pass Go, do not collect money.',
            action: function() {
                // Find the jail tile
                const jailTile = tiles.find(t => t.name.toLowerCase() === 'jail');
                if (jailTile) player.position = jailTile.id;
                messages.push(`You are in jail!`);
                players[currentPlayerID - 1].bail = false;
            }
        },
        {
            text: 'Pay school fees of 300',
            action: function() {
                player.money -= 300;
                messages.push(`You have 300 for school fees!`);
            }
        },
        {
            text: 'Your building loan matures. Collect 1500',
            action: function() {
                messages.push(`You have earned 1500!`);
                player.money += 1500;
            }
        }
    ];
    const idx = Math.floor(Math.random() * chanceScenarios.length);
    const chosen = chanceScenarios[idx];
    chosen.action();
    showModal('Landed on chance', 'Chance: ' + chosen.text);
    updateBoard();
}