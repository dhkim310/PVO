//화자명, 마이크볼륨 불러오기
async function get_speaker_data(get_url)
{
//{
//  "speaker1_input_data": "홍길동",
//  "mic1_volumn_data":80,
//  "speaker2_input_data": "관리자",
//  "mic2_volumn_data":50
//}


    let response = await $.ajax({
        url: get_url,
        type: "GET",
        dataType: "text",
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        success: function (json)
        {
            var jsonObj = jQuery.parseJSON(json);

            var speaker1_input_data = jsonObj.speaker1_input_data;
            var mic1_volumn_data    = jsonObj.mic1_volumn_data;
            var speaker2_input_data = jsonObj.speaker2_input_data;
            var mic2_volumn_data    = jsonObj.mic2_volumn_data;

        },

        error: function (request, status, error)
        {
            console.log(error);
            alert('죄송합니다. 서버 연결에 실패했습니다_2.');
        }

    });

    return response;
}
