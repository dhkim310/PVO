function changeButtonStyle(buttonId) {
    // 모든 버튼의 스타일 초기화
    var buttons = ["recent_button", "favorite_button", "trash_button"];
    buttons.forEach(function(btn) {
        // 버튼 스타일 초기화
        document.getElementById(btn).style.boxShadow = "none";
        document.getElementById(btn).style.border = "2px solid rgba(204,204,204,1)";
        document.getElementById(btn).style.backgroundColor = "rgba(255,255,255,1)";
        document.getElementById(btn).querySelector("span").style.color = "rgba(204,204,204,1)";
    });

    // 클릭된 버튼 스타일 변경
    var clickedButton = document.getElementById(buttonId);
    clickedButton.style.boxShadow = "0px 4px 4px rgba(0, 0, 0, 0.25)";
    clickedButton.style.border = "2px solid rgba(0,0,0,1)";
    clickedButton.style.backgroundColor = "rgba(255,255,255,1)";
    clickedButton.querySelector("span").style.color = "rgba(0, 0, 0, 1)";
}

document.getElementById("recent_button").onclick = function() {
    changeButtonStyle("recent_button");
};

document.getElementById("favorite_button").onclick = function() {
    changeButtonStyle("favorite_button");
};

document.getElementById("trash_button").onclick = function() {
    changeButtonStyle("trash_button");
};