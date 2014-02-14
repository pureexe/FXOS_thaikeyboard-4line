(function() {
  // Get the settings, and then show the panel afterwards
  var panel = document.querySelector('#general-settings');

  // Until Haida lands this is how users could go back to Settings app
  document.getElementById('back').addEventListener('click', function() {
    var activity = new MozActivity({
      name: 'configure',
      data: {
        target: 'device'
      }
    });

    // Close ourself after the activity transition is completed.
    setTimeout(function() {
      window.close();
    }, 1000);
  });

  /**
   * Gets the settings based on information from the dom
   */
     var sound_btn=document.getElementById('cb-clickSound');
     var vibrate_btn=document.getElementById('cb-vibration');
	if(localStorage.vibration==1){
		vibrate_btn.checked=true;
	}
	if(localStorage.clickSound==1){
		sound_btn.checked=true;
	}
sound_btn.addEventListener('change', function(e) {
      if(sound_btn.checked)
		localStorage.clickSound=1
	else
		localStorage.clickSound=0;
      });
vibrate_btn.addEventListener('change', function(e) {
	if(vibrate_btn.checked)
		localStorage.vibration=1;
	else
		localStorage.vibration=0;
      });
  
})();
