let playlist = {
	acousticness: { mean: 0, variance: 0},
	danceability: { mean: 0, variance: 0},
	energy: { mean: 0, variance: 0},
	loudness: { mean: 0, variance: 0},
	speechiness: { mean: 0, variance: 0},
	valence: { mean: 0, variance: 0},
	tempo: { mean: 0, variance: 0},
	playlist_id: undefined,
	count: 0
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
		playlist.acousticness.variance += (track.acousticness - playlist.acousticness.mean)^2;
		playlist.danceability.variance += (track.danceability - playlist.danceability.mean)^2;
		playlist.energy.variance += (track.energy - playlist.energy.mean)^2;
		playlist.loudness.variance += (track.loudness - playlist.loudness.mean)^2;
		playlist.speechiness.variance += (track.speechiness - playlist.speechiness.mean)^2;
		playlist.valence.variance += (track.valence - playlist.valence.mean)^2;
		playlist.tempo.variance += (track.tempo - playlist.tempo.mean)^2;
	}

}

playlist.compile()

console.log(playlist.acousticness.variance);

function getPlaylist(playlist_id){
	return new pl
}

function log_message(msg){
	console.log("Log: " + msg)
}

log_message("Wassup")


/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");
