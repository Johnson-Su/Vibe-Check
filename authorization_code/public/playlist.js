class Playlist{

    constructor(playlist_url, access_token, user_id){
        $.ajax({
            url: playlist_url,
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
            success: function(playlist) {

                this.name = playlist.name;
                this.acousticness = { mean: 0, stdev: 0 };
                this.danceability = { mean: 0, stdev: 0 };
                this.instrumentalness = { mean: 0, stdev: 0 };
                this.energy = { mean: 0, stdev: 0 };
                this.loudness = { mean: 0, stdev: 0 };
                this.speechiness = { mean: 0, stdev: 0 };
                this.valence = { mean: 0, stdev: 0 };
                this.tempo = { mean: 0, stdev: 0 };
                this.count = 0;
                this.track_data = ["potato"];
                this.filtered_uris = [];
                this.compiled = false;
                this.tracks = playlist.tracks.items;
                this.user_id = user_id;
                this.access_token = access_token;
                console.log("Constructing playlist object for " + this.name);
                console.log(this.track_data);
                console.log("asdcvasdcasd");

                function load_track_data(){
                    console.log(this.track_data);
                    setTimeout( function(){
                        console.log(this.track_data);
                        console.log("sdfasdfas");
                      this.tracks.forEach(function(playlist_track){
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
                                          console.log(this.track_data);
                                          this.track_data.push(audio_features);
                                          console.log(this.track_data.length + " and " + this.tracks.length);
                                          if(this.track_data.length === this.tracks.length){
                                              this.generateFilteredPlaylist(this.name, threshold);
                                              console.log(this.guess_genre());
                                          }//once completely loaded, now can check vibes
                                      },//success
                                  },)//ajax call to get audio features of a playlist
                              },//success
                          },)//ajax call to to access a certain song in a playlist
                      })//foreach
                    }, 10000);//timeout
                }//load

                load_track_data();
            }, //success 
            error: function(){
                console.log("ERROR: could not construct playlist object for " + playlist_url);
            }//error
        })//end of ajax call
    }//constructor

    compile_if_blank(){
        if (this.compiled === false){
            this.compile()
        }
    }//compile_if_blank()

    //Function to compile all track data for means and variances
    compile(){
        this.count = this.track_data.length;

        function clear_data(){
            console.log('Clear the data');
            this.acousticness.mean = 0;
            this.danceability.mean = 0;
            this.instrumentalness.mean = 0;
            this.energy.mean = 0;
            this.loudness.mean = 0;
            this.speechiness.mean = 0;
            this.valence.mean = 0;
            this.tempo.mean = 0;

            this.acousticness.stdev = 0;
            this.danceability.stdev = 0;
            this.instrumentalness.stdev = 0;
            this.energy.stdev = 0;
            this.loudness.stdev = 0;
            this.speechiness.stdev = 0;
            this.valence.stdev = 0;
            this.tempo.stdev = 0;

            //console.log(playlist);
        }

        function sum_means(){
            console.log('called sum_means for ' + this.track_data.length + ' items');
            console.log(this.track_data);

            for(var i = 0; i < this.track_data.length; i++){
                //console.log(this.track_data.length);
                //console.log('compiled a track at index ' + i);
                //console.log(track.acousticness);
                //console.log(this.track_data[i].acousticness);
                this.acousticness.mean += this.track_data[i].acousticness;
                this.danceability.mean += this.track_data[i].danceability;
                this.instrumentalness.mean += this.track_data[i].instrumentalness;
                this.energy.mean += this.track_data[i].energy;
                this.loudness.mean += this.track_data[i].loudness;
                this.speechiness.mean += this.track_data[i].speechiness;
                this.valence.mean += this.track_data[i].valence;
                this.tempo.mean += this.track_data[i].tempo;
            }
            console.log(playlist);
        }//sum_means

        function div_means(){
            console.log('called div_means');
            this.acousticness.mean /= this.count;
            this.danceability.mean /= this.count;
            this.instrumentalness.mean /= this.count;
            this.energy.mean /= this.count;
            this.loudness.mean /= this.count;
            this.speechiness.mean /= this.count;
            this.valence.mean /= this.count;
            this.tempo.mean /= this.count;
        }//div_means

        function sum_stdevs(){
            console.log('called sum_stdevs');
            for(var i = 0; i < this.track_data.length; i++){
                this.acousticness.stdev += (this.track_data[i].acousticness - this.acousticness.mean)**2;
                this.danceability.stdev += (this.track_data[i].danceability - this.danceability.mean)**2;
                this.instrumentalness.mean += (this.track_data[i].instrumentalness - this.instrumentalness.mean)**2;
                this.energy.stdev += (this.track_data[i].energy - this.energy.mean)**2;
                this.loudness.stdev += (this.track_data[i].loudness - this.loudness.mean)**2;
                this.speechiness.stdev += (this.track_data[i].speechiness - this.speechiness.mean)**2;
                this.valence.stdev += (this.track_data[i].valence - this.valence.mean)**2;
                this.tempo.stdev += (this.track_data[i].tempo - this.tempo.mean)**2;
            }

        }//sum_stdevs

        function calc_stdevs(){
            console.log('called calc_stdevs');
            this.acousticness.stdev = Math.sqrt(this.acousticness.stdev / (this.count - 1));
            this.danceability.stdev = Math.sqrt(this.danceability.stdev / (this.count - 1));
            this.instrumentalness.stdev = Math.sqrt(this.instrumentalness.stdev / (this.count - 1));
            this.energy.stdev = Math.sqrt(this.energy.stdev / (this.count - 1));
            this.loudness.stdev = Math.sqrt(this.loudness.stdev / (this.count - 1));
            this.speechiness.stdev = Math.sqrt(this.speechiness.stdev / (this.count - 1));
            this.valence.stdev = Math.sqrt(this.valence.stdev / (this.count - 1));
            this.tempo.stdev = Math.sqrt(this.tempo.stdev / (this.count - 1));
        }//calc_stdevs

        console.log("Compiling Playlist Data");
        clear_data();
        sum_means();
        div_means();
        sum_stdevs();
        calc_stdevs();
        console.log("Compiled Playlist Data. Logging playlist:");
        console.log(playlist);
        this.compiled = true;
    }//function compile(): Compile the playlist's audio-features data
    

    /*Function to filter playlist tracks based off threshold from user input
        filter_threshold runs from 0 to 1, 0 is not strict and 1 is strict
        should ONLY be called after this.compile is called
    */
    filter(filter_threshold){
        this.compile_if_blank();
        console.log("Called filter; preparing to reject URIs");
        this.filtered_uris = [];
        for(var i = 0; i < this.track_data.length; i++){
            if ((Math.abs(this.acousticness.mean - this.track_data[i].acousticness)/this.acousticness.stdev < filter_threshold)
                || (Math.abs(this.danceability.mean - this.track_data[i].danceability)/this.danceability.stdev < filter_threshold)
                || (Math.abs(this.instrumentalness.mean - this.track_data[i].instrumentalness)/this.instrumentalness.stdev < filter_threshold)
                || (Math.abs(this.energy.mean - this.track_data[i].energy)/this.energy.stdev < filter_threshold)
                || (Math.abs(this.loudness.mean - this.track_data[i].loudness)/this.loudness.stdev < filter_threshold)
                || (Math.abs(this.speechiness.mean - this.track_data[i].danceability)/this.speechiness.stdev < filter_threshold)
                || (Math.abs(this.valence.mean - this.track_data[i].valence)/this.valence.stdev < filter_threshold)
                || (Math.abs(this.tempo.mean - this.track_data[i].tempo)/this.tempo.stdev < filter_threshold)){
                this.filtered_uris.push(this.track_data[i].uri);
            }else{
                console.log('Rejected URI: ' + this.track_data[i].uri);
            }
        }
        console.log('Workable URIs: ' +  this.filtered_uris);
    }//function filter(filter_threshold): generate an array of track URIs based off compiled info and threshold

    //function to generate filtered playlist
    generate_filtered_playlist(filter_threshold){
        this.filter(filter_threshold);
        //make ajax call to create a new playlist, named by the playlist_name variable
        $.ajax({
            url: 'https://api.spotify.com/v1/users/' + this.user_id + '/playlists',
            headers: {
                'Authorization': 'Bearer ' + this.access_token,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                'name': this.name + ' [Vibe Checked]'
            }),
            type: 'POST',
            success: function(new_playlist) {
                //now make ajax call to populate playlist with filtered information
                console.log("Successfully Generated Playlist: " + new_playlist.name);
                console.log("Try adding in the following: " + this.filtered_uris);
                $.ajax({
                    url: 'https://api.spotify.com/v1/playlists/' + new_playlist.id + '/tracks',
                    headers: {
                        'Authorization': 'Bearer ' + this.access_token,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        'uris': this.filtered_uris
                    }),
                    type: 'POST',
                    success: function(snapshot) {
                        console.log("Looks like we got it in!" + snapshot.snapshot_id);
                    }//success
                },);//ajax call to populate playlist
            }//success
        },);//ajax call to create playlist
    }//generate_filtered_playlist
    
    //function that returns a dictionary of mean audio features
    get_audio_features(){
        const audio_features = {
            acousticness: this.acousticness.mean,                //0: not acoustic to 1: acoustic
            danceability: this.danceability.mean,               //0: not danceable to 1: most danceable
            energy: this.energy.mean,                           //0: not energetic to 1: uber high energy
            loudness: Math.max(0,(this.loudness.mean + 60)/60), //0: not loud to 1: uber loud
            speechiness: this.speechiness.mean,                 //0: words? what words? to 1: welcome to my podcast
            valence: this.valence.mean,                         //0: it's so saaad to 1: it's the best day ever
            tempo: this.tempo.mean/250                              //0: 0 bpm fam to 1: 250 bpm like a madlad
        }
        return audio_features;
    }//get_audio_features

    //function that returns the guess of the genre based off a trained neural net
    guess_genre(){
        this.compile();
        let potential_genres = trainedNN({
            danceability: this.danceability.mean,
            acousticness: this.acousticness.mean,
            energy: this.energy.mean,
            instrumentalness: this.instrumentalness.mean,
            valence: this.valence.mean
        });
        return Object.keys(potential_genres).reduce((a, b) => potential_genres[a] > potential_genres[b] ? a : b);
    }//guess_genre

}//class Playlist