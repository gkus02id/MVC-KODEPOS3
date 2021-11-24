function menuQuery(queryStr) {
    openMainLoading();

    if (initCorePopup()) {
        if (queryStr != '') {
            var xhr;
            xhr && xhr.abort();

            xhr = $.ajax({
                method: "POST",
                url: queryStr,
                beforeSend: function () {
                },
                success: function (results) {
                    if (queryStr == "logout") {
                        location.reload(true);
                    } else {
                        if (results != "") {
                            $("#content-wrapper-global").html(results);
                        } else {
                            doCheckUserStatus();
                        }
                    }
                    closeMainLoading();
                },
                error: function () {
                    closeMainLoading();
                }
            });
        } else {
            closeMainLoading();
        }
    } 
}


function doCheckUserStatus() {
    var xhr;
    xhr && xhr.abort();

    xhr = $.ajax({
            method: "GET",
            url: "userstatus",
            beforeSend: function () {
            },
            success: function (results) {
                if (results != "") {
                    var oJSonResult = JSON.parse(results);
                    if (oJSonResult.code == "0") {
                        window.location = "/";
                    }
                }
            },
            error: function () {
            }
        });
}

function fnLoadingForm(urlForm) {
    openMainLoading();
	if (urlForm != ''){
	    var xhr;
	    xhr && xhr.abort();

	    xhr = $.ajax({
	        method: "POST",
	        url: urlForm,
	        beforeSend: function () {
	        },
	        success: function (results) {
	            if (results != "") {
	                $("#content-wrapper-global").html(results);
	            }
	            closeMainLoading();
	        },
	        error: function () {
	            closeMainLoading();
	        }
	    });
	} else {
	    closeMainLoading();
	}
}

function fnLoadingFormWithParam(urlForm,dataForm) {
    var vData = "";
    openMainLoading();
	
	if (urlForm != '') {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: urlForm,
            data: dataForm, 
            beforeSend: function () {
            },
            success: function (results) {
                if (results != "") {
                    $("#content-wrapper-global").html(results);
                }
                closeMainLoading();
            },
            error: function () {
                closeMainLoading();
            }
        });
    } else {
        closeMainLoading();
    }
}

function autoLoginForm() {
    document.location = "/";
}

function doSubmitFormCoreNavigation(sysMenu, sysParam){
    $("form[name='formcorenavigation']").attr("target","_blank");    
    $("input[name='SYS_PARAM_MENU']").val(sysMenu);
    $("input[name='SYS_PARAM_REQ']").val(sysParam);
    $("form[name='formcorenavigation']").submit();
}

function doReloadFormCoreNavigation(sysMenu, sysParam) {
    $("form[name='formcorenavigation']").attr("target", "_self");
    $("input[name='SYS_PARAM_MENU']").val(sysMenu);
    $("input[name='SYS_PARAM_REQ']").val(sysParam);
    $("form[name='formcorenavigation']").submit();
}

