//자바스크립트가 문서가 준비된 상황 이후에 발동
    window.onload = function()
    {
        /*
        //--------<검색>---------/
        $("#search").on("keyup",function(key){
            if(key.keyCode==13)
            {
                //검색문구/
                var search = $('#search').val();

                //검색했던 text-red 클래스가 있으면 text-normal로 변경/
                $(".text-red").each(function(){
                    $(this).attr('class','text-normal');
                    console.log(this);
                });

                //검색문구가 있으면 text-red css적용/
                $(".text:contains('"+search+"')").each(function() {
                    var regex = new RegExp(search,'gi');
                    $(this).html( $(this).text().replace(regex, "<span class='text-red'>"+search+"</span>") );
                    //console.log(this);
                });
            }
        });
        //--------<검색>---------/
        */


        $(".record_btn_template").hide();
        $(".waveform_btn_template").hide();


        //--------------------레코드 / 보기------------------------
        const urlParams = new URL(location.href).searchParams;

        if(true == urlParams.has('mode'))
        {
            const mode = urlParams.get('mode');

            //레코드 모드
            if(mode == "record")
            {
                //쓰기모드
                ViewMode_Chart_Record();
            }


            //보기 모드
            if(mode == "view")
            {
                if(true == urlParams.has('idx')){

                    var idx = urlParams.get('idx');

                    ViewMode_Chart_View(idx);
                }
            }

        }else{
            //alert('주소가 명확하지 않습니다.');
            //history.back();

            location.href = "view.html?mode=record";
        }








        //-----------------키보드 이벤트--------------------
        document.addEventListener("keydown", eheckKey, false);

        function eheckKey(e) {
            if (e.shiftKey && e.keyCode === 65) {
                //console.log('Shift키와 A키가 눌렸습니다.');
                get_chatting_data_sample('json/view_chat_data.html?main_idx=A123456');
            }
        }


        //다운로드 기능
//        function download(filename, textInput) {
//
//          var element = document.createElement('a');
//          element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
//          element.setAttribute('download', filename);
//          document.body.appendChild(element);
//          element.click();
//          //document.body.removeChild(element);
//        }
//
//        document.getElementById("bt_text_follow1").addEventListener("click", function () {
//            //var text = document.getElementById("text").value;
//            var filename = "wav/RecordWaveData.wav";
//            download(filename, "aa");
//        }, false);
//
//
//        document.getElementById("bt_text_follow2").addEventListener("click", function () {
//            //var text = document.getElementById("text").value;
//            var filename = "wav/RecodTextData.wav";
//            download(filename, "aa");
//        }, false);




        //show_memo();

    }//window.onload
