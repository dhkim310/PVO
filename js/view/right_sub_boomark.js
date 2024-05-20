/*
<div class="sub_frame_content" id="sub_frame_content_data1">
    <div class="all_bookmark">
        <div class="bookmark_set" id="id_bookmark_set_0">
            <div class="bookmark_second">00:02</div>
            <div class="bookmark_del" onclick="ajax_bookmark_delete('A123456',0,2,9,'메모입니다_0')">삭제</div>
            <div class="bookmark_data">
                <input type="text" id="start_time_bookmark" value="2">
                <input type="text" id="end_time_bookmark" value="9">
            </div>
            <div class="bookmark_content" id="id_bookmark_content_0" onclick="WavPlay_range(2,9)">메모입니다_0</div>
        </div>
        ...
    </div>
</div>
*/

function show_bookmark(location, main_idx)
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

        var aa = '<div class="all_bookmark">'
                +'</div>';

        $('#sub_frame_content_data1').append(aa);

        //내용넣기
        get_bookmark_list_data("json/view_bookmark_data.html?main_idx="+main_idx,location);           //북마크


    }

    if(location == 2)
    {
        $('#sub_frame_content_data2').empty();

        var aa = '<div class="all_bookmark">'
                +'</div>';

        $('#sub_frame_content_data2').append(aa);

        //내용넣기
        get_bookmark_list_data("json/view_bookmark_data.html?main_idx="+main_idx,location);           //북마크
    }
}


//메모 리스트 데이터 불러오기
function get_bookmark_list_data(get_url, location)
{
    //모든 북마크를 클리어
    if(location == 1)
    {
        $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .all_bookmark").each(function(){
            $(this).empty();
        });
    }

    if(location == 2)
    {
        $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data2 .all_bookmark").each(function(){
            $(this).empty();
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
            var listLen = jsonObj.view_bookmark_datas.length;

            for(var i=0; i<listLen; i++)
            {
                var main_idx   = jsonObj.view_bookmark_datas[i].main_idx;
                var index      = jsonObj.view_bookmark_datas[i].index;
                var start_time = jsonObj.view_bookmark_datas[i].start_time;
                var end_time   = jsonObj.view_bookmark_datas[i].end_time;
                var contents   = jsonObj.view_bookmark_datas[i].contents;


                Add_bookmark_content(main_idx, index, start_time,  end_time, contents, location);

                console.log(main_idx +","+ index +","+ start_time +","+ end_time +","+ contents +","+ location);
            }

            //메모 및 북마크의 배경색을 바꾼다
            apply_wavesurfer_marker_color();

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_2.');
        }

    });
}

//우측화면 북마크 리스트
function Add_bookmark_content(main_idx, index, start_time, end_time, bookmark_text, location)
{
    //보기모드라면..
    if(global_view_state == "V")
    {
        //하단그래프에 북마크 시점을 추가한다.
        bottom_bookmark_point_insert(start_time, bookmark_text);
    }

    //var selecter = $(".middle_content").next(".memo").next().children();           //
    //var selecter = $(".time_memo");

    var selecter;

    if(location == 1)
    {
        selecter = $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .all_bookmark");
    }

    if(location == 2)
    {
        selecter = $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data2 .all_bookmark");
    }



    var add_bookmark_set =   '<div class="bookmark_set" id="id_bookmark_set_'+index+'">'
                                                    +'<div class="bookmark_second">'+SecondToHis(start_time)+'</div>'
                                                    +'<div class="bookmark_del" onclick="ajax_bookmark_delete(\''+main_idx+'\','+index+','+start_time+','+end_time+','+location+')">삭제</div>'
                                                    +'<div class="bookmark_data">'
                                                            +'<input type="text" id="start_time_bookmark" value="'+start_time+'">'
                                                            +'<input type="text" id="end_time_bookmark" value="'+end_time+'">'
                                                    +'</div>'
                                +'<div class="bookmark_content" id="id_bookmark_content_'+index+'" onclick="WavPlay_range('+start_time+','+end_time+')">'+bookmark_text+'</div>';


    $(selecter).append(add_bookmark_set);

    /*
    //-------------타임메모 늘러날때 전체메모 늘어나게 하려고 했는데...잘안됨 보강해야함
    //$(function() {
        $('.chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .all_bookmark').on('scroll', function() {
            var time_bookmark_height = $(this).height();
            console.log("-------------height:" + time_bookmark_height);
            //$('.chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .all_memo_tarea').height(time_memo_height);
        });
    //});
    */
}


function ajax_bookmark_delete(main_idx, index, start_time, end_time, location){
    //alert('메모삭제:id('+main_idx+') index:('+index+')');

    if (confirm("선택하신 북마크를 삭제하시겠습니까?"))
    {
        //예를 클릭한경우

        //-----대화창에 메모를 삭제한다.
        var selecter = $("input[id='start_time'][value='"+start_time+"']").parent().parent().children().next(".bookmark_yn");  //bookmark_yn
        $(selecter).html("");

        //----<Ajax로 DB에 데이터를 삭제>----
        var url = "json/delete_bookmark.html?main_idx="+main_idx+"&index="+index;

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

                    // Removes all markers.
                    wavesurfer.clearMarkers();

                    //메모리스트를 다시 불러온다.
                    get_bookmark_list_data("json/view_bookmark_data.html?main_idx=" + main_idx, location);

                    //하단 그래프에 북마크 시점을 다시불러온다
                    bottom_memo_point_reload(main_idx);
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


//메모삭제시 하단의 북마크 시점을 다시 불러온다
function bottom_bookmark_point_reload(main_idx)
{
    //<Ajax를 통해 하단 그래프에 메모 시점을 다시불러온다>
    var get_url = "json/view_bookmark_data.html?main_idx=" + main_idx;

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
                var start_time = jsonObj.view_bookmark_datas[i].start_time;
                var contents   = jsonObj.view_bookmark_datas[i].contents;

                //하단그래프에 메모시점을 추가한다.
                bottom_bookmark_point_insert(start_time, contents);
            }

            //메모 및 북마크의 배경색을 바꾼다
            apply_wavesurfer_marker_color();
        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_2.');
        }

    });

    //</Ajax를 통해 하단 그래프에 메모 시점을 다시불러온다>
}
