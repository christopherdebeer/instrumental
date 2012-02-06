var music, talk;

var instrumentals = {
    lessig : {
        talk : [ 'http://www.youtube.com/watch?v=2YRCPTFjB3Q', 100 ],
        music : [ 'http://www.youtube.com/watch?v=6Hh3tciRim0', 30 ]
    },
    acai : {
        talk : [ 'http://www.youtube.com/watch?v=gRmd3OXs-qE', 100 ],
        music : [ 'http://www.youtube.com/watch?v=DripIUEVjjA', 50 ]
    },
    'manila slum' : {
        talk : [ 'http://www.youtube.com/watch?v=eYFzGkBqJ2c', 100 ],
        music : [ 'http://www.youtube.com/watch?v=pt9Ov4gYtew', 40 ]
    },
    'pop out' : {
        talk : [ 'http://www.youtube.com/watch?v=BnZks0BCCiw', 100 ],
        music : [ 'http://www.youtube.com/watch?v=_83pa-KJGTc', 50 ]
    },
    'ryan dahl' : {
        talk : [ 'http://www.youtube.com/watch?v=L_JKb61EalQ', 100 ],
        music : [ 'http://www.youtube.com/watch?v=6Hh3tciRim0', 30 ]
    }
};

var queue = [];
var ready = false;
function onYouTubePlayerReady () {
    ready = true;
    for (var i = 0; i < queue.length; i++) queue[i]();
    queue = [];
}

function talkOnstateChange (state) {
    if (state === 0) { // ended
        setInterval(function () {
            var v = music[0].getVolume();
            music[0].setVolume(Math.floor(v * 0.99));
        }, 10);
    }
}

$(document).ready(function () {
    for (var key in instrumentals) {
        var div = $('<div>').appendTo($('#playlist'));
        $('<a>')
            .attr('href', '?' + escape(key))
            .text(key)
            .appendTo(div)
        ;
    }
    
    $('#play').click(function () {
        reload();
        
        $(this).val('pause').unbind('click').click(function pause () {
            talk[0].pauseVideo();
            music[0].pauseVideo();
            
            $(this).val('play').unbind('click').click(function () {
                talk[0].playVideo();
                music[0].playVideo();
                $(this).val('pause').unbind('click').click(pause);
            });
        });
    });
    
    var query = (window.location.search || '').replace(/^\?/, '');
    if (instrumentals[unescape(query)]) {
        var params = instrumentals[query]
        $('#talk-uri').val(params.talk[0]);
        $('#talk-volume').val(params.talk[1]);
        $('#music-uri').val(params.music[0]);
        $('#music-volume').val(params.music[1]);
        $('#play').trigger('click');
    }
    
    $('#reload').click(reload);
    
    function reload () {
        if (!ready) return queue.push(reload);
        
        talk = $('#talk-api');
        var talkUri = $('#talk-uri').val();
        var talkId = talkUri.match(/\bv=([^&]+)/)[1];
        talk[0].loadVideoById(talkId);
        talk[0].setVolume(parseInt($('#talk-volume').val(), 10));
        talk[0].addEventListener('onStateChange', 'talkOnstateChange');
        
        music = $('#music-api');
        var musicUri = $('#music-uri').val();
        var musicId = musicUri.match(/\bv=([^&]+)/)[1];
        music[0].loadVideoById(musicId);
        music[0].setVolume(parseInt($('#music-volume').val(), 10));
        music[0].setLoop(true);
    }
});
