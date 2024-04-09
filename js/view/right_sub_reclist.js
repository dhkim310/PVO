//--------------------------<우측 서브메뉴(녹취록 탐색 리스트)>---------------------------------------

/*
<div class="sub_frame_content" id="sub_frame_content_data1">
	<div class="reclist">
		<div class="reclist_content" onclick="reclist_view(1111,1)">이보워님 셋톱박스 설치문의1</div>
		<div class="reclist_date">2024. 1. 11.(수) 14:11</div>
        ...
	</div>
</div>
*/


function show_reclist(location)
{
    if(location == 1)
    {
        //기존내용 지우기
        $('#sub_frame_content_data1').empty();

        var aa = '<div class="reclist"></div>';
        $('#sub_frame_content_data1').append(aa);

        //내용넣기
        get_reclist_data("json/view_reclist_data.html",location);           //메모


    }

    if(location == 2)
    {
        $('#sub_frame_content_data2').empty();

         var aa = '<div class="reclist"></div>';
        $('#sub_frame_content_data2').append(aa);

        //내용넣기
        get_reclist_data("json/view_reclist_data.html",location);           //메모
    }
}

/*
{
  "view_reclist_datas": [
    {
      "main_idx": "1111",
      "index": 0,
      "subject": "이보워님 셋톱박스 설치문의1",
      "date": 2024. 1. 11.(수) 14:11
    },
    ...
*/

//녹취록탐색 리스트 데이터 불러오기
function get_reclist_data(get_url, location)
{
    $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);
            var listLen = jsonObj.view_reclist_datas.length;

            for(var i=0; i<listLen; i++)
            {
                var main_idx    = jsonObj.view_reclist_datas[i].main_idx;
                var subject     = jsonObj.view_reclist_datas[i].subject;
                var date        = jsonObj.view_reclist_datas[i].date;

                Add_reclists_content(main_idx, subject,  date, location);

                console.log(main_idx +","+ subject +","+ date +","+ location);
            }

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_2.');
        }

    });
}




//우측화면 녹취록탐색 리스트
function Add_reclists_content(main_idx, subject, date, location)
{
    var selecter;

    if(location == 1)
    {
        selecter = $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .reclist");
    }

    if(location == 2)
    {
        selecter = $(".chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data2 .reclist");
    }


    var aa = '<div class="reclist_content" onclick="reclist_view('+main_idx+','+location+')">'+subject+'</div>'
            +'<div class="reclist_date">'+date+'</div>';


    $(selecter).append(aa);
}
