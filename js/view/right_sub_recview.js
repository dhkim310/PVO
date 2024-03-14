//--------------------------<우측 서브메뉴(녹취록 탐색 뷰화면)>---------------------------------------

/*
<div class="sub_frame_content" id="sub_frame_content_data1">
	<div class="recview">
		<div class="subject">이보워님 요금제 상담 문의</div>
		<div class="recdate">녹음일자: 2024년 1월 29일 (월) 오후 12시 48분 5초 ~ 오후 12시 56분 38초</div>
		<div class="modrecdate">최종수정일자: 2024년 1월 29일 (월) 오후 12시 48분 5초 ~ 오후 12시 56분 38초</div>
		<div class="recview_list">
			<div class="list">
				<div class="name">관리자</div>
				<div class="start_time">2</div>
				<div class="text">티비하고 인터넷 지금 이번에 개통해서 부른 사람인데요</div>
			</div>
			<div class="list">
				<div class="name">홍길동</div>
				<div class="start_time">10</div>
				<div class="text">반갑습니다. 스카이라이프 전혜원입니다</div>
			</div>
		</div>
	</div>
</div>
*/

function reclist_view(main_idx, location)
{
    if(location == 1)
    {
        //기존내용 지우기
        $('#sub_frame_content_data1').empty();

        var aa = '<div class="recview"></div>';
        $('#sub_frame_content_data1').append(aa);

        //내용넣기
        get_recview_data("json/view_recview_data.html",location);           //메모


    }

    if(location == 2)
    {
        $('#sub_frame_content_data2').empty();

         var aa = '<div class="recview"></div>';
        $('#sub_frame_content_data2').append(aa);

        //내용넣기
        get_recview_data("json/view_recview_data.html",location);           //메모
    }
}

/*
{
  "main_idx": 1111,
  "subject":"이보워님 요금제 상담 문의",
  "from_date":"2024년 1월 29일 (월) 오후 12시 48분 5초",
  "to_date":"오후 12시 56분 38초",
  "rectime":165,
  "modify_date":"2024년 1월 29일 (월) 오후 12시 58분",
  "view_recview_datas": [
    {
      "index": 1,
      "speaker": 1,
      "name": "관리자",
      "start_time": 2,
      "end_time": 9,
      "text": "티비하고 인터넷 지금 이번에 개통해서 부른 사람인데요"
    },
    {
      "index": 2,
      "speaker": 2,
      "name": "홍길동",
      "start_time": 10,
      "end_time": 12,
      "text": "반갑습니다. 스카이라이프 전혜원입니다"
    }
  ]
}
*/

//녹취록탐색 리스트 데이터 불러오기
function get_recview_data(get_url, location)
{
    $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);

            var subject     = jsonObj.subject;
            var from_date   = jsonObj.from_date;
            var to_date     = jsonObj.to_date;
            var rectime     = jsonObj.rectime;
            var modify_date = jsonObj.modify_date;

            if(location == 1)
            {
                selecter = $("#sub_frame_content_data1 .recview");
            }

            if(location == 2)
            {
                selecter = $("#sub_frame_content_data2 .recview");
            }

             var aa = '<div class="subject">'+subject+'</div>'
                     +'<div class="recdate">녹음일자: '+from_date+' ~ '+to_date+' ('+rectime+')</div>'
                     +'<div class="modrecdate">최종수정일자: '+from_date+' ~ '+to_date+'</div>'
                     +'<div class="recview_list"></div>';

            $(selecter).append(aa);

            var listLen = jsonObj.view_recview_datas.length;

            for(var i=0; i<listLen; i++)
            {
                var index       = jsonObj.view_recview_datas[i].index;
                var speaker     = jsonObj.view_recview_datas[i].speaker;
                var name        = jsonObj.view_recview_datas[i].name;
                var start_time  = jsonObj.view_recview_datas[i].start_time;
                var end_time    = jsonObj.view_recview_datas[i].end_time;
                var text        = jsonObj.view_recview_datas[i].text;

                Add_recview_content(name,  start_time, text, location);

                console.log(name +","+ start_time +","+ text +","+ location);
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
function Add_recview_content(name, start_time, text, location)
{
    var selecter;

    if(location == 1)
    {
        selecter = $("#sub_frame_content_data1 .recview .recview_list");
    }

    if(location == 2)
    {
        selecter = $("#sub_frame_content_data2 .recview .recview_list");
    }

    var aa = '<div class="list">'
                +'<div class="name">'+name+'</div><div class="start_time">'+start_time+'</div>'
                +'<div class="text">'+text+'</div>'
            +'</div>';

    $(selecter).append(aa);


    //-------------타임메모 늘러날때 전체메모 늘어나게 하려고 했는데...잘안됨 보강해야함

//        $('.chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .time_memo').on('scroll', function() {
//            var time_memo_height = $(this).height();
//            console.log("-------------height:" + time_memo_height);
//            $('.chat_window .middle_content .sub_content .sub_frame #sub_frame_content_data1 .all_memo_tarea').height(time_memo_height);
//        });


}
