# Georgia State Parks - Facebook Audio

We're extending a Facebook feed reader app developed for Georgia State Parks.  The goal is to create an audio interface that is pleasent for hikers, walkers and runners to use while outdoors. The audio should be minimal, with overviews of titles and an easy means to request details.  

[Try it out](https://audioscape.github.io/audio/play)  



## Set Up Notes:
Set the fbAdminID variable to the admin actor_id for the site. This allows the code to know which posts are public posts and which are admin posts. To get the actor_id, do the following:

1. As an admin, Go to Settings > Page Info (and scroll to the bottom). Get the "Facebook Page ID"
2. Or View Source and search for actor_id. (Need to confirm when this is possible.)
3. Or use the facebook query url in a new browser tab. Look for actor_id in the results.

You may also need to add a folder name.  

## Feed Config:

1. Set includePublicFeed and fbShowControls to false in the page script to ensure no public feeds will be included.
2. Ensure fbInit() and fbFetch() are called and reload the page.
3. Restore/Remove includePublicFeed and fbShowControls based on the site preferences.