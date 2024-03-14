//--------------------------<우측 서브메뉴(메모)>---------------------------------------
/*
<div class="sub_frame_content" id="sub_frame_content_data1">
	<div class="all_memo">
		<textarea class="all_memo_tarea">aa</textarea>
	</div>
	<div class="memo_center_line"></div>
	<div class="time_memo">
		<div class="memo_wrapper">
		<div class="memo_set" id="id_memo_set_0">
		<div class="memo_second">00:02</div>
		<div class="memo_mod" onclick="memo_modify('A123456',0,2,9,'메모입니다_0')">수정</div>
		<div class="memo_del" onclick="ajax_memo_delete('A123456',0,2,9,'메모입니다_0')">삭제</div>
		<div class="memo_data">
			<input type="text" id="start_time_memo" value="2">
			<input type="text" id="end_time_memo" value="9">
		</div>
		<div class="memo_content" id="id_memo_content_0" onclick="WavPlay_range(2,9)">메모입니다_0</div>
		</div>
	</div>
	<div class="memo_wrapper">...</div>
	...
</div>
*/


function show_memo(location, main_idx)
{
    /*
    //복사본 만들어 추가하기
    var aa;
    aa = $($('.memo_template').clone().html());

    $('.sub_frame_content').append(aa);
    */


    if(location == 1)
    {
        //기존내용 지우기
        $('#sub_frame_content_data1').empty();

        var aa = '<div class="all_memo">'
                    +'<textarea class="all_memo_tarea">aa</textarea>'
                +'</div>'
                +'<div class="memo_center_line"></div>'
                +'<div class="time_memo"></div>';

        $('#sub_frame_content_data1').append(aa);

        //내용넣기
        get_memo_list_data("json/view_memo_data.html?main_idx=main_idx",location);           //메모


    }

    if(location == 2)
    {
        $('#sub_frame_content_data2').empty();

        var aa = '<div class="all_memo">'
                        +'<textarea class="all_memo_tarea">aa</textarea>'
                +'</div>'
                +'<div class="memo_center_line"></div>'
                +'<div class="time_memo"></div>';

        $('#sub_frame_content_data2').append(aa);

        //내용넣기
        get_memo_list_data("json/view_memo_data.html?main_idx=main_idx",location);           //메모
    }
}

//메모 리스트 데이터 불러오기
function get_memo_list_data(get_url, location)
{
    //모든 메모를 클리어
    if(location == 1)
    {
        $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .time_memo .memo_wrapper").each(function(){
            $(this).remove();
        });
    }

    if(location == 2)
    {
        $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data2 .time_memo .memo_wrapper").each(function(){
            $(this).remove();
        });
    }


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


                Add_memo_content(main_idx, index, start_time,  end_time, memo, location);

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

//우측화면 메모 리스트
function Add_memo_content(main_idx, index, start_time, end_time, memo_text, location)
{
    //보기모드라면..
    if(global_view_state == "V")
    {
        //하단그래프에 메모시점을 추가한다.
        bottom_memo_point_insert(start_time, "");
    }

    //var selecter = $(".middle_content").next(".memo").next().children();           //
    //var selecter = $(".time_memo");

    var selecter;

    if(location == 1)
    {
        selecter = $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .time_memo");
    }

    if(location == 2)
    {
        selecter = $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data2 .time_memo");
    }



    var add_memo_wrapper =   '<div class="memo_wrapper">'
                                +'<div class="memo_set" id="id_memo_set_'+index+'">'
                                                    +'<div class="memo_second">'+SecondToHis(start_time)+'</div>'
                                                    +'<div class="memo_mod" onclick="memo_modify(\''+main_idx+'\','+index+','+start_time+','+end_time+',\''+memo_text+'\')">수정</div>'
                                                    +'<div class="memo_del" onclick="ajax_memo_delete(\''+main_idx+'\','+index+','+start_time+','+end_time+',\''+memo_text+'\')">삭제</div>'
                                                    +'<div class="memo_data">'
                                                            +'<input type="text" id="start_time_memo" value="'+start_time+'">'
                                                            +'<input type="text" id="end_time_memo" value="'+end_time+'">'
                                                    +'</div>'
                                +'<div class="memo_content" id="id_memo_content_'+index+'" onclick="WavPlay_range('+start_time+','+end_time+')">'+memo_text+'</div>'
                             +'</div>';

    $(selecter).append(add_memo_wrapper);


    //-------------타임메모 늘러날때 전체메모 늘어나게 하려고 했는데...잘안됨 보강해야함
    //$(function() {
        $('.chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .time_memo').on('scroll', function() {
            var time_memo_height = $(this).height();
            console.log("-------------height:" + time_memo_height);
            $('.chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .all_memo_tarea').height(time_memo_height);
        });
    //});

}


function ajax_memo_delete(main_idx, index, start_time, end_time, memo_text){
    //alert('메모삭제:id('+main_idx+') index:('+index+')');

    if (confirm("선택하신 메모를 삭제하시겠습니까?"))
    {
        //예를 클릭한경우

        //-----대화창에 메모를 삭제한다.
        var selecter = $("input[id='start_time'][value='"+start_time+"']").parent().parent().children().next().next().next().next().next(".memo_yn");  //memo_yn
        $(selecter).html("");


        //----<Ajax로 DB에 데이터를 저장>----
        var url = "json/delete_memo.html?main_idx="+main_idx+"&index="+index+"&start_time="+start_time+"&end_time="+end_time+"&memo_text"+memo_text;

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
                    bottom_memo_point_reload(main_idx);

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


//메모삭제시 메모를 다시 불러온다
function bottom_memo_point_reload(workid)
{
    // Removes all markers.
    wavesurfer.clearMarkers();

    // 메모들을 다지운다. 아래에서 다시 불러온다.
    $(".memo_list").html("");


    //<Ajax를 통해 하단 그래프에 메모 시점을 다시불러온다>
    get_memo_list_data(main_idx, "json/view_memo_data.html?workid="+workid);

    /*
    //DB의 메모정보
    Add_memo_content("A123456",0,5,9, "aaaaaaaaaa");
    Add_memo_content("A123456",1,10,15, "bbbbbbbbbb");
    Add_memo_content("A123456",2,17,20, "ccccccccccc");
    */
    //</Ajax를 통해 하단 그래프에 메모 시점을 다시불러온다>
}
//--------------------------</우측 서브메뉴(메모)>---------------------------------------
