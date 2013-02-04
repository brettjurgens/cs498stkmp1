var listSize;

$(function(){

  var list = JSON.parse(localStorage.getItem("list"));

  debug = list;

  $.each(list, function(i,s){
    $("<li>" + s + " <span>delete</span></li>").appendTo("#list");
  });

  $("#new_item").keypress(function(e){
    $("#new_item").val();
    if(e.which === 13 && $("#new_item").val().length > 0) {
      if(listSize === 0)
        $("#list").empty();

      var array = [];
      var jsonparse = JSON.parse(localStorage.getItem("list"));
      if( jsonparse != null)
        array = jsonparse;
      var item = $("#new_item").val();
      array.push(item);

      localStorage.setItem("list", JSON.stringify(array));

      console.log("Adding \"" + item + "\" to the list...");

      $("<li>" + item + " <span>delete</span></li>").appendTo("#list");

      $("#new_item").val("");

    }
  })

})