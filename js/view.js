// variables
//let userName = null;
//let state = 'SUCCESS';

    // functions
    function Message(arg)
    {
        this.index = arg.index;
        this.text = arg.text;
        this.name = arg.name;
        this.memo_yn = arg.memo_yn;
        this.bookmark_yn = arg.bookmark_yn;
        this.st_time = arg.st_time;
        this.ed_time = arg.ed_time;
        this.message_side = arg.message_side;
        this.work_id = arg.work_id;
        this.speaker = arg.speaker;
        this.message_side = arg.message_side;

        this.draw = function (_this)
        {
            return function ()
            {
                var $message;
                $message = $($('.message_template').clone().html());

                //$message.find('.id').html("id" + _this.index);
                //$message.find('.avatar').html("<img src=img/chat/icon"+this.speaker+".svg>");
                $message.find('.name').html(_this.name);
                $message.find('.name').attr("onclick", "change_profile_form(\""+_this.work_id+"\",\""+_this.name+"\","+_this.index+","+_this.speaker+")");  //name 찾아서 onclcik함수및 값을 추가
                $message.find('.name').attr('id', 'id_name_'+_this.index);
                $message.find('.st_time').html(SecondToHis(_this.st_time));
                $message.find('.ed_time').html(SecondToHis(_this.ed_time));

                if(_this.memo_yn == "Y")
                {   $message.find('.memo_yn').html("메모");
                }else{
                    $message.find('.memo_yn').html(_this.memo_yn);
                }

                if(_this.bookmark_yn == "Y")
                {   $message.find('.bookmark_yn').html("북마크");
                }else{
                    $message.find('.bookmark_yn').html(_this.bookmark_yn);
                }


                var value =  "<input type='text' id='index' width='5px' value='"+_this.index+"'>";
                    value += "<input type='text' id='start_time' value='"+_this.st_time+"'>";
                    value += "<input type='text' id='end_time' value='"+_this.ed_time+"'>";
                    value += "<input type='text' id='work_id' width='5px' value='"+_this.work_id+"'>";

                $message.find('.data').html(value);
                $message.find('.message_menu').html("<input type='image' class='message_menu_img' id='id_message_menu_img_"+_this.index+"' src='img/chat/3.png'  onclick='Memu_pop(\""+_this.work_id+"\","+_this.index+","+_this.st_time+","+_this.ed_time+")'>");


                $message.find('.text').html(_this.text);           //text클래스를 찾아서 text내용을 넣고 message_side를 추가?
                $message.find('.text').attr('id',_this.index);     //text클래스를 찾아서 id및 값을 추가
                $message.find('.text').attr("onclick", "WavPlay_range("+_this.st_time+","+_this.ed_time+")");  //text클래스를 찾아서 onclcik함수및 값을 추가

                $message.find('.text_wrapper').attr("onmouseover", "menu_mouse_over("+_this.index+")");  //text_wrapper 클래스에 onmouseover="menu_mouse_over(n)" 함수를 추가
                $message.find('.text_wrapper').attr("onmouseout", "menu_mouse_out("+_this.index+")");    //text_wrapper 클래스에 onmouseover="menu_mouse_out(n)" 함수를 추가

                $message.addClass(this.message_side);

                $('.messages').append($message);

                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    }


    function sendMessage(work_id, index, speaker, name, st_time, ed_time, memo_yn, bookmark_yn, text, message_side)
    {
        var $messages, message;
        $('.message_input').val('');
        $messages = $('.messages');
        message = new Message({
            index: index,
            text: text,
            name: name,
            memo_yn: memo_yn,
            bookmark_yn: bookmark_yn,
            st_time: st_time,
            ed_time: ed_time,
            message_side: message_side,
            work_id: work_id,
            speaker: speaker,
            message_side: message_side
        });
        message.draw();
        $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 1);
    }



    function SecondToHis(seconds)
    {
        var hour, min, sec;

        hour = parseInt(seconds/3600);
        min = parseInt((seconds%3600)/60);
        sec = seconds%60;

        if (hour.toString().length==1) hour = "0" + hour;
        if (min.toString().length==1) min = "0" + min;
        if (sec.toString().length==1) sec = "0" + sec;

        if(hour > 0)
        {
            return hour + ":" + min + ":" + sec;
        }else{
            return min + ":" + sec;
        }
    }




    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



    //----------------------------------------------------------------------------------------------------------------------------------------------------------



/*
<wave style="display: block; position: relative; user-select: none; height: 50px; cursor: auto; overflow: auto hidden;"><wave style="position: absolute; z-index: 3; left: 0px; top: 0px; bottom: 0px; overflow: hidden; width: 0px; display: block; box-sizing: border-box; border-right: 1px solid orangered; pointer-events: none;"><canvas width="1185" height="62" style="position: absolute; left: 0px; top: 0px; bottom: 0px; height: 100%; width: 948px;"></canvas></wave><canvas width="1185" height="62" style="position: absolute; z-index: 2; left: 0px; top: 0px; bottom: 0px; height: 100%; pointer-events: none; width: 948px;"></canvas></wave>*/
    //----------------------------------------------------------------------------------------------------------------------------------------------------------


    // Create an instance
    var wavesurfer;
    var tmp_state = 0;              //플레이상태   0=일시정지, 1=재생
    var wave_file_name = "";        //플레이할 파일경로
    var global_time = 0;            //진행중인 실시간 현재초

    var global_select_index = 0;    //현재 선택된 index
    var global_view_mode = "B";      //메신져 형태로 보기, 발화자명으로 보기

    //-----<차트 그리기위한 변수>-----
    var canvas1;
    var canvas2;
    var isMerged = false;
    var ctx1;
    var ctx2;
    var buffer1 = [];
    var buffer2 = [];
    var timer;
    var audioContext;
    var analyser;
    var stream;
    //-----</차트 그리기위한 변수>-----

    //자바스크립트가 문서가 준비된 상황 이후에 발동
    window.onload = function()
    {
        /*--------<검색>---------*/
        $("#search").on("keyup",function(key){
            if(key.keyCode==13)
            {
                /*검색문구*/
                var search = $('#search').val();

                /* 검색했던 text-red 클래스가 있으면 text-normal로 변경 */
                $(".text-red").each(function(){
                    $(this).attr('class','text-normal');
                    console.log(this);
                });

                /* 검색문구가 있으면 text-red css적용 */
                $(".text:contains('"+search+"')").each(function() {
                    var regex = new RegExp(search,'gi');
                    $(this).html( $(this).text().replace(regex, "<span class='text-red'>"+search+"</span>") );
                    //console.log(this);
                });
            }
        });
        /*--------<검색>---------*/

        $(".record_btn_template").hide();
        $(".waveform_btn_template").hide();

        ViewMode_Chart_Record();

        volumn1();
        volumn2();
        speaker();

    }//window.onload



    function volumn1()
    {
        var slider = $("#volume1");
        slider.on("input", function() {
            console.log("Volumn1:" + $(this).val());
        });
    }

    function volumn2()
    {
        var slider = $("#volume2");
        slider.on("input", function() {
            console.log("Volumn2:" + $(this).val());
        });
    }

    function speaker()
    {
        var slider = $("#speaker");
        slider.on("input", function() {
            console.log("speaker:" + $(this).val());
        });
    }

    //--------------------------<VIEW Mode>-------------------------------------

    //레코드중 하단 차트 및 버튼 보이기
    function ViewMode_Chart_Record()
    {
        $('.messages').css("height","calc(100% - 265px)");  //215
        $('.memo').css("height","calc(100% - 265px)");  //215


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

    }

    //기록뷰중 하단 차트 및 버튼 보이기
    function ViewMode_Chart_View()
    {
        $('.messages').css("height","calc(100% - 225px)");  //175
        $('.memo').css("height","calc(100% - 225px)");

        $('#waveform').empty();

        $('#waveform').css({"top":"-1px", "position": "relative", "height":"50px", "background-color":"#f2f8ff"});
        $('.bottom_wrapper').css({"clear":"both", "position": "absolute", "display":"block", "height":"100px", "background-color":"#ffffff"});

        //파일명을 넘기고 차트를 생성
        create_wavesurfer(wave_file_name);

        //-------------------------------------------

        $('#record_btn').remove();
        var aa;
        aa = $($('.waveform_btn_template').clone().html());

        $('.bottom_wrapper').append(aa);
    }



    function onChangeViewMode(){

        if(global_view_mode == "B")
        {
            //내용을 변경한다.
            $("#ViewMode").html("발화자명으로 보기");
        }

        if(global_view_mode == "M")
        {
            //내용을 변경한다.
            $("#ViewMode").html("메신저 형태로 보기");
        }

        setTimeout(function (){ return get_meeting_data("A123456", "json/view_data.html?workid=A123456"); }, 100);                    //회의록

        //그래프가 준비되면 몇초뒤에 스크롤 Value값을 불러온다(다 뿌려지지전에 값을 불러오면 값이 이상해짐. 개발자모드에서 확인가능)
         setTimeout(()=>Get_Messages_Scroll_value(), 1000);


        if(global_view_mode == "M" || global_view_mode == "" )
        {
            global_view_mode = "B";
        }else{
            global_view_mode = "M";
        }
    }
    //--------------------------</VIEW Mode>-------------------------------------

    //--------------------------<우측 서브메뉴>---------------------------------------
    function show_memo()
    {
        $('.sub_frame_content').empty();

        var aa;
        aa = $($('.memo_template').clone().html());

        $('.sub_frame_content').append(aa);
    }
    //--------------------------</우측 서브메뉴>---------------------------------------

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

    function onRecord(){
        $('#bt_mic_img').attr("src","img/chat/record_mic_pause.png");

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
    }

    function onRecordStop(){
        $('#bt_mic_img').attr("src","img/chat/record_mic.png");

        if (stream) {
          clearInterval(timer); //타이머 종료

          stream.getTracks().forEach(function(track) {
            track.stop();
          });

        }
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

        if (isMerged) {
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
            barWidth:1,                 /* 그래프 바 두께 */
            //barRadius: 1,
            //responsive: true,
            //normalize: true,
            audioRate: 1,                /* 재생속도 */
            height:50,
            barHeight: 1.3,
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
                    <input type='text' id='work_id'     value='work_"+_this.index+"'>
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

                    //----------<선택좌표로 이동하기위해>---------
                    //선택된 좌표의 index값을 가져온다.
                    var select_index_val = $("input[id='start_time'][value='"+number+"']").prev().val();
                    global_select_index = select_index_val;     //값을 참고하기위해 전역화한다.

                    //배열에 저장된 값에서 index값 위치에있는 값을 적용한다.
                    var scroll_top = arr[select_index_val]-350;
                    $('.messages').animate({scrollTop : scroll_top}, 500);
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




    //----------------------------------------------------------------------------------------------------------------------------------------------------------

    //음성+메모 보기
    function view_voice_memo(){
        $(".messages").css("display","block");
        $(".memo").css("display","block");

        $(".messages").css("width","calc(100% - 50%)");

        $(".memo").css("left","calc(100% - 50%)");
        $(".memo").css("width","calc(100% - 50%)");

        //팝업메뉴를 닫는다.
        $(".popup_menu").remove();
    }

    //음성만 보기
    function view_voice(){
        $(".messages").css("display","block");
        $(".memo").css("display","none");

        $(".messages").css("width","100%");
        //$(".memo").css("left","0%");
        //$(".memo").css("width","100%");

        //팝업메뉴를 닫는다.
        $(".popup_menu").remove();
    }

    //메모만 보기
    function view_memo(){
        $(".messages").css("display","none");
        $(".memo").css("display","block");

        $(".memo").css("left","0%");
        $(".memo").css("width","100%");

        //팝업메뉴를 닫는다.
        $(".popup_menu").remove();
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------------




    //--------------------------<WaveSurfer Method>-------------------------------------
    //------------<뒤로 몇초 이동>------------
    function WavBackward()
    {
        wavesurfer.skipBackward();
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
    function WavForward()
    {
        wavesurfer.skipForward();
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


    //------------<스피드 팝업을 띄운다>------------

    function change_audioRate(){

        var add_pop_duration =     '<div class="popup_duration">'
                                        +'<div class="duration" onclick="change_duration(0.8)">0.8x</div>'
                                        +'<div class="duration" onclick="change_duration(1)">1x</div>'
                                        +'<div class="duration" onclick="change_duration(1.2)">1.2x</div>'
                                        +'<div class="duration" onclick="change_duration(1.5)">1.5x</div>'
                                        +'<div class="duration" onclick="change_duration(1.8)">1.8x</div>'
                                        +'<div class="duration" onclick="change_duration(2)">2x</div>'
                                    +'</div>';

        //var top = arr[index]-150;
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
    //------------</스피드 팝업을 띄운다>------------

    //------------<오디오 스피드를 조절한다>------------
    function change_duration(speed){

        //팝업 스피드를 닫는다.
        $(".popup_duration").remove();

        wavesurfer.setPlaybackRate(speed);

        //내용을 변경한다.
        var selecter = $("#speed");
        $(selecter).html(speed + "x");
    }
    //------------</오디오 스피드를 조절한다>------------

    //--------------------------</WaveSurfer Method>-------------------------------------










    //맨처음 스크롤 위치값을 가져온다.
    var arr = [];
    function Get_Messages_Scroll_value()
    {
        //1. profile클래스의 모든좌표를 알기위해 일단 스크롤을 맨처음으로 옮긴다.
        $('.messages').animate({scrollTop : 0}, 0);

        //2. messages클래스의 모든좌표를 배열에 넣음
        var all_profile_div = $(".profile");
        var all_profile_div_length = all_profile_div.length - 1;
        var a = 0;


        console.log(all_profile_div_length);

        $(all_profile_div).each(function(){

                if( all_profile_div_length > a)
                {
                    var offset = $(this).offset();
                    console.log(a + ":" + offset.top);

                    arr[a] = offset.top;
                }
            a++;
        });

        //for (var i = 0; i < arr.length; i++) { console.log("arr"+i+":"+arr[i]);  }
    }


    //메뉴를 팝업한다
    var isMemu_popOpen = false;
    function Memu_pop(work_id,index,start_time,end_time){

        //팝업메뉴를 닫는다.
        $(".popup_menu").remove();

        if(isMemu_popOpen == true)
        {
            isMemu_popOpen = false;

        }else{

            isMemu_popOpen = true;

            //var add_pop_menu =   '<div class="popup_menu">'
             //                   +'<div'
            var add_pop_menu =   '<div class="popup_menu">'
                                    +'<div class="popup_menu_list"><div class="popup_menu_icon"><img src="img/chat/12.png"></div><div class="popup_menu_name" onclick="Text_modify('+index+')">음성기록 편집</div></div>'
                                    +'<div class="popup_menu_list"><div class="popup_menu_icon"><img src="img/chat/12.png"></div><div class="popup_menu_name" onclick="Add_memo_form(\''+work_id+'\','+index+','+start_time+','+end_time+')">메모 추가</div></div>'
                                    +'<div class="popup_menu_list"><div class="popup_menu_icon"><img src="img/chat/12.png"></div><div class="popup_menu_name" onclick="Add_bookmark_form(\''+work_id+'\','+index+','+start_time+','+end_time+')">북마크 추가</div></div>'
                                +'</div>';

            //var top = arr[index]-150;
            $('body').append(add_pop_menu);


            //클릭한 영역의 text class를 읽어서
            //var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class

            var selecter = $("#id_message_menu_img_" + index);
            //선택자의 좌료를 읽음
            var selecter_offset = $(selecter).offset();

            //팝업의 top좌표 적용
            $(".popup_menu").css("top",selecter_offset.top + 15);
            $(".popup_menu").css("left",selecter_offset.left - 170);
        }

    }



    //음성기록 편집시, Text수정하기
    var select_index;
    var isModifyOpen = false;

    function Text_modify(index){

        //팝업메뉴를 닫는다.
        $(".popup_menu").remove();

        if(isModifyOpen == true)
        {
            isModifyOpen = false;

            //열려있는 모든 textarea 닫기
            close_textarea();


            //제거한 onclick함수를 text클래스에 추가한다.
            Add_WavPlay_range_function(index);

        }else{

            select_index = index;   //전역처리

            isModifyOpen = true;
            /*
            //-----참고용 데이터-----
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
                    <input type='text' id='work_id'     value='work_"+_this.index+"'>
                </div>
            </div>
            <div class="text_wrapper">
                <div class="text"></div>
            </div>
            */

            //클릭한 영역의 text class를 읽어서 onclick제거
            var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class
            $(selecter).removeAttr("onclick");

            //열려있는 모든 textarea 닫기
            close_textarea();


            //클릭한 영역의 text class를 읽어서
            var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class
            //console.log(selecter);

            //textarea에 넣기위해 내용을 읽어온다.
            var content = $(selecter).html();
            //console.log("text:" + content);

            //내용밑에 textarea, button을 추가한다.
            var tag = "<textarea class='save_txt' id='ta_"+index+"'>"+content+"</textarea><input type='button' class='save_btn' id='id_save_btn_"+index+"' value='저장' onclick='ajax_save_txt("+index+")'><input type='button' class='cancel_btn' onclick='close_textarea()' value='취소'>";
            $(selecter).append(tag);

        }


    }




    function close_textarea()
    {
        //열려있는 모든 textarea 닫기
        var all_textarea = $("textarea");      //console.log(all_textarea);

        $(all_textarea).each(function(){
            $(this).remove();
        });

        //열려있는 모든 save_btn 클래스 닫기
        var all_save_btn = $(".save_btn");
        $(all_save_btn).each(function(){
            $(this).remove();
        });

        //열려있는 모든 cancel_btn 클래스 닫기
        var all_cancel_btn = $(".cancel_btn");
        $(all_cancel_btn).each(function(){
            $(this).remove();
        });
    }


     //Textarea에서 저장버튼 클릭시...제거한 onclick함수를 text클래스에 추가한다.
    function Add_WavPlay_range_function(index)
    {
        var start_time_val = $("input[id='index'][value='"+index+"']").next().val();                //시작초
        var end_time_val = $("input[id='index'][value='"+index+"']").next().next().val();           //정지초

        var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class

        //text클래스에 함수명(+값) 추가
        $(selecter).attr('onclick',"WavPlay_range("+start_time_val+","+end_time_val+")");
    }

    //메뉴이미지에 마우스 올릴경우
    function menu_mouse_over(n){
        //console.log("over:"+n);

        $(".message_menu_img").css("display", "none");

        var selecter = $("#id_message_menu_img_" + n);
        $(selecter).css("display", "block");
    }

    //메뉴이미지에 마우스가 떠날경우
    function menu_mouse_out(n){
        console.log("out:"+n);
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //메모 작성 폼
    function Add_memo_form(work_id, index, start_time, end_time)
    {
         //팝업 메뉴를 닫는다.
        $(".popup_menu").remove();

        var add_pop_menu =   '<div class="popup_memo">'
                                +'<div class="cl_memo_area"><textarea class="cl_popup_memo_txt" id="cl_popup_memo_txt" placeholder="'+SecondToHis(start_time)+' 메모를 작성하세요" autofocus></textarea></div>'
                                +'<div class="cl_memo_button"><input type="button" value="저장" onclick="ajax_submit_memo(\''+work_id+'\','+index+','+start_time+','+end_time+')"><input type="button" value="취소" onclick="cancel_add_memo_form()"></div>'
                            +'</div>';


        //var top = arr[index]-150;
        $('body').append(add_pop_menu);


        var selecter = $("#id_message_menu_img_" + index);
        //선택자의 좌료를 읽음
        var selecter_offset = $(selecter).offset();

        //팝업의 top좌표 적용
        $(".popup_memo").css("top",selecter_offset.top + 20);
        $(".popup_memo").css("left",selecter_offset.left - 470);

        //textarea에 포커스주기
        $(".cl_popup_memo_txt").focus();
    }



    //우측화면 메모 리스트
    function Add_memo_content(work_id, index, start_time, end_time, memo_text)
    {
        //하단그래프에 메모시점을 추가한다.
        bottom_memo_point_insert(start_time, "");

        //var selecter = $(".middle_content").next(".memo").next().children();           //
        var selecter = $(".memo_list");

        var add_memo_wrapper =   '<div class="memo_wrapper">'
                                    +'<div class="memo_set" id="id_memo_set_'+index+'">'
                                                        +'<div class="memo_second">'+SecondToHis(start_time)+'</div>'
                                                        +'<div class="memo_mod" onclick="memo_modify(\''+work_id+'\','+index+','+start_time+','+end_time+',\''+memo_text+'\')">수정</div>'
                                                        +'<div class="memo_del" onclick="ajax_memo_delete(\''+work_id+'\','+index+','+start_time+','+end_time+',\''+memo_text+'\')">삭제</div>'
                                                        +'<div class="memo_data">'
                                                                +'<input type="text" id="start_time_memo" value="'+start_time+'">'
                                                                +'<input type="text" id="end_time_memo" value="'+end_time+'">'
                                                        +'</div>'
                                    +'<div class="memo_content" id="id_memo_content_'+index+'" onclick="WavPlay_range('+start_time+','+end_time+')">'+memo_text+'</div>'
                                 +'</div>';

        $(selecter).append(add_memo_wrapper);
    }


    //메모 작성폼 닫기
    function cancel_add_memo_form(){
        //팝업 메모를 닫는다.
        $(".popup_memo").remove();
    }

    //메모 수정화면 생성
    function memo_modify(work_id, index, start_time, end_time, memo_text){

        //열려있는 모든 textarea .memo_txt 닫기
        cancel_memo_modify_txt();


        //클릭한 영역의 id_memo_set_ id 읽어서
        var id_memo_set = "#id_memo_set_" + index;

        console.log(id_memo_set);
        var selecter = $(id_memo_set); //<--- id_memo_set_1 ~

        //내용밑에 textarea, button을 추가한다.
        var tag =  "<textarea class='memo_txt' id='ta_memo_"+index+"'>"+memo_text+"</textarea>"
                  +"<input type='button' class='memo_bodify_btn' id='id_memo_modify_btn_"+index+"' value='저장' onclick='ajax_memo_modify_txt(\""+work_id+"\","+index+","+start_time+","+end_time+")'>"
                  +"<input type='button' class='memo_cancel_btn' onclick='cancel_memo_modify_txt()' value='취소'>";
        $(selecter).append(tag);
    }

    //메모 수정창 닫기
    function cancel_memo_modify_txt()
    {
        //열려있는 모든 textarea .memo_txt 닫기
        var all_memo_textarea = $(".memo_txt");

        $(all_memo_textarea).each(function(){
            $(this).remove();
        });

        //열려있는 모든 memo_bodify_btn 클래스 닫기
        var all_save_btn = $(".memo_bodify_btn");
        $(all_save_btn).each(function(){
            $(this).remove();
        });

        //열려있는 모든 memo_cancel_btn 클래스 닫기
        var all_cancel_btn = $(".memo_cancel_btn");
        $(all_cancel_btn).each(function(){
            $(this).remove();
        });
    }

   //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //북마크
    function Add_bookmark_form(work_id, index, start_time, end_time)
    {
        //팝업 메뉴를 닫는다.
        $(".popup_menu").remove();

        ajax_submit_bookmark(work_id, index, start_time, end_time);
    }


    //하단 북마크 버튼 클릭시
    function add_bookmark(){
        console.log("전역화된 현재초:" + global_time);


        var start_time_val = $("input[id='index'][value='"+global_select_index+"']").next().val();                //시작초
        var end_time_val = $("input[id='index'][value='"+global_select_index+"']").next().next().val();           //정지초
        var work_id = $("input[id='index'][value='"+global_select_index+"']").next().next().next().val();         //work_id

        //console.log("bookmark work_id:" + work_id +" index:" + global_select_index + " start_time:" +  start_time_val + " end_time:" +  end_time_val);

        ajax_submit_bookmark(work_id, global_select_index, start_time_val, end_time_val);
    }


    //하단 그래프에 메모 시점 표시
    function bottom_memo_point_insert(second, message)
    {
        var option = {
                        time: second,
                        label: message,
                        color: '#0aff55',
                        position: 'top'
                     }


        wavesurfer.addMarker(option);
    }

    function bottom_memo_point_reload(workid)
    {
        // Removes all markers.
        wavesurfer.clearMarkers();

        // 메모들을 다지운다. 아래에서 다시 불러온다.
        $(".memo_list").html("");


        //<Ajax를 통해 하단 그래프에 메모 시점을 다시불러온다>
        get_meeting_memo_data(work_id, "json/view_memo_data.html?workid="+workid);

        /*
        //DB의 메모정보
        Add_memo_content("A123456",0,5,9, "aaaaaaaaaa");
        Add_memo_content("A123456",1,10,15, "bbbbbbbbbb");
        Add_memo_content("A123456",2,17,20, "ccccccccccc");
        */
        //</Ajax를 통해 하단 그래프에 메모 시점을 다시불러온다>
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


    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    function change_profile_form(work_id, name, index, speaker)
    {
        //alert(work_id + "," + name);

        var add_pop_profile =   '<div class="popup_profile">'
                                    +'<div class="popup_profile_list">'
                                        +'<div class="title">'
                                            +'<div id="title_text">참석자 변경</div>'
                                            +'<div id="close" onclick="close_profile_form()">X</div>'
                                        +'</div>'
                                        +'<div class="profile">'
                                            +'<div id="profile_pic"><img src=img/chat/icon2.svg></div>'
                                            +'<div id="profile_name">'
                                                 +'<input type="text" id="id_profile_change_name" value="관리자">'
                                                 +'<input type="text" id="id_profile_work_id" value=\''+work_id+'\' hidden>'
                                                 +'<input type="text" id="id_profile_index" value="'+index+'" hidden>'
                                                 +'<input type="text" id="id_profile_speaker" value="'+speaker+'" hidden>'
                                            +'</div>'
                                        +'</div>'
                                    +'</div>'
                                    +'<div class="setting_profile">'
                                        +'<div class="checkbtn"><input type="radio" name="profile_change_radio" value="1" checked></div><div class="checkcontent">여기만</div>'
                                    +'</div>'
                                    +'<div class="setting_profile">'
                                        +'<div class="checkbtn"><input type="radio" name="profile_change_radio" value="2"></div><div class="checkcontent">여기부터</div>'
                                    +'</div>'
                                    +'<div class="setting_profile">'
                                        +'<div class="checkbtn"><input type="radio" name="profile_change_radio" value="3"></div><div class="checkcontent">전체적용</div>'
                                    +'</div>'
                                    +'<div class="button">'
                                        +'<div id="save_btn" onclick="change_profile()">변경</div>'
                                    +'</div>'
                                +'</div>';

        $('body').append(add_pop_profile);


        //클릭한 영역의 text class를 읽어서
        //var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class

        var selecter = $("#id_name_" + index);
        //선택자의 좌료를 읽음
        var selecter_offset = $(selecter).offset();

        //팝업의 top좌표 적용
        $(".popup_profile").css("top",selecter_offset.top);
        $(".popup_profile").css("left",selecter_offset.left);
    }


    //팝업 프로필 메뉴를 닫는다.
    function close_profile_form()
    {
        $(".popup_profile").remove();
    }



/*
function test(number)
{

    var select_text_div = $("input[id='start_time'][value='"+number+"']").parent().parent().parent();//.next().children();
    console.log(select_text_div.length);
    if(select_text_div.length > 0)
    {
        //$('.messages').animate({scrollTop : 0}, 10);

        //end초를 가져오고.. 현재text 클래스의 배경을 변경한다.
        next_val = $("input[id='start_time'][value='"+number+"']").next().val();    //next()=end_time/val()=값


        $(select_text_div).css("background-color","#c5efff");


       //var select_div = $("input[id='start_time'][value='"+number+"']").parent().parent()


        var offset = $(select_text_div).offset();
        $('.messages').animate({scrollTop : 0}, 0);
        $('.messages').animate({scrollTop : 0}, 0);
        $('.messages').animate({scrollTop : offset.top}, 500);

        console.log("length:" + select_text_div.length + "  현재초:" + number + "   end_time:" + next_val + "  위치:" + offset.top);
    }

    //----------------------------------------------------------------------------------------------------------------------------------------------------------
    //1. profile클래스의 모든좌표를 알기위해 일단 스크롤을 맨처음으로 옮긴다.
    $('.messages').animate({scrollTop : 0}, 0);

    //2. messages클래스의 모든좌표를 배열에 넣음
    var all_profile_div = $(".profile");
    var all_profile_div_length = all_profile_div.length - 1;
    var a = 0;
    var arr = [];

    console.log(all_profile_div_length);

    $(all_profile_div).each(function(){

            if( all_profile_div_length > a)
            {
                var offset = $(this).offset();
                console.log(a + ":" + offset.top);

                arr[a] = offset.top;
            }
        a++;
    });

    //for (var i = 0; i < arr.length; i++) { console.log("arr"+i+":"+arr[i]);  }

    //2. 선택된 좌표의 index값을 가져온다.
    var select_index_val = $("input[id='start_time'][value='"+number+"']").prev().val();
    console.log(select_index_val);

    //3.배열에 저장된 값에서 index값 위치에있는 값을 적용한다.
    $('.messages').animate({scrollTop : arr[select_index_val]-120}, 500);

}
*/



/*
function upload()
{
    const fileinput = $("#fileinput")[0];
    var speker_length = $('#speker_length').val();

    console.log("speker_length: ", speker_length);
    // 파일을 여러개 선택할 수 있으므로 files 라는 객체에 담긴다.
    console.log("fileinput: ", fileinput.files)

    if(speker_length == ""){
        alert("화자수를 입력해주세요");
        return;
    }

    if(fileinput.files.length === 0){
    alert("파일은 선택해주세요");
    return;
    }

    var formData = new FormData();
    formData.append("num_speakers", speker_length);
    formData.append("file", fileinput.files[0]);

    var settings = {
        "url": "http://demo.voise.co.kr:38502/api/v1/diarization/file",
        "method": "POST",
        "timeout": 0,
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": formData
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        return_data = JSON.parse(response);
        console.log(return_data);
    });
}
*/

