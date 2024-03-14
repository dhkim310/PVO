
















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

