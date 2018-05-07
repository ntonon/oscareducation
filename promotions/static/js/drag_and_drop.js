var counter = 0;//Number of blockes added to the canva
var num = 0; //Number of blockes displayed on the canva
var tab = []; //The displayed blockes on the canva
var canva = "" //The canva type
var numQuest;

//Create a draggable div and push it to tab
function createInput(type,text,latex,hint,ancer,width,height,top,left){
  var number = counter; //The number of the new block being added
  var $inputDisplay;

  switch(type){
    case "text":
      $inputDisplay = $('<textarea type='+type+' class="dnd-textbox-student" id=textbox'+number+' disabled="disabled"></textarea>');
      $inputDisplay.val(text);
      break;

    case "latex":
      $inputDisplay = $('<textarea type='+type+' class="dnd-textbox-student" id=textbox'+number+' disabled="disabled"> </textarea>');
      $inputDisplay.val(latex);
      break;

    case "image":
      //image
      break;
  }

  var $orderDisplay = $('<p id=order'+number+' class="dnd-display-order"> </p>');//order of the box (varies according to the canva)
  var $request = $('<input id=dnd-'+numQuest+'-'+number+' name=dnd-'+numQuest+'-'+number+' style="display: none;"> </p>');

  var $block = $('<div id=draggable'+number+' type="text" class="dnd-draggable ui-widget-content" set="center"> </div>').draggable({
    containment: "#containment-wrapper",
    scroll: false,
    stack: ".dnd-draggable",
    stop: function(){
      order();
    }
  });

  //Append of the elements to the div block
  $inputDisplay.appendTo($block);
  $orderDisplay.appendTo($block);
  $request.appendTo($block);

  //Append of the div block to the container
  $block.appendTo(document.getElementById("containment-wrapper"));

  var posTop = $block.parent().height()/3 + (Math.random()*($block.parent().height()/3)) -50;
  var posLeft = $block.parent().width()/3 + (Math.random()*($block.parent().width()/3)) -50;

  if(ancer == "true"){
    $block.draggable("disable");
    posTop = top;
    posLeft = left;
  }

  $block.parent().css({position: 'relative'});
  $block.css({'width': width, 'height': height, 'top': posTop+'px', 'left': posLeft+'px', 'position': 'absolute'});

  counter++;
  num++;

  if(canva == "2-set") {

  }

  if(canva == "4-set") {

  }

  //We put the block in the tab
  tab.push($block);

  if(canva == "2-set") {
    $("#left-set").trigger("over", [$block]);
    $("#right-set").trigger("over", [$block]);
  }
  else if(canva == "4-set") {
    $("#upper-left-set").trigger("over", [$block]);
    $("#upper-right-set").trigger("over", [$block]);
    $("#down-left-set").trigger("over", [$block]);
    $("#down-right-set").trigger("over", [$block]);
  }
  else {
    order();
  }
}

//It varies according to the changeCanva
//If it's ranking, it will display the rank of each block on their order element
//If it's set, it will display the set of each block on their set element
function order() {
  if(canva == "ranking") {
    tab.sort(function(a,b){return (a.position().left-b.position().left)+(a.position().top-b.position().top);});
    for (var i = 0; i < num; i++) {
      var number = tab[i].attr('id').slice(9);
      $("#order"+number).html(i);
      $("#dnd-"+numQuest+"-"+number).val(i);
    }
  }
  else if(canva=="2-set" || canva=="4-set") {
    for (var i = 0; i < num; i++) {
      var elementid = tab[i].attr('id').slice(9);
      $("#dnd-"+numQuest+"-"+elementid).val($("#draggable"+number).attr('set'));
    }
  }
}

//Change the canva according to the type
function changeCanva(toploop,canvaType,upLeftSetName,upRightSetName,downLeftSetName,downRightSetName){
  canva = canvaType;
  numQuest = toploop;

  $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));

  if(canva == "2-set") {
    createSet("right",upRightSetName);
    createSet("left",upLeftSetName);
  }
  else if(canva == "4-set") {
    createSet("upperRight",upRightSetName);
    createSet("upperLeft",upLeftSetName);
    createSet("downRight",downRightSetName);
    createSet("downLeft",downLeftSetName);
  }
  else if (canva == "graduateLine") {
    document.getElementById("containment-wrapper").style.backgroundColor = "white";
  }
}

//Create set for set exercice
function createSet(pos,name) {
  var $set;
  var $input;
  if(pos=="right") {
    $input = $('<input id="rightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control" value='+name+' style="text-align: center;" disabled="disabled"> </input>')
    $set = $('<div id="right-set" class="ui-widget-content ui-state-default"> <div id='+pos+'> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui) {
        ui.draggable[0].setAttribute("set","right");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#90CAF9";
      },
      out: function(event, ui) {
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
    $input.appendTo()
  }
  else if (pos == "left") {
    $input = $('<input id="leftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control" value='+name+' style="text-align: center;" disabled="disabled"> </input>')
    $set = $('<div id="left-set" class="ui-widget-content ui-state-default"> <div id='+pos+'> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui) {
        ui.draggable[0].setAttribute("set","left");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#FFCC80";
      },
      out: function(event, ui) {
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "upperRight") {
    $input = $('<input id="upRightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control" value='+name+' style="text-align: center;" disabled="disabled"> </input>')
    $set = $('<div id="upper-right-set" class="ui-widget-content ui-state-default"> <div id='+pos+'> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui){
        ui.draggable[0].setAttribute("set","upperRight");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#42A5F5";
      },
      out: function(event, ui) {
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "upperLeft") {
    $input = $('<input id="upleftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control" value='+name+' style="text-align: center;" disabled="disabled"> </input>')
    $set = $('<div id="upper-left-set" class="ui-widget-content ui-state-default"> <div id='+pos+'> </div> </div>').droppable({
    accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui) {
        ui.draggable[0].setAttribute("set","upperLeft");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#FFA726";
      },
      out: function(event, ui) {
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "downRight") {
    $input = $('<input id="downRightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control" value='+name+' style="text-align: center;" disabled="disabled"> </input>')
    $set = $('<div id="down-right-set" class="ui-widget-content ui-state-default"> <div id='+pos+'> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui) {
        ui.draggable[0].setAttribute("set","downRight");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#5C6BC0";
      },
      out: function(event, ui) {
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";
      }
    });
  }
  else if (pos == "downLeft") {
    $input = $('<input id="downLeftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control" value='+name+' style="text-align: center;" disabled="disabled"> </input>')
    $set = $('<div id="down-left-set" class="ui-widget-content ui-state-default"> <div id='+pos+'> </div> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      over: function(event, ui) {
        ui.draggable[0].setAttribute("set","downLeft");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "#8D6E63";
      },
      out: function(event, ui) {
        ui.draggable[0].setAttribute("set","center");
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";;
      }
    });
  }

  $set.appendTo(document.getElementById("containment-wrapper"));
  $input.appendTo(document.getElementById(pos));
}