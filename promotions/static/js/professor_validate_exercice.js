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

    var counter = 0;//Number of blockes added to the canva
    var num = 0; //Number of blockes displayed on the canva
    var tab = []; //The displayed blockes on the canva
    var canva = "" //The canva type

    //Create a draggable div and push it to tab
    $scope.createDraggableBlock = function(typeId,question, topIndex) {
      var number = counter; //The number of the new block being added
      var type; //The type of data of the block
      var $inputDisplay;

      switch(typeId) {
        case "text":
        case 0:
          type = "text";
          $inputDisplay = $('<textarea type='+type+' class="dnd-textbox" id=textbox'+number+'></textarea>').change(function(){question["answers"][number]["text"]=this.value});
          break;

        case "latex":
        case 1:
          type = "latex";
          $inputDisplay = $('<textarea type='+type+' class="dnd-textbox" id=textbox'+number+'></textarea>').change(function(){question["answers"][number]["latex"]=this.value});
          //$inputDisplay = $('<textarea type='+type+' class="dnd-textbox" id=textbox'+number+'> <textarea class="keyboard"></textarea> <span class="mathquill mathquill-textbox-'+number+'" data-keyboard-type="math-advanced" id="xxxxz"></span> </textarea>').change(function(){question["answers"][number]["latex"]=this.value});

          //if (question.type.startsWith("math")) {
          //  $timeout(function() {
          //      $scope.renderMathquilDnD(topIndex, number, question);
          //  }, 100);
          //};
          break;

        case "image":
        case 2:
          //image
          break;

        default:
          console.log("Wrong type of block.");
      }

      var $deleteButton = $('<a class=dnd-btn-del> <span class="glyphicon glyphicon-trash trash-icon"></span> </a>').click(function(){$scope.deleteDraggableBlock(number,question)});//delete button of the block
      var $paramButton = $('<a class=dnd-btn-param> <span class="glyphicon glyphicon-cog"></span> </a>').click(function(){$scope.openBlockInfoDisplay(number,question)});//param button of the block
      var $orderDisplay = $('<p id=order'+counter+' class="dnd-display-order"> </p>');//order of the block (varies according to the canva)

      //Draggable block
      var $block = $('<div id=draggable'+number+' type="text" number='+number+' class="dnd-draggable ui-widget-content" set="center"> </div>').draggable({
        containment: "#containment-wrapper",
        scroll: false,
        stack: ".dnd-draggable",
        stop: function() {
          $scope.order(question);
          question["answers"][number]["left"] = $(this).position().left;
          question["answers"][number]["top"] = $(this).position().top;
          }
      });

      $block = $block.resizable({
        handles: "se",
        resize: function() {
          $scope.order(question);
          question["answers"][number]["height"] = $(this).height();
          question["answers"][number]["width"] = $(this).width();
        }
      });

      //Append of the elements to the div block
      $inputDisplay.appendTo($block);
      $orderDisplay.appendTo($block);
      $deleteButton.appendTo($block);
      $paramButton.appendTo($block);

      //Append of the div block to the container
      $block.appendTo(document.getElementById("containment-wrapper"));

      //We put the block in the tab
      tab.push($block);

      counter++;
      num++;

      question["answers"].push({
        number: number,//id of the block
        type: type,
        text: "",
        latex: "",
        order: "",//correct order
        hint: "",
        ancer: "false",
        width: 160,
        height: 80,
        top: "",//top position in the wrapper
        left: "",//left position in the wrapper
      });

      console.log(question);
      $scope.order(question);
    }

    //Display alert when deleting a block in order to
    //Remove the block "block" from the canva and from tab
    $scope.deleteDraggableBlock = function(number,question) {
      if (confirm('Etes vous sur de vouloir supprimer ce block ?')) {
        for (var i = 0; i < num; i++) {
          if (number == tab[i].attr('number')) {
            document.getElementById("draggable"+number).style.visibility = 'hidden';
            question["answers"][tab[i].attr('number')]={};
            tab.splice(i, 1);
            num--;
            break;
          }
        }
        $scope.order(question);
      }
    }

    //It varies according to the changeCanva
    //If it's ranking, it will display the rank of each block on their order element
    //If it's set, it will display the set of each block on their set element
    $scope.order = function(question) {
      if(canva=="ranking") {
        tab.sort(function(a,b){return (a.position().left-b.position().left)+(a.position().top-b.position().top) });
        for (var i = 0; i < num; i++) {
          $("#order"+tab[i].attr("number")).html(i);
          question["answers"][tab[i].attr("number")].order = i;
        }
      }
      else if(canva=="2-set" || canva=="4-set") {
        for (var i = 0; i < num; i++) {
          question["answers"][tab[i].attr('number')].order = tab[i].attr("set");
        }
      }
    }

    //Change the canva when the user select a new one
    $scope.changeCanva = function(question) {
      question["answers"]=[];

      if(canva != "") {
        document.getElementById("containment-wrapper").remove();
      }
      else {
        document.getElementById("addBlockText").style.display = "inline-block";
        document.getElementById("addBlockMath").style.display = "inline-block";
        document.getElementById("addBlockImage").style.display = "inline-block";
        document.getElementById("addBlockGeneral").style.display = "inline-block";
      }

      canva = document.getElementById("selectCanva").value;
      $('<div id="containment-wrapper" class="containment-wrapper"> </div>').appendTo(document.getElementById("wrapper"));

      if(canva == "2-set") {
        $scope.createSet("right",question);
        $scope.createSet("left",question);
      }

      else if(canva == "4-set") {
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

    //Create set for set exercice
    $scope.createSet = function(pos,question) {
      var $set;
      var $input;

      if(pos=="right") {
        $input = $('<input id="rightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upRightSetName=this.value});
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
        $input = $('<input id="leftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upLeftSetName=this.value});
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
        $input = $('<input id="upRightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upRightSetName=this.value});
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
        $input = $('<input id="upleftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.upLeftSetName=this.value});
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
        $input = $('<input id="downRightSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.downRightSetName=this.value});
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
        $input = $('<input id="downLeftSetName" type="text" placeholder="nom de l\'ensemble" class="form-control"> </input>').change(function(){question.canva.downLeftSetName=this.value});
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

    $scope.openBlockInfoDisplay = function(number,question, topIndex) {
      $('#BlockInfo').css('display', 'block');

      if(number != -1) {
        var type = question["answers"][number]["type"];
        $('#TypeBlockInfo').val(type);//Set the drop down list value
        $('#TextBlockInfo').val(question["answers"][number][type]);//Set the text value
        $('#HintBlockInfo').val(question["answers"][number]["hint"]);//Set the hint
        $('#AncerBlockInfo').prop('checked',(question["answers"][number]["ancer"] == "true"));//Set the ancer value
      }
      else {
        $('#TypeBlockInfo').val("text");//Set the drop down list value
        $('#TextBlockInfo').val("Texte de la boite");//Set the text value
        $('#HintBlockInfo').val("Indication(s)");//Set the hint
        $('#AncerBlockInfo').prop('checked',false);//Set the ancer value
      }

      $('#ValidateBlockInfo').off('click');
      $('#ValidateBlockInfo').on("click", function(){$scope.modifyDraggableBlock(number,question, topIndex);});
    }

    $scope.closeBlockInfoDisplay = function() {
      $('#BlockInfo').css('display', 'none');
    }

    $scope.modifyDraggableBlock = function(number,question, topIndex) {
      //Retrieve the information of the form
      var typeValue = $('#TypeBlockInfo').val();
      var textValue = $('#TextBlockInfo').val();
      var hintValue = $('#HintBlockInfo').val();
      var ancerValue = $('#AncerBlockInfo').prop('checked');

      //Create the new block
      if(number == -1) {
        number = counter;
        $scope.createDraggableBlock(typeValue, question, topIndex);
      }

      //Retrieve the block
      var $block = $('#draggable'+number);
      var $textbox = $('#textbox'+number);

      //Reset the values

      switch($block.attr("type")) {
        case "text":
          question["answers"][number]["text"] = "";
          break;

        case "latex":
          question["answers"][number]["latex"] = "";
          break;

        case "image":
          break;

        default:
          console.log("Wrong type of block.");
      }

      //Switch the values
      switch(typeValue) {
        case "text":
          question["answers"][number]["type"] = textValue;
          $block.attr("type","text");
          $textbox.val(textValue);
          break;

        case "latex":
          question["answers"][number]["latex"] = textValue;
          $block.attr("type","latex");
          $textbox.val(textValue);
          break;

        case "image":
          $block.attr("type","image");
          break;

        default:
          console.log("Wrong type of block.");
      }

      if(ancerValue) {
        question["answers"][number]["ancer"] = "true";
        $block.draggable("disable");
      }
      else {
        question["answers"][number]["ancer"] = "false";
        $block.draggable("enable");
      }

      question["answers"][number]["type"] = typeValue;
      question["answers"][number]["hint"] = hintValue;

      $scope.closeBlockInfoDisplay()
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
        if(question.type == "drag-and-drop") {
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
