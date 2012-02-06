var music, talk;

var instrumentals = {
    lessig : {
        talk : [ 'http://www.youtube.com/watch?v=2YRCPTFjB3Q', 100 ],
        music : [ 'http://www.youtube.com/watch?v=6Hh3tciRim0', 30 ]
    },
    acai : {
        talk : [ 'http://www.youtube.com/watch?v=gRmd3OXs-qE', 100 ],
        music : [ 'http://www.youtube.com/watch?v=DripIUEVjjA', 50 ]
    }
};

function talkOnstateChange (state) {
    if (state === 0) { // ended
        setInterval(function () {
            var v = music[0].getVolume();
            music[0].setVolume(Math.floor(v * 0.99));
        }, 10);
    }
}

$(document).ready(function () {
    $('#playlist a').each(function () {
        var name = $(this).text();
        $(this).click(function () {
            var params = instrumentals[name];
            $('#talk-uri').val(params.talk[0]);
            $('#talk-volume').val(params.talk[1]);
            $('#music-uri').val(params.music[0]);
            $('#music-volume').val(params.music[1]);
            
            reload();
            if ($('#play').val() === 'play') $('#play').trigger('click');
        });
    });
    
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
    
    $('#reload').click(reload);
    
    function reload () {
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
