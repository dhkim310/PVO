function account(){
    $("#whole").hide();
    $("#registration").show();
    $(".explanation").css({
        "top": "315px"
    });
}

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

function start_Recording(bStart) {

    console.log("1--------------------------<Recording started>");

    var constraints = {
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            mozNoiseSuppression: false,
            mozAutoGainControl: false
        }, video: false
    }

    // navigator.mediaDevices.getUserMedia(constraints)는 사용자의 오디오 미디어 가져옴
    // constraints 객체를 통해 오디오 설정을 지정
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        //미디어 스트림을 성공적으로 가져오면 AudioContext를 생성
        audioContext = new AudioContext({sampleRate: 16000});
        gumStream = stream;

        // 오디오 스트림 소스를 생성
        input = audioContext.createMediaStreamSource(stream);

        /* Create an analyser node */
        analyser = audioContext.createAnalyser();
        input.connect(analyser);

        /* Create a script processor node */
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        /* Connect the script processor node */
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        //Recorder 객체를 생성하고 녹음을 시작
        rec = new Recorder(input, {numChannels: 1});
        rec.record();

        /* Respond to the audio process event. */
        javascriptNode.onaudioprocess = function () {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

            var values = 0;

            var length = array.length;
            for (var i = 0; i < length; i++) {
                values += array[i];
            }

            var average = values / length;

            /* Normalize the volume */
            var volume = Math.floor((average / 128) * 100);  // 정규화 계수를 255에서 128로 변경  //동일한 입력 볼륨에 대해 더 높은 출력 볼륨이 측정
            //console.log(volume);

            drawMic(volume);
        }

    }).catch(function (err) {
        $(".stop").trigger("click");
        alert("마이크를 연결 해주세요");
        console.log("getUserMedia() fails");
    });
}

drawMic(0);

/* visualizer */
function drawMic(inputData) {
    if (inputData < 0) {
        inputData = 0;
    } else if (inputData > 100) {
        inputData = 100;
    }

    var inCircle_W_H = 100 / 2;      //circle3의 정사이즈 너비,높이값 / 2
    var percentage;

    if (inputData === 0) {
        percentage = inCircle_W_H;   //circle3 너비,높이값인 100

    } else if (inputData >= 100) {
        percentage = 99;
        ``
    } else {
        percentage = inCircle_W_H + (inputData * ((100 - inCircle_W_H) / 100));     //circle3 너비,높이값인 65 + (inputdata) *  ((100-65)/100)
    }


    $("#circle2").css('width', percentage + '%');
    $("#circle2").css('height', percentage + '%');

    // console.log("inputData:" + inputData + "  percent:" + percentage + "%");
}

/* curve */
$('#center-container').css({
    'background': '#22425f url(/VOIS/sttsv-visualizer/img/only-curve-1.svg) center',
    'background-size': '100% auto',
    'background-repeat': 'no-repeat'
});
