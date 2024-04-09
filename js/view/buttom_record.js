//--------------------------<RECORD>---------------------------------------
//실시간 차트를
function Record_Set()
{
    buffer1 = []; //버퍼 비우기
    buffer2 = [];

    canvas1 = null;
    canvas2 = null;

    ctx1 = null;
    ctx2 = null;

    audioContext = null;
    analyser     = null;

    canvas1 = document.getElementById('canvas1');
    canvas2 = document.getElementById('canvas2');

    canvas1.width = window.innerWidth;            //첫 번째 캔버스의 너비를 브라우저 창의 너비로 설정
    canvas1.height = window.innerHeight / 2;      //첫 번째 캔버스의 높이를 브라우저 창의 높이의 절반으로 설정
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight / 2;

    ctx1 = canvas1.getContext('2d');          //첫 번째 캔버스의 2D 렌더링 컨텍스트를 가져옵니다
    ctx2 = canvas2.getContext('2d');

    audioContext = new window.AudioContext();
    analyser     = audioContext.createAnalyser();
}


function CheckInputSubjectName()
{
    //제목을 입력했는지 검사
    if($.trim($("#subject_input").val())=='')
    {
        alert("제목을 입력해주세요.");
        $("#subject_input").focus();
        return false;
    }

    if($.trim($("#speaker1_input").val())=='')
    {
        alert("이름을 입력해주세요.");
        $("#speaker1_input").focus();
        return false;
    }

    if($.trim($("#speaker2_input").val())=='')
    {
        alert("이름을 입력해주세요.");
        $("#speaker2_input").focus();
        return false;
    }
}

//가녹취 팝업
function onFakeRecord()
{
    //제목과 이름을 입력했는지 검사
    if(false == CheckInputSubjectName())
    {
        return false;
    }

    // 배경 어둡게
    $(".shadow").show();

    //가녹취 팝업창 띄우기
     var html = '<div class="popup_fake_record_msg">'
                    +'<div class="fake_record_msg">가녹취를 시작합니다.</div>'
                    +'<div class="btn">'
                        +'<div class="ok_btn" id="ok_btn">확인</div>'
                        +'<div class="cancel_btn" id="cancel_btn">취소</div>'
                    +'</div>'
                +'</div>';
    $('body').append(html);

    //스크롤 막기
    $('.wrap').on('scroll touchmove mousewheel', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
        });


    //확인버튼
    $('#ok_btn').click(function(){

        global_record_mode = "FAKE";   //가 녹취모드로 변경
        onRecord();

        $(".popup_fake_record_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });

    //취소버튼
    $('#cancel_btn').click(function(){
        $(".popup_fake_record_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });
}



//-----위의 onFakeRecord()함수를 나중에 다시 대입하기위해 백업해둔다.-----
backup_func_FakeRecord = onFakeRecord;

//실녹취 팝업
function onRealRecord()
{
    //제목과 이름을 입력했는지 검사
    if(false == CheckInputSubjectName())
    {
        return false;
    }

    // 배경 어둡게
    $(".shadow").show();

    //실녹취 팝업창 띄우기
     var html = '<div class="popup_real_record_msg">'
                    +'<div class="real_record_msg">실녹취를 시작합니다.</div>'
                    +'<div class="btn">'
                        +'<div class="ok_btn" id="ok_btn">확인</div>'
                        +'<div class="cancel_btn" id="cancel_btn">취소</div>'
                    +'</div>'
                +'</div>';
    $('body').append(html);

    //스크롤 막기
    $('.wrap').on('scroll touchmove mousewheel', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
        });


    //확인버튼
    $('#ok_btn').click(function(){

        //가녹취, 레코딩중이라면...
        if(global_record_mode == "FAKE" && global_record_state == "RECORD")
        {
            RecordStop();  //정지후
        }

        global_record_mode = "REAL";   //실녹취모드로 변경
        onRecord();


        $(".popup_real_record_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });

    //취소버튼
    $('#cancel_btn').click(function(){
        $(".popup_real_record_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });
}


//녹취
function onRecord()
{
    //가녹취
    if(global_record_mode == "FAKE")
    {
        global_record_state = "RECORD"; //레코딩중
        $('#bt_mic_img').attr("src","img/chat/record_mic.png");

        //onclick="onFakeRecord()"함수를 onRealRecord()로 변경
        onFakeRecord = onRealRecord;

        //웹소켓 서버에 접속

        //웹소켓접속후 "fake"메세지 전송
    }

    //실녹취
    if(global_record_mode == "REAL")
    {
        global_record_state = "RECORD"; //레코딩중
        $('#bt_mic_img').attr("src","img/chat/record_mic_pause.png");

        //onclick="onFakeRecord()"함수를 onRecordPause()로 변경
        onFakeRecord = onRecordPause;

        //웹소켓 서버에 접속되어있다면...

        //"real"메세지 전송
    }

    //-------------<테스트용 실적용시 필요없음>---------------------
    //미적용시 timer관련 지울것
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(mediaStream) {

        stream = mediaStream;
        var source = audioContext.createMediaStreamSource(stream);          //오디오 스트림을 가져와서 웹 오디오 API의 AnalyserNode에 연결하고, 이를 통해 오디오 데이터를 추출
        source.connect(analyser);

        timer = setInterval(function() {
          var dataArray = new Float32Array(analyser.frequencyBinCount);     //데이터를 두 개의 Float32Array 배열에 저장합니다.

          analyser.getFloatTimeDomainData(dataArray);                       //AnalyserNode로부터 오디오 데이터를 가져와서 buffer에 저장합니다.

         //-----차트데이터 추가부분------
          buffer1.push(dataArray[0]);
          buffer2.push(dataArray[100]);

        }, 20);   //40,30,20적당(최소 20이하는 하지말것, 넣는속도보다 그리는속도가 느려짐)


        // AudioContext 재시작
        audioContext.resume().then(function() {
          draw();
        });

      });
    //-------------</테스트용 실적용시 필요없음>---------------------
}



function onRecordPause()
{
    RecordStop();

    $(".shadow").show(); // 배경 어둡게

     var html = '<div class="popup_pause_record_msg">'
                    +'<div class="pause_record_msg">일시정지</div>'
                    +'<div class="btn">'
                        +'<div class="continue_btn" id="continue_btn">이어하기</div>'
                        +'<div class="save_btn" id="save_btn">저장</div>'
                        +'<div class="exit_btn" id="exit_btn">저장안하고나가기</div>'
                    +'</div>'
                +'</div>';
    $('body').append(html);

    //스크롤 막기
    $('.wrap').on('scroll touchmove mousewheel', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
        });


    //이어하기
    $('#continue_btn').click(function(){

        //이어하기
        global_record_mode = "REAL";   //실녹취모드로 변경
        onRecord();

        $(".popup_pause_record_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });

    //저장
    $('#save_btn').click(function(){

        //정지후
        RecordStop();

        //저장

        //나가기

        $(".popup_pause_record_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });

    //저장안하고 나가기
    $('#exit_btn').click(function(){

        //정지후
        RecordStop();

        //DB삭제

        //나가기

        $(".popup_pause_record_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });
}


function popupRecordFirstMsg()
{
    $(".shadow").show(); // 배경 어둡게

     var html = '<div class="popup_record_first_msg">'
                    +'<div class="record_first_msg">녹취를 먼저 시작해주세요</div>'
                    +'<div class="btn">'
                        +'<div class="ok_btn" id="ok_btn">확인</div>'
                    +'</div>'
                +'</div>';
    $('body').append(html);

    //스크롤 막기
    $('.wrap').on('scroll touchmove mousewheel', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
        });


    //
    $('#ok_btn').click(function(){

        $(".popup_record_first_msg").remove();
        $('.shadow').hide(); // 배경 어둡게 삭제

        //스크롤 막기 해제
        $('.wrap').off('scroll touchmove mousewheel');
    });
}

function onRecordStop()
{
    if(global_record_mode == "" || global_record_state == "STOP")
    {
        popupRecordFirstMsg();
        return;
    }


    $('#bt_mic_img').attr("src","img/chat/fake_record_mic.png");

    //onclick="onFakeRecord()"함수를 백업해둔 onFakeRecord로 변경하여 원상복구시킴
    onFakeRecord = backup_func_FakeRecord;

    RecordStop();
}


function RecordStop()
{
    global_record_state = "STOP"; //record stop으로 변경


    //-------------<테스트용 실적용시 필요없음>---------------------
    //미적용시 timer관련 지울것

    if (stream) {
      clearInterval(timer); //타이머 종료

      stream.getTracks().forEach(function(track) {
        track.stop();
      });

    }
    //-------------</테스트용 실적용시 필요없음>---------------------
}



function draw()
{
    //첫 번째 버퍼의 길이가 캔버스의 너비보다 크면, 가장 오래된 데이터를 제거합니다.
    if (buffer1.length > canvas1.width) buffer1.shift();
    if (buffer2.length > canvas2.width) buffer2.shift();

    //첫 번째 캔버스를 지웁니다.
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx1.beginPath(); //새로운 경로를 시작합니다.

    for (var i = 0; i < buffer1.length; i++)
    {
        var v1 = buffer1[i] * (canvas1.height * 5);       //첫 번째 버퍼의 i번째 값을 캔버스 높이의 5배만큼 확대하여 v1에 저장합니다.
        var y1 = canvas1.height / 2 + v1;                 //y1 좌표는 캔버스의 절반 높이에서 v1 값을 더한 위치입니다.
        ctx1.fillRect(i, y1, 2, canvas1.height / 2 - y1); // 봉을 그립니다.
        ctx1.fillRect(i, y1, 2, -v1 * 2);                 // 봉을 그립니다.(위의 반대 그래프)
    }
    ctx1.fillStyle = 'rgb(34, 132, 245)'; // 첫 번째 파형의 색상을 빨간색으로 설정합니다.
    ctx1.fill(); // 봉을 채웁니다.

    if (isMerged)
    {
        for (var i = 0; i < buffer2.length; i++)
        {
            var v2 = buffer2[i] * (canvas1.height * 5);
            var y2 = canvas1.height / 2 + v2;
            ctx1.fillRect(i, y2, 2, canvas1.height / 2 - y2); // 봉을 그립니다.
            ctx1.fillRect(i, y2, 2, -v2 * 2);                 // 봉을 그립니다.(위의 반대 그래프)
        }
        ctx1.fillStyle = 'rgb(247, 97, 3)'; // 두 번째 파형의 색상을 초록색으로 설정합니다.
        ctx1.fill(); // 봉을 채웁니다.
    } else {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        for (var i = 0; i < buffer2.length; i++)
        {
            var v2 = buffer2[i] * (canvas2.height * 5);
            var y2 = canvas2.height / 2 + v2;
            ctx2.fillRect(i, y2, 2, canvas2.height / 2 - y2); // 봉을 그립니다.
            ctx2.fillRect(i, y2, 2, -v2 * 2);                 // 봉을 그립니다.(위의 반대 그래프)
        }
        ctx2.fillStyle = 'rgb(247, 97, 3)'; // 두 번째 파형의 색상을 초록색으로 설정합니다.
        ctx2.fill(); // 봉을 채웁니다.
    }

    // 다음 애니메이션 프레임에서 draw 함수를 다시 호출하도록 요청합니다.
    requestAnimationFrame(draw);
}
//--------------------------</RECORD>---------------------------------------


//레코드 마이크1 볼륨시
function mic1_volumn()
{
    var slider = $("#mic1_volumn");
    slider.on("input", function() {
        console.log("mic1_volumn:" + $(this).val());

        Set_Vr_Mic1_Vol($(this).val());
    });
}

//레코드 마이크2 볼륨시
function mic2_volumn()
{
    var slider = $("#mic2_volumn");
    slider.on("input", function() {
        console.log("mic2_volumn:" + $(this).val());

        Set_Vr_Mic2_Vol($(this).val());
    });
}

//Java를 통해 화자분리 마이크1 볼륨을 쉡스크립트로 저장하기
function Set_Vr_Mic1_Vol(volume)
{
    //java를 통해 마이크1 볼륨 처리...

    //mic1의 슬라이더를 이동
    $("#mic1_volumn").val(volume);

    console.log("마이크1 볼륨을:" + volume + "% 으로 조정하였습니다.");
}

//Java를 통해 화자분리 마이크2 볼륨을 쉡스크립트로 저장하기
function Set_Vr_Mic2_Vol(volume)
{
    //java를 통해 마이크2 볼륨 처리...

    //mic2의 슬라이더를 이동
    $("#mic2_volumn").val(volume);

    console.log("마이크2 볼륨을:" + volume + "% 으로 조정하였습니다.");
}

//레코드 스피커 볼륨시
function speaker_volumn()
{
    var slider = $("#speaker_volumn");
    slider.on("input", function() {
        console.log("speaker_volumn:" + $(this).val());
    });
}


//화자분리 모드변경 체크박스 상태 변경시 BackEnd에서 화자분리쪽으로 웹소켓방식으로 데이터를 보냄
function ChangeMode_checkCheckboxes()
{
    var checkbox_sd = $('#checkbox_sd').is(':checked');
    var checkbox_nr = $('#checkbox_nr').is(':checked');
    var output = "";

    if (!checkbox_sd && !checkbox_nr)
    {
        output = "wr_off";
    } else if (checkbox_sd && !checkbox_nr)
    {
        output = "wr_a__";
    } else if (!checkbox_sd && checkbox_nr)
    {
        output = "wr_b__";
    } else if (checkbox_sd && checkbox_nr)
    {
        output = "wr_ab_";
    }

    console.log("화자분리 모드변경:" + output);

    //----<Ajax로 DB에 데이터를 저장>----
    var url = "json/change_mode.html?mode="+output+"";

    $.ajax({
        url: url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
			console.log(jsonObj);

			if(jsonObj.state != "Y")
			{
                alert("모드변경 실패");
			}

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_1.');
        }

    });
}

