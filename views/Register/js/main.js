function btn_is_confirm_click() {
    if (confirm("정말로 탈퇴하시겠습니까?")) {
        alert("회원탈퇴 되었습니다.");
        location.href="/views/index.ejs?#";
    }
}