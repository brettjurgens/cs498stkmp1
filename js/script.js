var listSize;

function listMgr() {
  this.lists = [];
};

listMgr.prototype.addList = function(list) {
  this.lists.push(list);
};

listMgr.prototype.removeList = function(index) {
  this.lists.splice(index, 1);
};

function list() {
  this.items = [];
};

list.prototype.addItem = function(item) {
  this.items.push(item)
};

list.prototype.removeItem = function(index) {
  this.items.splice(index, 1);
};

function item(name, deadline) {
  this.name = name;
  this.done = false;

  // if deadline is specified, use it. otherwise it should be null.
  this.deadline = (typeof deadline === "undefined") ? null : deadline;
}

$(function(){

  $(document).bind('keyup', '/', function() {
    $("#new_item").focus();
  });

  $('input#new_item').bind('keydown', 'esc', function() {
    this.blur();
  });

  var list = JSON.parse(localStorage.getItem("list"));

  debug = list;

  populateList();

  $("#new_item").keypress(function(e){
    $("#new_item").val();
    if(e.which === 13 && $("#new_item").val().length > 0) {
      if(listSize === 0)
        $("#list").empty();
      indicateStatus();
      var array = [];
      var jsonparse = JSON.parse(localStorage.getItem("list"));
      if( jsonparse != null)
        array = jsonparse;
      var item = $("#new_item").val();
      array.push(item);

      localStorage.setItem("list", JSON.stringify(array));

      console.log("Adding \"" + item + "\" to the list...");

      $("<li>" + item + " <div class='deletebutton' href='#' onclick='javascript:removeFromList(" + listSize++ + ")'>delete</div></li>").appendTo("#list");

      $("#new_item").val("");

      $("#new_item").blur();
    }
  })

  $('.oranger').animate({color: '#f7931d'}, 1000);

})

function removeFromList(i) {
  var list = JSON.parse(localStorage.getItem("list"));
  if(listSize - 1 < i || i < 0)
    console.log("yo dood, that item doesn't exist...");
  else {
    listSize--;
    var removed = list.splice(i, 1);
    localStorage.setItem("list", JSON.stringify(list));
    console.log("Removed \"" + removed + "\" from the list");
    var uniqueishId = Date.now();
    $('<div id=' + uniqueishId + '>item deleted</div>').hide().appendTo('#notifications').fadeIn();
    setTimeout(
      function(){
        $('#' + uniqueishId).fadeOut();
      }, 2000);
    $('#list').empty();
    populateList();
  }
  indicateStatus();
}

function populateList() {
  var list = JSON.parse(localStorage.getItem("list"));
  listSize = list.length;
  if(listSize > 0)
    $.each(list, function(i,s){
      $("<li>" + s + " <div class='deletebutton' href='#' onclick='javascript:removeFromList(" + i + ")'>delete</div></li>").appendTo("#list");
    });
  else
    $("<li class='emptylist'>You have no items (you should probably add some)</li>").appendTo("#list");
}


function indicateStatus() {
  $('.oranger').animate({color: '#666'}, 50);
  $('.oranger').animate({color: '#f7931d'}, 100);
}


/* 
  Functions for the text input.
  Reworked from my own websites (http://movieaggregator.com and http://procosmicxy.info)
  I release it in the public domain, so no licensing issues?
*/
function clickclear(thisfield, defaulttext, color) {
  if (thisfield.value == defaulttext) {
    thisfield.value = "";
    if (!color) {
      color = "212121";
    }
    thisfield.style.color = "#" + color;
  }
}
function clickrecall(thisfield, defaulttext, color) {
  if (thisfield.value == "") {
    thisfield.value = defaulttext;
    if (!color) {
      color = "aaaaaa";
    }
    thisfield.style.color = "#" + color;
  }
}