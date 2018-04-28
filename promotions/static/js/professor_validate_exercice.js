function validateExerciceController($scope, $http, $sce, $timeout, $location) {
    $scope.uploadFile = function(files) {
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.addEventListener("load", function() {
            console.log("yay")
            $scope.base64img = reader.result;
            $scope.$digest();
        })
    }

    /////////////////////////////////////////////// DRAG AND DROP /////////////////////////////////////////////

    var counter = 0; //number of boxes added to the canva
    var num = 0; //number of boxes displayed on the canva

    var tab = []; //the displayed boxes on the canva
    var canva = "" //the canva type

    // create a draggable div and push it to tab
    $scope.createInput = function(typeId,topIndex,question){
        var number = counter;
        var type;
        var $newinput;

        switch(typeId){
            case 0:
                type = "text";
                $newinput = $('<input type='+type+' class="dnd-textbox" id=textbox'+number+'></input>').change(function(){question.answers[number].text=this.value});
                break;
            case 1:
                type = "math";
                $newinput = $('<input type='+type+' class="dnd-textbox" id=textbox'+number+'> <textarea class="keyboard"></textarea> <span class="mathquill mathquill-textbox-'+number+'" data-keyboard-type="math-advanced" id="xxxxz"></span> </input>').change(function(){question.answers[number].latex=this.value});

                if (question.type.startsWith("math")) {
                    $timeout(function() {
                        $scope.renderMathquilDnD(topIndex, number, question);
                    }, 100);
                };
                break;
            case 2:
                //image
        }

        //var $newinput = $('<textarea type="text" class="dnd-textbox" id=textbox'+number+'></textarea>');//input of the box
        var $deleteButton = $('<a class=dnd-btn-del btn btn-info btn-lg> <span class="glyphicon glyphicon-trash trash-icon"></span> </a>').click(function(){$scope.del('draggable'+number,question)});//delete button of the box
        var $paramButton = $('<a class=dnd-btn-param btn btn-info btn-lg> <span class="glyphicon glyphicon-cog"></span> </a>').click(function(){$scope.boxInfoDisplay('draggable'+number,question)});
        var $neworder = $('<p id=order'+counter+' class="dnd-display-order" value="" style="min-width:15px; min-height:15px;"> </p>');//order of the box (varies according to the canva)
        var $originButton = $('<span class="dnd-display-origin"></span>');

        //draggable box
        var $new = $('<div id=draggable'+number+' type="text" class="dnd-draggable ui-widget-content" set="center"> </div>').draggable({
            containment: "#containment-wrapper",
            scroll: false,
            drag: function(){
                $scope.order(question);
                //$new.parent().append($new);
            }
        });

        //append of the elements to the div block
        $newinput.appendTo($new);
        $neworder.appendTo($new);
        $originButton.appendTo($new);
        $deleteButton.appendTo($new);
        $paramButton.appendTo($new);

        //append of the div block to the container
        $new.appendTo(document.getElementById("containment-wrapper"));

        counter++;
        num++;

        //we put the block in the tab
        tab.push($new);

        question["answers"].push({
            type: type, //start as text by default
            text: "",
            latex: "",
            ancer: false,
            height: "75px",
            width: "150px",
            position: "",
            order: ""
        });

        console.log(question);

        $scope.order(question);
    }

    // varies according to the changeCanva
    // if it's ranking, it will display the rank of each block on their order element
    // if it's set, it will display the set of each block on their set element
    $scope.order = function(question){
        if(canva=="ranking"){
            tab.sort(function(a,b){return (a.position().left-b.position().left)+(a.position().top-b.position().top) });

            for (var i = 0; i < num; i++) {
              var elementid = tab[i].attr('id').slice(9);
              document.getElementById("order"+elementid).innerHTML=i;
              document.getElementById("order"+elementid).getAttribute("value")
              question.answers[parseInt(elementid)].order=i;
            }
        }
        else if(canva=="2-set" || canva=="4-set"){
            for (var i = 0; i < num; i++) {
                var elementid = tab[i].attr('id').slice(9);
                var element = document.getElementById("draggable"+elementid);
                var set = element.getAttribute("set");
                question.answers[parseInt(elementid)].order=set;
            //document.getElementById("order"+elementid).innerHTML=set;
            }
        }
    }

    //change the canva when the user select a new one
    $scope.changeCanva = function(question){

        question.answers=[];

        if(canva != "") {
            document.getElementById("containment-wrapper").remove();
        }

        canva = document.getElementById("selectCanva").value;
        $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));

        if(canva == "2-set"){
            $scope.createSet("right",question);
            $scope.createSet("left",question);
        }

        else if(canva == "4-set"){
            $scope.createSet("upperRight",question);
            $scope.createSet("upperLeft",question);
            $scope.createSet("downRight",question);
            $scope.createSet("downLeft",question);
        }
        else if (canva == "graduateLine") {
            document.getElementById("containment-wrapper").style.backgroundColor = "white";

        }
        counter = 0;
        tab = [];
        num = 0;
    }

    //create set for set exercice
    $scope.createSet = function(pos,question){
      var $set;
      var $input;

      if(pos=="right"){
        $input = $('<input id="rightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upRightSetName=this.value});
        $set = $('<div id="right-set" class="ui-widget-content ui-state-default "> <div id='+pos+' class="form-group input-group col-xs-4"> </div> </div>').droppable({
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
        $input.appendTo()
      }
      else if (pos == "left") {
        $input = $('<input id="leftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upLeftSetName=this.value});
        $set = $('<div id="left-set" class="ui-widget-content ui-state-default "> <div id='+pos+' class="form-group input-group col-xs-4"> </div> </div>').droppable({
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
        $input = $('<input id="upRightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upRightSetName=this.value});
        $set = $('<div id="upper-right-set" class="ui-widget-content ui-state-default "> <div id='+pos+' class="form-group input-group col-xs-4"> </div> </div>').droppable({
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
        $input = $('<input id="upleftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upLeftSetName=this.value});
        $set = $('<div id="upper-left-set" class="ui-widget-content ui-state-default "> <div id='+pos+' class="form-group input-group col-xs-4"> </div> </div>').droppable({
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
        $input = $('<input id="downRightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.downRightSetName=this.value});
        $set = $('<div id="down-right-set" class="ui-widget-content ui-state-default "> <div id='+pos+' class="form-group input-group col-xs-4"> </div> </div>').droppable({
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
        $input = $('<input id="downLeftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.downLeftSetName=this.value});
        $set = $('<div id="down-left-set" class="ui-widget-content ui-state-default "> <div id='+pos+' id= class="form-group input-group col-xs-4"> </div> </div>').droppable({
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
            ui.draggable[0].getElementsByClassName("dnd-display-order")[0].style.background = "white";;
          }
        });
      }

      $set.appendTo(document.getElementById("containment-wrapper"));
      $input.appendTo(document.getElementById(pos));
  }

    //display alert when deleting a block in order to
    //remove the block "block" from the canva and from tab
    $scope.del = function(block,question){
        if (confirm('Etes vous sur de vouloir supprimer ce block ?')){
            for (var i = 0; i < num; i++) {
                if (block == tab[i].attr('id')){
                    tab.splice(i, 1);
                    question["answers"].splice(i, 1);
                    document.getElementById(block).style.visibility = 'hidden';
                    num--;
                    break;
                }
            }
            $scope.order(question);
        }
    }

    /*$scope.boxInfoDisplay = function(block)
    {
        if(block != null)
        {
            document.getElementById("TypeBoxInfo").options[document.getElementById("TypeBoxInfo").selectedIndex].value = $('#'+block).attr('type');
            document.getElementById("TextBoxInfo").value = document.getElementById('textbox'+block.slice(9)).textContent;
            $('#AncerBoxInfo').prop('checked', $('#'+block).draggable('option', 'disabled'));
            $('#ValidateBoxInfo').off('click');
            $('#ValidateBoxInfo').on("click", function(){ $scope.validateChange(block); });
        }
        else
        {
            $('#ValidateBoxInfo').off('click');
            $('#ValidateBoxInfo').on("click", function(){ $scope.validateChange(null); });
        }
        var display = document.getElementById('BoxInfo').style.display
        if(display == "block")
        {
            document.getElementById('BoxInfo').style.display = "none";
        }
        else
        {
            document.getElementById('BoxInfo').style.display = "block";
        }
    }
    $scope.validateChange = function(block,question)
    {
        //Retrieve info from the form
        var boxType = document.getElementById("TypeBoxInfo").options[document.getElementById("TypeBoxInfo").selectedIndex].value;
        var text = document.getElementById("TextBoxInfo").value;
        var ancer = document.getElementById("AncerBoxInfo").checked;
        if(block!=null)
        {
            var elem = $('#'+block);
            switch(boxType){
                case "text":
                    document.getElementById('textbox'+block.slice(9)).innerHTML = text;
                    elem.attr("type","text");
                    break;
                case "latex":
                    elem.attr("type","latex");
                    document.getElementById('textbox'+block.slice(9)).innerHTML = "$$"+text.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"$$";
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, 'textbox'+block.slice(9)]); //Queue the changes of the textbox to MathJax
                    break;
                case "image":
                    elem.attr("type","image");
                    break;
                default:
                    console.log("Wrong type of box.");
            }
            if(ancer)
            {
                elem.draggable("disable");
            }
            else
            {
                elem.draggable("enable");
            }
        }
        else
        {
            var number = counter;
            var $newinput = $('<input type="text" class="dnd-textbox" id=textbox'+number+'></input>').change(function(){question.answers[number].text=this.value});
            //var $newinput = $('<textarea type="text" class="dnd-textbox" id=textbox'+number+'></textarea>');//input of the box
            var $deleteButton = $('<a class=dnd-btn-del btn btn-info btn-lg> <span class="glyphicon glyphicon-trash trash-icon"></span> </a>').click(function(){$scope.del('draggable'+number)});//delete button of the box
            var $paramButton = $('<a class=dnd-btn-param btn btn-info btn-lg> <span class="glyphicon glyphicon-cog"></span> </a>').click(function(){$scope.boxInfoDisplay('draggable'+number)});
            var $neworder = $('<p id=order'+counter+' class="dnd-display-order" style="min-width:15px; min-height:15px;"> </p>');//order of the box (varies according to the canva)
            var $originButton = $('<span class="dnd-display-origin"></span>');
            //draggable box
            var $new = $('<div id=draggable'+counter+' type="" class="dnd-draggable ui-widget-content" set="center"></div>').draggable({
                containment: "#containment-wrapper",
                scroll: false,
                snap: ".sticky-container",
                drag: function(){
                        $scope.order();
                        //$new.parent().append($new);
                }
            });
            var $imgBox = $('<img id="myImg" class = imgBoxClass src="#" alt="img" height="60" width="60"/>');
            var $btnUp = $('<label type="file" class="btn btn-default btn-file"> Browse <input type="file" style="display: none;"> </label>')
            //var $btnUp = $('<input type="file" />')
            if(ancer)
            {
                $new.draggable("disable");
            }
            //append of the elements to the div block
            $newinput.appendTo($new);
            $neworder.appendTo($new);
            $originButton.appendTo($new);
            $deleteButton.appendTo($new);
            $paramButton.appendTo($new);
            $new.appendTo(document.getElementById("containment-wrapper"));//append of the div block to the container
            switch(boxType){
                case "text":
                    document.getElementById("textbox"+counter).innerHTML = text;
                    $new.attr("type","text");
                    break;
                case "latex":
                    $new.attr("type","latex");
                    $timeout(function() {
                        $scope.renderMathquilDnD(topIndex, counter, question);
                    }, 100);
                    break;
                case "image":
                    $new.attr("type","image");
                    //$('#myImg').attr('src', e.target.result);
                    $btnUp.appendTo($new);
                    $imgBox.appendTo($new);
                    $(function () {
                        $(":file").change(function () {
                            if (this.files && this.files[0]) {
                                var reader = new FileReader;
                                reader.onload = imageIsLoaded;
                                reader.readAsDataURL(this.files[0]);
                            }
                     });
                    });
                    break;
                default:
                    console.log("Wrong type of box.");
            }
            counter++;
            num++;
            //we put the block in the tab
            tab.push($new);
            $scope.order();
        }
        document.getElementById('BoxInfo').style.display = "none";
    }*/

    $scope.renderMathquilDnD = function(topIndex,boxIndex) {
        query = $(".mathquill-textbox-"+boxIndex);

        renderMathquil(query, function(MQ, index, mq) {
            var mathquill = MQ.MathField(mq, {
                handlers: {
                    edit: function() {
                        console.log(question.answers[boxIndex].latex);
                        question.answers[boxIndex].latex = mathquill.latex();
                    }
                }
            });

            var keyboard = $($(mq).parent().children()[0]);

            return [mathquill, keyboard];
        });
    }

    /////////////////////////////////////////////// DRAG AND DROP /////////////////////////////////////////////

    $scope.validateExercice = function() {
        $http.post("validate/", {"questions": $scope.questions, "testable_online": $scope.testable_online})
            .error(function() {
                console.log("error")
                $scope.yamlValidationResult = $sce.trustAsHtml('<div class="alert alert-danger">Une erreur s\'est produite, nous en avons été alerté.</div>');
            })
            .success(function(data) {
                console.log("success");
                if (data.yaml.result == "error") {
                    $scope.yamlValidationResult = $sce.trustAsHtml('<div class="alert alert-danger"> <b>Erreur:</b> ' + data.yaml.message + '</b></div>');
                    $scope.exerciceIsValid = false;
                } else {
                    $scope.yamlValidationResult = $sce.trustAsHtml('<div class="alert alert-success">' + data.yaml.message + '</b></div>');

                    $scope.yamlRendering = $sce.trustAsHtml(data.rendering);
                    $scope.htmlRendering = $sce.trustAsHtml($scope.html);

                    $timeout(function() {

                        $('#exercice-rendering-yaml input[type="submit"]').addClass("disabled");
                        MathJax.Hub.Typeset(document.getElementById("exercice-rendering-panel"));

                        $($scope.questions).each(function(index, value) {
                            if (value.type == "graph") {
                                var graph = new Graph('graph-' + index)
                                $(value.answers).each(function(_, answer) {
                                    graph.addPoint(answer.graph.coordinates.X, answer.graph.coordinates.Y)
                                })
                            }
                        })

                    }, 0);

                    $scope.exerciceIsValid = true;
                }
            })

    }

    $scope.proposeToOscar = function() {
        var yaml = $scope.yaml;
        var html = $scope.html;
        var skill_code = $scope.skillCode;

        if (!skill_code) {
            $scope.yamlValidationResult = $sce.trustAsHtml('<div class="alert alert-danger"><b>Erreur :</b> vous devez sélectionner une compétence pour pouvoir proposer l\'exercice à Oscar.</div>');
            return;
        }

        $("#submit-pull-request").addClass("disabled");

        $http.post("submit/", {"questions": $scope.questions, "html": html, "skill_code": skill_code, "image": $scope.base64img, "testable_online": $scope.testable_online})
            .success(function(data) {
                if ($scope.forTestExercice && inUpdateMode) {
                    window.location.href =  "../../" + data.id + "/for_test_exercice/" + $scope.forTestExercice + "/";
                } else if ($scope.forTestExercice) {
                    window.location.href =  "../" + data.id + "/for_test_exercice/" + $scope.forTestExercice + "/";
                } else if (inUpdateMode) {
                    window.location.href = "..";
                }

                $scope.yamlValidationResult = $sce.trustAsHtml('<div class="alert alert-success">L\'exercice a correctement été soumis, merci !<br />Vous pouvez le voir <a href="' + data.url + '" target="_blank">ici</a>.</div>');
                console.log(data);

                $scope.yaml = "";
                $scope.html = "";
                $scope.skillCode = "";
                $scope.image = null;
                $scope.base64img = "";
                $scope.exerciceIsValid = ""
                $scope.htmlRendering = ""
                $scope.yamlRendering = ""
                $scope.testable_online = true;

                $scope.questions = [{
                    "instructions": "",
                    "type": "",
                    "answers": [{
                        "text": "",
                        "latex": "",
                        "correct": false,
                    }],
                    "source": "",
                    "indication": "",
                }]
            })
            .error(function() {
                $scope.yamlValidationResult = $sce.trustAsHtml('<div class="alert alert-danger">Une erreur s\'est produite, nous en avons été alerté.</div>');
            })
            .finally(function() {
                $timeout(function() {
                    $("#submit-pull-request").removeClass("disabled");
                }, 0);
            })
    }

    $scope.onChangeQuestionType = function(topIndex, question) {
        if(question.type == "drag-and-drop")
        {
            question.answers = [];
            question.canva = {
                "type": "",
                "upLeftSetName": "",
                "upRightSetName": "",
                "downLeftSetName": "",
                "downRightSetName": "",
            };
        }

        if (question.type.startsWith("math")) {
            $timeout(function() {
                console.log("c");
                for (var i = 0; i < question.answers.length; ++i)
                    $scope.renderMathquil(topIndex, i, question)
            }, 100);
        }
    }

    $scope.onChangeRadio = function(question, answer) {
        if (question.type != "radio")
            return;

        if (answer.correct !== true)
            return;

        for (a in question.answers) {
            var a = question.answers[a];
            if (a !== answer && a.correct === true) {
                a.correct = false;
            }
        }
    }

    $scope.onChangeGraphAnswerType = function(graph) {
        if (graph.type == "point") {
            graph["coordinates"] = {
                "X": "",
                "Y": "",
            }
        }
    };

    $scope.addAnswer = function(topIndex, question) {
        question["answers"].push({
            text: "",
            latex: "",
            graph: {type: ""},
            correct: false
        })

        if (question.type.startsWith("math")) {
            $timeout(function() {
                console.log("b");
                $scope.renderMathquil(topIndex, question.answers.length - 1, question);
            }, 100);
        }
    }

    $scope.removeAnswer = function(question, answer) {
        question["answers"].splice(question["answers"].indexOf(answer), 1);
    }

    $scope.addQuestion = function() {
        $scope.questions.push({
            "instructions": "",
            "type": "",
            "answers": [{
                "text": "",
                latex: "",
                graph: {type: ""},
                "correct": false
            }],
            "source": "",
            "indication": "",
        })
    }

    $scope.removeQuestion = function(question) {
        $scope.questions.splice($scope.questions.indexOf(question), 1);
    }

    var checkIfEditingExercice = function() {
        // this is a horrible hack to get to make this code works both for
        // create and edition of exercices :(
        let uri = window.location.href.split("#")[0].split("/").filter(function(a) { return a }).slice(-1);

        if (uri[0] != "update") {
            console.log("New ercercice mode");
            return;
        }

        inUpdateMode = true;

        $http.get("json/").success(function(data) {
            $scope.skillCode = data.skillCode;
            $scope.html = data.html;
            $scope.yaml = data.yaml;
            $scope.questions = data.questions;

            // TODO yamlRendering/htmlRendering et image
            $timeout(function() {
                for (var i = 0; i < $scope.questions.length; ++i) {
                    if ($scope.questions[i].type.startsWith("math")) {
                        console.log("a");
                        console.log($scope.questions[i])
                        for (var j = 0; j < $scope.questions[i].answers.length; ++ j) {
                            $scope.renderMathquil(i, j, $scope.questions[i])
                        }
                    }
                }
            }, 100);
        })
    }

    $scope.renderMathquil = function(topIndex, answerIndex, question) {
        console.log("topIndex: " + topIndex);
        console.log("answerIndex: " + answerIndex);
        if (answerIndex != null) {
            query = $(".mathquill-" + topIndex + "-" + answerIndex);
        } else {
            query = $(".mathquill-" + topIndex);
        }
        console.log(query);
        renderMathquil(query, function(MQ, index, mq) {
            var mathquill = MQ.MathField(mq, {
                handlers: {
                    edit: function() {
                        console.log("======> " + answerIndex);
                        question.answers[answerIndex].latex = mathquill.latex();
                        console.log(question.answers[answerIndex].latex);
                        console.log($scope.questions);
                    }
                }
            });

            console.log(question.answers);
            if (question.answers[answerIndex].text) {
                mathquill.latex(question.answers[answerIndex].text);
            }

            var keyboard = $($(mq).parent().children()[0]);

            return [mathquill, keyboard];
        });
    }

    $scope.skillCode = $location.search().code;

    // if we are creating a question for a skill for a test
    $scope.forTestExercice = $location.search().for_test_exercice;
    $scope.html = "";
    $scope.yaml = "";
    $scope.yamlRendering = "";
    $scope.htmlRendering = "";
    $scope.image = null;
    $scope.base64img = "";
    $scope.testable_online = true;

    var inUpdateMode = false;

    $scope.questions = [{
        instructions: "",
        type: "",
        answers: [{
            text: "",
            latex: "",
            graph: {type: ""},
            correct: false,
        }],
        source: "",
        indication: "",
    }]

    $scope.yamlValidationResult = "";
    $scope.exerciceIsValid = false;

    checkIfEditingExercice();
}
