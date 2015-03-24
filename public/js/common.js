// DOM Ready =============================================================
$(document).ready(function() {

  //'See It!' button pressed!!
  $(document).on('submit', '#search', function(e) {
    e.preventDefault(); // Prevents the form from submitting
    if ($('#toolbar+.data-alert').length > 0)
    {
      console.log("Not submitting");
      return false;
    }

    var $this = $(this); // `this` refers to the current form element
    $('#lat').attr("value", centerMarker.getPosition().lat());
    $('#lng').attr("value", centerMarker.getPosition().lng());
    
    //Clear the current search results
    //$('#resultslist').html("");

    //Search ajax request off to /search which will first create a subscription, then start returning results
    $.get('/search', $this.serialize(), function( renderedResults ) {
      console.log(renderedResults);
      $('#resultslist').append(renderedResults);
    }, 'html');

  });

  //Change in search radius text input
  $("#searchradius").on('input', function() {
    $('#toolbar+.data-alert').remove();
    if (isNaN($(this).val()) || $(this).val() <= 0 || $(this).val() >= 5001) {
      console.log("Invalid input");

      //printNotification("error", "Radius must be a number between 1 and 5000", pathToRoot);
      var $alert = $( "<div class='row data-alert'><div data-alert class='small-8 medium-6 columns small-centered alert-box alert radius'>Must be 1 to 5000<a href='#' class='close'>&times;</a></div></div>" );
 
      $( "#toolbar" ).after( $alert );
      $(document).foundation('alert', 'reflow');
    }
    else {
      //clearNotification();
      console.log('Manual distance: ' + ($(this).val()/1000).toFixed(3));

      distanceWidget.clear_markers();
      distanceWidget = new DistanceWidget(map, ($(this).val()/1000).toFixed(3) );
    }
  });
  
  //Logout menu item clicked
  $(document).on('click', '#logout', function(e) {
    $( "#logoutModal" ).append( "<img src='http://instagram.com/accounts/logout/' width='0' height='0'/>" );

    window.setTimeout(function() {
      window.location = "/login/logout";
    }, 3000);

  });

  // Initialize the map
  initialize($('#lat').attr("value"), $('#lng').attr("value"), $('#searchradius').attr("value"), 14);

  $(document).foundation('offcanvas', 'reflow');
  $(document).foundation('reveal', 'reflow');

});