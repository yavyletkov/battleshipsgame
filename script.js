var view = {

    displayMessage: function(msg) {
        var messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
        var textCloud = document.getElementById('messageArea');
        // textCloud.classList.add('move');
        // setTimeout(textCloud.classList.remove, 400, 'move');
    },

    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'hit')
    },

    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute('class', 'miss')
    }

};

var model = { boardSize: 7,
              numShips: 3,
              shipLength: 3,
              shipsSunk: 0,

              ships: [{ locations: ["0", "0", "0"], hits: ["", "", ""] },
                      { locations: ["0", "0", "0"], hits: ["", "", ""] },
                      { locations: ["0", "0", "0"], hits: ["", "", ""] }],

              fire: function(guess) {

                      for (var i = 0; i < this.numShips; i++) {
                          ship = this.ships[i];
                          locations = ship.locations;
                          hits = ship.hits;

                          for (var j = 0; j < locations.length; j++) {
                              if (guess === locations[j]) {
                                  hits[j] = "hit";
                                  view.displayHit(guess);
                                  view.displayMessage("ПРЯМ В БАШНЮ, БЛЯДЬ!!");
                                  console.log(this.shipsSunk);
                                  if (this.isSunk(ship) === true) {
                                      this.shipsSunk++;
                                      view.displayMessage("КОРАБЛЬ НА ДНЕ,<br>МАТЬ НА КУКАНЕ!!");
                                  }
                                  return true;
                              }
                          }
                      }
                      view.displayMiss(guess);
                      view.displayMessage("ЁБНУЛ В НИКУДА!!!!!");
                      return false;
                    },

              isSunk: function(ship) {
                          var count = 0;
                          for (var i = 0; i < this.shipLength; i++) {
                              if (ship.hits[i] === "hit") {count++}
                          }
                          if (count === this.shipLength) {return true}
                          else {return false}
                      },

              generateShipLocations: function() {
                                        var locations;
                                        for (var i = 0; i < this.numShips; i++) {
                                            do { locations = this.generateShip(); }
                                            while (this.collision(locations));
                                            this.ships[i].locations = locations;
                                        }

                                     },

              collision: function(locations) {
                            for (var i = 0; i < this.numShips; i++) {
                                ship = this.ships[i];
                                for (var j = 0; j < ship.locations.length; j++) {
                                    if (ship.locations.indexOf(locations[j]) >= 0) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        },

              generateShip: function() {
                              var direction = Math.floor(Math.random() * 2); // 0 или 1
                              var newShipLocations = [];
                                 if (direction === 1) {
                                    var row = Math.floor(Math.random() * 7) // от 0 до 6
                                    var column = Math.floor(Math.random() * 5); // от 0 до 4
                                    for (var i = 0; i < this.shipLength; i++) {
                                       newShipLocations[i] = row + "" + column;
                                       column++;
                                    }
                                 }

                                 else {
                                     row = Math.floor(Math.random() * 5) // от 0 до 4
                                     column = Math.floor(Math.random() * 7); // от 0 до 6
                                     for (i = 0; i < this.shipLength; i++) {
                                        newShipLocations[i] = row + "" + column;
                                        row++;
                                    }
                                }
                                return newShipLocations;
                            }
}

var controller = {

    guesses: 0,
    processGuess: function(guess) {
                      var location = parseGuess(guess);
                      if (location) {
                          this.guesses++;
                          var hit = model.fire(location);
                      }
                      if (hit && model.shipsSunk === model.numShips) {
                          view.displayMessage("КРАСАВА, ЁБАНА!<br>ШМАЛЬНУЛ " + this.guesses + " РАЗ");
                      }
                  }
};

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Долбоёб!! Вводи правильно!!")
    }
    else {
        firstChar = guess.charAt(0).toUpperCase();
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {alert("Долбоёб!! Вводи правильно!!")}
        else if (column < 0 || row < 0 || column >= model.boardSize || row >= model.boardSize) {
            alert("Долбоёб!! Вводи правильно!!");
        }
        else return row + column;
    }
    return null;
}

function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;

    model.generateShipLocations();
}

function handleFireButton() {
    var guessInput = document.getElementById('guessInput');
    guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

function handleKeyPress (e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

window.onload = init;
