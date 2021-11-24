
$(function () {
    $("input[name='username']").select();
    $("input[name='username']").focus();
});

$("#btnlogin").click(function () {
    var validUser = false;

    if ($("input[name='username']").val() != "" && $("input[name='password']").val() != "") {
        submitLoginAccount();
    } else {
        ErrorPopup("Username & Password wajib diisi !!", "", "");
    }        
});


function submitLoginAccount() {
    var xhr;
    xhr && xhr.abort();

    openMainLoading();
    
    xhr = $.ajax({
        method: "POST",
        url: "log-action",
        data: $("form[name='form_login']").serialize(),
        beforeSend: function () {
        },
        success: function (results) {
            closeMainLoading();
            if (results != "") {
                var dataJson = JSON.parse(results);
                if (dataJson.code == "1") {
                    window.location = "/kodepos";
                } else {
                    if (dataJson.message != "") {
                        message = dataJson.message;
                    } else {
                        message = "Invalid account";
                    }
                    ErrorPopup(message,"","");
                }
            }
        },
        error: function () {
            closeMainLoading();
        }
    })
}
