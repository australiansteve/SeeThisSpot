// DOM Ready =============================================================
$(document).ready(function() {

  //'Enter' is hit in the google map search bar - stop the form from submitting/page reloading
  $(document).on('submit', 'form[name="gsearch"]', function(e) {
    e.preventDefault(); // Prevents the form from submitting
  });

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
    $('#resultslist').html("");

    //Search ajax request off to /search which will first create a subscription, then start returning results
    $.get('/search', $this.serialize(), function( renderedResults ) {
      //console.log(renderedResults);
      $('#resultslist').append(renderedResults);

      if ($('#authenticate').length == 0) {
        $('#footer>div').append("<a id='authenticate' class='radius button' href='/login?return_to=backfill'>Login to Instagram for more...</a>");
      }

      updateToFriendlyTimes();
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

  //Scrolling triggers backfill when the user is logged in to Instagram
  var backfillInProgress = false;
  $(window).scroll(function() {
        
    if ($('#logout').length > 0 && !backfillInProgress) {

      if( $(window).scrollTop() >= ($(document).height() - $(window).height())*0.7 ) {

        //Backfill ajax request off to /search which will first create a subscription, then start returning results
        $.get('/search/backfill', function( renderedResults ) {
          //Remove any 'nosearchresult' items
          $('#nosearchresult').remove();
          $('#resultslist').append(renderedResults);
          backfillInProgress = false;

          updateToFriendlyTimes();
        }, 'html');

        backfillInProgress = true;
      }
    }
        
  });

  updateToFriendlyTimes();

  $(document).foundation('offcanvas', 'reflow');
  $(document).foundation('reveal', 'reflow');

});

function updateToFriendlyTimes() {

  var currentTime = Math.ceil(new Date().getTime() / 1000); //Current time in seconds, rounded up

  //Update the timestamp on each photo to be in human readable form
  $('.timer .raw').each(function(index) {
    //console.log("Convert " + $(this).text() + " to human form");
    //console.log("Current time " + currentTime);
    var timeDiff = currentTime - parseInt($(this).text());
    //console.log("Diff " + timeDiff);
    var friendlyTime = "";

    if ((timeDiff / 60) < 1) { //Under 1 minute
      friendlyTime = timeDiff + "s";
    }
    else if ((timeDiff / 3600) < 1) { //under 1 hour
      friendlyTime = Math.floor(timeDiff/60) + "m";//Convert seconds to minutes
    }
    else if ((timeDiff / 86400) < 1) { //under 1 day
      friendlyTime = Math.floor(timeDiff/3660) + "h";//Convert seconds to hours
    }
    else if ((timeDiff / 604800) < 1) { //under 1 week
      friendlyTime = Math.floor(timeDiff/86400) + "d";//Convert seconds to days
    }
    else { //over 1 week
      friendlyTime = Math.floor(timeDiff/604800) + "w";//Convert seconds to weeks
    }

    //console.log("Friendly time: " + friendlyTime);
    $(this).text(friendlyTime);
    $(this).removeClass("raw");

  });
}