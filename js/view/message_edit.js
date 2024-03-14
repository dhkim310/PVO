
//메뉴를 팝업한다
var isMemu_popOpen = false;
function Memu_pop(main_idx,index,start_time,end_time){

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
                                +'<div class="popup_menu_list"><div class="popup_menu_icon"><img src="img/chat/12.png"></div><div class="popup_menu_name" onclick="Add_memo_form(\''+main_idx+'\','+index+','+start_time+','+end_time+')">메모 추가</div></div>'
                                +'<div class="popup_menu_list"><div class="popup_menu_icon"><img src="img/chat/12.png"></div><div class="popup_menu_name" onclick="Add_bookmark_form(\''+main_idx+'\','+index+','+start_time+','+end_time+')">북마크 추가</div></div>'
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
                <input type='text' id='main_idx'     value='work_"+_this.index+"'>
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


//Textarea에서 저장버튼 클릭시
function ajax_save_txt(index){
    /*
    --참고할 내용--
    <li class="message left appeared">
        <div class="profile">
            ...
            <div class="data">
                <input type="text" id="index" width="5px" value="18">
                <input type="text" id="start_time" value="115">
                <input type="text" id="end_time" value="120">
                <input type="text" id="main_idx" width="5px" value="A123456">
            </div>
            <div class="message_menu">...</div>
        </div>
        <div class="text_wrapper" onmouseover="menu_mouse_over(18)" onmouseout="menu_mouse_out(18)">
            <div class="text" id="18" onclick="WavPlay_range(115,120)">네 저희가....</div>
        </div>
        <div class="scroll_position"></div>
    </li>
    */
    var start_time_val = $("input[id='index'][value='"+index+"']").next().val();                //시작초
    var end_time_val = $("input[id='index'][value='"+index+"']").next().next().val();           //정지초
    var main_idx_val = $("input[id='index'][value='"+index+"']").next().next().next().val();    //main_idx
    var text_val = $("#ta_"+index+"").val();                                                    //수정할 texarea값

    console.log("ajax_save_txt SAVE------------------------------------------------------");
    console.log("ajax_save_txt main_idx:("+main_idx_val+")  index:("+index+")  start_time:("+start_time_val+")  end_time:("+end_time_val+")");
    console.log("text:("+text_val+")");

    //----------------------DB저장하는 Ajax를 추가할것-----------------------
    var url = "json/change_content.html?main_idx="+main_idx_val+"&index="+index+"&start_time="+start_time_val+"&end_time="+end_time_val;

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



//Textarea에서 저장버튼 클릭시...제거한 onclick함수를 text클래스에 추가한다.
function Add_WavPlay_range_function(index)
{
    /*
    --참고할 내용--
    <li class="message left appeared">
        <div class="profile">
            ...
            <div class="data">
                <input type="text" id="index" width="5px" value="18">
                <input type="text" id="start_time" value="115">
                <input type="text" id="end_time" value="120">
                <input type="text" id="main_idx" width="5px" value="A123456">
            </div>
            <div class="message_menu">...</div>
        </div>
        <div class="text_wrapper" onmouseover="menu_mouse_over(18)" onmouseout="menu_mouse_out(18)">
            <div class="text" id="18" onclick="WavPlay_range(115,120)">네 저희가....</div>
        </div>
        <div class="scroll_position"></div>
    </li>
    */

    var start_time_val = $("input[id='index'][value='"+index+"']").next().val();                //시작초
    var end_time_val = $("input[id='index'][value='"+index+"']").next().next().val();           //정지초

    var selecter = $("input[id='index'][value='"+index+"']").parent().parent().next().children(); //<--- text class

    //text클래스에 함수명(+값) 추가
    $(selecter).attr('onclick',"WavPlay_range("+start_time_val+","+end_time_val+")");
}


//메모 작성 폼
function Add_memo_form(main_idx, index, start_time, end_time)
{
     //팝업 메뉴를 닫는다.
    $(".popup_menu").remove();

    var add_pop_menu =   '<div class="popup_memo">'
                            +'<div class="cl_memo_area"><textarea class="cl_popup_memo_txt" id="cl_popup_memo_txt" placeholder="'+SecondToHis(start_time)+' 메모를 작성하세요" autofocus></textarea></div>'
                            +'<div class="cl_memo_button"><input type="button" value="저장" onclick="ajax_submit_memo(\''+main_idx+'\','+index+','+start_time+','+end_time+')"><input type="button" value="취소" onclick="cancel_add_memo_form()"></div>'
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


//메모 저장
function ajax_submit_memo(main_idx, index, start_time, end_time){
    var memo_text = $("#cl_popup_memo_txt").val();

    if(memo_text != "")
    {
        console.log("---AJax로 저장할것--");
        console.log("main_idx:" + main_idx);
        console.log("index:" + index);
        console.log("start_time:" + start_time);
        console.log("end_time:" + end_time);
        console.log("memo_text:" + memo_text);

        //----<Ajax로 DB에 데이터를 저장>----
        var url = "json/save_memo.html?main_idx="+main_idx+"&index="+index+"&start_time="+start_time+"&end_time="+end_time+"&memo_text"+memo_text;

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
                    //Add_memo_content(main_idx, index, start_time, end_time, memo_text);
                    //3.Ajax로 값을 불러와라
                    get_memo_list_data(main_idx, "json/view_memo_data1.html?main_idx=main_idx");

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



//메모 작성폼 닫기
function cancel_add_memo_form(){
    //팝업 메모를 닫는다.
    $(".popup_memo").remove();
}



//북마크
function Add_bookmark_form(main_idx, index, start_time, end_time)
{
    //팝업 메뉴를 닫는다.
    $(".popup_menu").remove();

    ajax_submit_bookmark(main_idx, index, start_time, end_time);
}



//이름을 클릭하면 이름을 변경할수있는 팝업창이뜨고 이름을 변경할수 있음
function change_profile_form(main_idx, name, index, speaker)
{
    //alert(main_idx + "," + name);

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
                                             +'<input type="text" id="id_profile_main_idx" value=\''+main_idx+'\' hidden>'
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


//이름변경팝업 프로필 메뉴를 닫는다.
function close_profile_form()
{
    $(".popup_profile").remove();
}



//팝업된 프로필을 저장한다.
function change_profile()
{
    var id_profile_main_idx_val      = $("#id_profile_main_idx").val();
    var id_profile_index_val        = $("#id_profile_index").val();
    var id_profile_speaker_val      = $("#id_profile_speaker").val();
    var id_profile_change_name_val  = $("#id_profile_change_name").val();

    var radioValue = $(":input:radio[name='"+String("profile_change_radio")+"']:checked").val();

    console.log("id_profile_main_idx_val:" + id_profile_main_idx_val);
    console.log("id_profile_index_val:" + id_profile_index_val);
    console.log("id_profile_speaker_val:" + id_profile_speaker_val);
    console.log("id_profile_change_name_val:" + id_profile_change_name_val);

    console.log("radioValue:" + radioValue);


    var url = "json/change_profile.html?main_idx="+id_profile_main_idx_val+"&index="+id_profile_index_val+"&speaker="+id_profile_speaker_val+"&nwhere="+radioValue+"&name="+id_profile_change_name_val;
    var get_url = "json/view_data.html?workid="+id_profile_main_idx_val;

    console.log("change_profile() url:" + url);

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
                get_play_chatting_data(id_profile_main_idx_val, get_url);

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


