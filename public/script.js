window.onload = function() {
  var converter = new showdown.Converter();
  var pad = document.getElementById('pad');
  var markdownArea = document.getElementById('markdown'); 

  // make the tab act like a tab
  pad.addEventListener('keydown',function(e) {
      if(e.keyCode === 9) { // tab was pressed
          // get caret position/selection
          var start = this.selectionStart;
          var end = this.selectionEnd;

          var target = e.target;
          var value = target.value;

          // set textarea value to: text before caret + tab + text after caret
          target.value = value.substring(0, start)
                          + "\t"
                          + value.substring(end);

          // put caret at right position again (add one for the tab)
          this.selectionStart = this.selectionEnd = start + 1;

          // prevent the focus lose
          e.preventDefault();
      }
  });

  var previousMarkdownValue;          

  // convert text area to markdown html
  var convertTextAreaToMarkdown = function(){
      var markdownText = pad.value;
      previousMarkdownValue = markdownText;
      html = converter.makeHtml(markdownText);
      markdownArea.innerHTML = html;
  };

  var didChangeOccur = function(){
      if(previousMarkdownValue != pad.value){
          return true;
      }
      return false;
  };

  // check every second if the text area has changed
  setInterval(function(){
      if(didChangeOccur()){
          convertTextAreaToMarkdown();
      }
  }, 1000);

  // convert textarea on input change
  pad.addEventListener('input', convertTextAreaToMarkdown);

  // ignore if on home page
  if(document.location.pathname.length > 1){
      // implement share js
      var documentName = document.location.pathname.substring(1);
      sharejs.open(documentName, 'text', function(error, doc) {
          doc.attach_textarea(pad);
          convertTextAreaToMarkdown();
      });        
  }

  // convert on page load
  convertTextAreaToMarkdown();

};

function toggleByClass(className) {
    $("."+className).toggle();
}

$(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
});

//Generate Textbox
$(document).ready(function(){
    $("#addText").click(function(){
        $(".noteBook").append(" <div class='row'><textarea class='full-height display' placeholder='Write markdown text here...' id='pad'></textarea><div class='full-height display' id='markdown'></div></div>");
    });
});

//JExcel
$(document).ready(function(){
    var data1 = $.fn.jexcel('helper', { action:'createEmptyData', cols:22, rows:10 });
    $("#addTable").click(function(){
        $(".noteBook").append(" <div class='row'><div id='table'></div></div>");
        $('#table').jexcel({
            data:data1,
            csvHeaders:true,
            tableOverflow:true,
            tableHeight:'300px',
        });
    });
});

//Auto Expand MarkDown TextBox
$(document)
    .one('focus.autoExpand', 'textarea.autoExpand', function(){
        var savedValue = this.value;
        this.value = '';
        this.baseScrollHeight = this.scrollHeight;
        this.value = savedValue;
    })
    .on('input.autoExpand', 'textarea.autoExpand', function(){
        var minRows = this.getAttribute('data-min-rows')|0, rows;
        this.rows = minRows;
        rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 16);
        this.rows = minRows + rows;
    });

    var taskInput=document.getElementById("new-task");//Add a new task.
var addButton=document.getElementsByTagName("button")[0];//first button
var incompleteTaskHolder=document.getElementById("incomplete-tasks");//ul of #incomplete-tasks
var completedTasksHolder=document.getElementById("completed-tasks");//completed-tasks


//New task list item
var createNewTaskElement=function(taskString){

	var listItem=document.createElement("li");

	//input (checkbox)
	var checkBox=document.createElement("input");//checkbx
	//label
	var label=document.createElement("label");//label
	//input (text)
	var editInput=document.createElement("input");//text
	//button.edit
	var editButton=document.createElement("button");//edit button

	//button.delete
	var deleteButton=document.createElement("button");//delete button

	label.innerText=taskString;

	//Each elements, needs appending
	checkBox.type="checkbox";
	editInput.type="text";

	editButton.innerText="Edit";//innerText encodes special characters, HTML does not.
	editButton.className="edit";
	deleteButton.innerText="Delete";
	deleteButton.className="delete";



	//and appending.
	listItem.appendChild(checkBox);
	listItem.appendChild(label);
	listItem.appendChild(editInput);
	listItem.appendChild(editButton);
	listItem.appendChild(deleteButton);
	return listItem;
}



var addTask=function(){
	console.log("Add Task...");
	//Create a new list item with the text from the #new-task:
	var listItem=createNewTaskElement(taskInput.value);

	//Append listItem to incompleteTaskHolder
	incompleteTaskHolder.appendChild(listItem);
	bindTaskEvents(listItem, taskCompleted);

	taskInput.value="";

}

//Edit an existing task.

var editTask=function(){
console.log("Edit Task...");
console.log("Change 'edit' to 'save'");


var listItem=this.parentNode;

var editInput=listItem.querySelector('input[type=text]');
var label=listItem.querySelector("label");
var containsClass=listItem.classList.contains("editMode");
		//If class of the parent is .editmode
		if(containsClass){

		//switch to .editmode
		//label becomes the inputs value.
			label.innerText=editInput.value;
		}else{
			editInput.value=label.innerText;
		}

		//toggle .editmode on the parent.
		listItem.classList.toggle("editMode");
}




//Delete task.
var deleteTask=function(){
		console.log("Delete Task...");

		var listItem=this.parentNode;
		var ul=listItem.parentNode;
		//Remove the parent list item from the ul.
		ul.removeChild(listItem);

}


//Mark task completed
var taskCompleted=function(){
		console.log("Complete Task...");
	
	//Append the task list item to the #completed-tasks
	var listItem=this.parentNode;
	completedTasksHolder.appendChild(listItem);
				bindTaskEvents(listItem, taskIncomplete);

}


var taskIncomplete=function(){
		console.log("Incomplete Task...");
//Mark task as incomplete.
	//When the checkbox is unchecked
		//Append the task list item to the #incomplete-tasks.
		var listItem=this.parentNode;
	incompleteTaskHolder.appendChild(listItem);
			bindTaskEvents(listItem,taskCompleted);
}



var ajaxRequest=function(){
	console.log("AJAX Request");
}

//The glue to hold it all together.


//Set the click handler to the addTask function.
addButton.onclick=addTask;
addButton.addEventListener("click",addTask);
addButton.addEventListener("click",ajaxRequest);


var bindTaskEvents=function(taskListItem,checkBoxEventHandler){
	console.log("bind list item events");
//select ListItems children
	var checkBox=taskListItem.querySelector("input[type=checkbox]");
	var editButton=taskListItem.querySelector("button.edit");
	var deleteButton=taskListItem.querySelector("button.delete");


			//Bind editTask to edit button.
			editButton.onclick=editTask;
			//Bind deleteTask to delete button.
			deleteButton.onclick=deleteTask;
			//Bind taskCompleted to checkBoxEventHandler.
			checkBox.onchange=checkBoxEventHandler;
}

//cycle over incompleteTaskHolder ul list items
	//for each list item
	for (var i=0; i<incompleteTaskHolder.children.length;i++){

		//bind events to list items chldren(tasksCompleted)
		bindTaskEvents(incompleteTaskHolder.children[i],taskCompleted);
	}




//cycle over completedTasksHolder ul list items
	for (var i=0; i<completedTasksHolder.children.length;i++){
	//bind events to list items chldren(tasksIncompleted)
		bindTaskEvents(completedTasksHolder.children[i],taskIncomplete);
	}