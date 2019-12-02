function btn_is_confirm_click() {
    if (confirm("정말로 탈퇴하시겠습니까?")) {
        alert("회원탈퇴 되었습니다.");
        req.session.destory();
        session.user.id='dummy'
        location.href="/views/index.ejs?#";
    }
}
function confirm_click() {
    if (confirm("정말로 비밀번호를 변경하시겠습니까?")) {
        location.href="/views/index.ejs?#";
    }
}
function reg_confirm_click() {
    if (confirm("회원정보가 맞습니까?")) {
        location.href="/views/Register/Login.ejs";
    }
}