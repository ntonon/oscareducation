var counter = 0;//Number of blockes added to the canva
var num = 0; //Number of blockes displayed on the canva
var tab = []; //The displayed blockes on the canva
var canva = "" //The canva type
var numQuest;

//Create a draggable div and push it to tab
function createInput(type,text,latex,file,hint,ancer,width,height,top,left,answerOrder,answerSet){
  var number = counter; //The number of the new block being added
  var $inputDisplay;

  var $block = $('<div id=draggable'+number+' type="text" class="dnd-draggable ui-widget-content" set="center"> </div>').draggable({
    containment: "#containment-wrapper",
    scroll: false,
    stack: ".dnd-draggable",
    stop: function(){
      order();
    }
  });

  switch(type){
    case "text":
      $inputDisplay = $('<textarea type='+type+' class="dnd-textbox-student" id=textbox'+number+' disabled="disabled"></textarea>');
      $inputDisplay.val(text);
      break;

    case "latex":
      $inputDisplay = $('<textarea type='+type+' class="dnd-textbox-student" id=textbox'+number+' disabled="disabled"> </textarea>');
      $inputDisplay.val(latex);
      break;

    case "file":
      $inputDisplay = $('<img id=img'+number+' class="dnd-image" src='+file+' alt="your image"></img>');
      $inputDisplay.click(function(){
          document.getElementById('ImageInfo').style.display="block";
          document.getElementById("ImageZoom").src = this.src;
      });
      $inputDisplay.appendTo($block);

      break;
  }

  var $orderDisplay = $('<p id=order'+number+' class="dnd-display-order"> </p>');//order of the box (varies according to the canva)
  var $request = $('<input id=dnd-'+numQuest+'-'+number+' name=dnd-'+numQuest+'-'+number+' style="display: none;"> </p>');

  //Append of the elements to the div block
  $inputDisplay.appendTo($block);
  $orderDisplay.appendTo($block);
  $request.appendTo($block);

  //Append of the div block to the container
  $block.appendTo(document.getElementById("containment-wrapper"));

  var posTop = $block.parent().height()/3 + (Math.random()*($block.parent().height()/3)) -50;
  var posLeft = $block.parent().width()/3 + (Math.random()*($block.parent().width()/3)) -50;

  if(ancer == "true") {
    if(canva == "2-set" || canva == "4-set") {
      console.log(answerSet);
      //If the box is ancered, we need to set the order's box (answerSet) for 2-set, 4-set and graduate line exercices
      $block.attr("set",answerSet);
      if(answerSet=="left") { $orderDisplay.css({'background': "#FFCC80"}); }
      else if(answerSet=="right") { $orderDisplay.css({'background': "#90CAF9"}); }
      else if(answerSet=="upperLeft") { $orderDisplay.css({'background': "#FFA726"}); }
      else if(answerSet=="upperRight") { $orderDisplay.css({'background': "#42A5F5"}); }
      else if(answerSet=="downLeft") { $orderDisplay.css({'background': "#8D6E63"}); }
      else if(answerSet=="downRight") { $orderDisplay.css({'background': "#5C6BC0"}); }
    }
    else if(canva == "graduatedLine") {
      $block.attr("set",answerSet);
      $orderDisplay.html(answerSet);
    }

    $block.draggable("disable");
    posTop = top;
    posLeft = left;
  }

  $block.parent().css({position: 'relative'});
  $block.css({'width': width, 'height': height, 'top': posTop+'px', 'left': posLeft+'px', 'position': 'absolute'});

  counter++;
  num++;

  //We put the block in the tab
  tab.push($block);

  order();
}

//It varies according to the changeCanva
//If it's ranking, it will display the rank of each block on their order element
//If it's set, it will display the set of each block on their set element
function order() {
  if(canva == "ranking") {
    tab.sort(function(a,b){return (a.position().left-b.position().left)+(a.position().top-b.position().top);});
    for (var i = 0; i < num; i++) {
      var id = tab[i].attr('id').slice(9);
      $("#order"+id).html(i);
      $("#dnd-"+numQuest+"-"+id).val(i);
    }
  }
  else if(canva=="2-set" || canva=="4-set") {
    for (var i = 0; i < num; i++) {
      var id = tab[i].attr('id').slice(9);
      $("#dnd-"+numQuest+"-"+id).val($("#draggable"+id).attr('set'));
    }
  }
  else if(canva=="GraduatedLine") {
    tab.sort(function(a,b){return (a.position().left-b.position().left)+(a.position().top-b.position().top);});
    for (var i = 0; i < num; i++) {
      var id = tab[i].attr('id').slice(9);
      $("#dnd-"+numQuest+"-"+id).val(i+""+$("#draggable"+id).attr('set'));
    }
  }
}

//Change the canva according to the type
function changeCanvaRanking(toploop,canvaType){
  canva = canvaType;
  numQuest = toploop;

  $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));
}

function changeCanva2Set(toploop,canvaType,left,right) {
  canva = canvaType;
  numQuest = toploop;

  $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));

  createSet("left",left);
  createSet("right",right);
}

function changeCanva4Set(toploop,canvaType,upperLeft,upperRight,downLeft,downRight) {
  canva = canvaType;
  numQuest = toploop;

  $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));

  createSet("upperLeft",upperLeft);
  createSet("upperRight",upperRight);
  createSet("downLeft",downLeft);
  createSet("downRight",downRight);
}

function changeCanvaGraduatedLine(toploop,canvaType,numInter,begInter,endInter) {
  canva = canvaType;
  numQuest = toploop;

  $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));

  numInter = parseInt(numInter,10);
  begInter = parseInt(begInter,10);
  endInter = parseInt(endInter,10);

  var interSize = Math.round(((endInter-begInter)/numInter)*100)/100;//The size of an interval

  numInter += 2;

  var canvaWidth = $("#wrapper").width();//The width of the canva
  var lineWidth = canvaWidth*1.8;//The total width of the line

  var interWidth = lineWidth/numInter;//The width of an interval in pixel

  var currWidth = 0;//The current interval's width
  var currLeft = -5;//The current interval's left position
  for(var i = 0 ; i < numInter ; i++) {
    //Set the width and text of each variable
    var currBegInter;
    var currEndInter;
    if(i == 0) {
      currWidth = interWidth + (canvaWidth*0.1);
      currBegInter = "-∞";
      currEndInter = (begInter + ((i)*interSize));
    }
    else if ( i == numInter-1 ) {
      currWidth = interWidth + (canvaWidth*0.1)
      currBegInter = (begInter + ((i-1)*interSize));
      currEndInter = "∞";
    }
    else {
      currWidth = interWidth;
      currBegInter = (begInter + ((i-1)*interSize));
      currEndInter = (begInter + ((i)*interSize));
    }
    var interSet = String(currBegInter+";"+currEndInter);

    //The set of the interval
    var $set = $('<div id=interval'+i+' set='+interSet+' begin='+currBegInter+' end='+currEndInter+' class="dnd-interval-set"> </div>').droppable({
      accept: ".dnd-draggable",
      classes: {
        "ui-droppable-hover": "ui-state-hover"
      },
      drop: function(event, ui) {
        var inter = this.getAttribute("set");
        ui.draggable[0].setAttribute("set",inter);
        ui.draggable[0].getElementsByClassName("dnd-display-order")[0].innerHTML = inter;
      }
    });
    $set.css("width", currWidth+"px");
    $set.css("left", currLeft+"px");
    $set.appendTo(document.getElementById("containment-wrapper"));

    currLeft += currWidth;

    //Drawing the line
    var $line = $('<span id=line'+i+' class="dnd-interval-line"> </span>').appendTo(document.getElementById("interval"+i));
    if(i == 0) {
      $line.css("right", "0px");
    }
    else if ( i == numInter-1 ) {
      $line.css("left", "0px");
    }
    $line.css("width", interWidth+"px");

    //Drawing the dash
    if ( i != numInter-1 ) {
      $('<span id=dash'+i+' class="dnd-interval-dash" style="right: -1px;"> </span>').appendTo(document.getElementById("interval"+i));
    }

    //Adding the text
    if ( i != numInter-1 ) {
      var $text = $('<span id=text'+i+' class="dnd-interval-text"> '+currEndInter+' </span>');
      $text.appendTo(document.getElementById("containment-wrapper"));

      var textWidth = $text.width();
      $text.css("left", (currLeft-2-(textWidth/2))+"px");
    }

    //Drawing the arrow
    if ( i == numInter-1 ) {
      $('<span class="dnd-interval-arrow" style="left: '+interWidth+'px;"></span>').appendTo(document.getElementById("interval"+i));
    }
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

function closeBlockInfoDisplay() {
  $(".dnd-modal").css("display", "none");
}
