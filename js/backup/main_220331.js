// variables
//let userName = null;
//let state = 'SUCCESS';


function Message(arg)
{
    this.text = arg.text;
    this.message_side = arg.message_side;

    this.draw = function (_this)
    {
        return function ()
        {
            let $message;
            $message = $($('.message_template').clone().html());
            $message.addClass(_this.message_side).find('.text').html(_this.text);
            $('.messages').append($message);

            return setTimeout(function () {
                return $message.addClass('appeared');
            }, 0);
        };
    }(this);
    return this;
}

function getMessageText()
{
    let $message_input;
    $message_input = $('.message_input');
    return $message_input.val();
}

function sendMessage(text, message_side)
{
    let $messages, message;
    $('.message_input').val('');
    $messages = $('.messages');
    message = new Message({
        text: text,
        message_side: message_side
    });
    message.draw();
    $messages.animate({scrollTop: $messages.prop('scrollHeight')}, 300);
}

function greet()
{
    setTimeout(function ()
    {
        return sendMessage("스마트홈 데모에 오신걸 환영합니다.", 'left');
    }, 100);
}


function onClickAsEnter(e)
{
    if (e.keyCode === 13)
    {
        onSendButtonClicked()
    }
}


function onSendButtonClicked()
{

    let messageText = getMessageText();

    //-----빈값이 들어오면 보내는 함수를 추가해보자-----

    //CefSharp이 노출하는 오브젝트를 바인딩하는 함수를 IIFE형식으로 호출. 비동기함수이므로 await키워드로 함수의 완료를 기다림
    (async function () {

        //boundAsync싱크를 맞추고 C#으로 메세지를 보냄
        await CefSharp.BindObjectAsync("boundAsync");

        boundAsync.showDevTools(messageText);

    })();
}

function SampleRightText()
{
	setTimeout(function ()
    {
        return sendMessage("테스트입니다", 'right');
    }, 100);

}

function LoadComplete()
{
    return "WebPage Loaded"
}


