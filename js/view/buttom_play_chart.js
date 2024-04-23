//--------------------------</WaveSurfer>-------------------------------------
function create_wavesurfer(local_wave_file_name)
{
    $('#waveform').empty();

    // 객체 참조를 제거합니다.
    if(wavesurfer != null){
        wavesurfer = null;
    }


    /*--------<wavesurfer>---------*/
    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#2284f5',        /* 커서 오른쪽 영역의 색상. 즉, 파형 중 재생되지 않은 부분의 색상 */
        progressColor: '#f76103',    /* 커서 왼쪽 영역의 색상. 즉, 파형 중 재생된 부분의 색상 */
        cursorColor: "OrangeRed",    /* 커서 색상 */
        barWidth:1,                  /* 그래프 바 두께 */
        //barRadius: 1,
        //responsive: true,
        //normalize: true,
        audioRate: 1,                /* 재생속도 */
        height:50,
        barHeight: 9.9,              /* 그래프 바 높이 */
        skipLength: 5,               /*skipForward(),skipBackward()시 이동(초) 설정 */
        backend: 'MediaElement',
        plugins: [
                    WaveSurfer.markers.create({
                        markers: [
                                    /*
                                    {
                                        time: 0,
                                        label: "BEGIN",
                                        color: '#ff990a'
                                    },
                                    {
                                        time: 5.5,
                                        label: "V1",
                                        color: '#ff990a'
                                    },
                                    {
                                        time: 10,
                                        label: "V2",
                                        color: '#00ffcc',
                                        position: 'top'
                                    },
                                    {
                                        time: 24,
                                        label: "END",
                                        color: '#00ffcc',
                                        position: 'top'
                                    }
                                    */
                                ]

                    })
                ]
        /*
        audioContext	object	none	미리 생성된 AudioContext를 사용하도록 함
        audioRate	    float	1	    재생 속도. 정상속도는 1.
        barHeight	    number	1	    웨이브 폼 막대들의 높이. 1 보다 높은 값을 주면 더 길어지고 그 반대는 작아진다.
        barWidth	    number	none	웨이브 폼 막대들의 넓이. 넓이에 따라 ▁ ▂ ▇ ▃ ▅ ▂ 처럼 생긴 막대를 생성하게 된다.
        container	    mixed	none	웨이브 폼이 그려질 오브젝트의 CSS 선택자 또는 HTML 요소를 전달한다. 유일한 필수 옵션.
        cursorColor	    string	#333	현재 위치를 나타내는 커서의 색상을 설정함.
        cursorWidth	    integer	1	    커서의 넓이.
        fillParent	    boolean	true	부모 요소의 넓이를 가득 채워서 렌더링 할지 아니면minPxPerSec 옵션에 따라 렌더링할지를 선택함.
        height	        integer	128	    웨이브 폼 전체의 높이
        hideScrollbar	boolean	false	가로 스크롤바 표시 여부
        minPxPerSec	    integer	50	    오디오 파일의 1초당 렌더링 될 픽셀 수의 최소값
        normalize	    boolean	false	true 이면 가장 큰 막대의 길이에 비례하여 막대 높이 설정
        progressColor	string	#555	커서 왼쪽 영역의 파형 색상. 즉, 파형 중 재생된 부분의 색상
        responsive	    boolean	true	반응형 웨이브폼 여부
        scrollParent	boolean	false	웨이브 폼이 부모 요소보다 길어서 넘치는 경우 스크롤바를 이용하도록 할 것인지 아니면 부모 요소의 길이에 맞게 줄여서 렌더링할 것인지를 설정.
        waveColor	    string	#999	커서 오른쪽 영역의 색상. 즉, 파형 중 재생되지 않은 부분의 색상
        */
    });

    wavesurfer.on('error', function (e) {
        console.warn("wavesurfer_error:" + e);
    });

    wavesurfer.load(local_wave_file_name);


    //--------------------------<WaveSurfer EVENT>-------------------------------------

    wavesurfer.on("_onMouseUp", function (marker) {
        console.log("marker_onMouseUp", marker);
      });

    wavesurfer.on("marker-click", function (marker) {
        console.log("marker-click", marker);
      });

    wavesurfer.on('loading', function (percent, xhr) {
        //progressDiv.style.display = 'block';
        //progressBar.style.width = percent + '%';
        console.log("PERCENT:" + percent + "%");
    });

    wavesurfer.on('ready', function () {
        //progressDiv.style.display = 'none';
        //그래프가 준비되면 몇초뒤에 스크롤 Value값을 불러온다(다 뿌려지지전에 값을 불러오면 값이 이상해짐. 개발자모드에서 확인가능)
        setTimeout(()=>Get_Messages_Scroll_value(), 1000);

        var all_time = wavesurfer.getDuration();
        all_time = parseInt(all_time);  //소수점 없앰

        console.log("getDuration():" + all_time);
        $("#end_sec").html(SecondToHis(all_time));
    });

    //Play가 끝나면..버튼상태를 처음으로 돌림
    wavesurfer.on('finish', function () {
        tmp_state = 0;  //일시정지상태로 변경
        $("#id_btn_play").attr("src", $("#id_btn_play").attr("src").replace("pause","play"));
    });

    //그래프의 위치를 클릭할경우
    wavesurfer.on('seek', function(){
        Text_Select_empty();
        Memo_Select_empty();
        console.log("seek------------------");
    });

    //------------<PLAY중일떄>------------
    var bSelect = false;
    var next_val = 0;
    var select_count = 0;


    wavesurfer.on('audioprocess', function () {
        //---------1.현재초를 가져옴-------------
        var time = wavesurfer.getCurrentTime();     //플레이 초를 가져옴
        var number = parseInt(time);                //10.328255 이런식이므로 -> 10으로 변경
        global_time = number;                       //다른곳에서 참조할수있게 전역화

        console.log("현재초:" + number);

        $("#start_sec").html(SecondToHis(number));  /* play초를 표시 */

        //---------1.5 아래 선택자를 위한 참고데이터-------------
         /*
        <div class="profile">
            <div class="id"></div>
            <div class="avatar"></div>
            <div class="name"></div>
            <div class="st_time"></div>
            <div class="ed_time"></div>
            <div class="data">
                <input type='text' id='index'       value='"+_this.index+"'>";
                <input type='text' id='start_time'  value='"+_this.st_time+"'>
                <input type='text' id='end_time'    value='"+_this.ed_time+"'>
                <input type='text' id='main_idx'     value='work_"+_this.index+"'>
            </div>
        </div>
        <div class="text_wrapper">
            <div class="text"></div>
        </div>
        */



        //---------5.만약 현재(초)와 end_time값이 같을경우가 어쩌다 존재할경우 배경을 #ffffff으로 변경한다.-------------
        if(number == next_val)
        {
            bSelect = false;
        }

        //---------2.전체 text클래스의 색을 변경-------------
        if(bSelect == false)
        {
            //전체 text클래스의 배경을 #ffffff으로 변경한다.
            var not_select_text_div = $("input[id='start_time']").parent().parent().next().children();  //text클래스
            //console.log(select_text_div);

            $(not_select_text_div).each(function(){
                $(this).css({'backgroundColor':'#ffffff'});
            });

            //-----------<memo>------------
            var not_select_text_div_memo = $("input[id='start_time_memo']").parent().next();  //text클래스
            //console.log("----------------" + not_select_text_div_memo);

            $(not_select_text_div_memo).each(function(){
                $(this).css({'backgroundColor':'#ffffff'});
            });
            //-----------</memo>-----------
        }


        //---------3.동일한값이 있을경우 배경색을변경-------------
        //실시간 변하는(초)에서...현재 변하는(초)가 현재(초)=(start_time)에 해당하는value값이 있을경우 그text클래스를 가져와서
        var select_text_div = $("input[id='start_time'][value='"+number+"']").parent().parent().next().children();  //parent()=st_time/parent()=profile/next()=text_wrapper/child() = text
        //-----------<memo>------------
        var select_text_div_memo = $("input[id='start_time_memo'][value='"+number+"']").parent().next();
        //-----------</memo>-----------

        //그text클래스에 값이있으면
        if(select_text_div.length > 0)
        {
            //end초를 가져오고.. 현재text 클래스의 배경을 변경한다.
            next_val = $("input[id='start_time'][value='"+number+"']").next().val();    //next()=end_time/val()=값


            if(select_count == 0)   //한번만 작동하기위해
            {
                //선택된 text div의 배경을 변경
                $(select_text_div).css("background-color","#c5efff");
                //-----------<memo>------------
                $(select_text_div_memo).css("background-color","#fffcac");
                //-----------</memo>-----------

                //한동안 흰색배경으로 바뀌지않게 고정
                bSelect = true;

                //-------<scroll_position의 index를 가져옴>------
                var this_scroll_position_obj = $("input[id='start_time'][value='"+number+"']").parent().parent().next().next(); //data/profile/text_wrapper/scroll_posion
                //this_scroll_position_obj의 값은 div.scroll_position임
                //this_scroll_position_obj의 index정보를 스크롤위치값에 전달함
                var this_scroll_position_index = $('.scroll_position').index(this_scroll_position_obj);

                //console.log("tt:" + this_scroll_position_obj + "  bb:" + this_scroll_position_index);
                //---------------------------------------------

                //----------<선택좌표로 이동하기위해>---------
                //선택된 좌표의 index값을 가져온다.
                var select_index_val = $("input[id='start_time'][value='"+number+"']").prev().val();
                global_select_index = select_index_val;     //값을 참고하기위해 전역화한다.

                //배열에 저장된 값에서 index값 위치에있는 값을 적용한다.
                var scroll_top = global_scroll_positon_arr[this_scroll_position_index]-350;

                //하단버튼의 "텍스트 따라가기" 체크시..
                if(global_text_follow_Checked == true)
                {
                    $('.messages').animate({scrollTop : scroll_top}, 500);
                }

                //----------</선택좌표로 이동하기위해>---------

                console.log("PLAY------------------------------------------------------");
                console.log("index:" + select_index_val + "  Scroll좌표:" + scroll_top + "  length:" + select_text_div.length + "  현재초:" + number + "   end_time:" + next_val);
            }
            select_count++;

        }else{
            //아닐경우 초기화
            select_count = 0;
        }

        //---------4.다음값이 있을때까지 배경색을 유지-------------
        //end초는 위의 value값이 있을경우에 한번만 가져올테니 number값보다 작을것이고..
        //현재(초)는 다음 start_time이 존재하는나, end_time(next_val)보다 작을경우 선택을 유지한다.
        //아닐경우(false)는 전체 text클래스를 #ffffff색상으로 변경한다.
        if(number < next_val)
        {
            bSelect = true;

        }else{
            bSelect = false;
        }

        //-----------<memo>------------

        //-----------</memo>-----------
        //start_time_memo
    });

    //------------</PLAY중일떄>------------

    //------------<PAUSE중일떄>------------
    wavesurfer.on('pause', function () {
        //PLAY할수있게 이미지변경
        tmp_state = 0;   //일시정지상태로 변경
        $("#id_btn_play").attr("src", $("#id_btn_play").attr("src").replace("pause","play"));
    });
    //------------</PAUSE중일떄>------------

    //--------------------------</WaveSurfer EVENT>-------------------------------------

    /*--------<wavesurfer>---------*/
}
//--------------------------</WaveSurfer>-------------------------------------


function get_playchart_memo_data(get_url)
{
    $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
            var listLen = jsonObj.view_memo_datas.length;

            for(var i=0; i<listLen; i++)
            {
                var main_idx    = jsonObj.view_memo_datas[i].main_idx;
                var index      = jsonObj.view_memo_datas[i].index;
                var start_time = jsonObj.view_memo_datas[i].start_time;
                var end_time   = jsonObj.view_memo_datas[i].end_time;
                var memo       = jsonObj.view_memo_datas[i].memo;


                //하단그래프에 메모시점을 추가한다.
                bottom_memo_point_insert(start_time, "");

                console.log(main_idx +","+ index +","+ start_time +","+ end_time +","+ memo +","+ location);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_2.');
        }

    });
}



//북마크 불러오기
function get_playchart_bookmark_data(get_url)
{
    $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
            var listLen = jsonObj.view_bookmark_datas.length;

            for(var i=0; i<listLen; i++)
            {
                var main_idx    = jsonObj.view_bookmark_datas[i].main_idx;
                var index      = jsonObj.view_bookmark_datas[i].index;
                var start_time = jsonObj.view_bookmark_datas[i].start_time;
                var end_time   = jsonObj.view_bookmark_datas[i].end_time;

                //Add_memo_content(main_idx, index, start_time,  end_time);
                bottom_bookmark_point_insert(start_time, "");

                console.log(main_idx +","+ index +","+ start_time +","+ end_time);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_3.');
        }

    });
}


