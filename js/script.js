var listSize;
var listsSize;

function ListMgr() {
  this.lists = [];
};

ListMgr.prototype.addList = function(list) {
  this.lists.push(list);
};

ListMgr.prototype.removeList = function(index) {
  this.lists.splice(index, 1);
};

ListMgr.prototype.getList = function(index) {
  return this.lists[index];
};

function List(name) {
  this.name = name;
  this.items = [];
};

List.prototype.addItem = function(item) {
  this.items.push(item);

  // return the index of the item
  return this.items.length - 1;
};

List.prototype.removeItem = function(index) {
  this.items.splice(index, 1);
};

List.prototype.toggleItemDone = function(index) {
  this.items[index].done = !this.items[index].done;
};

List.prototype.getItem = function(index) {
  return this.items[index];
};

List.prototype.setDeadline = function(index, deadline) {
  this.items[index].deadline = deadline;
}

function Item(name, deadline) {
  this.name = name;
  this.done = false;

  // if deadline is specified, use it. otherwise it should be null.
  this.deadline = (typeof deadline === "undefined") ? null : deadline;
};

Item.prototype.toggleDone = function() {
  this.done = !this.done;
};

function getListMgr() {
  var parsed = JSON.parse(localStorage.getItem("lists"));
  parsed.__proto__ = ListMgr.prototype;
  return parsed;
};

function getList(index) {
  var listMgr = getListMgr();
  var list = listMgr.getList(index);
  list.__proto__ = List.prototype;
  return list;
};

function saveList(index, list) {
  var listMgr = getListMgr();
  listMgr.lists[index] = list;
  saveLists(listMgr);
};

function getItem(listIndex, index) {
  var list = getList(listIndex);
  var item = list.getItem(index);
  item.__proto__ = Item.prototype;
  return item;
};

function addItem(listIndex, name) {
  var list = getList(listIndex);
  var item = new Item(name);
  var index = list.addItem(item);
  saveList(listIndex, list);
  return index;
};

function markAsDone(listIndex, index) {
  $('#l' + listIndex + 'i' + index).toggleClass("done");
  var list = getList(listIndex);
  list.toggleItemDone(index);
  saveList(listIndex, list);
  loadList(listIndex);
};

function loadLists() {
  $('#list').empty();
  var lists = localStorage.getItem("lists");
  if(lists === null) {
    var listMgr = new ListMgr();
    localStorage.setItem("lists", JSON.stringify(listMgr));

    // grab it again
    lists = localStorage.getItem("lists");
  }

  lists = JSON.parse(lists);
  listsSize = lists.lists.length;
  if(listsSize > 0)
    $.each(lists.lists, function(i,s) {
      $("<a  href='#' onclick='javascript:goToList(" + i + ")'><li>"
        + this.name
        + " <div class='listbuttons'>"
        + " <a href='#' onclick='javascript:removeList(" + i + ")'>x</a>"
        + " <div class='spacer'></div>"
        // + " <a  href='#' onclick='javascript:goToList(" + i + ")'>></a>"
        + "</div></li></a>").appendTo("#list");
    });
  else
    $("<li class='emptylist'>You have no lists (you should probably add some)</li>").appendTo("#list");
};

function removeList(i) {
  var listMgr = getListMgr();
  listMgr.removeList(i);
  saveLists(listMgr);
  loadLists();
};

function addList(name) {
  var listMgr = getListMgr();
  var list = new List(name);
  listMgr.addList(list);
  saveLists(listMgr);
};

function saveLists(listMgr) {
  indicateStatus();
  localStorage.setItem("lists", JSON.stringify(listMgr));
};

function modal(listIndex, index) {
  $('.modal-backdrop').fadeIn();
  $('body').addClass('bodyModal');
  $('<div class="modal"></div>').hide().appendTo('body');

  item = getItem(listIndex, index);

  $('<div class="item-name">' + item.name + '</div>').appendTo('.modal');
  $('<div class="deadline-title">Set Deadline</div>').appendTo('.modal');
  $('<div class="deadline-select"></div>').appendTo('.modal');
  $('<input type="text" id="datapicker" />').datepicker().appendTo('.deadline-select');
  $('<div class="deadline-enter" onclick="setDeadline(' + listIndex + ', ' + index + ')">Set</div>').appendTo('.modal');

  $('.modal').fadeIn();
};

function closeModal() {
  $('.modal-backdrop').fadeOut();
  $('.modal').remove();
  $('body').removeClass('bodyModal');
};

function setDeadline(listIndex, index) {
  var list = getList(listIndex);
  var deadline = new Date($('#datapicker').val());

  list.setDeadline(index, deadline);
  saveList(listIndex, list);
  loadList(listIndex);

  closeModal();
};

function loadList(listIndex) {
  $('.back').fadeIn();
  $('.delete').fadeIn();
  $('#list').empty();
  var list = getList(listIndex);
  if(list.items.length > 0)
    $.each(list.items, function(i,s) {
      var itemClass = "";
      if(s.done)
        itemClass = "done";
      var deadline = "set deadline";
      var dead = null;
      if(s.deadline !== null) {
        dead = new Date(s.deadline);
        deadline = moment(s.deadline).fromNow();
      }
      $("<li id='l" + listIndex + "i" + i + "' class='" + itemClass + " listItem'>"
        + "<a href='#' onclick='javascript:modal(" + listIndex + ", " + i + ")'>"
        + this.name
        + "</a>"
        + " <div class='listbuttons'>"
        + " <a id='deadline" + i + "' class='setdeadlinetext' href='#' onclick='javascript:modal(" + listIndex + ", " + i + ")'>" + deadline + "</a>"
        + " <a href='#' onclick='javascript:markAsDone(" + listIndex + ", " + i + ")'>&#x2713;</a>"
        + "</div></li>").appendTo("#list");
      if(s.deadline !== null) {
        var now = new Date();
        if(now > dead)
          $('#deadline' + i).addClass('deadline-passed');
        $('#l' + listIndex + 'i' + i).attr('data-date', dead.toISOString()).addClass('has-date');
      }
      $('#l' + listIndex + 'i' + i).attr('data-name', this.name);
    })
  else
    $("<li class='emptylist'>You have no items (you should probably add some)</li>").appendTo("#list");
};

function goToList(listIndex) {
  $('#add-list-container').fadeOut(500);
  $('#add-item-container').fadeIn(500);
  $('#add-item-container').attr('data-list', listIndex)
  $('#list').fadeOut(500, function() {
    loadList(listIndex);
    $('#list').fadeIn(500);
  });
};

function indicateStatus() {
  $('.oranger').animate({color: '#666'}, 50);
  $('.oranger').animate({color: '#f7931d'}, 100);
};

function back() {
  if($('#add-list-container').css('display') === "none") {
    $('#add-item-container').fadeOut(500);
    $('#add-list-container').fadeIn(500);
    $('#add-item-container').attr('data-list', '-1');
    $('#list').fadeOut(500, function() {
      loadLists();
      $('#list').fadeIn(500);
    });
    $('.back').fadeOut(500);
    $('.delete').fadeOut(500);
  }
  else
    console.log("can't back out of nothing!");
};

function emptyDone() {
  var listIndex = $('#add-item-container').attr('data-list');
  var listMgr = getListMgr();
  var list = getList(listIndex);

  var offset = 0;
  $('.done').each(function(){
    var id = $(this).attr('id');

    // offset needed because array index changes :(
    list.removeItem(id - offset++);
  });

  saveList(listIndex, list);
  goToList(listIndex);
};

$(function(){

  $(document).bind('keyup', '/', function() {
    $(".add").focus();
  });

  $(document).bind('keyup', 'backspace', function() {
    back();
  });

  $('input.add').bind('keydown', 'esc', function() {
    this.blur();
  });

  $(document).bind('keydown', 'esc', function() {
    closeModal();
  });


  loadLists();

  $("#new_list").keypress(function(e){
    $("#new_list").val();
    if(e.which === 13 && $("#new_list").val().length > 0) {
      if(listSize === 0)
        $("#list").empty();

      var list = $("#new_list").val();

      $(".emptylist").remove();

      $("<a href='#' onclick='javascript:goToList(" + listsSize + ")'><li>"
        + list
        + " <div class='listbuttons'>"
        + " <a href='#' onclick='javascript:removeList(" + listsSize + ")'>x</a>"
        + " <div class='spacer'></div>"
        // + " <a href='#' onclick='javascript:goToList(" + listsSize++ + ")'>></a>"
        + "</div></li></a>").appendTo("#list");

      addList(list);

      $("#new_list").val("");

      $("#new_list").blur();
    }
  })

  $("#new_item").keypress(function(e){
    $("#new_item").val();
    if(e.which === 13 && $("#new_item").val().length > 0) {

      var item = $("#new_item").val();

      $(".emptylist").remove();

      var listIndex = $("#add-item-container").attr('data-list');
      var itemIndex = addItem(listIndex, item);
      $("<li id='l" + listIndex + "i" + itemIndex + "' class='listItem'>"
        + "<a href='#' onclick='javascript:modal(" + listIndex + ", " + itemIndex + ")'>"
        + item
        + "</a>"
        + " <div class='listbuttons'>"
        + " <a id='deadline" + itemIndex + "' class='setdeadlinetext' href='#' onclick='javascript:modal(" + listIndex + ", " + itemIndex + ")'>set deadline</a>"
        + " <a href='#' onclick='javascript:markAsDone(" + listIndex + ", " + itemIndex + ")'>&#x2713;</a>"
        + "</div></li>").appendTo("#list");

      $("#new_item").val("");

      $("#new_item").blur();
    }
  })


  $('.oranger').animate({color: '#f7931d'}, 1000);

})

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