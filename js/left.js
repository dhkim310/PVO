

//원형그래프
function circle_graph(percent)
{
    if($(".circle_graph_cover").hasClass("on")==false)
    {

        var graph = $(".circle_graph_cover").find(".circle_graph");

        graph.each(function(){

            //var percent = $(this).children(".circle").attr("data-percent");
            //90,75,60,80,70
            var circleLeft = $(this).find(".left .circle-mask-inner");
            var circleRight = $(this).find(".right .circle-mask-inner");
            var strong = $(this).find("strong");

            $({Count:0}).stop().animate({
                Count:percent
            },{
                duration:1000,
                progress:function(){
                    var num = this.Count; //75  25
                    strong.text(Math.ceil(num));
                    //백분율 구하는 공식 (부분값/전체값)*100 = 백분율
                    //백분율 에서 부분값을 구하는 공식  (백분율/100)*전체값 = 부분값
                    var deg = (num/100)*360; // 270   90
                    var degRight = Math.min(Math.max(deg,0),180);
                    var degLeft = Math.min(Math.max(deg-180,0),180);

                    circleRight.css("transform","rotate("+degRight+"deg)");
                    circleLeft.css("transform","rotate("+degLeft+"deg)");
                }
            });


            console.log(percent);

        });
        $(".circle_graph_cover").addClass("on");
    }
}
