$(function() {

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var subject = $("input#subject").val();
            var message = $("textarea#message").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            
            // 이메일 전송 함수 호출
            sendEmailWithService(name, email, subject, message, firstName);
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});

// 이메일 전송 함수
function sendEmailWithService(name, email, subject, message, firstName) {
    // 버튼 상태 변경
    var $submitBtn = $('button[type="submit"]');
    var originalText = $submitBtn.text();
    
    $submitBtn.prop('disabled', true);
    $submitBtn.text('전송 중...');

    // mailto 링크를 사용한 이메일 전송 (가장 확실한 방법)
    var emailBody = `안녕하세요,

다음과 같은 문의가 있습니다:

이름: ${name}
이메일: ${email}

메시지:
${message}

감사합니다.`;
    
    var mailtoLink = `mailto:choiyounghun0712@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // 이메일 클라이언트 열기
    window.location.href = mailtoLink;
    
    // 성공 메시지 표시 (약간의 지연 후)
    setTimeout(function() {
        showSuccessMessage(firstName);
        resetForm();
        
        // 버튼 상태 복구
        $submitBtn.prop('disabled', false);
        $submitBtn.text(originalText);
    }, 1000);
}

function showSuccessMessage(firstName) {
    $('#success').html("<div class='alert alert-success'>");
    $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
        .append("</button>");
    $('#success > .alert-success')
        .append(`<strong>${firstName}님, 이메일 클라이언트가 열렸습니다. </strong>`);
    $('#success > .alert-success')
        .append("메시지를 확인하고 전송해주세요!");
    $('#success > .alert-success')
        .append('</div>');
}

function resetForm() {
    $('#contactForm').trigger("reset");
}
