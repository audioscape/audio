// JQuery Embed for Facebook
// Authors: Dipak Yadav, Don Adams, Loren
// Company: DreamStudio.com
// Please send updates to http://DreamStudio.com/account/write/8
// Permission required for usage. This message must remain at top of script.

var fbFolder = '',
 fbLimit = 20,
 showComments = true,
 commentQuantity = 3,
 fbOffset = 0,
 includePublicFeed, /* not initialized, assume false */
 fbShowControls = false,
 fbAdminID = '', /* Used as a CSS class name to show/hide public posts. Loren adds: Let's use fbFolder instead, and eliminate fbAdminID.*/
 fbToken,
 nextfeedurl = [],
 glbl_groupIDs = "",
 postcount = {},
 sort_by_date = true,
 create_ul = true,
 postsToRead = [],
 feedCount = 0,
 playloop;

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  this.splice(from, (to || from || 1) + (from < 0 ? this.length : 0));
  return this.length;
};

includeCSS('https://fonts.googleapis.com/icon?family=Material+Icons');

// To Do: Lazy Load. Also do in Sites folder.
loadScript('js/speech-input.js');

function includeCSS(url) {
    if (!document.getElementById(url.replace("/","-").replace(".","-"))) { // Prevents multiple loads.
        var link  = document.createElement('link');
        link.id   = url.replace("/","-").replace(".","-");
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.media = 'all';
        $(document).ready(function () { /* Not necessary if appending to head */
            var body  = document.getElementsByTagName('body')[0];
            body.appendChild(link);
        });
    }
}
function loadScript(url, callback)
{
    if (!document.getElementById(url)) { // Prevents multiple loads.

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.id = url; // Used to prevent multiple loads. Might be an alternate way to check if script tag existing using the src.
        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;
        //$(document).ready(function () { // Only needed if appending to body
            var head = document.getElementsByTagName('head')[0];
           head.appendChild(script);
        //});
    } else {
        console.log("Script already available. Callback NOT used ");
    }
}

// Alternate - requires popup for user to signin via Facebook to get their individual access token.  
function fbFetchAccess() {
    FB.login(function (response) {
        if (response.session) {

            FB.getLoginStatus(function (response) {
                //alert('FireFox response');
                if (response.session) {
                    //alert('connected');
                    //$('#connect_button').hide();
                    //$('#res_json').html('loading...');
                    fbToken = response.session.access_token;
                    fbFetch(response.session.access_token);
                }
            });

        } else {
            alert('Not logged into Facebook.  Unable to show latest news.');
        }
    });
}
function formatDateTicks(startDate,endDate) {
    var startdate = new Date(startDate);
    var enddate = new Date(endDate);
    return formatDate(startdate) + ' to ' + ' <span style="white-space:nowrap">' + showTheHours(enddate.getHours()) + ':' + showZeroFilled(enddate.getMinutes()) + ' ' + showAmPm(enddate) + '</span>';
}
function formatDate(startDate) {
    var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    var dateStr = days[startDate.getDay()];
    dateStr += ', ' + months[startDate.getMonth()] + ' ' + startDate.getDate() + ', ' + fourdigits(startDate.getYear());
    dateStr += ', <span style="white-space:nowrap">' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate) + '</span>';
    return dateStr;
}


function encode(unencoded) {
    return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
}
function decode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g,  " "));
}
function fbFetch(groupIDs) { 
    // Callback is set with a '?' to overcome the cross domain problems with JSON

    // You can also request multiple objects in a single query using the "ids" query parameter.
    // For example, the URL https://graph.facebook.com?ids=arjun,vernal returns both profiles in the same response.
    // since=today&
    // Switch from /posts to /feed to show everyone
    // https://graph.facebook.com/?&access_token=117370968285365|5XkqBE8fUp29ZaTRAMTmAAfCFvk&batch=[{"method":"GET","relative_url":"285182178269780/posts?limit=20"},{"method":"GET","relative_url":"GrantParkGPNA/posts?limit=20"},{"method":"GET","relative_url":"peoplestownneighborhoodassociation/posts/?limit=20"},{"method":"GET","relative_url":"Peoplestown/posts?limit=20"}]
    // to load more feeds
    if(groupIDs == null || typeof groupIDs == "undefined") {
        groupIDs = glbl_groupIDs;
    }
    glbl_groupIDs = groupIDs;
    var path = "https://graph.facebook.com/v2.9/?";
    groupIDs = groupIDs.split(",");
    var query = [path, "&access_token=", fbToken, "&batch="];
    var batch = [];
    var endpoint = includePublicFeed ? "feed" : "posts";
    var html = [];
    for(var i = 0; i < groupIDs.length; i++) {
        if (typeof postcount[groupIDs[i]] === "undefined") {
            postcount[groupIDs[i]] = i * 1000;
        }
        var fields = "fields=id,name,created_time,message,from,caption,description,story";
        var objs = {};
        objs.method = "GET";
        objs.relative_url = groupIDs[i] + "/" + endpoint + "?"  + fields;
        // objs.relative_url = groupIDs[i] + "/" + endpoint + "?"  + fields + "&limit=" + fbLimit;
        if (nextfeedurl.length > 0) {
            console.log(nextfeedurl);
            objs.relative_url = objs.relative_url + "%26until=" + nextfeedurl[i].until;
            // objs.until = nextfeedurl[i].until;
            // objs.__paging_token = nextfeedurl[i].__paging_token;
        }
        batch.push(objs);
        // html.push("<div id='", groupIDs[i], "'></div>");
    }
    
    query.push(JSON.stringify(batch));
    var url = query.join("");
    var showHeading = false;
    if ($('.newsfeed').is(':empty')){
        $('.newsfeed').append(html.join(""));
        showHeading = true;
    }

    
    // console.log(url);
    // $.post( url, function( data ) {
    //  console.log( data );
    // });
    // return;
    
    
    
    /*
    var url = '';
    if (nextfeedurl.length == 0) {
        // url = "https://graph.facebook.com/" + fbFolder + "/" + endpoint + "?access_token=" + fbToken + "&limit=" + fbLimit + "&callback=?";
        
        url = "https://graph.facebook.com/posts?ids=" + groupIDs + "&access_token=" + fbToken+ "&callback=?";
    
        // Attempt to load posts from multiple groups:
        //url = "https://graph.facebook.com/posts?ids=" + groupIDs + "&access_token=" + fbToken + "&limit=" + fbLimit + "&callback=?";

    } else {
        url = [];
        url = nextfeedurl + "&callback=?";
    }
    */
    
    if (typeof (console) != 'undefined' && typeof (console.log) != 'undefined') {
        console.log('Facebook feed query:', url);
    }
    
    //Use jQuery getJSON method to fetch the data from the url and then create our unordered list with the relevant data.
    $.post(url, function (json) {
    //$.get("http://localhost/testjsonfull.json", function (json) {
        
        // console.log(json);
        
        var html = "";
        if(create_ul) {
            html += "<ul class='fb_posts'>";
        }
        $.each(json, function(j, data) {
            var body = JSON.parse(data.body);
            console.log(body);
            if (data.code !== 200) {
                
                console.error('Facebook returned an error: ', body.error.message);
                return;
            }
            
            
            if (showHeading && body.data.length > 0) {
                // BUGBUG Error, name no longer available
                //html += "<li data-id='"+(postcount[groupIDs[j]]++)+"' class='btn-green group-name' style='display:none'>" + body.data[0].from.name  + "</li>";
            }
            
            
            var commentCount = 0;

            // These aren't working...
            if (!showComments) {
                // Wrap newsText under thumbnail.  Allows for irregualar thumbnail widths, which look odd when comments don't separate.
                $('.newsText').attr('style', 'overflow: visible;');
            }
            if (showComments) {
                $('.newsText').attr('style', 'overflow:hidden;');
            }
            
            if(typeof body.paging != 'undefined' && typeof body.paging.next != 'undefined') {
                //alert(body.paging.next);
                var result = new URI.parseQuery(body.paging.next);
                // console.log("result", result);
                var params = {
                        
                        "until" : result.until,
                        "__paging_token" : result.__paging_token
                    };
                    // console.log("params", params);
                nextfeedurl.push(params);
            }
            
            var skipfirstrow = false;
            if(!showHeading) {
                skipfirstrow = true;
            }
            $.each(body.data, function (i, fb) {
                // console.log(postcount[groupIDs[j]]);
                // console.log('i=> ' + i)
                // console.log('fb=> ' + JSON.stringify(fb))
                if(skipfirstrow) { // quick fix of showing last record as first record on new request.
                    // console.log("will return");
                    skipfirstrow = false;
                    return;
                }
                
                //var postToRead = [];
                //console.log(fb);
                //console.log(fb.story);
                var story = "";
                if (typeof fb.story !== "undefined") {
                    story = fb.story;
                } else {
                    
                    if(fb.status_type === "shared_story") {
                        
                        if ($.inArray(fb.type, ["link", "status", "photo", "video", "offer"]) > -1) {
                            story = fb.from.name + " shared" + fb.name +"'s "+ fb.type;
                            
                        }
                    }
                    
                    if (fb.status_type === "added_photos") {
                        if(fb.type === "photo") {
                            story = fb.from.name + " posted";
                        }
                        
                    }
                    
                    if (fb.status_type === "mobile_status_update") {
                        if(fb.type === "status") {
                            story = fb.from.name + " updated his mobile status";
                        }
                    }
                    
                    
                    
                    console.log("CUSTOM STORY -", story);
                    

                }
                story += ", " + (moment(fb.created_time).fromNow());
                // console.log(story);
                // postToRead.push(postToRead);
                
                
                
                var splitID = [];
                var data_id = postcount[groupIDs[j]]++;
                
                // BUGBUG
                //html += "<li data-id='"+data_id+"' data-date='"+new Date(formatFBTime(fb.created_time)).getTime()+"' class='linked fbRow fbRowCollapsed fbRowHover " + fb.from.id + "'" + (!includePublicFeed && fbAdminID != '' && fb.from.id != fbAdminID  ? "style='display: none;'" : "") + ">";

                html += "<div class='fbClose fbExpanded' style='float:right'><div class='numberCircle' style='float:left'><div>-</div></div></div>";

                html += "<div class='fbOpen fbCondensed' style='float:right'><div class='numberCircle' style='float:left'><div>+</div></div></div>";
                
                if (fb.picture) {

                    html += "<a href='" + fb.link + "' target='_blank'><img class='newsImage newsImageSm fbCondensed' src='" + fb.picture + "' alt='' /></a>";

                    html += "<a href='" + fb.link + "' target='_blank'><img class='newsImage fbExpanded' src='" + fb.picture + "' alt='' /></a>";
                }

                html += "<div class='newsText'>";
                
                if (fb.name) {
                    fbname = fb.name;
                    if (fb.name.indexOf(" ") == -1 && fb.name.length > 40) {
                        if (fb.name.length < 80)
                        {
                            fbname = fb.name.substring(0,40) + '<br>' + fb.name.substring(41);
                            
                        } else {
                            fbname = '';
                        }
                    }
                    if (fbname.length > 0) {
                        if (fb.link) {
                            html += "<div class='newsfeedTitle'><a href='" + fb.link + "' target='_blank'>" + fbname + "</a></div>";
                        } else if (fb.from) {
                            html += "<div class='newsfeedTitle'><a href='https://www.facebook.com/" + fb.from.id + "' target='_blank'>" + fbname + "</a></div>";
                        }
                    }
                } else if (fb.message) {
                    html += "<!-- message as title -->";
                    if (fb.link) {
                        html += "<div class='newsfeedTitle'><a href='" + fb.link + "' target='_blank'>" + fb.message.substr(0,50) + "</a></div>";
                    } else {
                        html += "<div class='newsfeedTitle'>" + fb.message.substr(0,50) + "</div>";
                    }
                }
                
                if (fb.message) {
                    html += "<div class='newsfeedMessage'>" + fb.message.substr(0,350);
                    story += " Message : " + fb.message;
                    if (fb.message.length > 351) {
                        html += " <strong>more...</strong>";
                    }
                    html += "</div>";
                }
                
                if (fb.description || fb.caption || fb.story ) {
                    
                     if (fb.type == 'event') {
                        console.log("fb.story" + fb.story);
                        ev_id_array = fb.link.split('/')
                        ev_id = ev_id_array[ev_id_array.length - 2]
                        
                        
                        var ev_url = 'https://graph.facebook.com/' + ev_id + '?method=GET&format=json&suppress_http_code=1&access_token=' + fbToken;
                        
                        $.getJSON(ev_url, function(ev_json) {
                            html += "<div class='newsfeedTitle'><a href='" + fb.link + "' target='_blank'>" + ev_json.name + "</a></div>";
                            if (ev_json.location) {
                                html += '<b>Where:</b> ' + ev_json.location + '<br>';
                            }
                            html += '<b>When:</b> ' + formatDateTicks(ev_json.start_time, ev_json.end_time) + '<br>';
                            
                            console.log('Event Title : ' + ev_json.name)
                        });
                        
                    }
                    if (fb.caption && fb.caption.length > 250) {
                        html += "<div class='newsfeedDesc'>";
                    } else {
                        html += "<div class='newsfeedDesc' style='overflow:hidden'>";
                    }
                    if (fb.caption) {
                        html += fb.caption.substr(0,500);
                        story += " Caption : " + fb.caption;
                    }
                    if (fb.description) {
                        if (fb.caption) {
                            html += " - ";
                        }
                        html += fb.description.replace(fb.name, "").substr(0,500);
                        story += "Description : " + fb.description;
                    } else if (fb.story) {
                        
                        if (fb.caption) {
                            html += " - ";
                        }
                        
                        html += fb.story.replace(fb.name, "").substr(0,500);
                    } 
                   
                    html += "</div>";
                }
                if (fb.created_time) {
                    var startDate = new Date(formatFBTime(fb.created_time));
                    var startDateString = formatDate(startDate);
                    // BUGBUG var author = " by <a href='https://www.facebook.com/" + fb.from.id + "' target='_blank'>" + fb.from.name + "</a>";
                    var author = ""
                    html += '<div class="postDate ">Posted ' + startDateString + author + '</div>';
                }

                // console.log(story);
                
                postsToRead.push({
                    "id" : data_id,
                    "date" : new Date(formatFBTime(fb.created_time)).getTime(),
                    "story" : story
                });
                // Comments
                // Only summary of comments is displayed, just like facebook default, only 2 available unless you "read more" or "view all"... 
                // the graph call for "view all comments" is get the post ID of that post and append "/comment"...
                // example:
                // FEED: https://graph.facebook.com/161439580553446/feed
                // A POST FROM THE FEED: https://graph.facebook.com/161439580553446_177522428945161
                // VIEW ALL COMMENTS: https://graph.facebook.com/161439580553446_177522428945161/comments

                

                // COMMENTS
                if (showComments) {
                    if (fb.comments) {
                        //commentCount = 0;
                        html += "<div class='comments'>";
                        if (fb.comments) {
                            if(fb.comments.data.length > 3) {
                                html += "<a class='addComment commentIcon' href='https://www.facebook.com/" + fb.from.id + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>View all " + fb.comments.data.length + " comments / Add comment</a><br>";
                            } else {
                                html += "<a class='addComment commentIcon' href='https://www.facebook.com/" + fb.from.id + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>Add comment</a> | <a class='addComment' href='https://www.facebook.com/" + fb.from.id + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>View details</a><br>";
                            }
                        }
                        
                        // html += "</div>"; // end .newsText
                        html += '<div style="clear:both"></div>';
                        
                        fb.comments.data.sort(sortDates);
                        
                        $.each(fb.comments.data, function (j, data) {

                            // if (i == "data") {
                                // $.each(theComments, function (j, data) {
                                    
                                    
                                    data.message = data.message.replace(new RegExp("\\n", "g"),"<br>");

                                    var URLregex = new RegExp();
                                    URLregex.compile("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g");
                                     
                                    data.message = data.message.replace(URLregex, ' <a href="$2" target="_blank">view link</a> ');

                                    //var DOMAINregex = new RegExp();
                                    //DOMAINregex.compile(">https?://(?:www\.)?([^/]+)","g");
                                    //data.message = data.message.replace(DOMAINregex, '>Visit link on $1');

                                    html += "<div data-date='" + data.created_time + "' class='comment" + ((commentQuantity <= j ) ? " fbExpanded" : "") + "' ><img class='commentImage' src='https://graph.facebook.com/" + data.from.id + "/picture' alt='' />";
                                    html += data.message + "<br>";
                                    if (data.created_time) {
                                        var startDate = new Date(formatFBTime(data.created_time));
                                        //var startDateString = days[startDate.getDay()] + ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
                                        html += '<span class="commentDate">Posted ' + formatDate(startDate) + '</span><br>';
                                    }

                                    html += "</div><div style='clear:both'></div>";
                                // });
                            // }
                            
                        });
                        html += "</div>";
                        html += "</div>";
                        commentCount = 0;
                    } else {
                        html += "</div>"; // end .newsText
                        html += '<div style="clear:both"></div>';
                        // BUGBUG
                        //html += "<a class='addComment' href='https://www.facebook.com/" + fb.from.id + "/posts/" + fb.id.split("_")[1] + "' target='_blank'>Add comment</a><br>";
                    }
                }

                html += "<div style='clear:both'></div></li>";
            });
            
        
        }); // end getJSON
        if(create_ul) {
            html += "</ul>";
            $('.newsfeed').append(html);
            create_ul = false;
        } else {
            $('.fb_posts').append(html);
        }
        
            
        
        // $("#" + groupIDs[j]).append(html);
        
        if (sort_by_date) {
            $(".fb_posts li").sort(sortByDate) // sort elements
                  .appendTo('.fb_posts'); // append again to the list
        } else {
            $(".fb_posts li").sort(sortByGrp) // sort elements
                  .appendTo('.fb_posts'); // append again to the list
        }
        
        
        

        if (typeof (processFacebookPosts) == "function") {
            processFacebookPosts($('.newsfeed')); // optional - perform any custom processing such as analytics tracking
        }

        if (fbShowControls && fbAdminID != '') {
            if ($("li", $(".newsfeed")).not("." + fbAdminID).length > 0) {
                // found public posts in feed results
                if (includePublicFeed) {
                    $('.fbShowPublicPosts').hide();
                    $('.fbHidePublicPosts').show();
                }
                else {
                    $('.fbShowPublicPosts').show();
                    $('.fbHidePublicPosts').hide();
                }
            }
        }
        feedCount = postsToRead.length;
        console.log("feedCount", feedCount);
    });

} // end fbFetch

// sort function callback
function sortByDate(a, b){
    return ($(b).data('date')) - ($(a).data('date'));    
}
function sortByGrp(a, b){
    return ($(b).data('id')) < ($(a).data('id')) ? 1 : -1;    
}



function fbInit() {

    var html = [];
    var i = 0;
    var fb_includePublicFeed = "false";
    var $newsfeed = $('.newsfeed');

    if (fbShowControls) {

        fb_includePublicFeed = BrowserUtil.getCookie('fb_includePublicFeed');
        if (typeof fb_includePublicFeed != "undefined" && fb_includePublicFeed != "") {
            if (includePublicFeed === false) { // set to false, delete the cookie if found
                BrowserUtil.deleteCookie('fb_includePublicFeed');
            }
            else {
                // use cookie value to override the current value (true or undefined)
                includePublicFeed = fb_includePublicFeed == "true" ? true : false;
            }
        }

        html[i++] = "<div class='newsfeedControls'>";
        // BUGBUG Todo: Fix:
        //html[i++] = "<div id='loadMoreFbFeeds' class='button button-grey button-sm' style='margin:10px 0px 0px 0px'>More Posts</div>"; // Todo: adjust 10 More - may not always be 10
        
        // Hide buttons until the feed is loaded
        html[i++] = "<div class='fbShowPublicPosts button button-grey button-sm' style='display:none; float:left; margin:10px 10px 0px 0px'>Show Public Posts</div>";
        html[i++] = "<div class='fbHidePublicPosts button button-grey button-sm' style='display:none; float:left; margin:10px 10px 0px 0px'>Hide Public Posts</div>";
        html[i++] = "</div><div style='clear:both;margin-bottom:18px'></div>"; // end newsfeedControls

        $newsfeed.after(html.join(''));

        $("#loadMoreFbFeeds").click(function () {
            fbLimit = 10; // Corresponds to the "10 More" button
            fbOffset = fbLimit + fbOffset;
            fbFetch();
        });
        $(".fbShowPublicPosts").click(function () {
            includePublicFeed = true;
            BrowserUtil.setCookie('fb_includePublicFeed', true, 3650);
            $("li", $newsfeed).not("." + fbAdminID).show();
            $(".fbShowPublicPosts").hide();
            $(".fbHidePublicPosts").show();
        });
        $(".fbHidePublicPosts").click(function () {
            includePublicFeed = false;
            BrowserUtil.setCookie('fb_includePublicFeed', false, 3650);
            $("li", $newsfeed).not("." + fbAdminID).hide();
            $(".fbHidePublicPosts").hide();
            $(".fbShowPublicPosts").show();
        });

    }

    if (typeof(includePublicFeed) == 'undefined') {  // Not intialized
        includePublicFeed = false;
    }
    
    

} // end fbInit

function formatFBTime(fbDate) {
    // For Explorer 8 and Firefox 3
    var arrDateTime = fbDate.split("T");
    var arrDateCode = arrDateTime[0].split("-");
    var strTimeCode = arrDateTime[1].substring(0, arrDateTime[1].indexOf("+"));
    var arrTimeCode = strTimeCode.split(":");
    var valid_date = new Date()
    valid_date.setUTCFullYear(arrDateCode[0]);
    valid_date.setUTCMonth(arrDateCode[1] - 1);
    valid_date.setUTCDate(arrDateCode[2]);
    valid_date.setUTCHours(arrTimeCode[0]);
    valid_date.setUTCMinutes(arrTimeCode[1]);
    valid_date.setUTCSeconds(arrTimeCode[2]);
    return valid_date;
}


function formatFBTimestamp(unix_tm) {
    // For Explorer 8 and Firefox 3
    var dt = new Date(unix_tm*1000);
    
    var valid_date = new Date()
    valid_date.setUTCFullYear(dt.getFullYear());
    valid_date.setUTCMonth(dt.getMonth());
    valid_date.setUTCDate(dt.getDate());
    valid_date.setUTCHours(dt.getHours());
    valid_date.setUTCMinutes(dt.getMinutes());
    valid_date.setUTCSeconds(dt.getSeconds());
    return valid_date;
}
function fourdigits(number) {
    return (number < 1000) ? number + 1900 : number;
}
function showTheHours(theHour) {
    if (theHour > 0 && theHour < 13) {
        if (theHour == "0") theHour = 12;
        return (theHour);
    }
    if (theHour == 0) {
        return (12);
    }
    return (theHour - 12);
}
function showZeroFilled(inValue) {
    if (inValue > 9) {
        return "" + inValue;
    }
    return "0" + inValue;
}
function showAmPm(inDate) {
    if (inDate.getHours() < 12) {
        return (" am");
    }
    return (" pm");
}





function playCurrentPost()
{
    window.speechSynthesis.cancel();
    var postIndex = 0;
    if (sort_by_date) {
        postIndex = lastfeedReadByDateIndex;
    } else {
        postIndex = lastfeedReadByGrpIndex;
    }
    console.log(feedCount, postIndex + 1, postsToRead);
    if (postIndex + 1 < feedCount) {
        var txt = postsToRead[postIndex].story;
        var arr = [];
        while (txt.length > 0) {
            arr.push(txt.match(pattRegex)[0]);
            txt = txt.substring(arr[arr.length - 1].length);
        }
        $.each(arr, function () {
            console.log(this);
            var u = new SpeechSynthesisUtterance(this.trim());
            u.voice = voice;
            window.speechSynthesis.speak(u);
        });
    }
    
    
    playloop = setInterval(function() {
        if (!window.speechSynthesis.speaking) {
            if (sort_by_date) {
                lastfeedReadByDateIndex++;
            } else {
                lastfeedReadByGrpIndex++;
            }
            playCurrentPost();
        }
    }, 3000);
    
    
}

$(document).ready(function () {
    
    

    // TO DO: Limit .fbOpen and .fbClose to current item, change icon.
    $(document).on('click', '.fbDetails, .fbOpen', function (e) {
        $('.fbExpanded').show();
        $('.newsfeedMessage').show();
        $('.newsfeedDesc').show();
        $('.fbCondensed').hide();
        $('.fbRow.fbRowCollapsed').toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
        $('.fbDetails').hide();
        $('.fbShrink').show();
        e.preventDefault();
    });
    $(document).on('click', '.fbShrink, .fbClose', function (e) {
        $('.fbExpanded').hide();
        $('.newsfeedMessage').hide();
        $('.newsfeedDesc').hide();
        $('.fbCondensed').show();
        $('.fbRow.fbRowCollapsed').toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
        $('.fbShrink').hide();
        $('.fbDetails').show();
        e.preventDefault();
    });
    
    $(document).on('click', '.fbSrtByGroup', function(e) {
        $(this).hide();
        $(".fbSrtByDate").show();
        $(".fb_posts li").sort(sortByGrp) // sort elements
                  .appendTo('.fb_posts'); // append again to the list
        $(".group-name").show();
        
        if (lastfeedReadByGrpIndex < feedCount) {
            $('.skipNext').show();
        } else {
            $('.skipNext').hide();
        }
        
        if (lastfeedReadByGrpIndex > 0) {
            $('.skipPrevious').show();
        } else {
            $('.skipPrevious').hide();
        }
        
        
        // sort play list by group
        postsToRead.sort(function(a, b) {
            return b.id < a.id ? 1 : -1;
        });
        
        
        
        sort_by_date = false;
        
        e.preventDefault();
    });
    $(document).on('click', '.fbSrtByDate', function(e) {
        $(this).hide();
        $(".fbSrtByGroup").show();
        $(".fb_posts li").sort(sortByDate) // sort elements
                  .appendTo('.fb_posts'); // append again to the list
        $(".group-name").hide();
        
        if (lastfeedReadByDateIndex < feedCount) {
            $('.skipNext').show();
        } else {
            $('.skipNext').hide();
        }
        
        if (lastfeedReadByDateIndex > 0) {
            $('.skipPrevious').show();
        } else {
            $('.skipPrevious').hide();
        }
        
        // sort play list by date
        postsToRead.sort(function(a, b) {
            return b.id < a.id ? 1 : -1;
        });
        sort_by_date = true;
        
        e.preventDefault();
    });

    $('.newsfeed').click(function (event) {


        if (event.isDefaultPrevented()) {
            return false; // click hander called again due to event bubbling. If already handled, just return.
        }

        var $eventTarget = $(event.target);

        if ($eventTarget.is("a")) {
            return true; // follow the url
        }

        var $parent = $eventTarget.closest('.fbRow');
        if ($parent.length > 0) {
            
            if (!$parent.hasClass('fbRowCollapsed')) {
                $('.fbExpanded', $parent).hide();
                $('.fbCondensed', $parent).show();
                $parent.toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from expanded to collapsed
                $parent.addClass('fbRowHover');
            } else {
                $('.fbExpanded', $parent).show();
                $('.fbCondensed', $parent).hide();
                $parent.toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
                $parent.removeClass('fbRowHover');
            }
            event.preventDefault();
        }
    });
});

function goPage(page,e) {
    window.location=page;
    e.preventDefault();
}


function sortDates(a, b)
{
    return new Date(formatFBTime(b.created_time)).getTime() - new Date(formatFBTime(a.created_time)).getTime();
}

/*!
 * JavaScript Cookie v2.1.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();
        api.noConflict = function () {
            window.Cookies = OldCookies;
            return api;
        };
    }
}(function () {
    function extend () {
        var i = 0;
        var result = {};
        for (; i < arguments.length; i++) {
            var attributes = arguments[ i ];
            for (var key in attributes) {
                result[key] = attributes[key];
            }
        }
        return result;
    }

    function init (converter) {
        function api (key, value, attributes) {
            var result;
            if (typeof document === 'undefined') {
                return;
            }

            // Write

            if (arguments.length > 1) {
                attributes = extend({
                    path: '/'
                }, api.defaults, attributes);

                if (typeof attributes.expires === 'number') {
                    var expires = new Date();
                    expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
                    attributes.expires = expires;
                }

                try {
                    result = JSON.stringify(value);
                    if (/^[\{\[]/.test(result)) {
                        value = result;
                    }
                } catch (e) {}

                if (!converter.write) {
                    value = encodeURIComponent(String(value))
                        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
                } else {
                    value = converter.write(value, key);
                }

                key = encodeURIComponent(String(key));
                key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
                key = key.replace(/[\(\)]/g, escape);

                return (document.cookie = [
                    key, '=', value,
                    attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
                    attributes.path    && '; path=' + attributes.path,
                    attributes.domain  && '; domain=' + attributes.domain,
                    attributes.secure ? '; secure' : ''
                ].join(''));
            }

            // Read

            if (!key) {
                result = {};
            }

            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all. Also prevents odd result when
            // calling "get()"
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var rdecode = /(%[0-9A-Z]{2})+/g;
            var i = 0;

            for (; i < cookies.length; i++) {
                var parts = cookies[i].split('=');
                var name = parts[0].replace(rdecode, decodeURIComponent);
                var cookie = parts.slice(1).join('=');

                if (cookie.charAt(0) === '"') {
                    cookie = cookie.slice(1, -1);
                }

                try {
                    cookie = converter.read ?
                        converter.read(cookie, name) : converter(cookie, name) ||
                        cookie.replace(rdecode, decodeURIComponent);

                    if (this.json) {
                        try {
                            cookie = JSON.parse(cookie);
                        } catch (e) {}
                    }

                    if (key === name) {
                        result = cookie;
                        break;
                    }

                    if (!key) {
                        result[name] = cookie;
                    }
                } catch (e) {}
            }

            return result;
        }

        api.set = api;
        api.get = function (key) {
            return api(key);
        };
        api.getJSON = function () {
            return api.apply({
                json: true
            }, [].slice.call(arguments));
        };
        api.defaults = {};

        api.remove = function (key, attributes) {
            api(key, '', extend(attributes, {
                expires: -1
            }));
        };

        api.withConverter = init;

        return api;
    }

    return init(function () {});
}));
/* End jQuery Cookie Plugin */
