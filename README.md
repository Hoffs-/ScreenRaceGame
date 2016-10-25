# ScreenRaceGame
A simple game built using Node.js/Socket.io in which users race from left part of the screen to the right.

Used with my IRC bot built for Twitch.TV.


- Game is started by sending a 'prepare' command over the Socket.IO.
- Any user can join by using a command from the bot. The bot then sends a 'join' message over Socket.IO and a user is assigned with a random emoticon from global twitch emoticons.
- Game is started by sending a 'start' command over the Socket.IO. After this command no more join's can be made.
- When the race finishes results are relayed back to the server and then to the bot.
