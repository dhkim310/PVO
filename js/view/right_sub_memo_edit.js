//메모 수정화면 생성
function memo_modify(main_idx, index, start_time, end_time, memo_text){

    //열려있는 모든 textarea .memo_txt 닫기
    cancel_memo_modify_txt();


    //클릭한 영역의 id_memo_set_ id 읽어서
    var id_memo_set = "#id_memo_set_" + index;

    console.log(id_memo_set);
    var selecter = $(id_memo_set); //<--- id_memo_set_1 ~

    //내용밑에 textarea, button을 추가한다.
    var tag =  "<textarea class='memo_txt' id='ta_memo_"+index+"'>"+memo_text+"</textarea>"
              +"<input type='button' class='memo_bodify_btn' id='id_memo_modify_btn_"+index+"' value='저장' onclick='ajax_memo_modify_txt(\""+main_idx+"\","+index+","+start_time+","+end_time+")'>"
              +"<input type='button' class='memo_cancel_btn' onclick='cancel_memo_modify_txt()' value='취소'>";
    $(selecter).append(tag);
}


//메모 수정 버튼 클릭시
function ajax_memo_modify_txt(main_idx, index, start_time, end_time){

    //textarea의 값을 읽어서
    var textarea_ta_memo_val = $("#ta_memo_" + index).val();
    console.log(textarea_ta_memo_val);

    //메모 수정창 닫기
    cancel_memo_modify_txt();
    //----------------------DB저장하는 Ajax를 추가할것-----------------------

    //----<Ajax로 DB에 데이터를 저장>----
    var url = "json/change_memo.html?main_idx="+main_idx+"&index="+index+"&start_time="+start_time+"&end_time="+end_time+"&memo_text"+textarea_ta_memo_val;

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
                get_memo_list_data(main_idx, "json/view_memo_data2.html?workid=workid");

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
