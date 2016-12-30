#ftGestures.js
The engine to detect gestures on touch screens ( I created this as member of Future Technologies Association )

### engine object
The **ftg**, or **ftGestures** is the object of this engine

### ftg.create(Element target, String data, Function callback, [Element developerField])
Function adds to target element the dectector of gestures

- **target** - Canvas, or just DOM Element, where the engine shoud detect the gestures

- **data** - JSON String with the array of gestures, all gesture is made of directions in degrees.
<p> The model of one gesture is is:
<br> **[{"deg": a}, {"deg": b}, {"deg": c}, ...]**
<p> For example the gesture of square is:
<br> **[{"deg": 90},{"deg": 180},{"deg": -90},{"deg": 0}]**
<p> At the moment I'm creating the creator for gestures

- **callback** - the function run after end of detecting event, engine send 1 argument to **callback** - the array with results of detecting gestures.

- **developerField** - DOM Element, where engine can writing information for developers
