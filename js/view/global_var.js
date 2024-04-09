//-----<보기시 play관련>-----
var wavesurfer;
var tmp_state = 0;                  //플레이상태   0=일시정지, 1=재생
var global_wave_file_name = "";            //플레이할 파일경로
var global_time = 0;                //진행중인 실시간 현재초
var global_select_index = 0;        //현재 선택된 index
var global_scroll_positon_arr = []; //스크롤 포지션값
//-----<보기시 play관련>-----

var global_msg_view_mode = "M";      //메신져 형태로 보기, 발화자명으로 보기
var global_view_state = "W";         //W:쓰기화면, V보기화면
var global_record_mode = "";        //FAKE:가녹취, REAL:실녹취
var global_record_state = "STOP";       //STOP, RECORD
var backup_func_FakeRecord;             //FakeRecord()를 기억후 나중에 대입하기위해
var global_text_follow_Checked = false;            //텍스트 따라가기

//-----<레코드시 차트 그리기위한 변수>-----
var canvas1;
var canvas2;
var isMerged = false;
var ctx1;
var ctx2;
var buffer1 = [];
var buffer2 = [];
var timer;
var audioContext;
var analyser;
var stream;
//-----</레코드시 차트 그리기위한 변수>-----

