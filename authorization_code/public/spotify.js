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

    // ************* playlist stuff ***************
            // set playlist names to cassettes
            var num=0;
            var num1=0;
            for(index = 0; index < playlists.items.length; index++){
              var table = document.getElementById("myTable");
              function truncate(str, n){
                return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
              };
              playlist_name = truncate(playlists.items[index].name, 15)
              if(index%2==0){
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                cell1.innerHTML = playlist_name;
                if(num%3==0){cell1.className = 'orange';}
                else if(num%3==1){cell1.className = 'white';}
                else if(num%3==2){cell1.className = 'yellow'; }
                cell1.id = "playlist" + index;
                num++;
              }
              else{
                var cell2 = row.insertCell(1);
                cell2.innerHTML = playlist_name;
                if(num1%3==0){cell2.className = 'black';}
                else if(num1%3==1){cell2.className = 'yellow';}
                else if(num1%3==2){cell2.className = 'blue'; }
                cell2.id = "playlist" + index;
                num1++;
              }
            }

            for(playlist_id = 0; playlist_id < playlists.items.length; playlist_id++){
                document.getElementById("playlist" + playlist_id).addEventListener('click',
                    function checkPlaylist(){
                        current = this.id
                        index = current.substring(8, current.length)
                        $.ajax({
                            url: playlists.items[index].href,
                            headers: {
                                'Authorization': 'Bearer ' + access_token
                            },
                            success: function(playlist) {
                                $('#loggedin').hide();
                                $('#vibe-checker').show();

                                console.log("playlist: " + playlist.name);
                                link = playlist.href.split("/");
                                link = "https://open.spotify.com/embed/playlist/" + link[link.length - 1]
                                document.getElementById("show-playlist").src = link;
                                playlist.tracks.items.forEach(function(track){
                                    // console.log(track.track.name);

                                    $.ajax({
                                        url: 'https://api.spotify.com/v1/audio-features/' + track.track.id,
                                        headers: {
                                            'Authorization': 'Bearer ' + access_token
                                        },
                                        success: function(track) {
                                            // console.log(track);
                                            console.log("{ input: { danceability: "+ track.danceability+ ", acousticness: " + track.acousticness+ ", energy: " + track.energy+ ", instrumentalness: " +track.instrumentalness + ", valence: " + track.valence + " }, output: { Country: 1} },");
                                        }
                                    },)

                                });
                            }
                        },)
                    });
            }

        // ********** end playlist stuff ************
        //Vibe Check Function. Pass a playlist api url to the function to generate a vibe-checked playlist.
                        function vibe_check(playlist_url, threshold){

                            //ajax call to access playlist
                            $.ajax({
                                url: playlist_url,
                                headers: {
                                    'Authorization': 'Bearer ' + access_token
                                },
                                success: function(playlist) {
                                    console.log("Accessing playlist: " + playlist.name);

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
                                        filtered_uris: []
                                    };

                                    //console.log(playlist_data);
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
                                        console.log("Called filter; preparing to reject URIs");
                                        playlist.filtered_uris = []
                                        //based off filter, remove tracks that are bad
                                        for(var i = 0; i < playlist.track_data.length; i++){
                                            if ((Math.abs(playlist.acousticness.mean - playlist.track_data[i].acousticness)/playlist.acousticness.stdev < filter_threshold)
                                                || (Math.abs(playlist.danceability.mean - playlist.track_data[i].danceability)/playlist.danceability.stdev < filter_threshold)
                                                || (Math.abs(playlist.energy.mean - playlist.track_data[i].energy)/playlist.energy.stdev < filter_threshold)
                                                || (Math.abs(playlist.loudness.mean - playlist.track_data[i].loudness)/playlist.loudness.stdev < filter_threshold)
                                                || (Math.abs(playlist.speechiness.mean - playlist.track_data[i].danceability)/playlist.speechiness.stdev < filter_threshold)
                                                || (Math.abs(playlist.valence.mean - playlist.track_data[i].valence)/playlist.valence.stdev < filter_threshold)
                                                || (Math.abs(playlist.tempo.mean - playlist.track_data[i].tempo)/playlist.tempo.stdev < filter_threshold)){
                                                playlist.filtered_uris.push(playlist.track_data[i].uri);
                                            }else{
                                                console.log('Rejected URI: ' + playlist.track_data[i].uri);
                                            }
                                        }
                                        console.log('Workable URIs: ' +  playlist.filtered_uris);
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
                                                'name': playlist_name + ' [Vibe Checked]'
                                            }),
                                            type: 'POST',
                                            success: function(new_playlist) {
                                                //now make ajax call to populate playlist with filtered information
                                                console.log("Successfully Generated Playlist: " + new_playlist.name);
                                                console.log("Try adding in the following: " + playlist.filtered_uris);
                                                $.ajax({
                                                    url: 'https://api.spotify.com/v1/playlists/' + new_playlist.id + '/tracks',
                                                    headers: {
                                                        'Authorization': 'Bearer ' + access_token,
                                                        'Content-Type': 'application/json'
                                                    },
                                                    data: JSON.stringify({
                                                        'uris': playlist.filtered_uris
                                                    }),
                                                    type: 'POST',
                                                    success: function(snapshot) {
                                                        console.log("Looks like we got it in!" + snapshot.snapshot_id);
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
                                                            playlist.generateFilteredPlaylist(playlist.name, threshold);
                                                        }//once completely loaded, now can check vibes
                                                    },//success
                                                },)//ajax call to get audio features of a playlist
                                            },//success
                                        },)//ajax call to to access a certain song in a playlist
                                    });//foreach to get all audio features from each song
                                }//successfully accessed playlist URL
                            },)//ajax call access a playlist
                        }//Function: Vibe Check

                        //function to search for a playlist based off a string query. Returns 20 playlists max.
                        function search_playlist(input_string){

                            //ajax call to access playlist
                            $.ajax({
                                url: 'https://api.spotify.com/v1/search',
                                headers: {
                                    'Authorization': 'Bearer ' + access_token
                                },
                                data: {
                                    'q': input_string,
                                    'type': 'playlist'
                                },
                                error: function() {
                                    console.log("failed at search call");
                                },
                                success: function(response) {
                                    console.log("Found " + response.playlists.items.length + " from query: " + input_string);
                                    console.log(response.playlists);

                                    function get_playlist_url(index){
                                        return response.playlists.items[index].href;
                                    }//get_playlist_url

                                }//successfully accessed playlist URL
                            },)//ajax call access a playlist
                        }//Function: Search for a Playlist


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


// MACHINE LEARNING PART WOOT WOOT//
////////////////////////////////////
//     ____          ____
//    |oooo|        |oooo|
//    |oooo| .----. |oooo|
//    |Oooo|/\_||_/\|oooO|
//    `----' / __ \ `----'
//    ,/ |#|/\/__\/\|#| \,
//   /  \|#|| |/\| ||#|/  \
//  / \_/|_|| |/\| ||_| \_/ \
// |_\/     o\=----=/o    \/_|
// <_>       |=\__/=|      <_>
// <_>       |------|      <_>
// | |    ___|======|___   | |
// //\\  / |O|======|O| \  //\\
// |  |  | |O+------+O| |  |  |
// |\/|  \_+/        \+_/  |\/|
// \__/  _|||        |||_  \__/
//        | ||        || |
//       [==|]        [|==]
//       [===]        [===]
//        >_<          >_<
//       || ||        || ||
//       || ||        || ||
//       || ||        || ||
//     __|\_/|__    __|\_/|__
//    /___n_n___\  /___n_n___\
////////////////////////////////////
const brain = require("brain.js")
//brain.js trainedNN for 1k songs on the following:

// fields to consider:
// acousticness
// danceability
// energy
// instumentalness
// valence
// tempo

// music genres:
// 1=EDM
// 2=pop
// 3=rap
// 5=lofi
// 6=country
// 7=classical

function trainedNN(input) {
return {
'LOFI':1/(1+1/Math.exp((-21.401443481445312+24.35832405090332*1/(1+1/Math.exp((-8.392271995544434+7.710432529449463*(input['danceability']||0)+4.483984470367432*(input['acousticness']||0)-17.352312088012695*(input['energy']||0)+12.887937545776367*(input['instrumentalness']||0)+4.8691792488098145*(input['valence']||0))))+16.992862701416016*1/(1+1/Math.exp((-2.5020105838775635+0.4075414538383484*(input['danceability']||0)+0.40179166197776794*(input['acousticness']||0)+0.8510603308677673*(input['energy']||0)+169.41151428222656*(input['instrumentalness']||0)-2.196516752243042*(input['valence']||0))))-23.76111602783203*1/(1+1/Math.exp((3.755976915359497-36.59063720703125*(input['danceability']||0)+14.076555252075195*(input['acousticness']||0)-16.976600646972656*(input['energy']||0)+3.229679584503174*(input['instrumentalness']||0)+8.240936279296875*(input['valence']||0))))))),
'EDM':1/(1+1/Math.exp((-95.17872619628906-32.41843032836914*1/(1+1/Math.exp((-8.392271995544434+7.710432529449463*(input['danceability']||0)+4.483984470367432*(input['acousticness']||0)-17.352312088012695*(input['energy']||0)+12.887937545776367*(input['instrumentalness']||0)+4.8691792488098145*(input['valence']||0))))+95.63311767578125*1/(1+1/Math.exp((-2.5020105838775635+0.4075414538383484*(input['danceability']||0)+0.40179166197776794*(input['acousticness']||0)+0.8510603308677673*(input['energy']||0)+169.41151428222656*(input['instrumentalness']||0)-2.196516752243042*(input['valence']||0))))-26.20052146911621*1/(1+1/Math.exp((3.755976915359497-36.59063720703125*(input['danceability']||0)+14.076555252075195*(input['acousticness']||0)-16.976600646972656*(input['energy']||0)+3.229679584503174*(input['instrumentalness']||0)+8.240936279296875*(input['valence']||0))))))),
'RAP':1/(1+1/Math.exp((-5.983826160430908+0.5373189449310303*1/(1+1/Math.exp((-8.392271995544434+7.710432529449463*(input['danceability']||0)+4.483984470367432*(input['acousticness']||0)-17.352312088012695*(input['energy']||0)+12.887937545776367*(input['instrumentalness']||0)+4.8691792488098145*(input['valence']||0))))-18.70572853088379*1/(1+1/Math.exp((-2.5020105838775635+0.4075414538383484*(input['danceability']||0)+0.40179166197776794*(input['acousticness']||0)+0.8510603308677673*(input['energy']||0)+169.41151428222656*(input['instrumentalness']||0)-2.196516752243042*(input['valence']||0))))-0.6679232120513916*1/(1+1/Math.exp((3.755976915359497-36.59063720703125*(input['danceability']||0)+14.076555252075195*(input['acousticness']||0)-16.976600646972656*(input['energy']||0)+3.229679584503174*(input['instrumentalness']||0)+8.240936279296875*(input['valence']||0))))))),
'CLASSICAL':1/(1+1/Math.exp((-20.523542404174805-25.32865333557129*1/(1+1/Math.exp((-8.392271995544434+7.710432529449463*(input['danceability']||0)+4.483984470367432*(input['acousticness']||0)-17.352312088012695*(input['energy']||0)+12.887937545776367*(input['instrumentalness']||0)+4.8691792488098145*(input['valence']||0))))+16.27237892150879*1/(1+1/Math.exp((-2.5020105838775635+0.4075414538383484*(input['danceability']||0)+0.40179166197776794*(input['acousticness']||0)+0.8510603308677673*(input['energy']||0)+169.41151428222656*(input['instrumentalness']||0)-2.196516752243042*(input['valence']||0))))+33.79419708251953*1/(1+1/Math.exp((3.755976915359497-36.59063720703125*(input['danceability']||0)+14.076555252075195*(input['acousticness']||0)-16.976600646972656*(input['energy']||0)+3.229679584503174*(input['instrumentalness']||0)+8.240936279296875*(input['valence']||0))))))),
'POP':1/(1+1/Math.exp((-10.174331665039062-3.8872437477111816*1/(1+1/Math.exp((-8.392271995544434+7.710432529449463*(input['danceability']||0)+4.483984470367432*(input['acousticness']||0)-17.352312088012695*(input['energy']||0)+12.887937545776367*(input['instrumentalness']||0)+4.8691792488098145*(input['valence']||0))))+10.095831871032715*1/(1+1/Math.exp((-2.5020105838775635+0.4075414538383484*(input['danceability']||0)+0.40179166197776794*(input['acousticness']||0)+0.8510603308677673*(input['energy']||0)+169.41151428222656*(input['instrumentalness']||0)-2.196516752243042*(input['valence']||0))))-3.5891551971435547*1/(1+1/Math.exp((3.755976915359497-36.59063720703125*(input['danceability']||0)+14.076555252075195*(input['acousticness']||0)-16.976600646972656*(input['energy']||0)+3.229679584503174*(input['instrumentalness']||0)+8.240936279296875*(input['valence']||0))))))),
'RnB':1/(1+1/Math.exp((-2.867238998413086-34.049747467041016*1/(1+1/Math.exp((-8.392271995544434+7.710432529449463*(input['danceability']||0)+4.483984470367432*(input['acousticness']||0)-17.352312088012695*(input['energy']||0)+12.887937545776367*(input['instrumentalness']||0)+4.8691792488098145*(input['valence']||0))))+3.3303561210632324*1/(1+1/Math.exp((-2.5020105838775635+0.4075414538383484*(input['danceability']||0)+0.40179166197776794*(input['acousticness']||0)+0.8510603308677673*(input['energy']||0)+169.41151428222656*(input['instrumentalness']||0)-2.196516752243042*(input['valence']||0))))+1.6304932832717896*1/(1+1/Math.exp((3.755976915359497-36.59063720703125*(input['danceability']||0)+14.076555252075195*(input['acousticness']||0)-16.976600646972656*(input['energy']||0)+3.229679584503174*(input['instrumentalness']||0)+8.240936279296875*(input['valence']||0))))))),
'COUNTRY':1/(1+1/Math.exp((3.388113021850586-78.80740356445312*1/(1+1/Math.exp((-8.392271995544434+7.710432529449463*(input['danceability']||0)+4.483984470367432*(input['acousticness']||0)-17.352312088012695*(input['energy']||0)+12.887937545776367*(input['instrumentalness']||0)+4.8691792488098145*(input['valence']||0))))-10.57968521118164*1/(1+1/Math.exp((-2.5020105838775635+0.4075414538383484*(input['danceability']||0)+0.40179166197776794*(input['acousticness']||0)+0.8510603308677673*(input['energy']||0)+169.41151428222656*(input['instrumentalness']||0)-2.196516752243042*(input['valence']||0))))+1.7033580541610718*1/(1+1/Math.exp((3.755976915359497-36.59063720703125*(input['danceability']||0)+14.076555252075195*(input['acousticness']||0)-16.976600646972656*(input['energy']||0)+3.229679584503174*(input['instrumentalness']||0)+8.240936279296875*(input['valence']||0)))))))};
}

console.log(trainedNN({danceability: 0.81, acousticness: 0.961, energy: 0.17, instrumentalness: 0.942, valence: 0.336}))
