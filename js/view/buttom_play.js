

//재생 스피커 볼륨시
function play_speaker_volumn()
{
    var slider = $("#play_speaker_volumn");
    slider.on("input", function() {
        console.log("play_speaker_volumn:" + $(this).val());
    });
}

//재생속도 변경시
function play_audioRate()
{
    var slider = $("#play_audioRate");
    slider.on("input", function() {
        console.log("play_audioRate:" + $(this).val());

        //WaveSurfer의 재생속도를 변경
        wavesurfer.setPlaybackRate($(this).val());

        $("#play_audioRate_tooltip").html($(this).val());
        // 툴팁 위치 조정
        //const percent = (this.value - this.min) / (this.max - this.min);
        //const offset = percent * (this.offsetWidth - 30); // 30은 툴팁의 대략적인 너비입니다.
        //tooltipValue.style.left = $(this).val();
    });
}



//--------------------------<WaveSurfer Method>-------------------------------------

//------------<뒤로 몇초 이동>------------
function WavBackward(val)
{
    //wavesurfer.skipBackward();
    wavesurfer.skip(val);
}
//------------</뒤로 몇초 이동>------------


//------------<시작, 일시정지>------------
function WavPlayPause()
{
    if(tmp_state == 0)          //일시정지 상태일경우
    {
        wavesurfer.play();      //play
        tmp_state = 1;          //재생상태로 변경
        $("#id_btn_play").attr("src", $("#id_btn_play").attr("src").replace("play","pause"));

    }else if(tmp_state == 1){

        wavesurfer.pause();
        tmp_state = 0;          //일시정지상태로 변경
        $("#id_btn_play").attr("src", $("#id_btn_play").attr("src").replace("pause","play"));
    }
}
//------------</시작, 일시정지>------------


//------------<앞으로 몇초이동>------------
function WavForward(val)
{
    //wavesurfer.skipForward();
    wavesurfer.skip(val);
}
//------------</앞으로 몇초이동>------------


//모든 text클래스의 배경을 #ffffff으로 변경한다.
function Text_Select_empty()
{
    var not_select_text_div = $("input[id='start_time']").parent().parent().next().children();  //모든 text클래스

    //모든 text클래스의 text클래스의 배경을 #ffffff으로 변경
    $(not_select_text_div).each(function(){
        $(this).css({'backgroundColor':'#ffffff'});
    });
}


//모든 메모 text클래스의 배경을 #ffffff으로 변경한다.
function Memo_Select_empty()
{
     //-----------<memo>------------
    var not_select_text_div_memo = $("input[id='start_time_memo']").parent().next();  //text클래스
    //console.log("----------------" + not_select_text_div_memo);

    $(not_select_text_div_memo).each(function(){
        $(this).css({'backgroundColor':'#ffffff'});
    });
    //-----------</memo>-----------
}


//------------<Text를 클릭시 그래프 위치이동>------------
function WavPlay_range(start,end)
{
    Text_Select_empty();
    Memo_Select_empty();

    wavesurfer.play(start,end);
    tmp_state = 1;      //재생상태로 변경
    $("#id_btn_play").attr("src", $("#id_btn_play").attr("src").replace("play","pause"));

    //팝업메뉴를 닫는다.
    $(".popup_menu").remove();
}
//------------</Text를 클릭시 그래프 위치이동>------------




//------------<오디오 스피드를 조절한다>------------
//function change_duration(speed){
//
//    //팝업 스피드를 닫는다.
//    $(".popup_duration").remove();
//
//    wavesurfer.setPlaybackRate(speed);
//
//    //내용을 변경한다.
//    var selecter = $("#speed");
//    $(selecter).html(speed + "x");
//}
//------------</오디오 스피드를 조절한다>------------

//--------------------------</WaveSurfer Method>-------------------------------------




//하단 북마크 버튼 클릭시
function add_bookmark(){
    console.log("전역화된 현재초:" + global_time);


    var start_time_val = $("input[id='index'][value='"+global_select_index+"']").next().val();                //시작초
    var end_time_val = $("input[id='index'][value='"+global_select_index+"']").next().next().val();           //정지초
    var main_idx = $("input[id='index'][value='"+global_select_index+"']").next().next().next().val();         //main_idx

    //console.log("bookmark main_idx:" + main_idx +" index:" + global_select_index + " start_time:" +  start_time_val + " end_time:" +  end_time_val);

    ajax_submit_bookmark(main_idx, global_select_index, start_time_val, end_time_val);
}


function ajax_submit_bookmark(main_idx, index, start_time, end_time)
{
    //----<Ajax로 DB에 데이터를 저장>----
    var url = "json/save_bookmark.html?main_idx="+main_idx+"&index="+index+"&start_time="+start_time+"&end_time="+end_time;

    $.ajax({
        url: url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
            console.log(jsonObj);

            if(jsonObj.state == "Y")
            {
                //--Ajax성공할경우 아래작업 수행---

                var selecter = '#' + index;
                var text = $(selecter).text();
                console.log("bookmark_text:" + text);

                //하단차트에 북마크시점을 표시
                bottom_bookmark_point_insert(start_time, text);

                //메모 및 북마크의 배경색을 바꾼다
                apply_wavesurfer_marker_color();

                //-----대화창에 메모를 표시한다.
                var selecter = $("input[id='start_time'][value='"+start_time+"']").parent().parent().children().next().next().next().next().next(".bookmark_yn");  //bookmark_yn
                $(selecter).html("북마크");

                console.log(selecter);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_7.');
        }
    });
    //----</Ajax로 DB에 데이터를 저장>----
}



//하단 그래프에 북마크 시점 표시
function bottom_bookmark_point_insert(second, message)
{
    var option = {
                    time: second,
                    label: message,
                    color: '#e30aff',
                    position: 'bottom'
                 }


    wavesurfer.addMarker(option);
}



//텍스트 따라기기
function onFollowText()
{
    //버튼 형태의 체크박스를 만들고, 체크되었을 때 버튼의 색상이 바뀜
//     var button = document.getElementById("bt_text_follow");
//     button.classList.toggle("checked"); // 'checked' 클래스 토글


    $("#bt_text_follow").toggleClass("checked");
    global_text_follow_Checked = $("#bt_text_follow").hasClass("checked");

    console.log("텍스트 따라가기:" + isButtonChecked);

}




//------------<스피드 팝업을 띄운다>------------
/*
function change_audioRate(){

    var add_pop_duration =     '<div class="popup_duration">'
                                    +'<div class="duration" onclick="change_duration(0.8)">0.8x</div>'
                                    +'<div class="duration" onclick="change_duration(1)">1x</div>'
                                    +'<div class="duration" onclick="change_duration(1.2)">1.2x</div>'
                                    +'<div class="duration" onclick="change_duration(1.5)">1.5x</div>'
                                    +'<div class="duration" onclick="change_duration(1.8)">1.8x</div>'
                                    +'<div class="duration" onclick="change_duration(2)">2x</div>'
                                +'</div>';

    //var top = global_scroll_positon_arr[index]-150;
    $('body').append(add_pop_duration);


    //클릭한 영역의 text class를 읽어서
    //var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class

    var selecter = $("#speed");
    //선택자의 좌료를 읽음
    var selecter_offset = $(selecter).offset();

    //팝업의 top좌표 적용
    $(".popup_duration").css("top",selecter_offset.top - 180);
    $(".popup_duration").css("left",selecter_offset.left - 20);

}
*/
//------------</스피드 팝업을 띄운다>------------
