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
    error = params.error;

var user_id;

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
            //userProfilePlaceholder.innerHTML = userProfileTemplate(response);
            user_id = response.id;
            console.log('User ID: ' + user_id);
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
            console.log("Reached Playlists")
            console.log(playlists);

    // ************* vibe check stuff ***************
            // set playlist names to cassettes
            for(index = 0; index < 6; index++){
                document.getElementById("playlist" + (index + 1)).innerHTML = playlists.items[index].name;

            }
            
                
                var all_playlists = document.getElementsByClassName("playlist");
                console.log(all_playlists.length)

                for(j = 0; j < all_playlists.length; j++){
                    playlist_id = all_playlists[j].id;
                    document.getElementById(all_playlists[j].id).addEventListener('click', 
                        function(){
                            checkPlaylist(playlist_id)
                        });
                }
                    
                
                function checkPlaylist(playlist_id){
                    // console.log(playlist_number);
                    $.ajax({
                        url: playlists.items[playlist_id[playlist_id.length - 1]].href,
                        headers: {
                            'Authorization': 'Bearer ' + access_token
                        },
                        success: function(playlist) {
                            console.log("playlist: " + playlist.name);
                            playlist.tracks.items.forEach(function(track){
                                // console.log(track.track.name);

                                // $.ajax({
                                //     url: 'https://api.spotify.com/v1/audio-features/' + track.track.id,
                                //     headers: {
                                //         'Authorization': 'Bearer ' + access_token
                                //     },
                                //     success: function(track) {
                                //         // console.log(track);

                                //     }
                                // },)

                            });
                        }
                    },) 
                }
        // ********** vibe check stuff ************

            
            var array_size = playlists.items.length;
            console.log("Number of Playlists: " + array_size);
            console.log("Try getting first playlist")
            var playlist_url = playlists.items[0].href;

            $.ajax({
                url: playlist_url,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(playlist) {
                    console.log("playlist: " + playlist.name);
                    var playlist_data = {
                        acousticness: { mean: 0, stdev: 0 },
                        danceability: { mean: 0, stdev: 0 },
                        energy: { mean: 0, stdev: 0 },
                        loudness: { mean: 0, stdev: 0 },
                        speechiness: { mean: 0, stdev: 0 },
                        valence: { mean: 0, stdev: 0 },
                        tempo: { mean: 0, stdev: 0 },
                        count: 0,
                        track_data: [],
                        filtered_uris: ""
                    };
                    console.log(playlist_data);
                    Object.assign(playlist, playlist_data)
                    console.log("FINAL PLAYLIST OBJECT:");
                    console.log(playlist);

                    //Function to compile all track data for means and variances
                    playlist.compile = function() {
                        //access https://api.spotify.com/v1/playlists/{playlist_id}/tracks and iterate through tracks
                        playlist.count = playlist.track_data.length;
                        
                        function clear_data(){
                            console.log('Clear the data');
                            playlist.acousticness.mean = 0;
                            console.log(playlist.acousticness.mean);
                            playlist.danceability.mean = 0;
                            playlist.energy.mean = 0;
                            playlist.loudness.mean = 0;
                            playlist.speechiness.mean = 0;
                            playlist.valence.mean = 0;
                            playlist.tempo.mean = 0;

                            playlist.acousticness.stdev = 0;
                            playlist.danceability.stdev = 0;
                            playlist.energy.stdev = 0;
                            playlist.loudness.stdev = 0;
                            playlist.speechiness.stdev = 0;
                            playlist.valence.stdev = 0;
                            playlist.tempo.stdev = 0;

                            console.log(playlist);
                        }

                        function sum_means(){
                            console.log('called sum_means for ' + playlist.track_data.length + ' items');
                            console.log(playlist.track_data);
                            
                            for(var i = 0; i < playlist.track_data.length; i++){
                                console.log(playlist.track_data.length);
                                console.log('compiled a track at index ' + i);
                                //console.log(track.acousticness);
                                console.log(playlist.track_data[i].acousticness);
                                playlist.acousticness.mean += playlist.track_data[i].acousticness;
                                playlist.danceability.mean += playlist.track_data[i].danceability;
                                playlist.energy.mean += playlist.track_data[i].energy;
                                playlist.loudness.mean += playlist.track_data[i].loudness;
                                playlist.speechiness.mean += playlist.track_data[i].speechiness;
                                playlist.valence.mean += playlist.track_data[i].valence;
                                playlist.tempo.mean += playlist.track_data[i].tempo;
                            }
                            console.log(playlist);
                        }//sum_means

                        function div_means(){
                            console.log('called div_means');
                            playlist.acousticness.mean /= playlist.count;
                            playlist.danceability.mean /= playlist.count;
                            playlist.energy.mean /= playlist.count;
                            playlist.loudness.mean /= playlist.count;
                            playlist.speechiness.mean /= playlist.count;
                            playlist.valence.mean /= playlist.count;
                            playlist.tempo.mean /= playlist.count;
                            console.log("Acousticness: " + playlist.acousticness.mean);
                            console.log("Danceability: " + playlist.danceability.mean);
                        }//div_means

                        function sum_stdevs(){
                            console.log('called sum_stdevs');
                            for(var i = 0; i < playlist.track_data.length; i++){
                                playlist.acousticness.stdev += (playlist.track_data[i].acousticness - playlist.acousticness.mean)**2;
                                playlist.danceability.stdev += (playlist.track_data[i].danceability - playlist.danceability.mean)**2;
                                playlist.energy.stdev += (playlist.track_data[i].energy - playlist.energy.mean)**2;
                                playlist.loudness.stdev += (playlist.track_data[i].loudness - playlist.loudness.mean)**2;
                                playlist.speechiness.stdev += (playlist.track_data[i].speechiness - playlist.speechiness.mean)**2;
                                playlist.valence.stdev += (playlist.track_data[i].valence - playlist.valence.mean)**2;
                                playlist.tempo.stdev += (playlist.track_data[i].tempo - playlist.tempo.mean)**2;
                                console.log("Acousticness: " + playlist.acousticness.stdev);
                                console.log("Danceability: " + playlist.danceability.stdev);
                                console.log((playlist.track_data[i].acousticness - playlist.acousticness.mean)**2);
                                console.log((playlist.track_data[i].danceability - playlist.danceability.mean)**2);
                            }
                            
                        }//sum_stdevs

                        function calc_stdevs(){
                            console.log('called calc_stdevs');
                            playlist.acousticness.stdev = Math.sqrt(playlist.acousticness.stdev / (playlist.count - 1));
                            playlist.danceability.stdev = Math.sqrt(playlist.danceability.stdev / (playlist.count - 1));
                            playlist.energy.stdev = Math.sqrt(playlist.energy.stdev / (playlist.count - 1));
                            playlist.loudness.stdev = Math.sqrt(playlist.loudness.stdev / (playlist.count - 1));
                            playlist.speechiness.stdev = Math.sqrt(playlist.speechiness.stdev / (playlist.count - 1));
                            playlist.valence.stdev = Math.sqrt(playlist.valence.stdev / (playlist.count - 1));
                            playlist.tempo.stdev = Math.sqrt(playlist.tempo.stdev / (playlist.count - 1));
                        }//calc_stdevs

                        console.log("Compiling Playlist Data");
                        clear_data();
                        sum_means();
                        div_means();
                        sum_stdevs();
                        calc_stdevs();
                        console.log("Compiled Playlist Data. Logging playlist:");
                        console.log(playlist);
                    }//compile the playlists information

                    /*Function to filter playlist tracks based off threshold from user input 
                        filter_threshold runs from 0 to 1, 0 is not strict and 1 is strict
                        should ONLY be called after playlist.compile is called
                    */
                    playlist.filter = function(filter_threshold) {
                        console.log("Called filter");
                        playlist.filtered_uris = ""
                        //based off filter, remove tracks that are bad
                        for(track in track_data){
                            if ((Math.abs(playlist.acousticness.mean - track.acousticness)/playlist.acousticness.variance < filter_threshold) || (Math.abs(playlist.danceability.mean - track.danceability)/playlist.danceability.variance < filter_threshold)
                                || (Math.abs(playlist.energy.mean - track.energy)/playlist.energy.variance < filter_threshold)
                                || (Math.abs(playlist.loudness.mean - track.loudness)/playlist.loudness.variance < filter_threshold)
                                || (Math.abs(playlist.speechiness.mean - track.danceability)/playlist.speechiness.variance < filter_threshold)
                                || (Math.abs(playlist.valence.mean - track.valence)/playlist.valence.variance < filter_threshold)
                                || (Math.abs(playlist.tempo.mean - track.tempo)/playlist.tempo.variance < filter_threshold)){
                                playlist.filtered_uris += track.uri + ",";
                            }
                        }
                        playlist.filtered_uris 
                    }//filter

                    //Function to generate filtered playlist. Can only be called post-filter.
                    playlist.generateFilteredPlaylist = function(playlist_name, filter_threshold){
                        // to POST https://api.spotify.com/v1/users/{user_id}/playlists
                        playlist.filter(filter_threshold);
                        //make ajax call to create a new playlist, named by the playlist_name variable
                        $.ajax({
                            url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
                            headers: {
                                'Authorization': 'Bearer ' + access_token,
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                'name': playlist_name + '[Vibe Checked]'
                            }),
                            success: function(new_playlist) {
                                //now make ajax call to populate playlist with filtered information
                                $.ajax({
                                    url: 'https://api.spotify.com/v1/playlists/' + new_playlist.id + '/tracks',
                                    headers: {
                                        'Authorization': 'Bearer ' + access_token,
                                        'Content-Type': 'application/json'
                                    },
                                    data: JSON.stringify({
                                        'uris': playlist.filtered_uris
                                    }),
                                    success: function(snapshot) {
                                        console.log(snapshot.snapshot_id);
                                    }
                                },);//ajax call to populate playlist
                            }
                        },);//ajax call to create playlist
                    }//generateFilteredPlaylist

                    //populate track_data once so we don't make a million API calls
                    playlist.tracks.items.forEach(function(playlist_track){
                        console.log(playlist_track.track.name);
                        $.ajax({
                            url: 'https://api.spotify.com/v1/tracks/' + playlist_track.track.id,
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function(track) {
                                // given a track object, return the uri and audio features

                                $.ajax({
                                    url: 'https://api.spotify.com/v1/audio-features/' + track.id,
                                    headers: {
                                        'Authorization': 'Bearer ' + access_token
                                    },
                                    success: function(audio_features) {
                                        // given a track object, return the uri and audio features                                        
                                        console.log(playlist.track_data.push(audio_features));
                                        //console.log(audio_features);
                                        console.log(playlist.track_data.length + " and " + playlist.tracks.items.length);
                                        if(playlist.track_data.length === playlist.tracks.items.length){
                                            playlist.compile();
                                        }
                                    },
                                },)
                            },
                        },)

                    });
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
