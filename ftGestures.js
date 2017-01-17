ftg = ftGestures = {};
ftg.mustDraw = false;

ftg.classClickToTouch = function(_event){
  
  this.data = {clientX: _event.clientX, clientY: _event.clientY};
  this.item = function(){
  
    return this.data;
    
  }
  
}

ftg.create = function(_object, _data, _callBack, _developerField){
  
  ftg.target = _object;
  if(ftg.target.tagName == "CANVAS"){
    ftg.context = ftg.target.getContext("2d");
  }else{
    ftg.context = null;
  }
  
  ftg.dataString = _data;
  ftg.developerField = _developerField || null;
  
  ftg.endFunc = _callBack;
  
  ftg.target.addEventListener("touchstart", ftg.createShadow);
  ftg.target.addEventListener("touchmove", ftg.updateShadow);
  ftg.target.addEventListener("touchend", function(_event){ ftg.endFunc(ftg.precent) });
  
  ftg.mouseState = "UP";
  
  ftg.target.addEventListener("mousedown", function(_event){ ftg.createShadow({targetTouches: new ftg.classClickToTouch(_event)}); ftg.mouseState = "DOWN"; });
  ftg.target.addEventListener("mousemove", function(_event){ if(ftg.mouseState == "DOWN") ftg.updateShadow({targetTouches: new ftg.classClickToTouch(_event)}); });
  ftg.target.addEventListener("mouseup", function(_event){ ftg.endFunc(ftg.precent); ftg.mouseState = "UP"; });
  
  //ftg.target.addEventListener("keydown", ftg.keyDown);
  
}
  
  ftg.createShadow = function(_event){
    
    var _touches = _event.targetTouches;
    var _item = _touches.item(0);
    
    if(ftg.context != null && ( ftg.developerField != null || ftg.mustDraw == true )){
      ftg.context.clearRect(0, 0, ftg.target.width, ftg.target.height);
      ftg.target.width = ftg.target.width;
    }
    
    ftg.startPoint = {x: _item.clientX, y: _item.clientY};
    ftg.lastPoint = {x: _item.clientX, y: _item.clientY};
    ftg.lastPosition = {x: _item.clientX, y: _item.clientY};
    
    ftg.data = JSON.parse(ftg.dataString);
    ftg.lastdir = [];
    
    ftg.status = [];
    ftg.precent = [];
    for(var i = 0; i < ftg.data.length; i++){
      ftg.status[i] = 0;
      ftg.precent[i] = 0;
      ftg.lastdir[i] = null;
    }
    
    ftg.distance = 0;
    ftg.maxDifference = 30;
    ftg.precentMistake = 0.5;
    ftg.minDistance = 10 * (ftg.target.clientWidth / 100);
    
  }
    
    ftg.updateShadow = function(_event){
      
      var _touches = _event.targetTouches;
      var _item = _touches.item(0);

      var lastDeg = Math.atan2(ftg.lastPosition.y - _item.clientY, ftg.lastPosition.x - _item.clientX) * (180 / Math.PI);
      var totalDeg = Math.atan2(ftg.lastPoint.y - _item.clientY, ftg.lastPoint.x - _item.clientX) * (180 / Math.PI);  
      
      if(ftg.developerField != null){
        ftg.developerField.innerHTML = totalDeg + "<br>";
      }
      
      if(ftg.context != null && ( ftg.developerField != null || ftg.mustDraw == true )){
        ftg.context.strokeStyle="#005500";
        ftg.context.moveTo(_item.clientX, _item.clientY);
        ftg.context.lineTo(_item.clientX+1, _item.clientY);
        ftg.context.stroke();
      }
      
      var distance = Math.sqrt(Math.pow(_item.clientX - ftg.lastPosition.x, 2) + Math.pow(_item.clientY - ftg.lastPosition.y, 2));
      
      if(distance > ftg.minDistance){
        
        ftg.lastPosition = {x: _item.clientX, y: _item.clientY};
        distance = 0;
        
      }
      
      if(Math.abs(lastDeg - totalDeg) > 30){
        
        /*if(ftg.context != null && ( ftg.developerField != null || ftg.mustDraw == true )){
          ftg.context.moveTo(0, _item.clientY);
          ftg.context.lineTo(ftg.target.width, _item.clientY);
        }*/
        
        ftg.lastPoint.x = _item.clientX;
        ftg.lastPoint.y = _item.clientY;
        distance = 0;
        
      }
      
      var data;
      var precentAdd;
      var currentDir;
      var check;
      
      for(var i = 0; i < ftg.data.length; i++){
        
        data = ftg.data[i];
        precentAdd = 100 / data.length;

        currentDir = null;
        
        if(ftg.lastdir[i] == null){
        
          for(var u = 0; u < data.length; u++){
            
            if(Math.abs(data[u].deg - totalDeg) < ftg.maxDifference){
              
              currentDir = u;          
              if(data[u].checked != true) break;
                
                }
            
          }
        
        }else{
        
          if(Math.abs(data[ftg.lastdir[i]].deg - totalDeg) < ftg.maxDifference){
           
            currentDir = ftg.lastdir[i];
            
          }
          
        }
        
        if(currentDir == null){
          
          //console.log("Mistake!!");
          ftg.precent[i] -= ftg.precentMistake;
          
        }else{
          
          if(data[currentDir].checked != true){
            
            check = true;
            
            if(typeof data[currentDir].after != "undefined" && data[currentDir].after != null){
                  
              if(ftg.status[i] >= data[currentDir].after) check = true;
              else check = false;
              
            }
            
            if(check == true){
            
              ftg.precent[i] += precentAdd;
              ftg.status[i] += 1;
              data[currentDir].checked = true;
              if(ftg.status[i] == data.length) ftg.lastdir[i] = currentDir;
            
            }
            
          }
          
        }
        
        if(ftg.developerField != null){
          ftg.developerField.innerHTML += i + ": " + ftg.precent[i] + "<br>";
        }
 
      }
      
    }