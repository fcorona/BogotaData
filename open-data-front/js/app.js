$(document).foundation({
	orbit: {
		navigation_arrows: false,
		slide_number: false,
		timer: false
	}
});

// Copy Clipboard
$("#link").click(function(){
  var holdtext = $("#clipboard").innerText;
  Copied = holdtext.createTextRange();
  Copied.execCommand("Copy");
});

//Facebook Login
window.fbAsyncInit = function() {
	
  FB.init({
	appId      : '541715325944679',
	status     : true, // check login status
	cookie     : true, // enable cookies to allow the server to access the session
	xfbml      : true  // parse XFBML
  });

  // Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
  // for any authentication related change, such as login, logout or session refresh. This means that
  // whenever someone who was previously logged out tries to log in again, the correct case below 
  // will be handled. 
  FB.Event.subscribe('auth.authResponseChange', function(response) {
	// Here we specify what we do with the response anytime this event occurs. 
	if (response.status === 'connected') {
			//FB.api('/me', function(data) {
			//alert('Nombre: ' + data.name);
			//});
	  // The response object is returned with a status field that lets the app know the current
	  // login status of the person. In this case, we're handling the situation where they 
	  // have logged in to the app.
	  testAPI();
	} else if (response.status === 'not_authorized') {
	  // In this case, the person is logged into Facebook, but not into the app, so we call
	  // FB.login() to prompt them to do so. 
	  // In real-life usage, you wouldn't want to immediately prompt someone to login 
	  // like this, for two reasons:
	  // (1) JavaScript created popup windows are blocked by most browsers unless they 
	  // result from direct interaction from people using the app (such as a mouse click)
	  // (2) it is a bad experience to be continually prompted to login upon page load.
	  FB.login(function(){}, {scope: 'publish_actions'});
	} else {
	  // In this case, the person is not logged into Facebook, so we call the login() 
	  // function to prompt them to do so. Note that at this stage there is no indication
	  // of whether they are logged into the app. If they aren't then they'll see the Login
	  // dialog right after they log in to Facebook. 
	  // The same caveats as above apply to the FB.login() call here.
	  FB.login(function(){FB.api('/me/feed', 'post', {message: 'Hello, world!'});}, {scope: 'publish_actions'});
	}
  });
  };

  // Load the SDK asynchronously
	
	(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) return;
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/es_LA/all.js#xfbml=1&appId=541715325944679";
	fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));



  // Here we run a very simple test of the Graph API after login is successful. 
  // This testAPI() function is only called in those cases. 
  function testAPI() {
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', function(response) {
	  console.log('Good to see you, ' + response.name + '.');
	});
  }
// TWITTER

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");

// ZERO
var client = new ZeroClipboard( document.getElementById("copy-button"), {
  moviePath: "bower_components/zeroclipboard/ZeroClipboard.swf"
} );

client.on( "load", function(client) {
  // alert( "movie is loaded" );

  client.on( "complete", function(client, args) {
    // `this` is the element that was clicked
    // this.style.display = "none";
    alert("Enlace copiado: " + args.text );
  } );
} );