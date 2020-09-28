
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

  voices.sort((a, b) => {
    let fa = a.lang.toLowerCase(),
        fb = b.lang.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
  });

  console.log(voices)
  for(i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    if(voices[i].default) {
        //option.textContent += ' -- DEFAULT';
        voice = voices[i];
        option.setAttribute('selected', "selected");
    } else if (voices[i].name == "Google UK English Male") {
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
    
    let currentSentenceIndex = 0;
    window.speechSynthesis.cancel();

    var theText = $(".tts").text().toString().trim();

    // https://stackoverflow.com/questions/11761563/javascript-regexp-for-splitting-text-into-sentences-and-keeping-the-delimiter
    let sentenceArray = theText.match(/([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g);

    //console.log(sentenceArray);

    var u = new SpeechSynthesisUtterance(theText.trim());

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
                    if (currentSentenceIndex > 0) {
                      currentSentenceIndex = currentSentenceIndex-1; // Since canceling adds 1 when speaking
                    }
                    u.voice = voice;

                    playAudio(currentSentenceIndex); 
                    //window.speechSynthesis.speak(u);

                    //playCurrentPost();
                } else {
                    window.speechSynthesis.cancel();
                    if (currentSentenceIndex > 0) {
                      currentSentenceIndex = currentSentenceIndex-1; // Since canceling adds 1 when speaking
                    }
                    u.voice = voice;

                    playAudio(currentSentenceIndex);
                    //window.speechSynthesis.speak(u);
                }
                $(".listenButton").hide();
                $(".pauseButton").show();
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

                    playAudio(0);
                    

                    

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

  function playAudio(startIndex) {
    for (index = startIndex; index < sentenceArray.length; ++index) {

        u = new SpeechSynthesisUtterance(sentenceArray[index]);

        u.voice = voice;
        u.index = index;
        //u.rate = 1.8;
        u.onend = function (event) {
            //t = event.timeStamp - t;
            //console.log(event.timeStamp);
            //console.log((t / 1000) + " seconds");
            if (window.speechSynthesis.speaking) {
              currentSentenceIndex++;
            }
            console.log("Next index: " + currentSentenceIndex)
        };
        window.speechSynthesis.speak(u);
    };
  }

  populateVoiceList();
});


