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
                                    load_playlist(playlist.href);
                                    link = playlist.href.split("/");
                                    link = "https://open.spotify.com/embed/playlist/" + link[link.length - 1]
                                    document.getElementById("show-playlist").src = link;
    
                                    var flag = 0;
                                    document.getElementById("check-slider").addEventListener('input',
                                        function(){
                                           if(this.value <= 20 && flag == 0){
                                               flag = 1;
                                               console.log(document.getElementById("vslider").value)
                                                vibe_check(playlist.href, (100 - document.getElementById("vslider").value) / 33 + 0.2);
                                           }//if flag
                                    });//document.getElementById
                                }//success
                            },)//.ajax
                        }//checkPlaylist
                    );//document.getElement
                }//for loop
    
                // ********** end playlist stuff ************
                
                //functions to assign current playlist and such

                //Properties
                var current_playlist;

                //Vibe Check Function. Pass a playlist api url to the function to generate a vibe-checked playlist.
                function load_playlist(playlist_url){
                    console.log("Load a playlist!")
                    current_playlist = new Playlist(playlist_url, access_token, user_id);
                    //console.log("Printing: " + current_playlist);
                }//load in new playlist to current_playlist

                function vibe_check(threshold){
                    if(typeof current_playlist != "undefined"){
                        current_playlist.generate_filtered_playlist(threshold);
                    }else{
                        console.log("you don't have a playlist");
                        console.log("see: " + current_playlist);
                    }
                }//vibe_check
    
                            
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
                            // console.log(response.playlists);
                            var num=0;
                            var num1=0;
                            for(index = 20; index - 20 < 8; index++){
                                var table = document.getElementById("myTable");
                                function truncate(str, n){
                                    return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
                                };
                                playlist_name = truncate(response.playlists.items[index - 20].name, 15)
                                if(index%2==0){
                                    var row = table.insertRow(0);
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

                            for(playlist_id = 20; playlist_id - 20 < 8; playlist_id++){
                                document.getElementById("playlist" + playlist_id).addEventListener('click',
                                    function(){
                                        console.log(this.id);
                                        current = this.id
                                        index = current.substring(8, current.length)
                                        $.ajax({
                                            url: response.playlists.items[index - 20].href,
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
                                                load_playlist(playlist.href);
                                                var flag = 0;
                                                document.getElementById("check-slider").addEventListener('input',
                                                    function(){
                                                        if(this.value <= 20 && flag == 0){
                                                            flag = 1;
                                                            console.log(document.getElementById("vslider").value)
                                                            vibe_check((100 - document.getElementById("vslider").value) / 33 + 0.2);
                                                        } 
                                                    }
                                                );
                                            }//successs
                                        },)//ajax call
                                    }//anon function
                                );//doc.getelemtentbyid
                            }//for loop 
                        }//successfully accessed playlist URL
                    },)//ajax call access a playlist
                }//Function: Search for a Playlist
                
                document.getElementById("search-test").addEventListener('click', function(){
                    search_playlist(document.getElementById("searchbar").value);
                });
    
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