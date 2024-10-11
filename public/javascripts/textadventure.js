class Place {
  constructor(name) {
    this.name = name;
    this.description = "";
    this.north = "wall";
    this.south = "wall";
    this.east = "wall";
    this.west = "wall";
    this.pickups = [];
  }

  toStr() {
    return `${this.name}`;
  }

  roomObjects() {
    let itemText = "";
    if (this.pickups.length === 0) {
      return `there is nothing in the ${this.name}\n`;
    } else {
      for (let item of this.pickups) {
        itemText += `${item}\n`;
      }
      return `In ${this.name}, you see\n${itemText}\n`;
    }
  }

  addPickUp(x) {
    this.pickups.push(x);
  }

  removePickUp(x) {
    let index = this.pickups.indexOf(x);
    if (index > -1) {
      return this.pickups.splice(index, 1)[0];
    }
  }
}

//player  class

class Player {
  constructor(name) {
    this.name = name;
    this.inventory = [];
    this.location = null;
  }

  move(direction) {
    if (direction == "north" && this.location.north != "wall") {
      this.location = this.location.north;
      return `Moved to the North. Current Location: ${this.location.name}\n`;
    } else if (direction == "south" && this.location.south != "wall") {
      this.location = this.location.south;
      return `Moved to the South. Current Location: ${this.location.name}\n`;
    } else if (direction == "west" && this.location.west !== "wall") {
      this.location = this.location.west;
      return `Moved to the West. Current Location: ${this.location.name}\n`;
    } else if (direction == "east" && this.location.east !== "wall") {
      this.location = this.location.east;
      return `Moved to the East. Current Location: ${this.location.name}\n`;
    } else {
      return "There is wall in that direction.You cannot go that way";
    }
  }

  take(item) {
    if (
      this.location.pickups
        .map((i) => i.toLowerCase())
        .includes(item.toLowerCase())
    ) {
      let takenItem = this.location.removePickUp(item);
      if (takenItem !== undefined) {
        this.inventory.push(takenItem);
        return `item ${item} picked up`;
      } else {
        return `item ${item} could not be picked up`;
      }
    } else {
      return `this item is not here`;
    }
  }

  lookAround() {
    return `${this.location.roomObjects()}\n`;
  }

  showInventory() {
    if (this.inventory.length == 0) {
      return `${this.name}'s inventory is empty\n`;
    } else {
      let inventoryText = "";
      for (let item of this.inventory) {
        inventoryText += `${item}\n`;
      }
      return `${this.name} inventory\n ${inventoryText}\n`;
    }
  }

  tellPlace() {
    return this.location.description;
  }
}

//end of player class

//creature class
class Creatures {
  constructor(name, health) {
    this.name;
    this.health;
  }
}

//end creature class to add later

function createPlace(
  name,
  description,
  pickups = null,
  north = "wall",
  east = "wall",
  south = "wall",
  west = "wall"
) {
  let place = new Place(name);
  place.description = description;
  place.north = north;
  place.south = south;
  place.east = east;
  place.west = west;

  if (pickups !== null) {
    for (let pickup of pickups) {
      place.addPickUp(pickup);
    }
  }
  return place;
}

let garden = createPlace(
  "Enchanted Garden",
  "You step into a lush garden where flowers glow with a soft light and the air is filled with the melody of singing birds. Around you, trees tower high, their leaves whispering secrets to those who listen closely.",
  (pickups = [
    "glowing rose",
    "luminescent grass",
    "golden tulip",
    "singing bird",
    "whispering Tree",
  ])
);

let livingRoom = createPlace(
  "Victorian Living Room",
  "You find yourself in a living room that exudes Victorian elegance. A grand chandelier hangs from the ceiling, casting warm light on the lavish furniture and intricate rugs that adorn the room. You notice a hint of mystery in the air, like secrets hidden within the walls waiting to be discovered.",
  (pickups = [
    "golden glasses",
    "velvet cushion",
    "ornate key",
    "silk ball",
    "antique vase",
    "red elixir",
  ])
);

let kitchen = createPlace(
  "Rustic Kitchen",
  "You walk into a rustic kitchen where the aroma of freshly baked bread fills the air. An old, yet well-maintained wooden table sits at the center, surrounded by shelves filled with jars of spices and ingredients from all over the world. It's a place that holds the warmth of a thousand meals shared.",
  (pickups = [
    "sourdough loaf",
    "aromatic herbs",
    "ancient recipe book",
    "freshly brewed potion",
    "crystal cup",
    "blue elixir",
  ])
);

let library = createPlace(
  "Mystical Library",
  "As you enter, the smell of aged parchment greets you. The library is a repository of knowledge, with towering shelves filled with books that contain the wisdom of ages. You feel a sense of wonder as you gaze upon ancient tomes and magical artifacts that promise adventure and discovery.",
  (pickups = [
    "ancient tome",
    "celestial map",
    "magical lens",
    "scrolls",
    "enchanted quill",
  ])
);

//connections
livingRoom.north = garden;
livingRoom.east = kitchen;
livingRoom.west = library;

garden.south = livingRoom;

kitchen.west = livingRoom;

library.east = livingRoom;

//game play

let player1;
let gameOn = false;
if (!gameOn) {
  intro();
}

function printTextSlowly(elementId, text, interval) {
  let i = 0;
  let element = document.getElementById(elementId);

  function helper() {
    if (i < text.length) {
      element.innerHTML += text[i];
      i++;
      setTimeout(helper, interval);
    }
  }

  helper();
}

function gamePlay() {
  let playerName = prompt("What is Your Name Player (min. 5 chars)");
  if (
    playerName !== null &&
    (playerName.length < 5 || /^\d+$/.test(playerName))
  ) {
    alert(
      "Player name cannot be less than 5 characters nor a number. Press again for automatic name"
    );
    playerName = "Vincent";
  }

  gameOn = true;
  document.getElementById("displayer").classList.remove("growText");

  player1 = new Player(playerName);
  player1.location = livingRoom;

  let introText = `Dear Hero ${playerName} your adventure is Starting`;
  printTextSlowly("displayer", introText, 100);
  document.getElementById(
    "dispLocal"
  ).innerHTML = `${player1.location.toStr()}`;
}

function movePlayer() {
  if (!gameOn) {
    alert("Please start a new game first");
    gamePlay();
    return;
  }
  const directions = ["north", "south", "east", "west"];
  let getCommand = document.getElementById("command");

  if (directions.includes(getCommand.value)) {
    let result = player1.move(getCommand.value);
    //document.getElementById('displayer').innerHTML += '\n' + result;
    printTextSlowly("displayer", "\n" + result, 100);
    document.getElementById(
      "dispLocal"
    ).innerHTML = `${player1.location.toStr()}`;
  } else if (getCommand.value.startsWith("take ")) {
    let item = getCommand.value.substring(5).trim();
    let result = "\n" + player1.take(item);
    //document.getElementById('displayer').innerHTML += '\n' + result;
    printTextSlowly("displayer", result, 100);
  } else if (getCommand.value === "look around") {
    let lookResult = player1.lookAround();
    //document.getElementById('displayer').innerHTML += '\n' + lookResult;
    printTextSlowly("displayer", "\n" + lookResult, 100);
  } else if (getCommand.value === "clear") {
    document.getElementById("displayer").innerHTML = "";
  } else if (getCommand.value === "show inventory") {
    let inventoryResult = player1.showInventory();
    //document.getElementById('displayer').innerHTML+='\n'+inventoryResult;
    printTextSlowly("displayer", "\n" + inventoryResult, 100);
  } else if (getCommand.value === "tell place") {
    let tellPlaceResult = player1.tellPlace();
    document.getElementById("displayer").innerHTML += "\n" + tellPlaceResult;
    printTextSlowly("displayer", "\n" + tellPlaceResult, 100);
  } else {
    document.getElementById("displayer").innerHTML += "\nUnknown command";
  }

  //reset command line
  document.getElementById("command").value = "";
}

//show inventory
let showInventoryFlag = 0;

function displayInventory() {
  showInventoryFlag = 1 - showInventoryFlag;
  if (showInventoryFlag == 1) {
    document.getElementById("showinventory").innerHTML =
      player1.showInventory();
    document.getElementById("startgamebutton").innerHTML = "Hide Inventory";
  } else {
    document.getElementById("showinventory").innerHTML = "";
    document.getElementById("startgamebutton").innerHTML = "Show Inventory";
  }
}

//bind enter
document.getElementById("command").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    movePlayer();
    e.preventDefault();
  }
});

function intro() {
  if (!gameOn) {
    let introText = "Press Start For New Game ";
    document.getElementById("displayer").innerHTML = introText;
    document.getElementById("displayer").classList.add("growText");
  } else {
    return;
  }
}

if (!gameOn) {
  intro();
  //
  setTimeout(intro, 5000);
}
