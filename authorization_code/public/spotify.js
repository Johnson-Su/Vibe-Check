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
            // userProfilePlaceholder.innerHTML = userProfileTemplate(response);

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
