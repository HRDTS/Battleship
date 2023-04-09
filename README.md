<h1>Project title:</h1><br>

Classic battleship strategy game remade in Javascript<br>

<strong> LIVE: https://battleship-phi.vercel.app/ </strong><br>

<h1>Screenshot one:</h1><br> 

![homepage](https://raw.githubusercontent.com/HRDTS/Battleship/main/img/battleshipss1.png)

<h1>Screenshot two: </h1><br> 

![gameplay](https://raw.githubusercontent.com/HRDTS/Battleship/main/img/battleshipss2.png)

![Screenshot two](https://raw.githubusercontent.com/HRDTS/Battleship/main/img/battleshipss2.png)

<h1>Project description:</h1><br>

This project is built in vanilla Javascript, HTML and CSS. 

Game explanation: there are two players with each their own game board and their own fleet (10 ships). There are 100 tiles on each game board.  The ships have different sizes, some ships take up only 1 tile, whereas other ships take up 4 tiles. Before the game can start, the users need to place their ships on the game board.  After the ship placement, the players can click one by one on the opponents game board. The goal is to click on a tile that contains a ship. Each hit (click) reveals a tile: the tile is either empty (missed shot) or it contains a ship (accurate hit). Hitting a ship grants the player one more turn.
If the user clicks on a tile and it appears to contain a ship, it will show a number. This number indicates how big the ship is. If the tile shows ‘1’, then the ship is already destroyed because that ship only contained 1 tile. However, if the tile shows ‘3’, there will be 2 adjacent tiles bordering the tile that got hit. This hit indication makes the game more fun and less random.
The game is won when all the enemy ships are destroyed.
I will dive deeper into each feature here:

<h2>Custom ship placement</h2><br>
There are two game modes: quick game and normal game. Quick game presents the user with a preplaced ship placement. Normal game allows the user to place ships strategically on the game board.  

By hovering over the game board, the user can see where the ship will be placed. The actual placement of ship is done by clicking on a tile. The ship placement is done with X,Y coordinates. These X, Y coordinates are stored in an array, and when the game starts and the opponent clicks on the game board, the code checks the click (X, Y coordinate) and see if this click is inside the array where the ships are stored.

There are two things I needed to prevent in order for the ship placement to work:
1. overlapping ships. Every time the user clicks to place a ship, the code checks if that position is available. 
2. ships going out of bounds. Users can’t click outside the game board, but if the ship is longer than 1 tile, selecting a border tile will make the rest of the ship go out of bounds. So every time a ship is placed, it checks availability for all of its tiles.

<h2>Fleet update bar</h2><br>
Each game board has an update bar where all the ships are presented. A ship that has sunk will be colored red, a ship that is still active will be colored green. The bar updates after each click.

<h2>Intelligent computer moves</h2><br>
Initially the computer hits a random tile on the opponents board. However, if the computer hits a ship, it will attack adjacent tiles starting from: up, down, left and right. This makes the game more competitive, and without this feature, the human user would almost always win.
<h2>Numbers indicating nearby ships</h2><br> 
When you hit a ship that consist of multiple tiles, the number will indicate that there are tiles border the previously hit tile. This feature shifts the game from random clicking to thoughtful clicking.
<h2>Personal note:</h2><br>
As glad as I am with how this project turned out, I need to point out a couple of things that I would do different. First, I would break up my code in modules, because the script.js file is bigger than it should be. When I was coding this project, I had the feeling that it got a bit unstructured at some point. Having the features broken in pieces would make everything look a lot nicer and easier to read through.  The second point: I would remove the inconsistencies in my coding. There are some features that require extra steps to compensate for those inconsistencies. This makes my code harder to read and probably makes the code inefficient.

All in all this project was a great learning experience, especially since I built it after having 3 – 4 months of coding experience.

Please feel free to reach out to me with any feedback or questions you may have. I am always happy to connect with fellow developers and share my experiences. 
If you find your image in this or any other project and you do not want it to be used, please contact me. I will promptly remove the image upon request.
You can contact me at: T.genc58@hotmail.com

