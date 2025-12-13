/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
  $("a.page-scroll").bind("click", function (event) {
    var $anchor = $(this);
    var offset = 0;

    // 프로젝트 섹션으로 이동할 때 추가 여백 적용 (네비게이션 바 높이 고려)
    if ($anchor.attr("href") === "#projects") {
      offset = 80; // 상단 여백 (픽셀 단위)
    } else {
      offset = 50; // 다른 섹션들의 기본 여백
    }

    $("html, body")
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr("href")).offset().top - offset,
        },
        1500,
        "easeInOutExpo"
      );
    event.preventDefault();
  });
});

// Highlight the top nav as scrolling occurs
$("body").scrollspy({
  target: ".navbar-fixed-top",
});

// Closes the Responsive Menu on Menu Item Click
$(".navbar-collapse ul li a").click(function () {
  $(".navbar-toggle:visible").click();
});

$("div.modal").on("show.bs.modal", function () {
  var modal = this;
  var hash = modal.id;
  window.location.hash = hash;
  window.onhashchange = function () {
    if (!location.hash) {
      $(modal).modal("hide");
    }
  };
});

// Tab Navigation - IntersectionObserver로 active 탭 표시
$(document).ready(function () {
  var $tabNav = $("#tabNav");

  if (!$tabNav.length) return;

  // IntersectionObserver로 현재 보이는 섹션 감지
  if ("IntersectionObserver" in window) {
    var observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // 뷰포트 중앙 기준
      threshold: 0
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var sectionId = entry.target.getAttribute("id");

          // 모든 탭에서 active 제거
          $(".tab-nav-list a").removeClass("active");

          // 현재 섹션에 해당하는 탭에 active 추가
          var $activeLink = $('.tab-nav-list a[data-section="' + sectionId + '"]');
          if ($activeLink.length) {
            $activeLink.addClass("active");
          }
        }
      });
    }, observerOptions);

    // 모든 섹션 관찰 시작
    $("section[id]").each(function () {
      observer.observe(this);
    });
  } else {
    // IntersectionObserver 미지원 브라우저 fallback
    console.warn("IntersectionObserver not supported");
  }
});
