# Chess Player Blueprint

The following is my blueprint/brainstorming/plan/map/thing for implementing a chess player in the site. This will include 2-player hotseat, post-game analysis, replays with HUD analysis, AI vs AI evolving leagues, and probably more.

1. Implement basic chess rules && 2-player hotseat
    1. Test movement and state without movement rules. *(complete)*
    2. Implement movement and capture rules in all cases. **<-- Am Here *(partially complete)***
    3. collect moves in algebraic notation. 
    4. Affect board state correctly.
    5. Game over checks and game reset functionality (maybe win/loss tracking).
    6. Some automated tests.

**Big Picture**: At this point 2-player hotseat will be functional. 

2. Animated game replays. Time should be spent here to make sure I squeeze every possible HUD point out of this, because all of it is going to be used for analysis (and everything used for analysis will be used for AI at some point, and my own personal studies as a chess player). Going beyond what Lichess and Chess.com do in some cases, but also not doing some very important things which they do (much will have to wait until I've hooked this up to a stockfish dealio, and even then I'm not trying to duplicate existing analysis tools exactly). The main thing here is to iron out any edge cases that I missed in the last step, and to flesh out the HUD and display. Some of this will get implemented during the final phase of step #1, while implementing automated tests.

**Big Picture**: At this step, I will probably take the time to implement some artwork for the pieces and board, allowing for customization. Until this point, just simple placeholder art. Probably after this point, too -- just slightly better placeholder art.

3. Human vs. AI play. This will mainly involve developing a template AI which can be tweaked to behave somewhat intelligently using a variety of relevant variables (some obvious, some exposed during the previous step). Serious AI will not be implemented yet. This step will be broken down into two parts:
    1. placeholder AI that literally just picks randomly from valid moves, to test the platform in general.
    2. template AI that uses many variables to interpret a position before picking from among the valid moves, but still doesn't do look-ahead decision tree calculation. Will be my best guess to start with, but this template will be used for the next step (AI vs AI play and genetic algorithms).
        
**Big Picture**: At this point the AI will be "position-oriented", and potentially capable of playing a strong game based on pattern recognition although not yet likely to be very good. It will at this point be ready for tuning, bot-on-bot play, and genetic algorithms, and the exact limits of position-oriented AI will be determined, to some degree, before I begin on the decision trees. For the position-oriented AI I will use metrics gleaned from chess theory (including books and experience and preferences), in addition to novel things revealed during testing to this point. Before the AI vs AI play step, this template positional AI will not be very good but should be capable of playing an interesting, if weak game.

4. AI vs AI play. This is where the project starts to get very interesting. It will be broken down into steps, and will (for now) only include a "positional" AI (depth trees come later). Broken down into steps:
    1. A single game between bots. The first step is merely to watch such a game transpire, ensuring that it happens without issue. Big first step.
    2. An actual League of several dozen (or even hundred) randomly-tuned bots, using the previously-developed template for a positional AI. It will use a legit ELO system, and I'll take my time at this step because not only will it be awesome but it will determine just how much league simulation I can get away with in the browser (it's definitely possible, but how difficult or with what wrinkles has yet to be determined). 
    3. Implementing a full-blown genetic algorithms system attached to the ELO league, introducing and retiring players from the league at some rate, using the reproductive rules of genetic algorithms and complex adaptive systems. 

**Big Picture**: At this stage, the project will already be yielding academically interesting results, although it may or may not be playing a strong chess game yet. I suspect it will offer some surprises, and at least be super freaking neat to watch and play against. I will likely spend many months on this step even after it is functioning, to polish it and play with the ELO league (which will be a major source of entertainment, although not yet at its full potential), while also working on performance questions that will have arisen by now.

5. Depth-oriented AI (the use of depth trees in addition to position interpretation). This is the part where the AI templates begin to include factors based on using a depth-tree to look ahead several positions, and the many nuances of doing so will be the variables added to the genetic algorithms system and AI template during this step. There are a lot of questions about this step, and I am not going to break it down into steps yet, but that's the basic idea.

**Big Picture**: Once I'm at this step, the project will be reaching a somewhat mature stage. This step will take an uknown amount of time, and probably years, if there even is an end-date to it. Very likely, this step is open-ended and is where the majority of the project's lifespan will occur. At some point, when it is quite strong, I will want to look in to testing it against some standard.

**Time Estimates**: Few months to a year to a serious prototype stage. Years to a polished and very mature stage. Indefinite lifespan for iteration and improvement once it is mature. The first few steps, at least, will likely only take a couple of months. Everything during and after AI vs. AI play could take an open-ended amount of time, and I'm excited to see where it goes.

