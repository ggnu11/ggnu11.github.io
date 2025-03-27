// Typed.js 기능
document.addEventListener("DOMContentLoaded", function () {
  var typed = new Typed("#typed", {
    strings: [
      "안녕하세요!",
      "프론트엔드 개발자 최영훈입니다.",
      "새로운 기술을 배우고 성장하는 것을 즐깁니다.",
    ],
    typeSpeed: 50,
    backSpeed: 35,
    loop: true,
  });
});

// 이메일 복사 기능
function copyEmail() {
  const email = document.getElementById("email").textContent;
  navigator.clipboard
    .writeText(email)
    .then(() => {
      alert("이메일이 복사되었습니다");
    })
    .catch((err) => {
      console.error("복사 실패: ", err);
    });
}
