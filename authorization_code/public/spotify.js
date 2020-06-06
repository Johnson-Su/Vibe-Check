(function() {

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

// var userProfileSource = document.getElementById('user-profile-template').innerHTML,
//     userProfileTemplate = Handlebars.compile(userProfileSource),
//     userProfilePlaceholder = document.getElementById('user-profile');


var params = getHashParams();

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    test = params.test,
    error = params.error;

if (error) {
    alert('There was an error during the authentication');
} else {
    if (access_token) {
    // render oauth info
    // oauthPlaceholder.innerHTML = oauthTemplate({
    //   access_token: access_token,
    //   refresh_token: refresh_token
    // });

    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);

            $('#login').hide();
            $('#loggedin').show();
        }
    });

    $.ajax({
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(playlists) {
            //document.getElementById("playlist-name").innerHTML = playlists.items[0].name;
            console.log(playlists);
            var array_size = playlists.length;
            console.log("array size" + array_size);
            var playlist_url = playlists.items[0].href;
            $.ajax({
                url: playlist_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },

                success: function(playlist) {
                    console.log("playlist: " + playlist.name);
                    let playlist_data = {
                        acousticness: { mean: 0, stdev: 0 },
                        danceability: { mean: 0, stdev: 0 },
                        energy: { mean: 0, stdev: 0 },
                        loudness: { mean: 0, stdev: 0 },
                        speechiness: { mean: 0, stdev: 0 },
                        valence: { mean: 0, stdev: 0 },
                        tempo: { mean: 0, stdev: 0 },
                        playlist_id: undefined,
                        count: 0,
                        track_data: new Array(),
                        filtered_uris: ""
                    };

                    Object.assign(playlist, playlist_data)
                    
                    //populate track_data once so we don't make a million API calls
                    playlist.tracks.items.forEach(function(playlist_track){
                        console.log(playlist_track.track.name);

                        $.ajax({
                            url: 'https://api.spotify.com/v1/tracks/' + playlist_track.track.id,
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function(track) {
<<<<<<< HEAD
                                // given a track object, return the uri and audio features

                                $.ajax({
                                    url: 'https://api.spotify.com/v1/audio-features/' + track.id,
                                    headers: {
                                        'Authorization': 'Bearer ' + access_token
                                    },
                                    success: function(audio_features) {
                                        // given a track object, return the uri and audio features                                        
                                        playlist.track_data.push(audio_features);
                                        console.log(audio_features);
                                    }
                                },)
=======
                                // console.log(track.danceability);
>>>>>>> 43db13af082a4c0675cc186bc21c18d6a309a749

                            }
                        },)

                    });

                    //define some nice functions
                    playlist.compile = function() {
                        //access https://api.spotify.com/v1/playlists/{playlist_id}/tracks and iterate through tracks
                        let count = track_data.length;

                        for(track in track_data){
                            playlist.acousticness.mean += track.acousticness;
                            playlist.danceability.mean += track.danceability;
                            playlist.energy.mean += track.energy;
                            playlist.loudness.mean += track.loudness;
                            playlist.speechiness.mean += track.speechiness;
                            playlist.valence.mean += track.valence;
                            playlist.tempo.mean += track.tempo;
                        }

                        playlist.acousticness.mean /= count;
                        playlist.danceability.mean /= count;
                        playlist.energy.mean /= count;
                        playlist.loudness.mean /= count;
                        playlist.speechiness.mean /= count;
                        playlist.valence.mean /= count;
                        playlist.tempo.mean /= count;

                        for(track in track_data){
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

                    //filter_threshold runs from 0 to 1, 0 is not strict and 1 is strict
                    playlist.filter = function(filter_threshold) {  
                        playlist.compile();
                        playlist.filtered_uris = ""
                        //based off filter, remove tracks that are bad
                        for(track in track_data){
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
                        $.ajax({
                            url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function(audio_features) {
                                // given a track object, return the uri and audio features                                        
                                playlist.track_data.push(audio_features);
                                console.log(audio_features.liveness);
                            }
                        },)
                        
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
                }
            },)




            $('#login').hide();
            $('#loggedin').show();
        }
    });


    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }


}
})();
