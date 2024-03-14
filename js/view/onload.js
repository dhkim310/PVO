//자바스크립트가 문서가 준비된 상황 이후에 발동
    window.onload = function()
    {
        /*--------<검색>---------*/
        $("#search").on("keyup",function(key){
            if(key.keyCode==13)
            {
                /*검색문구*/
                var search = $('#search').val();

                /* 검색했던 text-red 클래스가 있으면 text-normal로 변경 */
                $(".text-red").each(function(){
                    $(this).attr('class','text-normal');
                    console.log(this);
                });

                /* 검색문구가 있으면 text-red css적용 */
                $(".text:contains('"+search+"')").each(function() {
                    var regex = new RegExp(search,'gi');
                    $(this).html( $(this).text().replace(regex, "<span class='text-red'>"+search+"</span>") );
                    //console.log(this);
                });
            }
        });
        /*--------<검색>---------*/

        $(".record_btn_template").hide();
        $(".waveform_btn_template").hide();

        //쓰기모드
        ViewMode_Chart_Record();


        //show_memo();

    }//window.onload
