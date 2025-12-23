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

// 활동 카드 오버레이 기능
$(document).ready(function () {
  var $activityItems = $(".activity-item");
  var $overlay = $("#activityOverlay");
  var $overlayContent = $overlay.find(".activity-overlay-content");
  var $overlayBackdrop = $overlay.find(".activity-overlay-backdrop");
  var $overlayClose = $overlay.find(".activity-overlay-close");

  // 활동 데이터
  var activityData = {
    mentor: {
      badges: [
        { icon: "fas fa-user-tie", text: "멘토 활동", textJp: "メンター活動" },
        { icon: "fas fa-book-open", text: "학습 가이드", textJp: "学習ガイド" },
        { icon: "fas fa-route", text: "진로 상담", textJp: "進路相談" },
      ],
      items: [
        {
          icon: "fas fa-check-circle",
          text: "멘토로 활동하여 전공 과목 학습 방향 안내 및 학습 방법 공유",
          textJp:
            "メンターとして活動し、専攻科目の学習方向を案内し、学習方法を共有",
        },
        {
          icon: "fas fa-check-circle",
          text: "IT 진로 상담 및 학습 로드맵 피드백 제공",
          textJp: "IT進路相談及び学習ロードマップフィードバック提供",
        },
      ],
    },
    kosmo: {
      badges: [
        { icon: "fab fa-java", text: "Java", textJp: "Java", type: "tech" },
        { icon: "fas fa-leaf", text: "Spring", textJp: "Spring", type: "tech" },
        {
          icon: "fas fa-database",
          text: "Oracle",
          textJp: "Oracle",
          type: "tech",
        },
        {
          icon: "fas fa-plug",
          text: "WebSocket",
          textJp: "WebSocket",
          type: "tech",
        },
        {
          icon: "fas fa-trophy",
          text: "우수상",
          textJp: "優秀賞",
          type: "award",
        },
      ],
      items: [
        {
          icon: "fas fa-check-circle",
          text: "Java, Spring, Spring Boot, JSP, MyBatis, Oracle 기반 웹 애플리케이션 개발 교육 수료",
          textJp:
            "Java、Spring、Spring Boot、JSP、MyBatis、Oracle基盤のウェブアプリケーション開発教育修了",
        },
        {
          icon: "fas fa-check-circle",
          text: "MVC 아키텍처 기반 서버 구조 설계 및 REST API 설계·연동 경험",
          textJp:
            "MVCアーキテクチャ基盤のサーバー構造設計及びREST API設計・連動経験",
        },
        {
          icon: "fas fa-check-circle",
          text: "개인 프로젝트 3회, 팀 프로젝트 1회 수행을 통해 풀스택 개발 경험 축적",
          textJp:
            "個人プロジェクト3回、チームプロジェクト1回を遂行し、フルスタック開発経験を蓄積",
        },
        {
          icon: "fas fa-check-circle",
          text: "WebSocket(STOMP) 기반 실시간 시스템 설계 및 구현 경험",
          textJp: "WebSocket(STOMP)基盤のリアルタイムシステム設計及び実装経験",
        },
        {
          icon: "fas fa-check-circle",
          text: "실시간 경매 시스템 팀 프로젝트에서 분석 및 핵심 기능 개발 담당",
          textJp:
            "リアルタイムオークションシステムチームプロジェクトで分析及び核心機能開発担当",
        },
        {
          icon: "fas fa-trophy",
          text: "프로젝트 완성도와 기여도를 인정받아 팀 프로젝트 우수상 수상",
          textJp:
            "プロジェクト完成度と貢献度を認められ、チームプロジェクト優秀賞受賞",
        },
      ],
    },
  };

  // 현재 언어 가져오기
  function getCurrentLang() {
    return $("body").hasClass("theme-jp") ? "jp" : "ko";
  }

  // 오버레이 열기
  function openOverlay($item) {
    var activity = $item.data("activity");
    var data = activityData[activity];
    var lang = getCurrentLang();
    var isJp = lang === "jp";

    // 아이콘 설정
    var iconClass = $item.data("icon") || "fas fa-info-circle";
    $overlay
      .find(".activity-overlay-icon")
      .html('<i class="' + iconClass + '"></i>');

    // 제목 설정
    var title = isJp ? $item.data("title-jp") : $item.data("title-ko");
    var subtitle = isJp ? $item.data("subtitle-jp") : $item.data("subtitle-ko");
    $overlay
      .find(".activity-overlay-title")
      .html("<h3>" + title + "</h3><p>" + subtitle + "</p>");

    // 배지 설정
    var badgesHtml = '<div class="activity-badges">';
    data.badges.forEach(function (badge) {
      var badgeText = isJp ? badge.textJp : badge.text;
      var badgeClass = badge.type
        ? "activity-badge " + badge.type
        : "activity-badge";
      badgesHtml +=
        '<span class="' +
        badgeClass +
        '">' +
        '<i class="' +
        badge.icon +
        '"></i>' +
        "<span>" +
        badgeText +
        "</span>" +
        "</span>";
    });
    badgesHtml += "</div>";
    $overlay.find(".activity-overlay-badges").html(badgesHtml);

    // 설명 설정
    var itemsHtml = '<ul class="activity-list">';
    data.items.forEach(function (item) {
      var itemText = isJp ? item.textJp : item.text;
      var iconClass =
        item.icon === "fas fa-trophy" ? "fa-trophy" : "fa-check-circle";
      itemsHtml +=
        "<li>" +
        '<i class="fas ' +
        iconClass +
        '"></i>' +
        "<span>" +
        itemText +
        "</span>" +
        "</li>";
    });
    itemsHtml += "</ul>";
    $overlay.find(".activity-overlay-description").html(itemsHtml);

    // 오버레이 표시
    $overlay.addClass("active");
  }

  // 오버레이 닫기
  function closeOverlay() {
    $overlay.removeClass("active");
    $("body").css("overflow", "");
  }

  // 카드 클릭 이벤트
  $activityItems.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    openOverlay($(this));
  });

  // 닫기 버튼 클릭
  $overlayClose.on("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    closeOverlay();
  });

  // 백드롭 클릭 시 닫기
  $overlayBackdrop.on("click", function (e) {
    if (e.target === this) {
      closeOverlay();
    }
  });

  // ESC 키로 닫기
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $overlay.hasClass("active")) {
      closeOverlay();
    }
  });
});
