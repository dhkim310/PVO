//미팅,회의록 불러오기
function get_meeting_data(workid, get_url, view_type)
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
                var work_id     = jsonObj.view_datas[i].work_id;
                var index       = jsonObj.view_datas[i].index;
                var speaker     = jsonObj.view_datas[i].speaker;
                var name        = jsonObj.view_datas[i].name;
                var start_time  = jsonObj.view_datas[i].start_time;
                var end_time    = jsonObj.view_datas[i].end_time;
                var memo_yn     = jsonObj.view_datas[i].memo_yn;
                var bookmark_yn = jsonObj.view_datas[i].bookmark_yn;
                var text        = jsonObj.view_datas[i].text;

                if(global_view_mode == "M")
                {
                    if(speaker == "1")
                    {
                        sendMessage(work_id, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'left');
                    }else{
                        sendMessage(work_id, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, 'right');
                    }
                }else{
                    sendMessage(work_id, index, speaker, name,  start_time,  end_time, memo_yn, bookmark_yn, text, '');
                }


                console.log(work_id +","+ index +","+ speaker +","+ name +","+ start_time +","+ end_time +","+ memo_yn +","+ bookmark_yn +","+ text);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_1.');
        }

    });
}

//미팅,회의록의 메모 불러오기
function get_meeting_memo_data(workid, get_url)
{
    //모든 메모를 클리어
    $(".memo_wrapper").each(function(){
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
            var listLen = jsonObj.view_memo_datas.length;

            for(var i=0; i<listLen; i++)
            {
                var work_id    = jsonObj.view_memo_datas[i].work_id;
                var index      = jsonObj.view_memo_datas[i].index;
                var start_time = jsonObj.view_memo_datas[i].start_time;
                var end_time   = jsonObj.view_memo_datas[i].end_time;
                var memo       = jsonObj.view_memo_datas[i].memo;

                Add_memo_content(work_id, index, start_time,  end_time, memo);
                console.log(work_id +","+ index +","+ start_time +","+ end_time +","+ memo);
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
function get_meeting_bookmark_data(workid, get_url)
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
                var work_id    = jsonObj.view_bookmark_datas[i].work_id;
                var index      = jsonObj.view_bookmark_datas[i].index;
                var start_time = jsonObj.view_bookmark_datas[i].start_time;
                var end_time   = jsonObj.view_bookmark_datas[i].end_time;

                //Add_memo_content(work_id, index, start_time,  end_time);
                bottom_bookmark_point_insert(start_time, "");

                console.log(work_id +","+ index +","+ start_time +","+ end_time);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_3.');
        }

    });
}


//팝업된 프로필을 저장한다.
function change_profile()
{
    var id_profile_work_id_val      = $("#id_profile_work_id").val();
    var id_profile_index_val        = $("#id_profile_index").val();
    var id_profile_speaker_val      = $("#id_profile_speaker").val();
    var id_profile_change_name_val  = $("#id_profile_change_name").val();

    var radioValue = $(":input:radio[name='"+String("profile_change_radio")+"']:checked").val();

    console.log("id_profile_work_id_val:" + id_profile_work_id_val);
    console.log("id_profile_index_val:" + id_profile_index_val);
    console.log("id_profile_speaker_val:" + id_profile_speaker_val);
    console.log("id_profile_change_name_val:" + id_profile_change_name_val);

    console.log("radioValue:" + radioValue);


    var url = "json/change_profile.html?work_id="+id_profile_work_id_val+"&index="+id_profile_index_val+"&speaker="+id_profile_speaker_val+"&nwhere="+radioValue+"&name="+id_profile_change_name_val;
    var get_url = "json/view_data.html?workid="+id_profile_work_id_val;

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
                //팝업 프로필 메뉴를 닫는다.
                close_profile_form();

                //대화내용을 다시 불러온다.
                get_meeting_data(id_profile_work_id_val, get_url);

                //그래프가 준비되면 몇초뒤에 스크롤 Value값을 불러온다
                setTimeout(()=>Get_Messages_Scroll_value(), 1000);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_4.');
        }
    });
}


//Textarea에서 저장버튼 클릭시
function ajax_save_txt(index){

    var start_time_val = $("input[id='index'][value='"+index+"']").next().val();                //시작초
    var end_time_val = $("input[id='index'][value='"+index+"']").next().next().val();           //정지초
    var work_id_val = $("input[id='index'][value='"+index+"']").next().next().next().val();     //작업id
    var text_val = $("#ta_"+index+"").val();                                                    //수정할 texarea값

    console.log("SAVE------------------------------------------------------");
    console.log("work_id:("+work_id_val+")  index:("+index+")  start_time:("+start_time_val+")  end_time:("+end_time_val+")");
    console.log("text:("+text_val+")");

    //----------------------DB저장하는 Ajax를 추가할것-----------------------
    var url = "json/change_content.html?work_id="+work_id_val+"&index="+index+"&start_time="+start_time_val+"&end_time="+end_time_val;

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

                //수정한 문구를 text클래스에 적용한다.
                var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class
                $(selecter).text(text_val);

                //열려있는 모든 textarea 닫기
                close_textarea();


                //제거한 onclick함수를 text클래스에 추가한다.
                Add_WavPlay_range_function(index);


                isModifyOpen = false;  //수정창 닫힘상태
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_5.');
        }
    });

}


//메모 저장
function ajax_submit_memo(work_id, index, start_time, end_time){
    var memo_text = $("#cl_popup_memo_txt").val();

    if(memo_text != "")
    {
        console.log("---AJax로 저장할것--");
        console.log("work_id:" + work_id);
        console.log("index:" + index);
        console.log("start_time:" + start_time);
        console.log("end_time:" + end_time);
        console.log("memo_text:" + memo_text);

        //----<Ajax로 DB에 데이터를 저장>----
        var url = "json/save_memo.html?work_id="+work_id+"&index="+index+"&start_time="+start_time+"&end_time="+end_time+"&memo_text"+memo_text;

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

                    //우측리스트에 메모를 추가한다.
                    //Add_memo_content(work_id, index, start_time, end_time, memo_text);
                    //3.Ajax로 값을 불러와라
                    get_meeting_memo_data(work_id, "json/view_memo_data1.html?workid=workid");

                    //완료되면 팝업 메모를 닫는다.
                    $(".popup_memo").remove();

                    //-----대화창에 메모를 표시한다.
                    var selecter = $("input[id='start_time'][value='"+start_time+"']").parent().parent().children().next().next().next().next().next(".memo_yn");  //memo_yn
                    $(selecter).html("메모");

                    console.log(selecter);
                }

            },

            error: function (request, status, error)
            {
                console.log(error);
                alert('죄송합니다. 서버 연결에 실패했습니다_6.');
            }
        });
        //----</Ajax로 DB에 데이터를 저장>----



    }else{
        alert("메모를 입력하세요");
    }
}


function ajax_submit_bookmark(work_id, index, start_time, end_time)
{
    //----<Ajax로 DB에 데이터를 저장>----
    var url = "json/save_bookmark.html?work_id="+work_id+"&index="+index+"&start_time="+start_time+"&end_time="+end_time;

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
                bottom_bookmark_point_insert(start_time, "");

                //-----대화창에 메모를 표시한다.
                var selecter = $("input[id='start_time'][value='"+start_time+"']").parent().parent().children().next().next().next().next().next(".bookmark_yn");  //memo_yn
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

//메모 수정 버튼 클릭시
function ajax_memo_modify_txt(work_id, index, start_time, end_time){

    //textarea의 값을 읽어서
    var textarea_ta_memo_val = $("#ta_memo_" + index).val();
    console.log(textarea_ta_memo_val);

    //메모 수정창 닫기
    cancel_memo_modify_txt();
    //----------------------DB저장하는 Ajax를 추가할것-----------------------

    //----<Ajax로 DB에 데이터를 저장>----
    var url = "json/change_memo.html?work_id="+work_id+"&index="+index+"&start_time="+start_time+"&end_time="+end_time+"&memo_text"+textarea_ta_memo_val;

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

                //1.textarea_ta_memo_val을 ajax로 db에 저장

                //--Ajax성공할경우 아래작업 수행---

                //2.Ajax로 값을 불러와라
                get_meeting_memo_data(work_id, "json/view_memo_data2.html?workid=workid");

                /*
                //작성한 내용으로 변경
                var selecter = "#id_memo_content_" + index;
                console.log(selecter);

                $(selecter).html(textarea_ta_memo_val);
                */

            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_8.');
        }
    });
    //----</Ajax로 DB에 데이터를 저장>----

}


function ajax_memo_delete(work_id, index, start_time, end_time, memo_text){
    //alert('메모삭제:id('+work_id+') index:('+index+')');

    if (confirm("선택하신 메모를 삭제하시겠습니까?"))
    {
        //예를 클릭한경우

        //-----대화창에 메모를 삭제한다.
        var selecter = $("input[id='start_time'][value='"+start_time+"']").parent().parent().children().next().next().next().next().next(".memo_yn");  //memo_yn
        $(selecter).html("");


        //----<Ajax로 DB에 데이터를 저장>----
        var url = "json/delete_memo.html?work_id="+work_id+"&index="+index+"&start_time="+start_time+"&end_time="+end_time+"&memo_text"+memo_text;

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

                    //하단 그래프에 메모 시점을 다시불러온다
                    bottom_memo_point_reload(work_id);

                    console.log(selecter);

                }

            },

            error: function (request, status, error)
            {
                console.log(error);
                alert('죄송합니다. 서버 연결에 실패했습니다_9.');
            }
        });
        //----</Ajax로 DB에 데이터를 저장>----



    } else {
        //아니오를 클릭한경우
    }

}
/*
function Road_Ajax_Data()
{
    //var d = new Date();
    //var this_time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();


    //DB의 대화정보
    sendMessage("A123456",  0, "관리자",   5,   9, "Y", "반갑습니다. 스카이라이프 전혜원입니다.", 'left');
    sendMessage("A123456",  1, "관리자",  10,  15, "Y", "티비하고 인터넷 지금 이번에 개통해서 부른 사람인데요", 'left');
    sendMessage("A123456",  2, "관리자",  17,  20, "Y", "네 고객님", 'left');
    sendMessage("A123456",  3, "관리자",  22,  26, "",  "스카이 라이프 아이피타임 와아파이 연결을 하려고 하는데 와이파이 연결이 안되거든요", 'left');
    sendMessage("A123456",  4, "관리자",  30,  35, "",  "와이파이 연결이 안돼요", 'left');
    sendMessage("A123456",  5, "관리자",  37,  42, "",  "텔레비에서 와이파이 연결 무선 인터넷 연결을 하라 그래서 시키는대로 했는데 연결이 안되거든요", 'left');
    sendMessage("A123456",  6, "관리자",  42,  48, "",  "네 실례지만 홍길동 고객님 본인 되세요? 네 소중한 정보 확인 고맙습니다. 화면에 고객님 와이파이 그게 안잡힌다는거죠?네 실례지만 홍길동 고객님 본인 되세요? 네 소중한 정보 확인 고맙습니다. 화면에 고객님 와이파이 그게 안잡힌다는거죠?", 'left');
    sendMessage("A123456",  7, "관리자",  50,  55, "",  "무슨 인터넷 연결을 하라고 그래갖고 연결을 원하시는 와이파이를 선택해 주세요. 그래가지고 제가 스카이 아이 타임 aed를 연결을 했는데 비밀번호를 넣어서 넣어도 연결이 안 돼요", 'left');
    sendMessage("A123456",  8, "관리자",  60,  65, "",  "계속 연결이 안 돼요 비밀번호까지 넣었는데도 예예 네 실내지만 그러면은 이인식 고객님 저희 기사 방문할 수 있도록 접수해 드릴 텐데 예 석포면으로 방문해 드리면 될까요.", 'left');
    sendMessage("A123456",  9, "관리자",  66,  70, "",  "그랬더니 네 이쪽에 가면은 와이파이가 잘 안 돼서 저희들들이 설명을 안 해줬다 이렇게 얘기를 하더라고요 그 말이 맞는 거예요.", 'left');
    sendMessage("A123456", 10, "관리자",  71,  75, "",  "그게 무슨 말씀이시래요", 'left');
    sendMessage("A123456", 11, "관리자",  75,  80, "",  "아니 그러니까 여기 이쪽에는 와이파이를 연결해도 네 잘 안 잡힐 경우가 많아 가지고 설명을 아예 안 해드린다 그 기사가 그랬어요.", 'left');
    sendMessage("A123456", 12, "관리자",  80,  85, "",  "이상하네요. 고객님", 'left');
    sendMessage("A123456", 13, "관리자",  85,  90, "",  "그니까 그거에 대해서 한번 좀 알아봐 주세요.아니 이게 안 될 것 같으면 tv에서 이렇게 안 나오거든요. ", 'left');
    sendMessage("A123456", 14, "관리자",  90,  95, "",  "네 그렇죠 인터넷 연결을 하라 그러는데 연결이 안 되는데 연결이 안 된다라고 기사한테 전화를 했더니 기사가 저한테 여기 연결이 잘 안 되기 때문에 아예 저희가 설명도 안 해드리고 이럽니다. ", 'left');
    sendMessage("A123456", 15, "관리자", 100, 105, "",  "아무리 그래도 여기도 대기업인데 그래갖고 좀 의아했었는데 바로 지금 말씀하시기로 좀 기사를 방문시키겠다.", 'left');
    sendMessage("A123456", 16, "관리자", 105, 110, "",  "예예 설치 기사요", 'left');
    sendMessage("A123456", 17, "관리자", 110, 115, "",  "예 개인 연락처로 하신 거예요", 'left');
    sendMessage("A123456", 18, "관리자", 115, 120, "",  "네 저희가 설치 기사랑 as 기사가 다른 경우 있을 수 있기 때문에 제가 그런 내용 메모해서 as로 접수를 해드리고요 네 아까 말씀해 주신 공공팔 일 번 메모 남겨드리구요.", 'left');
    sendMessage("A123456", 19, "관리자", 125, 130, "",  "네 잠시만요 고객님 일정 한번 확인해 보겠습니다. ", 'left');
    sendMessage("A123456", 20, "관리자", 135, 140, "",  "예 저희가 지금 일정이 고객님 월요일 열한시에서 한시 사이가 가장 빠른데 최대한 빠르게 방문할 수 있도록 메모 남겨보겠습니다 고객님", 'left');

    //DB의 메모정보
    Add_memo_content("A123456",0,5,9, "aaaaaaaaaa");
    Add_memo_content("A123456",1,10,15, "bbbbbbbbbb");
    Add_memo_content("A123456",2,17,20, "ccccccccccc");

}
*/
