function btn_is_confirm_click() {
    if (confirm("정말로 탈퇴하시겠습니까?")) {
        alert("회원탈퇴 되었습니다.");
        location.href="/views/index.ejs?#";
    }
}

$(function(){
    $('#new_pass').keyup(function(){
      $('#chkNotice').html('');
    });

    $('#re_pass').keyup(function(){

        if($('#new_pass').val() != $('#re_pass').val()){
          $('#chkNotice').html('비밀번호 일치하지 않음<br><br>');
          $('#chkNotice').css("color", "#f82a2aa3").css("font-weight", "bolder");
        } else{
          $('#chkNotice').html('비밀번호 일치함<br><br>');
          $('#chkNotice').css("color", "#199894b3").css("font-weight", "bolder");
        }
    });
});

$(function(){
    $('#pass1').keyup(function(){
      $('#chkNotice').html('');
    });

    $('#re_pass1').keyup(function(){

        if($('#pass1').val() != $('#re_pass1').val()){
          $('#chkNotice').html('비밀번호 일치하지 않음<br><br>');
          $('#chkNotice').css("color", "#f82a2aa3").css("font-weight", "bolder");
        } else{
          $('#chkNotice').html('비밀번호 일치함<br><br>');
          $('#chkNotice').css("color", "#199894b3").css("font-weight", "bolder");
        }
    });
});