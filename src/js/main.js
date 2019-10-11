class Game {
    // --------------------------------------------------------------
    // Game constructer
    // --------------------------------------------------------------
    constructor(gameContainerElement) {
        this.availableCells = [];
        this.unavailableCells = [];
        this.gameContainerElement = gameContainerElement;
        this.gameGridElement = this.gameContainerElement.querySelector('.grid');
    }
    // --------------------------------------------------------------
    // initialising game
    // --------------------------------------------------------------
    init() {

        const GRID_SIZE = 12;
        const PLAYERS = [{
                name: 'Zeus',
                className: 'player-1',
                rowMin: 0,
                rowMax: Math.floor(GRID_SIZE / 3),
                colMin: 0,
                colMax: GRID_SIZE - 1,
                health: 100,
                attack: 10,
                shield: 10,
                speed: 2
            },
            {
                name: 'Poseidon',
                className: 'player-2',
                rowMin: Math.floor(GRID_SIZE / 2),
                rowMax: GRID_SIZE - 1,
                colMin: 0,
                colMax: GRID_SIZE - 1,
                health: 100,
                attack: 10,
                shield: 10,
                speed: 2
            }
        ];
        const DISABLED_CELLS = 15;
        const PICKUPS_COUNT = 5;
        const PICKUPS = [{
                type: 'defense',
                className: 'pickup-defense',
                effect: 10
            },
            {
                type: 'attack',
                className: 'pickup-attack',
                effect: 20
            },
            {
                type: 'health',
                className: 'pickup-health',
                effect: 10
            },
            {
                type: 'attack',
                className: 'pickup-attack-super',
                effect: 40
            },
            {
                type: 'speed',
                className: 'pickup-speed',
                effect: 3
            }
        ];


        // Grid
        new Grid(this.gameGridElement, GRID_SIZE, this);

        // Dimmed Cells
        const dimmedCells = new DimmedCell(GRID_SIZE, this);
        for (let i = 0; i < DISABLED_CELLS; i++) {
            dimmedCells.dimCell();
        }

        // Players
        new Player(GRID_SIZE, PLAYERS[0], this);
        new Player(GRID_SIZE, PLAYERS[1], this);

        // PICKUPS
        for (let i = 0; i < PICKUPS_COUNT; i++) {
            new Pickup(GRID_SIZE, PICKUPS[0], this);
            new Pickup(GRID_SIZE, PICKUPS[1], this);
            new Pickup(GRID_SIZE, PICKUPS[2], this);
            new Pickup(GRID_SIZE, PICKUPS[3], this);
            new Pickup(GRID_SIZE, PICKUPS[4], this);
        }

        // Engine
        new Engine(PLAYERS, PICKUPS, this);
    }
}


class Grid {
    // --------------------------------------------------------------
    // Grid constructer
    // --------------------------------------------------------------
    constructor(gridContainer, gridSize, game) {
        this.gridContainer = gridContainer;
        this.gridSize = gridSize;
        this.game = game;
        this.draw();
    }

    // --------------------------------------------------------------
    // loops through and places cells on the grid.
    // --------------------------------------------------------------
    draw() {
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                this.gridContainer.appendChild(this.createGridItem(row, col));
                this.game.availableCells.push([row, col]);
            }
        }

        this.resizeGrid();
    }
    // --------------------------------------------------------------
    // creates an item (div), giving it a class and data-set  
    // correlating with its position on the grid.
    // --------------------------------------------------------------
    createGridItem(row, col) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.classList.add(`cell_${row}_${col}`);
        gridItem.setAttribute('data-row', row);
        gridItem.setAttribute('data-col', col);
        return gridItem;
    }

    // -------------------------------------------------------------- 
    // takes the grid container and put it in columns equal
    // to the size of the gridSize.
    // --------------------------------------------------------------
    resizeGrid() {
        this.gridContainer.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    }
}


class Item {
    // -------------------------------------------------------------- 
    // Item constructor
    // --------------------------------------------------------------
    constructor(row, col, itemClassName, game) {
        this.game = game;
        this.row = row;
        this.col = col;
        this.itemClassName = itemClassName;
        this.avoidItems = [
            'pickup-attack',
            'pickup-attack-super',
            'pickup-defense',
            'pickup-health',
            'pickup-speed',
            'player-1',
            'player-2'
        ];
    }
    // --------------------------------------------------------------
    // Check if there are any nearby avoidItems to the given cell.
    // returns `true` If there are no nearby avoidItems.
    // returns `false` If there are one or more nearby avoidItems.
    // --------------------------------------------------------------
    checkNearby(row, col) {

        let topCell = this.game.gameContainerElement.querySelector(
            `.cell_${row - 1}_${col}`
        );
        let bottomCell = this.game.gameContainerElement.querySelector(
            `.cell_${row + 1}_${col}`
        );
        let rightCell = this.game.gameContainerElement.querySelector(
            `.cell_${row}_${col + 1}`
        );
        let leftCell = this.game.gameContainerElement.querySelector(
            `.cell_${row}_${col - 1}`
        );

        if (
            this.isCloseTo(
                topCell,
                bottomCell,
                rightCell,
                leftCell,
                this.avoidItems[0]
            )
        ) {
            if (
                this.isCloseTo(
                    topCell,
                    bottomCell,
                    rightCell,
                    leftCell,
                    this.avoidItems[1]
                )
            ) {
                if (
                    this.isCloseTo(
                        topCell,
                        bottomCell,
                        rightCell,
                        leftCell,
                        this.avoidItems[2]
                    )
                ) {
                    if (
                        this.isCloseTo(
                            topCell,
                            bottomCell,
                            rightCell,
                            leftCell,
                            this.avoidItems[3]
                        )
                    ) {
                        if (
                            this.isCloseTo(
                                topCell,
                                bottomCell,
                                rightCell,
                                leftCell,
                                this.avoidItems[4]
                            )
                        ) {
                            if (
                                this.isCloseTo(
                                    topCell,
                                    bottomCell,
                                    rightCell,
                                    leftCell,
                                    this.avoidItems[5]
                                )
                            ) {
                                if (
                                    this.isCloseTo(
                                        topCell,
                                        bottomCell,
                                        rightCell,
                                        leftCell,
                                        this.avoidItems[6]
                                    )
                                ) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    // --------------------------------------------------------------
    // Used by checkNearby() to check if given cells are close to the
    // given item and returns `true` If there's a close `item`.
    // `false` If there isn't.
    // --------------------------------------------------------------
    isCloseTo(topCell, bottomCell, rightCell, leftCell, item) {
        if (
            !(
                topCell.classList.contains(item) || bottomCell.classList.contains(item) ||
                rightCell.classList.contains(item) || leftCell.classList.contains(item)
            )
        ) {
            return true;
        } else {
            return false;
        }
    }

    // --------------------------------------------------------------
    // Check whether a given cell is available or not.
    // returns `true` If it's available.
    // --------------------------------------------------------------
    isAvailableCell(row, col) {
        let result = !this.game.unavailableCells.includes(`cell_${row}_${col}`);
        return result;
    }

    // --------------------------------------------------------------
    // Put a specific item on the grid, based on its row, col.
    // the itemClassName specifies which item it represents.
    // --------------------------------------------------------------
    placeItem(row, col, itemClassName) {
        let selectedCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col}`);
        selectedCell.classList.add(itemClassName);

        // Make that cell unavailable for later use
        this.game.unavailableCells.push(`cell_${row}_${col}`);
    }
}

class DimmedCell extends Item {
    // --------------------------------------------------------------
    // DimmedCell constructor > extending Item
    // --------------------------------------------------------------
    constructor(GRID_SIZE) {
        super(null, null, null, game);
        this.GRID_SIZE = GRID_SIZE;
    }
    // --------------------------------------------------------------
    // picks random cell and checks if its avaliable. If `true`
    // places a dimmed cell and adds it to `unavaliableCells`
    // --------------------------------------------------------------
    dimCell() {
        let randCellRow = getRandomInt(0, this.GRID_SIZE - 1);
        let randCellCol = getRandomInt(0, this.GRID_SIZE - 1);

        if (this.isAvailableCell(randCellRow, randCellCol)) {
            this.placeItem(randCellRow, randCellCol, 'disabled');
        } else {
            return this.dimCell();
        }
    }
}

class Player extends Item {
    // --------------------------------------------------------------
    // Player constructor > extending Item
    // --------------------------------------------------------------
    constructor(GRID_SIZE, player, game) {
        super(null, null, null, game);
        this.GRID_SIZE = GRID_SIZE;
        this.rowMin = player.rowMin;
        this.rowMax = player.rowMax;
        this.colMin = player.colMin;
        this.colMax = player.colMax;
        this.speed = 2;
        this.className = player.className;
        this.add();
    }

    // --------------------------------------------------------------
    // adds the player onto the grid by assigning it a random col 
    // and row. 
    // --------------------------------------------------------------
    add() {
        let randCellRow = getRandomInt(0, this.GRID_SIZE - 1);
        let randCellCol = getRandomInt(0, this.GRID_SIZE - 1);

        // ensures the player begin at different sides of the map.
        if (
            randCellRow >= this.rowMin &&
            randCellRow <= this.rowMax &&
            (randCellCol > this.colMin && randCellCol < this.colMax)
        ) {
            if (this.isAvailableCell(randCellRow, randCellCol)) {
                this.placeItem(randCellRow, randCellCol, this.className);
            } else {
                return this.add();
            }
        } else {
            return this.add();
        }
    }
}

class Pickup extends Item {
    // --------------------------------------------------------------
    // Pickup constructor > extending Item
    // --------------------------------------------------------------
    constructor(GRID_SIZE, pickup, game) {
        super(null, null, null, game);
        this.GRID_SIZE = GRID_SIZE;
        this.className = pickup.className;
        this.add();
    }

    // --------------------------------------------------------------
    // adds the pickup onto the grid by assigning it a random col 
    // and row. 
    // --------------------------------------------------------------
    add() {
        let randCellRow = getRandomInt(1, this.GRID_SIZE - 2);
        let randCellCol = getRandomInt(1, this.GRID_SIZE - 2);

        if (this.isAvailableCell(randCellRow, randCellCol)) {

            // check if there are any nearby pickups
            if (this.checkNearby(randCellRow, randCellCol)) {
                this.placeItem(randCellRow, randCellCol, this.className);
            } else {
                return this.add();
            }
        } else {
            return this.add();
        }
    }
}

class Engine {
    // --------------------------------------------------------------
    // Engine constructor 
    // --------------------------------------------------------------
    constructor(players, pickups, game) {
        this.game = game;
        this.players = players;
        this.pickups = pickups;
        this.playerTurn = 0;
        this.MAX_HIGHLIGHTED_CELLS = 2;
        this.updateStats();
        this.controller();
        this.highlightAvailableCells();
    }


    // --------------------------------------------------------------
    // Adds `click` to each cell, and
    // If clicked, `checkTurn` to check current player turn, and use the
    // Returned value to get the player's element, and
    // Remove the associated class from the old location, and
    // Add that class to the new location
    // Change the player turn to the next player
    // Highlight available cells according to each player's turn
    // --------------------------------------------------------------
    controller() {
        const gridItems = this.game.gameContainerElement.querySelectorAll('.grid-item');

        for (let item of gridItems) {
            item.addEventListener('click', () => {
                let player = this.checkTurn();
                let playerElement = this.game.gameContainerElement.querySelector(`.${player}`);
                playerElement.classList.remove(player);
                item.classList.add(player);

                let playerRow = item.getAttribute('data-row');
                let playerCol = item.getAttribute('data-col');

                // Hit a pickup?
                this.takePickup(this.playerTurn, item);

                // Combat Mode?
                if (this.isCombatMode(this.playerTurn, playerRow, playerCol)) {
                    this.startCompatMode();
                }

                // Switch player turn
                this.playerTurn = this.playerTurn == 0 ? 1 : 0;

                // Highlight Available Cells
                this.highlightAvailableCells();
            });
        }
    }


    // --------------------------------------------------------------
    // select dashboard of requested player.
    // also between standard player dashboard and combat dashboard.  
    // --------------------------------------------------------------
    getPlayerDashboard(playerIndex, combat = false) {
        return this.game.gameContainerElement.querySelector(
            `#${combat ? 'combat_' : ''}player_${playerIndex + 1}_dashboard`
        );
    }


    // --------------------------------------------------------------
    // Check if the `landedCell` has a pickup or not, if yes, 
    // remove that pickup.
    // Increase/Decrease stats based on the pickup.
    // Animate the stats.
    // Call `updateStats` to update stats change.
    // --------------------------------------------------------------
    takePickup(currentPlayer, landedCell) {
        if (landedCell.classList.contains('pickup-attack')) {
            landedCell.classList.remove('pickup-attack');
            this.players[currentPlayer].attack = this.pickups[1].effect;

            this.getPlayerDashboard(currentPlayer)
                .querySelector('#attack')
                .classList.add('updateStats');
            setTimeout(() => {
                this.getPlayerDashboard(currentPlayer)
                    .querySelector('#attack')
                    .classList.remove('updateStats');
            }, 1000);
            this.updateStats();

        } else if (landedCell.classList.contains('pickup-defense')) {
            landedCell.classList.remove('pickup-defense');
            this.players[currentPlayer].shield += this.pickups[0].effect;

            this.getPlayerDashboard(currentPlayer)
                .querySelector('#shield')
                .classList.add('updateStats');
            setTimeout(() => {
                this.getPlayerDashboard(currentPlayer)
                    .querySelector('#shield')
                    .classList.remove('updateStats');
            }, 1000);
            this.updateStats();

        } else if (landedCell.classList.contains('pickup-health')) {
            landedCell.classList.remove('pickup-health');
            this.players[currentPlayer].health += this.pickups[2].effect;
            this.getPlayerDashboard(currentPlayer)
                .querySelector('#health')
                .classList.add('updateStats');
            setTimeout(() => {
                this.getPlayerDashboard(currentPlayer)
                    .querySelector('#health')
                    .classList.remove('updateStats');
            }, 1000);
            this.updateStats();

        } else if (landedCell.classList.contains('pickup-attack-super')) {
            landedCell.classList.remove('pickup-attack-super');
            this.players[currentPlayer].attack = this.pickups[3].effect;

            this.getPlayerDashboard(currentPlayer)
                .querySelector('#attack')
                .classList.add('updateStats');
            setTimeout(() => {
                this.getPlayerDashboard(currentPlayer)
                    .querySelector('#attack')
                    .classList.remove('updateStats');
            }, 1000);
            this.updateStats();

        } else if (landedCell.classList.contains('pickup-speed')) {
            landedCell.classList.remove('pickup-speed');
            this.players[currentPlayer].speed = this.pickups[4].effect;
        }
    }


    // --------------------------------------------------------------
    // Update stats
    // --------------------------------------------------------------
    updateStats() {
        const playerOneDashboard = this.getPlayerDashboard(0);
        const playerTwoDashboard = this.getPlayerDashboard(1);
        playerOneDashboard.querySelector(
            '#health'
        ).innerHTML = this.players[0].health;
        playerOneDashboard.querySelector(
            '#attack'
        ).innerHTML = this.players[0].attack;
        playerOneDashboard.querySelector(
            '#shield'
        ).innerHTML = this.players[0].shield;

        playerTwoDashboard.querySelector(
            '#health'
        ).innerHTML = this.players[1].health;
        playerTwoDashboard.querySelector(
            '#attack'
        ).innerHTML = this.players[1].attack;
        playerTwoDashboard.querySelector(
            '#shield'
        ).innerHTML = this.players[1].shield;
    }

    updateCombatStats() {
        const combatPlayerOneDashboard = this.getPlayerDashboard(0, true);
        const combatPlayerTwoDashboard = this.getPlayerDashboard(1, true);
        combatPlayerOneDashboard.querySelector(
            '#health'
        ).innerHTML = this.players[0].health;
        combatPlayerOneDashboard.querySelector(
            '#attack'
        ).innerHTML = this.players[0].attack;
        combatPlayerOneDashboard.querySelector(
            '#shield'
        ).innerHTML = this.players[0].shield;

        combatPlayerTwoDashboard.querySelector(
            '#health'
        ).innerHTML = this.players[1].health;
        combatPlayerTwoDashboard.querySelector(
            '#attack'
        ).innerHTML = this.players[1].attack;
        combatPlayerTwoDashboard.querySelector(
            '#shield'
        ).innerHTML = this.players[1].shield;
    }

    // --------------------------------------------------------------
    // Reset Active Turn
    // Add `active-turn` class to the current player's turn
    // Return the current player, to be used at the `controller` method
    // --------------------------------------------------------------
    checkTurn() {
        const currentPlayer = this.playerTurn;
        this.resetTurn();
        this.getPlayerDashboard(currentPlayer).classList.add('active-turn');
        this.getPlayerDashboard(currentPlayer, true).classList.add('active-turn');
        return `player-${this.playerTurn + 1}`;
    }

    // --------------------------------------------------------------
    // Remove `active-turn` class from the previous turn
    // --------------------------------------------------------------
    resetTurn() {
        let activeTurn = this.game.gameContainerElement.querySelectorAll('.active-turn');

        for (let i = 0; i < activeTurn.length; i++) {
            activeTurn[i].classList.remove('active-turn');
        }
    }

    // --------------------------------------------------------------
    // Which player turn is it (Initiialy, it's going to be `player-1`)
    // Get the player `offset` (i.e. `row` & `col`)
    // Highlight available cells for selected player in all directions.
    // --------------------------------------------------------------
    highlightAvailableCells() {

        this.resetHighlightedCells();

        let player = this.checkTurn();
        let playerElement = this.game.gameContainerElement.querySelector(`.${player}`);

        let row = parseInt(playerElement.getAttribute('data-row'));
        let col = parseInt(playerElement.getAttribute('data-col'));

        // Top
        for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
            let topCell = this.game.gameContainerElement.querySelector(`.cell_${row - i}_${col}`);

            // Check if cell is unavailable
            if (row - i < 0) {
                break;
            } else if (topCell.classList.contains('disabled')) {
                break;
            } else {
                topCell.classList.add('highlighted');
            }
        }

        // Right
        for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
            let rightCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col + i}`);

            // Check if cell is unavailable
            if (col + i > 11) {
                break;
            } else if (rightCell.classList.contains('disabled')) {
                break;
            } else {
                rightCell.classList.add('highlighted');
            }
        }

        // Bottom
        for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
            let bottomCell = this.game.gameContainerElement.querySelector(`.cell_${row + i}_${col}`);

            // Check if cell is unavailable
            if (row + i > 11) {
                break;
            } else if (bottomCell.classList.contains('disabled')) {
                break;
            } else {
                bottomCell.classList.add('highlighted');
            }
        }

        // Left
        for (let i = 1; i <= this.players[this.playerTurn].speed; i++) {
            let leftCell = this.game.gameContainerElement.querySelector(`.cell_${row}_${col - i}`);

            // Check if cell is unavailable
            if (col - i < 0) {
                break;
            } else if (leftCell.classList.contains('disabled')) {
                break;
            } else {
                leftCell.classList.add('highlighted');
            }
        }
    }

    // --------------------------------------------------------------
    // Reset all highlighted cells so that whenever a player turn
    // is switched, It erased the previous player highlighted cells.
    // --------------------------------------------------------------
    resetHighlightedCells() {
        let highlightedCells = this.game.gameContainerElement.querySelectorAll(
            '.highlighted'
        );
        for (let cell of highlightedCells) {
            cell.classList.remove('highlighted');
        }
    }

    // --------------------------------------------------------------
    // Check if the opponent player cell is touching `currentPlayer`.
    // --------------------------------------------------------------
    isCombatMode(currentPlayer, row, col) {
        row = parseInt(row);
        col = parseInt(col);

        let opponentPlayer = currentPlayer == 0 ? 'player-2' : 'player-1';

        let topCell = this.game.gameContainerElement.querySelector(
            `.cell_${row - 1}_${col}`
        );
        let bottomCell = this.game.gameContainerElement.querySelector(
            `.cell_${row + 1}_${col}`
        );
        let rightCell = this.game.gameContainerElement.querySelector(
            `.cell_${row}_${col + 1}`
        );
        let leftCell = this.game.gameContainerElement.querySelector(
            `.cell_${row}_${col - 1}`
        );

        if (!(row == 0)) {
            if (topCell.classList.contains(opponentPlayer)) {
                return true;
            }
        }
        if (!(row == 11)) {
            if (bottomCell.classList.contains(opponentPlayer)) {
                return true;
            }
        }
        if (!(col == 0)) {
            if (leftCell.classList.contains(opponentPlayer)) {
                return true;
            }
        }
        if (!(col == 11)) {
            if (rightCell.classList.contains(opponentPlayer)) {
                return true;
            }
        }
        return false;
    }

    // --------------------------------------------------------------
    // Player that initiates the combat gets to attack first.
    // after 1 second the second player attacks, which repeats until
    // one player is defeated.
    // --------------------------------------------------------------
    startCompatMode() {
        let combatModeModal = this.game.gameContainerElement.querySelector('.combat-mode');
        combatModeModal.classList.add('visible');

        this.updateCombatStats();

        var myTimer = setInterval(() => {
            let currentPlayer = this.playerTurn;
            let nextPlayer = currentPlayer == 1 ? 0 : 1;

            this.fight(currentPlayer, nextPlayer, myTimer);

            this.playerTurn = this.playerTurn == 0 ? 1 : 0;
        }, 1000);
    }


    // --------------------------------------------------------------
    // damage is calculated and stats updated.
    // --------------------------------------------------------------
    fight(currentPlayer, nextPlayer, timer) {
        let damage =
            this.players[nextPlayer].attack -
            (this.players[currentPlayer].shield / 100) *
            this.players[nextPlayer].attack;
        this.players[currentPlayer].health -= damage;

        // Animate stats
        this.getPlayerDashboard(currentPlayer)
            .querySelector('#health')
            .classList.add('updateStats');
        setTimeout(() => {
            this.getPlayerDashboard(currentPlayer)
                .querySelector('#health')
                .classList.remove('updateStats');
        }, 500);

        this.updateCombatStats();

        if (this.players[currentPlayer].health <= 0) {
            this.getPlayerDashboard(currentPlayer).querySelector('#health').innerHTML = 0;

            clearInterval(timer);
            this.announceTheWinner(this.players[nextPlayer].name);
        } else {
            this.checkTurn();
        }
    }

    announceTheWinner(winner) {
        // Show Victory Popup
        let victoryPopup = this.game.gameContainerElement.querySelector('.combat-mode.victory');
        victoryPopup.classList.add('visible');

        // Add winner text
        let winnerElem = this.game.gameContainerElement.querySelector('.combat-mode.victory .inner h2');
        winnerElem.innerHTML = `<span>${winner}</span> wins!`;

        // Restart the game
        let restartBtn = this.game.gameContainerElement.querySelector('.combat-mode.victory .inner .btn');
        restartBtn.addEventListener('click', () => {
            this.restart();
        });
    }

    restart() {
        location.reload();
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


let game = new Game(document.querySelector('#game'));
game.init();