// DOM Ready =============================================================
$(document).ready(function() {

  // Initialize the map
  initialize($('#lat').attr("value"), $('#lng').attr("value"), $('#searchradius').attr("value"), 14);

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
    
    $.post(
        "/search", // Gets the URL to sent the post to
        $this.serialize(), // Serializes form data in standard format
        function(data) { console.log(data) },
        "json" // The format the response should be in
    );
    
  });

  //Login button pressed
  $(document).on('click', '#authenticate', function(e) {
    e.preventDefault(); // Prevents the form from submitting

    $.get(
        "/login", // URL to send the request to
        function(data) { 
          console.log(data);
          $('#instaLogin').contents().find('body').append(data);
        },
        "html" // The format the response should be in
    );
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
  
  $(document).foundation('reveal', 'reflow');

});