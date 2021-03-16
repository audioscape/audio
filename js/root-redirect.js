if (location.host.indexOf('earthpoints') >= 0) {
	window.location="/api";
} else if (location.host.indexOf('hyperloop2.com') >= 0) {
	window.location="http://jump.technology";
} else if (location.host.indexOf('jump.technology') >= 0) {
	window.location="/wing/home";
} else if (location.host.indexOf('memorystone') >= 0) {
	window.location="/memorystone";
} else if (location.host.indexOf('catchsail.com') >= 0) {
	window.location="/memorystone/summer";
} else if (location.host.indexOf('plasma') >= 0) {
	window.location="/kickstarter/elements"; // Periodic table
} else if (location.host.indexOf('recyclingisland.com') >= 0) {
	window.location="/projects/recycling-island/";
} else if (location.host.indexOf('mygeorgia') >= 0) {
	window.location="http://exploregeorgia.org";
} else if (location.host.indexOf('eon.tech') >= 0) {
	window.location="/projects";
} else if (location.host.indexOf('marta') >= 0 || location.host.indexOf('martapoints') >= 0 || location.host.indexOf('atlantapoints.com') >= 0) {
	window.location="/explore/";
} else {
	window.location="/audioscape/";
}