
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




    $(document).on("change", "#voiceSelect", function(e) {
        
        var selectedOption = $(this)[0].selectedOptions[0].getAttribute('data-name');
        for(var j = 0; j < voices.length ; j++) {
            if(voices[j].name === selectedOption) {
                voice = voices[j];
                if (window.speechSynthesis.speaking) {
                    console.log("changing voice");
                    playCurrentPost();
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
        if (window.speechSynthesis.paused && window.speechSynthesis.pending) {
            // if paused & pending, restart the utterance.
            console.log('should resume if interupted');
            window.speechSynthesis.resume();
            
        } else {
            // else start reading the next post.
            
            // playloop = setInterval(function() {
                if (!window.speechSynthesis.speaking) {
                    console.log('restarting play');
                    playCurrentPost();
                }
            // }, 3000);
        }
    });
    
    $(document).on('click', '.pauseButton', function(e) {
        $(this).hide();
        window.speechSynthesis.pause();
        window.speechSynthesis.cancel();
        clearTimeout(playloop);
        $(".listenButton").show();
    });



$(document).ready(function () {
    
  // populate voice list -- starts

  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  // populate voice list -- end

  populateVoiceList();
});


