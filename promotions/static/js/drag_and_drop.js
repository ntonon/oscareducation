var counter = 0; //number of boxes added to the canva
var num = 0; //number of boxes displayed on the canva

var tab = []; //the displayed boxes on the canva
var canva;
var numQuest;

/*
type: type, //start as text by default
text: "",
latex: "",
ancer: false,
height: "75px",
width: "150px",
position: "",
order: ""
*/

// create a draggable div and push it to tab
function createInput(type,text,latex,ancer,toploop){
  var number = counter;

  var $neworder = $('<p id=order'+number+' class="dnd-display-order" style="min-width:15px; min-height:15px;"> </p>');//order of the box (varies according to the canva)
  var $newrequest = $('<input id=dnd-'+numQuest+'-'+number+' name=dnd-'+numQuest+'-'+number+' style="display: none;"> </p>');
  var $originButton = $('<span class="dnd-display-origin"></span>');
  var $new = $('<div id=draggable'+number+' type="text" class="dnd-draggable ui-widget-content" set="center"> </div>').draggable({
    containment: "#containment-wrapper",
    scroll: false,
    drag: function(){
      order();
    }
  });

  var $newinput;
  switch(type){
    case "text":
      $newinput = $('<input type='+type+' class="dnd-textbox-student" id=textbox'+number+' value='+text+' disabled="disabled"></input>');
      break;
    case "latex":
      $newinput = $('<input type='+type+' class="dnd-textbox-student" id=textbox'+number+' value='+latex+' disabled="disabled"> </input>');
      break;
    case "image":
      //image
  }

  //append of the elements to the div block
  $newinput.appendTo($new);
  $neworder.appendTo($new);
  $newrequest.appendTo($new);
  $originButton.appendTo($new);

  //append of the div block to the container
  $new.appendTo(document.getElementById("containment-wrapper"));

  var posTop = $new.parent().height()/3 + (Math.random()*($new.parent().height()/3)) -50;
  var posLeft = $new.parent().width()/3 + (Math.random()*($new.parent().width()/3)) -50;

  if(ancer == "true"){
    $new.draggable("disable");
    posTop = answer.posTop;
    posLeft = answer.posLeft;
  }

  $new.parent().css({position: 'relative'});
  $new.css({top: posTop+'px', left: posLeft+'px', position:'absolute'});

  counter++;
  num++;

  //we put the block in the tab
  tab.push($new);

  order();
}

// varies according to the changeCanva
// if it's ranking, it will display the rank of each block on their order element
// if it's set, it will display the set of each block on their set element
function order(){
    if(canva == "ranking"){
        tab.sort(function(a,b){return (a.position().left-b.position().left)+(a.position().top-b.position().top) });

        for (var i = 0; i < num; i++){
          var elementid = tab[i].attr('id').slice(9);
          document.getElementById("order"+elementid).innerHTML=i;
          document.getElementById("dnd-"+numQuest+"-"+elementid).value = i;
        }
    }
    else if(canva=="2-set" || canva=="4-set"){
        for (var i = 0; i < num; i++) {
            var elementid = tab[i].attr('id').slice(9);
            var element = document.getElementById("draggable"+elementid);
            var set = element.getAttribute("set");
            document.getElementById("dnd-"+numQuest+"-"+elementid).value = set;
        //document.getElementById("order"+elementid).innerHTML=set;
        }
    }
}

//change the canva when the user select a new one
function changeCanva(toploop,canvaType,upLeftSetName,upRightSetName,downLeftSetName,downRightSetName){
    canva = canvaType;
    numQuest = toploop;

    $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));

    if(canva == "2-set"){
        var $rightSet = createSet("right",upRightSetName);
        var $leftSet = createSet("left",upLeftSetName);
        $leftSet.appendTo(document.getElementById("containment-wrapper"));
        $rightSet.appendTo(document.getElementById("containment-wrapper"));
    }
    else if(canva == "4-set"){
        var $upRightSet = createSet("upperRight",upRightSetName);
        var $upLeftSet = createSet("upperLeft",upLeftSetName);
        var $downRightSet = createSet("downRight",downRightSetName);
        var $downLeftSet = createSet("downLeft",downLeftSetName);

        $upRightSet.appendTo(document.getElementById("containment-wrapper"));
        $upLeftSet.appendTo(document.getElementById("containment-wrapper"));
        $downRightSet.appendTo(document.getElementById("containment-wrapper"));
        $downLeftSet.appendTo(document.getElementById("containment-wrapper"));
    }
    else if (canva == "graduateLine") {
        document.getElementById("containment-wrapper").style.backgroundColor = "white";
    }
}

//create set for set exercice
function createSet(pos,name){
  if(pos=="right"){
    var set = $('<div id="right-set" class="ui-widget-content ui-state-default "> <div> <input id="rightSetName" type="text" class="form-control" disabled="disabled" value='+name+' style="text-align: center;"> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui){
        ui.draggable[0].setAttribute("set","right");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#90CAF9";
      },
      out: function(event, ui){
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "left") {
    var set = $('<div id="left-set" class="ui-widget-content ui-state-default "> <div> <input id="leftSetName" class="form-control" disabled="disabled" value='+name+' style="text-align: center;"> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui){
        ui.draggable[0].setAttribute("set","left");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#FFCC80";
      },
      out: function(event, ui){
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "upperRight") {
    var set = $('<div id="upper-right-set" class="ui-widget-content ui-state-default "> <div> <input id="leftSetName" type="text" class="form-control" disabled="disabled" value='+name+' style="text-align: center;"> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui){
        ui.draggable[0].setAttribute("set","upperRight");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#42A5F5";
      },
      out: function(event, ui){
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "upperLeft") {
    var set = $('<div id="upper-left-set" class="ui-widget-content ui-state-default "> <div> <input id="leftSetName" type="text" class="form-control" disabled="disabled" value='+name+' style="text-align: center;"> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui){
        ui.draggable[0].setAttribute("set","upperLeft");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#FFA726";
      },
      out: function(event, ui){
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "downRight") {
    var set = $('<div id="down-right-set" class="ui-widget-content ui-state-default "> <div> <input id="leftSetName" type="text" class="form-control" disabled="disabled" value='+name+' style="text-align: center;"> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui){
        ui.draggable[0].setAttribute("set","downRight");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#5C6BC0";
      },
      out: function(event, ui){
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "downLeft") {
    var set = $('<div id="down-left-set" class="ui-widget-content ui-state-default "> <div> <input id="leftSetName" type="text" class="form-control" disabled="disabled" value='+name+' style="text-align: center;"> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui){
        ui.draggable[0].setAttribute("set","downLeft");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#8D6E63";
      },
      out: function(event, ui){
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  return set;
}
