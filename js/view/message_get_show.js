
function chatting_clear()
{
    //모든 메세지를 클리어
    $(".messages .message").each(function(){
        $(this).remove();
    });
}


//미팅,회의록 불러오기
function get_play_chatting_data(get_url)
{
    //모든 메모를 클리어
    $(".messages .message").each(function(){
        $(this).remove();
    });

    $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
            var listLen = jsonObj.view_datas.length;

            for(var i=0; i<listLen; i++)
            {
                var main_idx    = jsonObj.view_datas[i].main_idx;
                var index       = jsonObj.view_datas[i].index;
                var speaker     = jsonObj.view_datas[i].speaker;
                var name        = jsonObj.view_datas[i].name;
                var start_time  = jsonObj.view_datas[i].start_time;
                var end_time    = jsonObj.view_datas[i].end_time;
                var memo_yn     = jsonObj.view_datas[i].memo_yn;
                var bookmark_yn = jsonObj.view_datas[i].bookmark_yn;
                var text        = jsonObj.view_datas[i].text;

                /*
                {
                  "main_idx": "A123456",
                  "index": 1,
                  "speaker": 2,
                  "name": "관리자",
                  "start_time": 10,
                  "end_time": 15,
                  "memo_yn": "Y",
                  "bookmark_yn" : "",
                  "text": "티비하고 인터넷 지금 이번에 개통해서 부른 사람인데요"
                }
                */

                //메신저형태로 출력
                if(global_msg_view_mode == "M")
                {
                    if(speaker == "1")
                    {
                        sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'left');
                    }else{
                        sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'right');
                    }
                }else{
                    sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, '');
                }


                console.log(main_idx +","+ index +","+ speaker +","+ name +","+ start_time +","+ end_time +","+ memo_yn +","+ bookmark_yn +","+ text);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_1.');
        }

    });
}




function sendMessage(main_idx, index, speaker, name, st_time, ed_time, memo_yn, bookmark_yn, text, message_side)
{
    //아래 MessageClass() 대입
    var messageVal = new MessageClass({
        main_idx: main_idx,
        index: index,
        speaker: speaker,
        name: name,
        st_time: st_time,
        ed_time: ed_time,
        memo_yn: memo_yn,
        bookmark_yn: bookmark_yn,
        text: text,
        message_side: message_side
    });

    messageVal.draw();

    /*
    var $messages = $('.messages');
    $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 1);   //애니메이션효과
    */
}



//Message클래스
function MessageClass(arg)
{
    //전달받은값을 대입
    this.main_idx = arg.main_idx;
    this.index = arg.index;
    this.speaker = arg.speaker;
    this.name = arg.name;
    this.st_time = arg.st_time;
    this.ed_time = arg.ed_time;
    this.memo_yn = arg.memo_yn;
    this.bookmark_yn = arg.bookmark_yn;
    this.text = arg.text;
    this.message_side = arg.message_side;

    //message_template에서 행태를 복사해와서 DB에서 전달받은값을 대입하고 messages클래스에 append시킨다.
    this.draw = function (_this)
    {
        return function ()
        {
            var $message;
            $message = $($('.message_template').clone().html());

            //$message.find('.id').html("id" + _this.index);
            //$message.find('.avatar').html("<img src=img/chat/icon"+this.speaker+".svg>");
            $message.find('.name').html(_this.name);
            $message.find('.name').attr("onclick", "change_profile_form(\""+_this.main_idx+"\",\""+_this.name+"\","+_this.index+","+_this.speaker+")");  //name 찾아서 onclcik함수및 값을 추가
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
                value += "<input type='text' id='main_idx' width='5px' value='"+_this.main_idx+"'>";

            $message.find('.data').html(value);
            $message.find('.message_menu').html("<input type='image' class='message_menu_img' id='id_message_menu_img_"+_this.index+"' src='img/chat/3.png'  onclick='Memu_pop(\""+_this.main_idx+"\","+_this.index+","+_this.st_time+","+_this.ed_time+")'>");


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

//초를 HH:MM:SS로
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


function SecondToHis_hangul(seconds)
{
    var hour, min, sec;

    hour = parseInt(seconds/3600);
    min = parseInt((seconds%3600)/60);
    sec = seconds%60;

    if (hour.toString().length==1) hour = "" + hour;
    if (min.toString().length==1) min = "" + min;
    if (sec.toString().length==1) sec = "" + sec;

    if(hour > 0)
    {
        return hour + "시" + min + "분" + sec + "초";
    }else{
        return min + "분" + sec + "초";
    }
}






//맨처음 스크롤 위치값을 가져온다.
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

                global_scroll_positon_arr[a] = offset.top;
            }
        a++;
    });



    //for (var i = 0; i < global_scroll_positon_arr.length; i++) { console.log("global_scroll_positon_arr"+i+":"+global_scroll_positon_arr[i]);  }
}



//스크롤을 맨하단으로 이동
function Set_Messages_Scroll_bottom()
{
    //1. profile클래스의 모든좌표를 알기위해 일단 스크롤을 맨처음으로 옮긴다.
    $('.messages').animate({scrollTop : 0}, 0)


    var local_scroll_positon_arr = [];
    var last_profile = 0;

    //2. messages클래스의 모든좌표를 배열에 넣음
    var all_profile_div = $(".scroll_position");
    var all_profile_div_length = all_profile_div.length - 1;



    console.log(all_profile_div_length);

    $(all_profile_div).each(function(){

        var offset = $(this).offset();
        console.log(last_profile + ":" + offset.top);

        local_scroll_positon_arr[last_profile] = offset.top;

        last_profile++;
    });

    var all_profile_div = $(".scroll_position");

    var scroll_top = local_scroll_positon_arr[last_profile-2];
    //scroll_top = scroll_top + 5000;

    $('.messages').animate({scrollTop : scroll_top}, 0);

    console.log("local_scroll_positon_arr:" + local_scroll_positon_arr);
    console.log("scroll_top:" + scroll_top);

}



//DB데이터 리플래시용
function get_chatting_data(get_url)
{
    $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
            var listLen = jsonObj.view_datas.length;


            if(0 < listLen)
            {
                num = listLen - 1;  //1이면 0

                var main_idx    = jsonObj.view_datas[num].main_idx;
                var index       = jsonObj.view_datas[num].index;
                var speaker     = jsonObj.view_datas[num].speaker;
                var name        = jsonObj.view_datas[num].name;
                var start_time  = jsonObj.view_datas[num].start_time;
                var end_time    = jsonObj.view_datas[num].end_time;
                var memo_yn     = jsonObj.view_datas[num].memo_yn;
                var bookmark_yn = jsonObj.view_datas[num].bookmark_yn;
                var text        = jsonObj.view_datas[num].text;

                if(global_msg_view_mode == "M")
                {
                    if(speaker == "1")
                    {
                        sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'left');
                    }else{
                        sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'right');
                    }
                }else{
                    sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, '');
                }


                console.log(main_idx +","+ index +","+ speaker +","+ name +","+ start_time +","+ end_time +","+ memo_yn +","+ bookmark_yn +","+ text);

            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_1.');
        }

    });


    //스크롤을 맨하단으로 이동
    setTimeout(()=>Set_Messages_Scroll_bottom(), 300);
}





//테스트용
var ee = 0;
function get_chatting_data_sample(get_url)
{
    //모든 메모를 클리어
//    $(".messages .message").each(function(){
//        $(this).remove();
//    });

    $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
            var listLen = jsonObj.view_datas.length;


            if(ee < listLen)
            {
                //for(var i=0; i<ee; i++)
                {
                    var main_idx     = jsonObj.view_datas[ee].main_idx;
                    var index       = jsonObj.view_datas[ee].index;
                    var speaker     = jsonObj.view_datas[ee].speaker;
                    var name        = jsonObj.view_datas[ee].name;
                    var start_time  = jsonObj.view_datas[ee].start_time;
                    var end_time    = jsonObj.view_datas[ee].end_time;
                    var memo_yn     = jsonObj.view_datas[ee].memo_yn;
                    var bookmark_yn = jsonObj.view_datas[ee].bookmark_yn;
                    var text        = jsonObj.view_datas[ee].text;

                    if(global_msg_view_mode == "M")
                    {
                        if(speaker == "1")
                        {
                            sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'left');
                        }else{
                            sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'right');
                        }
                    }else{
                        sendMessage(main_idx, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, '');
                    }


                    console.log(main_idx +","+ index +","+ speaker +","+ name +","+ start_time +","+ end_time +","+ memo_yn +","+ bookmark_yn +","+ text);


                }

                ee++;
            }


        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_1.');
        }

    });


    //스크롤을 맨하단으로 이동
    setTimeout(()=>Set_Messages_Scroll_bottom(), 300);
}


