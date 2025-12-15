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

// Language Toggle with Theme Change
$(document).ready(function () {
  var currentLang = "ko"; // Default language

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

  // Function to show language transition animation
  function showLanguageAnimation(fromLang, toLang) {
    var $overlay = $('<div class="language-transition-overlay"></div>');
    $("body").append($overlay);

    // 한국 → 일본: 일본의 특징을 담은 애니메이션
    if (fromLang === "ko" && toLang === "jp") {
      $overlay.addClass("transition-ko-to-jp");

      // 붉은 태양 생성 (일본 국기의 상징)
      var $sun = $('<div class="japanese-sun"></div>');
      $overlay.append($sun);

      // 일본 전통 문양 (세이카이 패턴) 생성
      for (var i = 0; i < 6; i++) {
        var $pattern = $('<div class="japanese-pattern"></div>');
        var angle = i * 60;
        var distance = 150 + Math.random() * 100;
        $pattern.css({
          transform: "rotate(" + angle + "deg) translateX(" + distance + "px)",
          animationDelay: i * 0.1 + "s",
        });
        $overlay.append($pattern);
      }
    }
    // 일본 → 한국: 태극기 패턴 애니메이션
    else if (fromLang === "jp" && toLang === "ko") {
      $overlay.addClass("transition-jp-to-ko");
      // 태극 패턴 생성
      var $taegeuk = $('<div class="taegeuk-pattern"></div>');
      $overlay.append($taegeuk);
      // 한국 전통 패턴 효과
      for (var i = 0; i < 8; i++) {
        var $wave = $('<div class="korean-wave"></div>');
        var angle = i * 45;
        $wave.css({
          transform: "rotate(" + angle + "deg)",
          animationDelay: i * 0.1 + "s",
        });
        $overlay.append($wave);
      }
    }

    // 애니메이션 후 제거
    var animationDuration = fromLang === "ko" && toLang === "jp" ? 2000 : 1500;
    setTimeout(function () {
      $overlay.fadeOut(300, function () {
        $(this).remove();
      });
    }, animationDuration);
  }

  // Function to change language
  function changeLanguage(lang) {
    // Don't change if already in this language
    if (currentLang === lang) {
      return;
    }

    // Show transition animation
    showLanguageAnimation(currentLang, lang);

    currentLang = lang;
    var dataAttr = "data-" + lang;

    // Get all elements with data-ko and data-jp, sorted by depth (deepest first)
    var $allElements = $("[data-ko][data-jp]");
    var elementsArray = $allElements.toArray();

    // Sort by depth (deepest elements first)
    elementsArray.sort(function (a, b) {
      var depthA = $(a).parents("[data-ko][data-jp]").length;
      var depthB = $(b).parents("[data-ko][data-jp]").length;
      return depthB - depthA;
    });

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

          if (iconHTML) {
            // Check if icons are direct children
            var $directIcons = $elem.children("i");
            if ($directIcons.length > 0) {
              // Icons are direct children, preserve them
              $elem.html(iconHTML + " " + newText);
            } else {
              // Icons are nested, try to preserve structure
              $elem.html(iconHTML + " " + newText);
            }
          } else {
            // No icons, just update text
            $elem.text(newText);
          }
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

    // Update language button states
    $(".lang-btn").removeClass("active");
    $('.lang-btn[data-lang="' + lang + '"]').addClass("active");

    // Store preference
    localStorage.setItem("preferred-lang", lang);
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

  // Language button click handler - 이벤트 위임 방식으로 안정적으로 처리
  // 이벤트 위임 방식으로 바인딩 (동적으로 추가된 요소도 처리 가능)
  $(document)
    .off("click.languageToggle", ".lang-btn")
    .on("click.languageToggle", ".lang-btn", function (e) {
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
    changeLanguage(savedLang);
  } else {
    // Ensure default language button is active
    $('.lang-btn[data-lang="ko"]').addClass("active");
  }
});

// Experience Map - Dynamic Connection Lines (완전히 재구축)
$(document).ready(function () {
  var updateTimeout = null;
  var lastUpdateTime = 0;
  var MIN_UPDATE_INTERVAL = 100; // 최소 업데이트 간격 (ms)
  var cachedPositions = {}; // 위치 캐싱

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

    // 모든 패널 처리 (활성/비활성 모두)
    $(".experience-panel").each(function () {
      var $panel = $(this);
      var $canvas = $panel.find(".map-canvas");
      var $overlay = $canvas.find(".connection-overlay");

      // 기본 요소 체크
      if ($overlay.length === 0 || $canvas.length === 0) return;

      // 패널이 활성화되어 있는지 확인
      var isActive = $panel.hasClass("active");

      if (!isActive) {
        // 비활성 패널의 연결선은 제거
        $overlay.find(".dynamic-line").remove();
        return;
      }

      // 캔버스 크기 가져오기
      var canvasRect = $canvas[0].getBoundingClientRect();

      // 캔버스가 화면에 제대로 렌더링되지 않았으면 재시도
      if (canvasRect.width === 0 || canvasRect.height === 0) {
        setTimeout(function () {
          drawConnectionLines();
        }, 200);
        return;
      }

      // SVG 크기 설정
      $overlay.attr("width", canvasRect.width);
      $overlay.attr("height", canvasRect.height);

      // 기존 연결선 제거
      $overlay.find(".dynamic-line").remove();

      // 패널 타입 확인
      var panelType = $panel.attr("data-panel");
      var lineColor = panelType === "korea" ? "#6366f1" : "#dc2626";
      var lineClass = panelType === "korea" ? "korea-line" : "japan-line";

      // 각 마커와 정보 블록을 연결
      $panel.find(".location-marker").each(function () {
        var $marker = $(this);
        var location = $marker.attr("data-location");

        // 해당 위치의 모든 정보 블록 찾기 (여러 개 가능)
        var $infoBlocks = $panel.find(
          '.info-block[data-location="' + location + '"]'
        );

        if ($infoBlocks.length === 0) return;

        // 마커 dot 요소 찾기
        var $markerDot = $marker.find(".marker-dot");
        if ($markerDot.length === 0) return;

        // 마커 위치 계산 (중심점) - 고정 좌표 사용
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
    });
  }

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

  // 탭 전환 시
  $(document).on("click", ".experience-tab", function () {
    // 탭이 전환되는 동안 여러 번 업데이트
    setTimeout(drawConnectionLines, 100);
    setTimeout(drawConnectionLines, 300);
    setTimeout(drawConnectionLines, 600);
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
      setTimeout(drawConnectionLines, 100);
      setTimeout(drawConnectionLines, 400);
    }
  });

  $(".experience-panel").each(function () {
    mutationObserver.observe(this, {
      attributes: true,
      attributeFilter: ["class"],
    });
  });
});
