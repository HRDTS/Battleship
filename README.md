# Battleship
Classic battleship strategy game remade in Javascript.

Game explanation:
The gameplay is simple: there are two players with each their own gameboard and each with their own fleet (10 ships in total). The gameboard contains 100 tiles each. Players can place their ships - that vary in length - on the gameboard. The player can click on the opponents gameboard and reveal the tile: the tile is either empty (miss) or a part of a ship (hit). Hitting a ship grants the player one more turn. In my project, I added numbers to the tiles to indicate nearby ships. So if the user clicks on a tile and it shows a '3', that means that the tile that got struck borders 2 more tiles that contain ships. If you successfuly hit all 3 tiles/ships, you destroy the ship.

Features:
- Custom ship placement by the user.
- Fleet update bar that constantly display whether a ship is destroyed or not.
- Intelligent computer moves: the computer attacks the vicinity of the previously hit tile.
- Numbers on the tiles indicating nearby ships. When you hit a ship that consist of multiple tiles, the number will indicate that there are tiles border the previously hit tile. This feature shifts the game from random clicking to thoughtful clicking.
- Responsive and mobile optimised. I used media queuries to improve the playability on smaller screens. This was a challenge for two reasons: 1. this is my first mobile optimised app. 2. The tiles on the gameboard get very small on smaller screens. 

This project contains close to no libaries. The only library that I really needed was Lodash for comparing arrays. 

For contact or any other questions, please contact me at T.genc58@hotmail.com