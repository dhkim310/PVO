//--------------------------<VIEW Mode>-------------------------------------

//레코드중 하단 차트 및 버튼 보이기
function ViewMode_Chart_Record()
{
    $('.messages').css("height","calc(100% - 235px)");  //265
    $('.sub_content').css("height","calc(100% - 225px)");  //255


    $('#waveform').empty();

    var add_canvas = '<canvas id="canvas1"></canvas>'
                    +'<canvas id="canvas2"></canvas>';

    $('#waveform').append(add_canvas);
    //----------------------

    $('#waveform').css({"top":"-1px", "position": "relative", "height":"85px", "background-color":"#ffffff"});
    $('.bottom_wrapper').css({"clear":"both", "position": "absolute", "display":"block", "height":"140px", "background-color":"#ffffff"});

    //-------------------------------------------

    $('#waveform_btn').remove();
    var aa;
    aa = $($('.record_btn_template').clone().html());

    $('.bottom_wrapper').append(aa);

    Record_Set();

    global_view_state = "W";  //쓰기모드


    mic1_volumn();
    mic2_volumn();
    speaker_volumn();

    //쓰기모드시 화자명 입력창 팝업
    $(".pop_speaker_name").show();
}




//기록뷰중 하단 차트 및 버튼 보이기
function ViewMode_Chart_View()
{
    $('.messages').css("height","calc(100% - 195px)");  //175,225
    $('.sub_content').css("height","calc(100% - 185px)");  //215

    $('#waveform').empty();

    $('#waveform').css({"top":"-1px", "position": "relative", "height":"50px", "background-color":"#f2f8ff"});
    $('.bottom_wrapper').css({"clear":"both", "position": "absolute", "display":"block", "height":"100px", "background-color":"#ffffff"});

    wave_file_name = "wav/test_sample.wav";         //오디오파일명

    setTimeout(function (){ return get_play_chatting_data("A123456", "json/view_data.html?workid=A123456",""); }, 100);                    //회의록
    setTimeout(function (){ return get_playchart_memo_data("A123456", "json/view_memo_data.html?workid=workid"); }, 100);               //하단 차트 메모
    setTimeout(function (){ return get_playchart_bookmark_data("A123456", "json/view_bookmark_data.html?workid=workid"); }, 100);           //하단 차트 북마크


    //파일명을 넘기고 차트를 생성
    create_wavesurfer(wave_file_name);

    //-------------------------------------------

    //레코드화면 닫기
    $('#record_btn').remove();

    //플레이조작버튼 추가
    var aa;
    aa = $($('.waveform_btn_template').clone().html());
    $('.bottom_wrapper').append(aa);


    global_view_state = "V";  //보기모드


    //기능함수
    play_speaker_volumn();
    play_audioRate();

    //보기모드시 화자명 입력창 감추기
    $(".pop_speaker_name").hide();
}



function onChangeViewMode()
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

    setTimeout(function (){ return get_play_chatting_data("A123456", "json/view_data.html?workid=A123456"); }, 100);                    //회의록

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
