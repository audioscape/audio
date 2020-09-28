
function removeOptions(selectbox)
{
    var i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }
  
  voices = window.speechSynthesis.getVoices();
  // prevent populating of voices more than once.
  removeOptions(document.getElementById("voiceSelect"));
  
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      //option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    if (voices[i].name == "Google UK English Male") {
        voice = voices[i];
        option.setAttribute('selected', "selected");
    }
    document.getElementById("voiceSelect").appendChild(option);
  }
}

// var synth = window.speechSynthesis;
var voices = [], voice, chunkLength = 120, lastfeedReadByDateIndex = 0,
    lastfeedReadByGrpIndex = 0,
    pattRegex = new RegExp(
            '^[\\s\\S]{' + Math.floor(chunkLength / 2) + ','
            + chunkLength + '}[.!?,]{1}|^[\\s\\S]{1,' + chunkLength 
            + '}$|^[\\s\\S]{1,' + chunkLength + '} ')
    ;





$(document).ready(function () {
    
    window.speechSynthesis.cancel();

    var this2 = $(".tts").text();
    var u = new SpeechSynthesisUtterance(this2.trim());


    $(document).on("change", "#voiceSelect", function(e) {
        var selectedOption = $(this)[0].selectedOptions[0].getAttribute('data-name');
        for(var j = 0; j < voices.length ; j++) {
            if(voices[j].name === selectedOption) {
                voice = voices[j];
                if (window.speechSynthesis.speaking) {
                    console.log("changing voice");

                    //window.speechSynthesis.pause();
                    //window.speechSynthesis.resume();

                    window.speechSynthesis.cancel();
                    u.voice = voice;
                    window.speechSynthesis.speak(u);

                    //playCurrentPost();
                } else {
                    window.speechSynthesis.cancel();
                    $(".listenButton").hide();
                    $(".pauseButton").show();
                    u.voice = voice;
                    window.speechSynthesis.speak(u);
                }
                break;
            }
        }
    });
    
    $(document).on('click', '.skipNext', function(e) {
        if (sort_by_date) {
            if (lastfeedReadByDateIndex < feedCount) {
                lastfeedReadByDateIndex++;
                if (lastfeedReadByDateIndex >= feedCount) {
                    $(this).hide();
                }
            }
        } else {
            if (lastfeedReadByGrpIndex < feedCount) {
                lastfeedReadByGrpIndex++;
                if (lastfeedReadByGrpIndex >= feedCount) {
                    $(this).hide();
                }
            }
        }
        
        $('.skipPrevious').show();
        playCurrentPost();
    });
    
    $(document).on('click', '.skipPrevious', function(e) {
        if (sort_by_date) {
            if (lastfeedReadByDateIndex > 0) {
                lastfeedReadByDateIndex--;
            }
            if (lastfeedReadByDateIndex <= 0) {
                    $(this).hide();
            }
        } else {
            if (lastfeedReadByGrpIndex > 0) {
                lastfeedReadByGrpIndex--;
            }
            if (lastfeedReadByGrpIndex <= 0) {
                    $(this).hide();
            }
        }
        
        $('.skipNext').show();
        playCurrentPost();
    });
    
    $(document).on('click', '.listenButton', function(e) {
        $(this).hide();
        $(".pauseButton").show();
        e.preventDefault();
        console.log('.listenButton clicked');
        if (window.speechSynthesis.paused || window.speechSynthesis.pending) {
            // if paused & pending, restart the utterance.
            console.log('should resume if interupted');
            window.speechSynthesis.resume();
            
        } else {

            //window.speechSynthesis.cancel(); // Seems to be needed to clear after reload.

            // else start reading the next post.
            
            // playloop = setInterval(function() {
                //if (!window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                    console.log('restarting play');
                    
                    // Reactivate for Facebook
                    //playCurrentPost();

                    
                    u.voice = voice;
                    //u.rate = 1.8;
                    window.speechSynthesis.speak(u);

                //}
            // }, 3000);
        }
    });
    
    $(document).on('click', '.pauseButton', function(e) {
        $(this).hide();
        window.speechSynthesis.pause();
        //window.speechSynthesis.cancel();

        // Reactivate for Facebook
        //clearTimeout(playloop);
        $(".listenButton").show();
    });


  // populate voice list -- starts

  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  // populate voice list -- end

  populateVoiceList();
});


