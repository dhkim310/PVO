

//--------------------------<VIEW Mode>-------------------------------------

//레코드중 하단 차트 및 버튼 보이기
async function ViewMode_Chart_Record()
{
    $('.messages').css("height","calc(100% - 235px)");  //265
    $('.sub_content').css("height","calc(100% - 225px)");  //255


    //제목지우기
    $('.title').empty();
    $('.title').append('<input id="subject_input" placeholder="제목 입력">');

    //저장일 지우기
    $('.ymdhis').empty();

    //---------------waveform의 항목 지우고 차트 캔버스 추가-----------------
    $('#waveform').empty();

    var add_canvas = '<canvas id="canvas1"></canvas>'
                    +'<canvas id="canvas2"></canvas>';

    $('#waveform').append(add_canvas);
    //-------------------------------------------------------------------


    //레코드 모드와 보기 모드에 따라 waveform, bottom_wrapper설정을 미세조정
    $('#waveform').css({"top":"-1px", "position": "relative", "height":"85px", "background-color":"#ffffff"});
    $('.bottom_wrapper').css({"clear":"both", "position": "absolute", "display":"block", "height":"140px", "background-color":"#ffffff"});


    //---waveform_btn의 항목 지우고 record_btn_template의 클론을 만들어 추가---
    $('#waveform_btn').remove();
    var aa;
    aa = $($('.record_btn_template').clone().html());

    $('.bottom_wrapper').append(aa);
    //---------------------------------------------------------------------

    //button_record.js에서 변수값들을 초기화
    Record_Set();

    //쓰기모드로 설정
    global_view_state = "W";

    //button_record.js에서 각 슬라이더 기능활성화
    mic1_volumn();
    mic2_volumn();
    speaker_volumn();

    //쓰기모드시 화자명 입력창 팝업
    $(".pop_speaker_name").show();


    //-------------<디폴트 화자명, 볼륨설정값 불러오기>------------

    var json_speaker_data = await get_speaker_data("json/record_name_data.html");
    var jsonObj = jQuery.parseJSON(json_speaker_data);

    //화자명을 디폴트로 입력
    $("#speaker1_input").val(jsonObj.speaker1_input_data);
    $("#speaker2_input").val(jsonObj.speaker2_input_data);

    //버튼하단에 있는 볼륨조절 함수
    Set_Vr_Mic1_Vol(jsonObj.mic1_volumn_data);
    Set_Vr_Mic2_Vol(jsonObj.mic2_volumn_data);

    //-------------</디폴트 화자명, 볼륨설정값 불러오기>------------

    //화자분리 모드변경 체크박스 상태 변경 시 함수 호출
    $('#checkbox_sd').change(ChangeMode_checkCheckboxes);
    $('#checkbox_nr').change(ChangeMode_checkCheckboxes);
}




//기록뷰중 하단 차트 및 버튼 보이기
async function ViewMode_Chart_View(main_idx)
{
    $('.messages').css("height","calc(100% - 195px)");  //175,225
    $('.sub_content').css("height","calc(100% - 185px)");  //215



    //-------------------------------DB에서 값을 불러올것------------------------------------
    var json_main_data = await get_main_data("json/view_main_data.html?main_idx="+main_idx+"");                   //메인데이터

    //DB에서 불러온 JSON데이털에서 오디어파일경로를 적용
    var jsonObj = jQuery.parseJSON(json_main_data);

    /*
   <div class="contents">
        <!-- (채팅화면) -->
        <div class="chat_window">
            <div class="top_menu">
                <div class="subject">
                   <div class="title">홍길동님 주택청약 신청문의</div>
                </div>
                <div class="ymdhis">녹음일자 2024년 1월 31일(수) 오후 2시 11분 8초</div>
*/

    //---제목---
    selecter = $(".contents .chat_window .top_menu .subject .title");
    $(selecter).empty();
    $(selecter).append(jsonObj.subject);


    //---녹음일자---
    selecter = $(".contents .chat_window .top_menu .ymdhis");
    $(selecter).empty();
    $(selecter).append("녹음일자 : " + jsonObj.from_date);


    //오디오파일명
    global_wave_file_name  = jsonObj.wave_file_name;        //wave_file_name = "wav/test_sample.wav";
    //-----------------------------------------------------------------------------------------


    $('#waveform').empty();


    //레코드 모드와 보기 모드에 따라 waveform, bottom_wrapper설정을 미세조정
    $('#waveform').css({"top":"-1px", "position": "relative", "height":"50px", "background-color":"#f2f8ff"});
    $('.bottom_wrapper').css({"clear":"both", "position": "absolute", "display":"block", "height":"100px", "background-color":"#ffffff"});


    //회의내용 불러오기
    setTimeout(function (){ return get_play_chatting_data("json/view_chat_data.html?main_idx="+main_idx+""); }, 100);

    //하단 차트의 메모위치 불러오기
    setTimeout(function (){ return get_playchart_memo_data("json/view_memo_data.html?main_idx="+main_idx+""); }, 100);

    //하단 차트의 북마크위치 불러오기
    setTimeout(function (){ return get_playchart_bookmark_data("json/view_bookmark_data.html?main_idx="+main_idx+""); }, 100);


    //-------------------------------------------

    //레코드화면이 있을경우 닫기
    $('#record_btn').remove();
    $('#waveform_btn').remove();


    //플레이조작버튼 추가
    var aa;
    aa = $($('.waveform_btn_template').clone().html());
    $('.bottom_wrapper').append(aa);

    //보기모드로 설정
    global_view_state = "V";


    //buttom_play.js에서 스피커크기조절 기능 활성화
    play_speaker_volumn();


    //buttom_play.js에서 재생속도변경 기능 활성화
    play_audioRate();

    //보기모드시 화자명 입력창 감추기
    $(".pop_speaker_name").hide();

    //파일명을 넘기고 차트를 생성
    create_wavesurfer(global_wave_file_name);
}


//메신저형태로 보기 / 리스트형태로 보기
function onChangeViewMode(main_idx)
{
    /*
    if(global_msg_view_mode == "B")
    {
        //내용을 변경한다.
        $("#ViewMode").html("발화자명으로 보기");
    }

    if(global_msg_view_mode == "M")
    {
        //내용을 변경한다.
        $("#ViewMode").html("메신저 형태로 보기");
    }
    */

    setTimeout(function (){ return get_play_chatting_data("json/view_chat_data.html?main_idx="+main_idx+""); }, 100);                    //회의록

    //그래프가 준비되면 몇초뒤에 스크롤 Value값을 불러온다(다 뿌려지지전에 값을 불러오면 값이 이상해짐. 개발자모드에서 확인가능)
     setTimeout(()=>Get_Messages_Scroll_value(), 1000);


    if(global_msg_view_mode == "M" || global_msg_view_mode == "" )
    {
        global_msg_view_mode = "B";
    }else{
        global_msg_view_mode = "M";
    }
}
//--------------------------</VIEW Mode>-------------------------------------



//녹취록탐색 뷰 데이터 불러오기
async function get_main_data(get_url)
{
/*
{
    "main_idx": 1111,
    "subject":"이보워님 요금제 상담 문의",
    "wave_file_name":"wav/test_sample.wav",
    "from_date":"2024년 1월 29일 (월) 오후 12시 48분 5초",
    "to_date":"오후 12시 56분 38초",
    "rectime":165,
    "modify_date":"2024년 1월 29일 (월) 오후 12시 58분"
}
*/

    var subject;
    var wave_file_name;
    var from_date;
    var to_date;
    var rectime;
    var modify_date;

    let response = await $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);

            subject         = jsonObj.subject;
            wave_file_name  = jsonObj.wave_file_name;
            from_date       = jsonObj.from_date;
            to_date         = jsonObj.to_date;
            rectime         = jsonObj.rectime;
            modify_date     = jsonObj.modify_date;

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_2.');
        }

    });


    return response;
}
























 //음성+메모 보기
/*
function view_voice_memo(){
    $(".messages").css("display","block");
    $(".memo").css("display","block");

    $(".messages").css("width","calc(100% - 50%)");

    $(".memo").css("left","calc(100% - 50%)");
    $(".memo").css("width","calc(100% - 50%)");

    //팝업메뉴를 닫는다.
    $(".popup_menu").remove();
}
*/
//음성만 보기
/*
function view_voice(){
    $(".messages").css("display","block");
    $(".memo").css("display","none");

    $(".messages").css("width","100%");
    //$(".memo").css("left","0%");
    //$(".memo").css("width","100%");

    //팝업메뉴를 닫는다.
    $(".popup_menu").remove();
}
*/
//메모만 보기
/*
function view_memo(){
    $(".messages").css("display","none");
    $(".memo").css("display","block");

    $(".memo").css("left","0%");
    $(".memo").css("width","100%");

    //팝업메뉴를 닫는다.
    $(".popup_menu").remove();
}
*/
