let playlist = {
	acousticness: { mean: 0, stdev: 0},
	danceability: { mean: 0, stdev: 0},
	energy: { mean: 0, stdev: 0},
	loudness: { mean: 0, stdev: 0},
	speechiness: { mean: 0, stdev: 0},
	valence: { mean: 0, stdev: 0},
	tempo: { mean: 0, stdev: 0},
	playlist_id: undefined,
	count: 0,
	tracks: undefined
};

console.log(playlist.acousticness.variance);

playlist.compile = function() {
	//access https://api.spotify.com/v1/playlists/{playlist_id}/tracks and iterate through tracks
	for(track in tracks){
		playlist.acousticness.mean += track.acousticness;
		playlist.danceability.mean += track.danceability;
		playlist.energy.mean += track.energy;
		playlist.loudness.mean += track.loudness;
		playlist.speechiness.mean += track.speechiness;
		playlist.valence.mean += track.valence;
		playlist.tempo.mean += track.tempo;
		playlist.count++;
	}
	playlist.acousticness.mean /= count;
	playlist.danceability.mean /= count;
	playlist.energy.mean /= count;
	playlist.loudness.mean /= count;
	playlist.speechiness.mean /= count;
	playlist.valence.mean /= count;
	playlist.tempo.mean /= count;
	for(track in tracks){
		playlist.acousticness.stdev += (track.acousticness - playlist.acousticness.mean)^2;
		playlist.danceability.stdev += (track.danceability - playlist.danceability.mean)^2;
		playlist.energy.stdev += (track.energy - playlist.energy.mean)^2;
		playlist.loudness.stdev += (track.loudness - playlist.loudness.mean)^2;
		playlist.speechiness.stdev += (track.speechiness - playlist.speechiness.mean)^2;
		playlist.valence.stdev += (track.valence - playlist.valence.mean)^2;
		playlist.tempo.stdev += (track.tempo - playlist.tempo.mean)^2;
	}
	playlist.acousticness.stdev = Math.sqrt(playlist.acousticness.stdev / (count - 1));
	playlist.danceability.stdev = Math.sqrt(playlist.danceability.stdev / (count - 1));
	playlist.energy.stdev = Math.sqrt(playlist.energy.stdev / (count - 1));
	playlist.loudness.stdev = Math.sqrt(playlist.loudness.stdev / (count - 1));
	playlist.speechiness.stdev = Math.sqrt(playlist.speechiness.stdev / (count - 1));
	playlist.valence.stdev = Math.sqrt(playlist.valence.stdev / (count - 1));
	playlist.tempo.stdev = Math.sqrt(playlist.tempo.stdev / (count - 1));
}//compile the playlists information

playlist.remove = function(track){ //probably need to fix this
	if (playlist.tracks[track.id] != null){
		playlist.tracks.remove(track.id)
	}
}//remove

//filter_threshold runs from 0 to 1, 0 is not strict and 1 is strict
playlist.filter = function(filter_threshold) {	
	playlist.compile();
	playlist.filtered_uris = ""
	//based off filter, remove tracks that are bad
	for(track in tracks){
		if (Math.abs(playlist.acousticness.mean - track.acousticness)/playlist.acousticness.variance < filter_threshold)
			|| (Math.abs(playlist.danceability.mean - track.danceability)/playlist.danceability.variance < filter_threshold)
			|| (Math.abs(playlist.energy.mean - track.energy)/playlist.energy.variance < filter_threshold)
			|| (Math.abs(playlist.loudness.mean - track.loudness)/playlist.loudness.variance < filter_threshold)
			|| (Math.abs(playlist.speechiness.mean - track.danceability)/playlist.speechiness.variance < filter_threshold)
			|| (Math.abs(playlist.valence.mean - track.valence)/playlist.valence.variance < filter_threshold)
			|| (Math.abs(playlist.tempo.mean - track.tempo)/playlist.tempo.variance < filter_threshold){
			playlist.filtered_uris += track.uri + ",";
		}
	}
	playlist.filtered_uris 
}//filter

playlist.generateFilteredPlaylist = function(){
	// to POST https://api.spotify.com/v1/users/{user_id}/playlists
	//request body
	{
  		"name": "CURRENT PLAYLIST NAME [Vibe Checked]",
  		"description": "New playlist description",
  		"public": false
	}

	//from new playlist, add in songs that passed through filter:
	// POST https://api.spotify.com/v1/playlists/{playlist_id}/tracks
	{
		"uris": "spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M"
	}


}


console.log(playlist.acousticness.variance);

function log_message(msg){
	console.log("Log: " + msg)
}

log_message("Wassup")


/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");
