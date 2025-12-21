/*!
 * Start Bootstrap - Agnecy Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// 스크롤 중 플래그 (IntersectionObserver와의 충돌 방지)
var isScrolling = false;

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function () {
  $("a.page-scroll").on("click", function (event) {
    event.preventDefault();
    var $anchor = $(this);
    var target = $anchor.attr("href");

    // href가 유효한지 확인
    if (!target || target === "#" || target === "") {
      return;
    }

    var $targetSection = $(target);

    // 타겟 섹션이 존재하는지 확인
    if ($targetSection.length === 0) {
      return;
    }

    // 클릭한 탭을 즉시 활성화
    var sectionId = $anchor.attr("data-section");
    if (sectionId) {
      $(".tab-nav-list a").removeClass("active");
      $anchor.addClass("active");
    }

    // 네비게이션 바 높이 고려한 오프셋 (모든 섹션에 일관되게 적용)
    var navHeight = $(".tab-nav").outerHeight() || 60;
    var offset = navHeight + 20; // 네비게이션 높이 + 추가 여백

    // 스크롤 중 플래그 설정
    isScrolling = true;

    // 스크롤 애니메이션
    $("html, body")
      .stop(true, true) // 진행 중인 애니메이션 즉시 중지
      .animate(
        {
          scrollTop: $targetSection.offset().top - offset,
        },
        600, // 속도 개선: 800ms -> 600ms
        "easeInOutExpo",
        function () {
          // 애니메이션 완료 후 플래그 해제
          setTimeout(function () {
            isScrolling = false;
          }, 100);
        }
      );
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

// 포트폴리오 모달 즉시 표시 (애니메이션 제거)
$(".portfolio-modal").on("show.bs.modal", function (e) {
  var $modal = $(this);

  console.log("Modal show event triggered for:", $modal.attr("id"));

  // body 스크롤 잠금
  $("body").css({
    overflow: "hidden",
    paddingRight: getScrollbarWidth() + "px",
  });

  // 모달과 백드롭을 즉시 표시
  setTimeout(function () {
    $modal.addClass("in").show().css({
      display: "flex",
    });

    // 백드롭 생성 및 표시
    var $backdrop = $(".modal-backdrop");
    if ($backdrop.length === 0) {
      $("body").append('<div class="modal-backdrop fade in"></div>');
      $backdrop = $(".modal-backdrop");
    }
    $backdrop.addClass("in").css({
      opacity: "0.75",
      display: "block",
    });

    console.log("Modal displayed:", $modal.css("display"));
  }, 0);
});

// 포트폴리오 모달 즉시 닫기 (애니메이션 제거)
$(".portfolio-modal").on("hide.bs.modal", function () {
  var $modal = $(this);
  var $backdrop = $(".modal-backdrop");

  console.log("Modal hide event triggered");

  // fade 클래스 임시 제거하여 애니메이션 없이 즉시 닫기
  $modal.removeClass("fade");
  $backdrop.removeClass("fade");

  // 모달이 완전히 닫힌 후 fade 클래스 복원
  $modal.one("hidden.bs.modal", function () {
    $modal.addClass("fade");

    // 백드롭 제거
    $(".modal-backdrop").remove();

    // body 스크롤 복원
    $("body").css({
      overflow: "",
      paddingRight: "",
    });

    console.log("Modal hidden and cleaned up");
  });
});

// 스크롤바 너비 계산 함수
function getScrollbarWidth() {
  var outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  outer.style.msOverflowStyle = "scrollbar";
  document.body.appendChild(outer);

  var inner = document.createElement("div");
  outer.appendChild(inner);

  var scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

// ESC 키로 모달 닫기
$(document).on("keydown", function (e) {
  if (e.key === "Escape" || e.keyCode === 27) {
    $(".portfolio-modal.in").modal("hide");
  }
});

// Overlay 클릭으로 모달 닫기
$(".portfolio-modal").on("click", function (e) {
  if ($(e.target).hasClass("portfolio-modal")) {
    $(this).modal("hide");
  }
});

// 프로젝트 이미지 캐러셀 기능
function moveCarousel(button, direction) {
  var $carousel = $(button).closest(".project-carousel");
  var $slides = $carousel.find(".carousel-slide");
  var $indicators = $carousel.find(".indicator");
  var currentIndex = $slides.filter(".active").index();
  var nextIndex = currentIndex + direction;

  // 순환 처리
  if (nextIndex < 0) {
    nextIndex = $slides.length - 1;
  } else if (nextIndex >= $slides.length) {
    nextIndex = 0;
  }

  // 슬라이드 전환
  $slides.removeClass("active");
  $slides.eq(nextIndex).addClass("active");

  // 인디케이터 업데이트
  $indicators.removeClass("active");
  $indicators.eq(nextIndex).addClass("active");
}

function goToSlide(indicator, index) {
  var $carousel = $(indicator).closest(".project-carousel");
  var $slides = $carousel.find(".carousel-slide");
  var $indicators = $carousel.find(".indicator");

  // 슬라이드 전환
  $slides.removeClass("active");
  $slides.eq(index).addClass("active");

  // 인디케이터 업데이트
  $indicators.removeClass("active");
  $indicators.eq(index).addClass("active");
}

// 프로젝트 모달 탭 전환
function switchProjectTab(button, tabName) {
  var $modal = $(button).closest(".portfolio-modal");
  var $tabButtons = $modal.find(".tab-btn");
  var $tabContents = $modal.find(".tab-content");

  // 모든 탭 버튼 비활성화
  $tabButtons.removeClass("active");

  // 클릭한 탭 버튼 활성화
  $(button).addClass("active");

  // 모든 탭 콘텐츠 숨기기
  $tabContents.removeClass("active");

  // 선택한 탭 콘텐츠 표시
  $modal.find('.tab-content[data-tab="' + tabName + '"]').addClass("active");
}

// Tab Navigation - IntersectionObserver로 active 탭 표시
$(document).ready(function () {
  var $tabNav = $("#tabNav");

  if (!$tabNav.length) return;

  // 네비게이션 높이 계산
  var navHeight = $tabNav.outerHeight() || 60;

  // IntersectionObserver로 현재 보이는 섹션 감지
  if ("IntersectionObserver" in window) {
    // rootMargin: 상단에서 네비게이션 높이만큼 여유를 두고, 하단은 50% 이상 보일 때 활성화
    var observerOptions = {
      root: null,
      rootMargin: "-" + (navHeight + 10) + "px 0px -50% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    var currentSection = null;
    var sectionEntries = [];

    var observer = new IntersectionObserver(function (entries) {
      // 스크롤 애니메이션 중일 때는 IntersectionObserver 업데이트 무시
      if (isScrolling) {
        return;
      }

      // 모든 관찰 중인 섹션의 상태 업데이트
      entries.forEach(function (entry) {
        var sectionId = entry.target.getAttribute("id");
        var index = sectionEntries.findIndex(function (e) {
          return e.id === sectionId;
        });

        if (index === -1) {
          sectionEntries.push({
            id: sectionId,
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingTop: entry.boundingClientRect.top,
          });
        } else {
          sectionEntries[index].isIntersecting = entry.isIntersecting;
          sectionEntries[index].intersectionRatio = entry.intersectionRatio;
          sectionEntries[index].boundingTop = entry.boundingClientRect.top;
        }
      });

      // 가장 위에 있고 교차하는 섹션 찾기
      var activeSection = null;
      var minTop = Infinity;

      sectionEntries.forEach(function (entry) {
        if (
          entry.isIntersecting &&
          entry.boundingTop < minTop &&
          entry.boundingTop >= -navHeight
        ) {
          minTop = entry.boundingTop;
          activeSection = entry.id;
        }
      });

      // 활성 섹션이 변경되었을 때만 업데이트
      if (activeSection && activeSection !== currentSection) {
        currentSection = activeSection;

        // 모든 탭에서 active 제거
        $(".tab-nav-list a").removeClass("active");

        // 현재 섹션에 해당하는 탭에 active 추가
        var $activeLink = $(
          '.tab-nav-list a[data-section="' + activeSection + '"]'
        );
        if ($activeLink.length) {
          $activeLink.addClass("active");
        }
      }
    }, observerOptions);

    // 모든 섹션 관찰 시작 (hero 섹션 제외)
    $("section[id]").each(function () {
      var sectionId = $(this).attr("id");
      // hero 섹션은 제외
      if (sectionId !== "hero") {
        observer.observe(this);
      }
    });
  } else {
    // IntersectionObserver 미지원 브라우저 fallback - 스크롤 이벤트 사용
    var ticking = false;

    function updateActiveTab() {
      // 스크롤 애니메이션 중일 때는 업데이트 무시
      if (isScrolling) {
        ticking = false;
        return;
      }

      var scrollPosition = $(window).scrollTop();
      var activeSection = null;
      var minDistance = Infinity;

      $("section[id]").each(function () {
        var sectionId = $(this).attr("id");
        // hero 섹션은 제외
        if (sectionId === "hero") return;

        var sectionTop = $(this).offset().top;
        var distance = Math.abs(sectionTop - scrollPosition - navHeight - 10);

        // 섹션이 뷰포트 상단 근처에 있고, 가장 가까운 섹션 선택
        if (
          sectionTop <= scrollPosition + navHeight + 50 &&
          distance < minDistance
        ) {
          minDistance = distance;
          activeSection = sectionId;
        }
      });

      if (activeSection) {
        var $currentActive = $(".tab-nav-list a.active");
        var currentSectionId = $currentActive.attr("data-section");

        if (currentSectionId !== activeSection) {
          $(".tab-nav-list a").removeClass("active");
          $('.tab-nav-list a[data-section="' + activeSection + '"]').addClass(
            "active"
          );
        }
      }

      ticking = false;
    }

    $(window).on("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveTab);
        ticking = true;
      }
    });

    // 초기 실행
    updateActiveTab();
  }
});

// Skills Section - Tab Switching
$(document).ready(function () {
  // 이벤트 위임 방식으로 안정적으로 처리 (동적으로 추가된 요소도 처리 가능)
  $(document)
    .off("click.skillsTab", ".skill-tab")
    .on("click.skillsTab", ".skill-tab", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $tab = $(this);
      var category = $tab.data("category");

      if (!category) {
        return;
      }

      // Don't process if clicking the already active tab
      if ($tab.hasClass("active")) {
        return;
      }

      // Remove active class from all tabs
      $(".skill-tab").removeClass("active");
      $tab.addClass("active");

      // Hide all panels
      $(".skills-panel").removeClass("active");

      // Show selected panel
      var $panel = $('.skills-panel[data-panel="' + category + '"]');

      if ($panel.length > 0) {
        $panel.addClass("active");
      }
    });

  // Ensure first tab is active on load
  var $firstTab = $(".skill-tab").first();
  if ($firstTab.length && !$firstTab.hasClass("active")) {
    $firstTab.addClass("active");
    var firstCategory = $firstTab.data("category");
    if (firstCategory) {
      $('.skills-panel[data-panel="' + firstCategory + '"]').addClass("active");
    }
  }
});

// Experience Section - Tab Switching (한국/일본)
$(document).ready(function () {
  // 이벤트 위임 방식으로 안정적으로 처리
  $(document).on("click", ".experience-tab", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var country = $(this).data("country");

    if (!country) {
      return;
    }

    // Remove active class from all tabs
    $(".experience-tab").removeClass("active");
    $(this).addClass("active");

    // Hide all panels
    $(".experience-panel").removeClass("active");

    // Show selected panel
    var $panel = $('.experience-panel[data-panel="' + country + '"]');

    if ($panel.length > 0) {
      $panel.addClass("active");
    }
  });
});

// Language Toggle with Theme Change - Modern Pill Design
$(document).ready(function () {
  var currentLang = "ko"; // Default language
  var isTransitioning = false; // Prevent spam clicks

  // Theme colors
  var themes = {
    ko: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      gradient: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      background: "#f8fafc",
    },
    jp: {
      primary: "#dc2626",
      secondary: "#991b1b",
      gradient: "linear-gradient(135deg, #dc2626, #991b1b)",
      background: "#fef2f2",
    },
  };

  // Check if user prefers reduced motion
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // Function to change language
  function changeLanguage(lang) {
    // Don't change if already in this language or transitioning
    if (currentLang === lang || isTransitioning) {
      return;
    }

    isTransitioning = true;
    currentLang = lang;
    var dataAttr = "data-" + lang;
    var shouldAnimate = !prefersReducedMotion();

    // Update thumb position
    var $thumb = $("#toggleThumb");
    if (lang === "jp") {
      $thumb.addClass("moving-to-jp");
    } else {
      $thumb.removeClass("moving-to-jp");
    }

    // Update button states
    $(".toggle-option").removeClass("active");
    $('.toggle-option[data-lang="' + lang + '"]').addClass("active");

    // Get all elements with data-ko and data-jp, sorted by depth (deepest first)
    var $allElements = $("[data-ko][data-jp]");
    var elementsArray = $allElements.toArray();

    // Sort by depth (deepest elements first)
    elementsArray.sort(function (a, b) {
      var depthA = $(a).parents("[data-ko][data-jp]").length;
      var depthB = $(b).parents("[data-ko][data-jp]").length;
      return depthB - depthA;
    });

    // Function to update element text with animation
    function updateElementText($elem, newText, iconHTML) {
      if (shouldAnimate) {
        // Add slide-out animation
        $elem.addClass("lang-text-out");

        // Wait for slide-out, then update text and slide-in
        setTimeout(function () {
          // Update content
          if (iconHTML) {
            var $directIcons = $elem.children("i");
            if ($directIcons.length > 0) {
              $elem.html(iconHTML + " " + newText);
            } else {
              $elem.html(iconHTML + " " + newText);
            }
          } else {
            $elem.text(newText);
          }

          // Remove slide-out and add slide-in
          $elem.removeClass("lang-text-out").addClass("lang-text-in");

          // Clean up animation class after completion
          setTimeout(function () {
            $elem.removeClass("lang-text-in");
          }, 300);
        }, 250);
      } else {
        // No animation - instant update
        if (iconHTML) {
          var $directIcons = $elem.children("i");
          if ($directIcons.length > 0) {
            $elem.html(iconHTML + " " + newText);
          } else {
            $elem.html(iconHTML + " " + newText);
          }
        } else {
          $elem.text(newText);
        }
      }
    }

    // Update each element
    $(elementsArray).each(function () {
      var $elem = $(this);
      var newText = $elem.attr(dataAttr);

      if (newText) {
        // Check if this element has direct children with data attributes
        var $directChildrenWithData = $elem.children("[data-ko][data-jp]");

        if ($directChildrenWithData.length === 0) {
          // No direct children with data attributes, safe to update
          // Preserve icon elements (i tags)
          var $icons = $elem.find("i");
          var iconHTML = "";
          if ($icons.length > 0) {
            iconHTML = $icons
              .map(function () {
                return this.outerHTML;
              })
              .get()
              .join(" ");
          }

          updateElementText($elem, newText, iconHTML);
        }
        // If element has children with data attributes, they will be updated separately
      }

      // Update title attributes
      var titleAttr = dataAttr + "-title";
      var newTitle = $elem.attr(titleAttr);
      if (newTitle) {
        $elem.attr("title", newTitle);
      }
    });

    // Change theme
    changeTheme(lang);

    // Store preference
    localStorage.setItem("preferred-lang", lang);

    // Reset transition flag after all animations complete
    setTimeout(function () {
      isTransitioning = false;
    }, shouldAnimate ? 600 : 400);
  }

  // Function to change theme
  function changeTheme(lang) {
    var theme = themes[lang];
    var $body = $("body");

    // Add theme class
    $body.removeClass("theme-ko theme-jp").addClass("theme-" + lang);

    // Apply theme with animation
    $body.css("transition", "background-color 0.5s ease");

    // Update CSS variables (if supported)
    if (document.documentElement.style.setProperty) {
      document.documentElement.style.setProperty(
        "--theme-primary",
        theme.primary
      );
      document.documentElement.style.setProperty(
        "--theme-secondary",
        theme.secondary
      );
      document.documentElement.style.setProperty(
        "--theme-gradient",
        theme.gradient
      );
    }
  }

  // Language button click handler
  $(document)
    .off("click.languageToggle", ".toggle-option")
    .on("click.languageToggle", ".toggle-option", function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $btn = $(this);
      var lang = $btn.data("lang");

      if (!lang) {
        return;
      }

      // Don't process if clicking the already active button
      if ($btn.hasClass("active")) {
        return;
      }

      changeLanguage(lang);
    });

  // Load saved language preference
  var savedLang = localStorage.getItem("preferred-lang");
  if (savedLang && (savedLang === "ko" || savedLang === "jp")) {
    currentLang = savedLang;
    // Update UI without animation on initial load
    var $thumb = $("#toggleThumb");
    if (savedLang === "jp") {
      $thumb.addClass("moving-to-jp");
    }
    $(".toggle-option").removeClass("active");
    $('.toggle-option[data-lang="' + savedLang + '"]').addClass("active");
    changeTheme(savedLang);

    // Update text content
    var dataAttr = "data-" + savedLang;
    var $allElements = $("[data-ko][data-jp]");
    var elementsArray = $allElements.toArray();

    elementsArray.sort(function (a, b) {
      var depthA = $(a).parents("[data-ko][data-jp]").length;
      var depthB = $(b).parents("[data-ko][data-jp]").length;
      return depthB - depthA;
    });

    $(elementsArray).each(function () {
      var $elem = $(this);
      var newText = $elem.attr(dataAttr);

      if (newText) {
        var $directChildrenWithData = $elem.children("[data-ko][data-jp]");

        if ($directChildrenWithData.length === 0) {
          var $icons = $elem.find("i");
          var iconHTML = "";
          if ($icons.length > 0) {
            iconHTML = $icons
              .map(function () {
                return this.outerHTML;
              })
              .get()
              .join(" ");
          }

          if (iconHTML) {
            var $directIcons = $elem.children("i");
            if ($directIcons.length > 0) {
              $elem.html(iconHTML + " " + newText);
            } else {
              $elem.html(iconHTML + " " + newText);
            }
          } else {
            $elem.text(newText);
          }
        }
      }

      var titleAttr = dataAttr + "-title";
      var newTitle = $elem.attr(titleAttr);
      if (newTitle) {
        $elem.attr("title", newTitle);
      }
    });
  } else {
    // Ensure default language button is active
    $(".toggle-option").removeClass("active");
    $('.toggle-option[data-lang="ko"]').addClass("active");
  }
});

// Experience Map - Dynamic Connection Lines + Zoom Feature
$(document).ready(function () {
  var updateTimeout = null;
  var lastUpdateTime = 0;
  var MIN_UPDATE_INTERVAL = 100; // 최소 업데이트 간격 (ms)
  var cachedPositions = {}; // 위치 캐싱
  var zoomedLocation = null; // 현재 확대된 위치

  function drawConnectionLines() {
    // 모바일에서는 연결선 표시 안 함
    if ($(window).width() <= 768) {
      $(".connection-overlay").find(".dynamic-line").remove();
      return;
    }

    var now = Date.now();

    // 너무 자주 업데이트되는 것을 방지
    if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
      return;
    }

    lastUpdateTime = now;

    // 활성화된 패널만 처리
    var $activePanel = $(".experience-panel.active");

    if ($activePanel.length === 0) return;

    var $canvas = $activePanel.find(".map-canvas");
    var $overlay = $canvas.find(".connection-overlay");

    // 기본 요소 체크
    if ($overlay.length === 0 || $canvas.length === 0) return;

    // 캔버스 크기 가져오기
    var canvasRect = $canvas[0].getBoundingClientRect();

    // 캔버스가 화면에 제대로 렌더링되지 않았으면 스킵
    if (canvasRect.width === 0 || canvasRect.height === 0) {
      return;
    }

    // SVG 크기 설정
    $overlay.attr("width", canvasRect.width);
    $overlay.attr("height", canvasRect.height);

    // 기존 연결선 제거
    $overlay.find(".dynamic-line").remove();

    // 패널 타입 확인
    var panelType = $activePanel.attr("data-panel");
    var lineColor = panelType === "korea" ? "#6366f1" : "#dc2626";
    var lineClass = panelType === "korea" ? "korea-line" : "japan-line";

    // 각 마커와 정보 블록을 연결
    $activePanel.find(".location-marker").each(function () {
      var $marker = $(this);
      var location = $marker.attr("data-location");

      // 해당 위치의 모든 정보 블록 찾기 (여러 개 가능)
      var $infoBlocks = $activePanel.find(
        '.info-block[data-location="' + location + '"]'
      );

      if ($infoBlocks.length === 0) return;

      // 마커 dot 요소 찾기
      var $markerDot = $marker.find(".marker-dot");
      if ($markerDot.length === 0) return;

      // 마커 위치 계산 (중심점)
      var markerRect = $markerDot[0].getBoundingClientRect();
      var markerCenterX =
        markerRect.left + markerRect.width / 2 - canvasRect.left;
      var markerCenterY =
        markerRect.top + markerRect.height / 2 - canvasRect.top;

      // 각 정보 블록에 대해 연결선 생성
      $infoBlocks.each(function () {
        var $infoBlock = $(this);

        // 정보 블록 위치 계산 (왼쪽 중앙)
        var infoRect = $infoBlock[0].getBoundingClientRect();
        var infoLeftX = infoRect.left - canvasRect.left;
        var infoCenterY = infoRect.top + infoRect.height / 2 - canvasRect.top;

        // 유효한 좌표인지 확인
        if (
          isNaN(markerCenterX) ||
          isNaN(markerCenterY) ||
          isNaN(infoLeftX) ||
          isNaN(infoCenterY) ||
          markerCenterX < 0 ||
          markerCenterY < 0
        ) {
          return;
        }

        // SVG line 요소 생성
        var $line = $(
          document.createElementNS("http://www.w3.org/2000/svg", "line")
        );
        $line.attr({
          class: "dynamic-line " + lineClass,
          "data-location": location,
          x1: markerCenterX,
          y1: markerCenterY,
          x2: infoLeftX,
          y2: infoCenterY,
          stroke: lineColor,
          "stroke-width": "2",
          "stroke-dasharray": "5,5",
        });

        $overlay.append($line);
      });
    });
  }

  // 마커 확대/축소 기능
  function zoomToLocation(location, $panel) {
    var $canvas = $panel.find(".map-canvas");
    var $mapImage = $canvas.find(".map-image");
    var $markers = $canvas.find(".location-marker");
    var $infoBlocks = $canvas.find(".info-block");
    var $resetBtn = $canvas.find(".zoom-reset-btn");

    // 이미 확대된 위치를 다시 클릭하면 원복
    if (zoomedLocation === location) {
      resetZoom($panel);
      return;
    }

    // 확대 상태 저장
    zoomedLocation = location;

    // 해당 위치의 마커와 정보 블록만 표시
    $markers.each(function () {
      var $marker = $(this);
      if ($marker.attr("data-location") === location) {
        $marker.addClass("zoomed-active");
      } else {
        $marker.addClass("zoomed-inactive");
      }
    });

    $infoBlocks.each(function () {
      var $block = $(this);
      if ($block.attr("data-location") === location) {
        $block.addClass("zoomed-active");
      } else {
        $block.addClass("zoomed-inactive");
      }
    });

    // 지도 확대
    $canvas.addClass("zoomed");

    // 리셋 버튼 표시
    if ($resetBtn.length === 0) {
      var $newResetBtn = $(
        '<button class="zoom-reset-btn" title="원래대로"><i class="fas fa-compress-arrows-alt"></i> <span data-ko="원래대로" data-jp="元に戻す">원래대로</span></button>'
      );
      $canvas.append($newResetBtn);

      // 현재 언어 적용
      var currentLang = $("body").attr("data-lang") || "ko";
      var resetText = currentLang === "jp" ? "元に戻す" : "원래대로";
      $newResetBtn.find("span").text(resetText);
    } else {
      $resetBtn.fadeIn(300);
    }

    // 연결선 업데이트
    setTimeout(drawConnectionLines, 400);
  }

  function resetZoom($panel) {
    var $canvas = $panel.find(".map-canvas");
    var $markers = $canvas.find(".location-marker");
    var $infoBlocks = $canvas.find(".info-block");
    var $resetBtn = $canvas.find(".zoom-reset-btn");

    // 확대 상태 초기화
    zoomedLocation = null;

    // 모든 요소 표시
    $markers.removeClass("zoomed-active zoomed-inactive");
    $infoBlocks.removeClass("zoomed-active zoomed-inactive");
    $canvas.removeClass("zoomed");

    // 리셋 버튼 숨김
    $resetBtn.fadeOut(300);

    // 연결선 업데이트
    setTimeout(drawConnectionLines, 400);
  }

  // 마커 클릭 이벤트
  $(document).on("click", ".location-marker", function (e) {
    e.stopPropagation();
    var $marker = $(this);
    var location = $marker.attr("data-location");
    var $panel = $marker.closest(".experience-panel");

    zoomToLocation(location, $panel);
  });

  // 리셋 버튼 클릭 이벤트
  $(document).on("click", ".zoom-reset-btn", function (e) {
    e.stopPropagation();
    var $panel = $(this).closest(".experience-panel");
    resetZoom($panel);
  });

  // 탭 전환 시 줌 초기화
  var isTabSwitching = false;
  $(document).on("click", ".experience-tab", function () {
    // 모든 패널의 줌 초기화
    $(".experience-panel").each(function () {
      var $panel = $(this);
      if (zoomedLocation) {
        resetZoom($panel);
      }
    });

    // 마커 선택 상태 초기화
    selectedLocation = null;
    $(".location-marker").removeClass("selected");
    $(".dynamic-line").removeClass("highlighted dimmed");

    // 탭 전환 중 플래그 설정
    isTabSwitching = true;

    // 즉시 모든 연결선 제거 (잘못된 위치에 그려지는 것 방지)
    $(".connection-overlay").find(".dynamic-line").remove();

    // 패널 전환 애니메이션이 완료될 때까지 대기 후 연결선 업데이트
    setTimeout(function () {
      drawConnectionLines();
      isTabSwitching = false;
    }, 450);
  });

  // 초기 로드
  setTimeout(function () {
    drawConnectionLines();
  }, 800);

  // 이미지 로드 완료 후
  $(window).on("load", function () {
    setTimeout(function () {
      drawConnectionLines();
    }, 300);
  });

  // 윈도우 리사이즈
  var resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      drawConnectionLines();
    }, 200);
  });

  // IntersectionObserver로 패널이 화면에 보일 때 업데이트
  if ("IntersectionObserver" in window) {
    var panelObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
            setTimeout(drawConnectionLines, 200);
          }
        });
      },
      {
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: "50px",
      }
    );

    $(".experience-panel").each(function () {
      panelObserver.observe(this);
    });
  }

  // MutationObserver로 패널 활성화 감지
  var mutationObserver = new MutationObserver(function (mutations) {
    // 탭 전환 중이면 무시 (중복 호출 방지)
    if (isTabSwitching) {
      return;
    }

    var needsUpdate = false;
    mutations.forEach(function (mutation) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        var $target = $(mutation.target);
        if ($target.hasClass("experience-panel")) {
          needsUpdate = true;
        }
      }
    });

    if (needsUpdate) {
      setTimeout(drawConnectionLines, 450);
    }
  });

  $(".experience-panel").each(function () {
    mutationObserver.observe(this, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });

  // 마커 클릭 시 연결선 강조
  var selectedLocation = null;

  $(document).on("click", ".location-marker", function (e) {
    e.stopPropagation();

    var clickedLocation = $(this).attr("data-location");
    var $activePanel = $(".experience-panel.active");
    var $allLines = $activePanel.find(".connection-overlay .dynamic-line");

    // 같은 마커를 다시 클릭하면 선택 해제
    if (selectedLocation === clickedLocation) {
      selectedLocation = null;
      // 모든 연결선을 기본 상태로
      $allLines.removeClass("highlighted dimmed");
      // 마커 강조 제거
      $activePanel.find(".location-marker").removeClass("selected");
    } else {
      selectedLocation = clickedLocation;

      // 먼저 모든 연결선의 클래스 제거
      $allLines.removeClass("highlighted dimmed");

      // 모든 연결선을 순회하면서 선택된 것과 아닌 것 구분
      $allLines.each(function () {
        var lineLocation = $(this).attr("data-location");
        if (lineLocation === clickedLocation) {
          $(this).addClass("highlighted");
        } else {
          $(this).addClass("dimmed");
        }
      });

      // 모든 마커의 선택 상태 제거
      $activePanel.find(".location-marker").removeClass("selected");
      // 클릭된 마커 강조
      $(this).addClass("selected");
    }
  });

  // 다른 곳 클릭 시 선택 해제
  $(document).on("click", function (e) {
    if (
      !$(e.target).closest(".location-marker").length &&
      !$(e.target).closest(".info-block").length
    ) {
      selectedLocation = null;
      var $activePanel = $(".experience-panel.active");
      $activePanel
        .find(".connection-overlay .dynamic-line")
        .removeClass("highlighted dimmed");
      $activePanel.find(".location-marker").removeClass("selected");
    }
  });

  // Experience Modal functionality
  var $experienceModal = $("#experienceModal");
  var $experienceModalBody = $experienceModal.find(".experience-modal-body");

  // info-block 클릭 시 모달 열기
  $(document).on("click", ".info-block", function (e) {
    e.stopPropagation();

    var $block = $(this);
    var $category = $block.find(".info-category").clone();

    // 모달에 내용 삽입
    $experienceModalBody.empty().append($category);

    // 모달 열기
    $experienceModal.addClass("active");
    $("body").css("overflow", "hidden");
  });

  // 모달 닫기 버튼
  $experienceModal.find(".experience-modal-close").on("click", function () {
    closeExperienceModal();
  });

  // 오버레이 클릭 시 모달 닫기
  $experienceModal.find(".experience-modal-overlay").on("click", function () {
    closeExperienceModal();
  });

  // ESC 키로 모달 닫기
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $experienceModal.hasClass("active")) {
      closeExperienceModal();
    }
  });

  // 모달 닫기 함수
  function closeExperienceModal() {
    $experienceModal.removeClass("active");
    $("body").css("overflow", "");
  }

  // 이력서 다운로드 버튼 클릭 핸들러
  $(".resume-download-btn").on("click", function(e) {
    e.preventDefault();
    var resumeUrl = $(this).attr("href");
    var fileName = $(this).attr("download") || "ChoiYoungHun_Frontend_Engineer_Resume.pdf";
    
    // 새 링크 요소를 생성하여 다운로드 강제
    var link = document.createElement("a");
    link.href = resumeUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
