var instPopup;
var instDelPopup;
var instSubPopUp;
var instSub2PopUp;
var instSub3PopUp;
var instComPopUp;
var intCfPopUp;
var instPrintPopup;
var oRemodalPopUp;
var isCheckUniquePopup = false;

function initCorePopup() {
    /*
    $('.remodal').unbind();
    $('.subremodal').unbind();
    $('.sub2remodal').unbind();
    $('.sub3remodal').unbind();
    $('.cfremodal').unbind();
    */

    $(document).on('confirmation', '.remodal').unbind();
    $(document).on('cancellation', '.remodal').unbind();
    $(document).on('closed', '.remodal').unbind();
    $(document).on('closing', '.remodal').unbind();
    $(document).on('opened', '.remodal').unbind();
    $(document).on('opening', '.remodal').unbind();

    $(document).on('subconfirmation', '.subremodal').unbind();
    $(document).on('subcancellation', '.subremodal').unbind();
    $(document).on('subclosed', '.subremodal').unbind();
    $(document).on('subclosing', '.subremodal').unbind();
    $(document).on('subopened', '.subremodal').unbind();
    $(document).on('subopening', '.subremodal').unbind();

    $(document).on('sub2confirmation', '.sub2remodal').unbind();
    $(document).on('sub2cancellation', '.sub2remodal').unbind();
    $(document).on('sub2closed', '.sub2remodal').unbind();
    $(document).on('sub2closing', '.sub2remodal').unbind();
    $(document).on('sub2opened', '.sub2remodal').unbind();
    $(document).on('sub2opening', '.sub2remodal').unbind();

    $(document).on('sub3confirmation', '.sub3remodal').unbind();
    $(document).on('sub3cancellation', '.sub3remodal').unbind();
    $(document).on('sub3closed', '.sub3remodal').unbind();
    $(document).on('sub3closing', '.sub3remodal').unbind();
    $(document).on('sub3opened', '.sub3remodal').unbind();
    $(document).on('sub3opening', '.sub3remodal').unbind();

    $(document).on('cconfirmation', '.cremodal').unbind();
    $(document).on('ccancellation', '.cremodal').unbind();
    $(document).on('cclosed', '.cremodal').unbind();
    $(document).on('cclosing', '.cremodal').unbind();
    $(document).on('copened', '.cremodal').unbind();
    $(document).on('copening', '.cremodal').unbind();

    $(document).on('delconfirmation', '.delremodal').unbind();
    $(document).on('delcancellation', '.delremodal').unbind();
    $(document).on('delclosed', '.delremodal').unbind();
    $(document).on('delclosing', '.delremodal').unbind();
    $(document).on('delopened', '.delremodal').unbind();
    $(document).on('delopening', '.delremodal').unbind();

    $(document).on('printconfirmation', '.printremodal').unbind();
    $(document).on('printcancellation', '.printremodal').unbind();
    $(document).on('printclosed', '.printremodal').unbind();
    $(document).on('printclosing', '.printremodal').unbind();
    $(document).on('printopened', '.printremodal').unbind();
    $(document).on('printopening', '.printremodal').unbind();

    if (typeof customLoadRecord !== 'undefined' && typeof customLoadRecord === 'function') customLoadRecord = undefined;
    if (typeof showCustomLoadRecord !== 'undefined' && typeof showCustomLoadRecord === 'function') showCustomLoadRecord = undefined;
    if (typeof showCustomButton !== 'undefined' && typeof showCustomButton === 'function') showCustomButton = undefined;
    if (typeof customLoadListRecord !== 'undefined' && typeof customLoadListRecord === 'function') customLoadListRecord = undefined;
    if (typeof showCustomSaveEntry !== 'undefined' && typeof showCustomSaveEntry === 'function') showCustomSaveEntry = undefined;
    if (typeof customCloseReModalPopup !== 'undefined' && typeof customCloseReModalPopup === 'function') customCloseReModalPopup = undefined;
    if (typeof customProcessPreClosePopUp !== 'undefined' && typeof customProcessPreClosePopUp === 'function') customProcessPreClosePopUp = undefined;
    if (typeof showCustomSaveEntryPopup !== 'undefined' && typeof showCustomSaveEntryPopup === 'function') showCustomSaveEntryPopup = undefined;
    if (typeof customExtendCancelCRemodal !== 'undefined' && typeof customExtendCancelCRemodal === 'function') customExtendCancelCRemodal = undefined;
    if (typeof customDoDeleteRecord !== 'undefined' && typeof customDoDeleteRecord === 'function') customDoDeleteRecord = undefined;
    if (typeof customDoPrintRecord !== 'undefined' && typeof customDoPrintRecord === 'function') customDoPrintRecord = undefined;
    if (typeof customLoadContentOnePopupForm !== 'undefined' && typeof customLoadContentOnePopupForm === 'function') customLoadContentOnePopupForm = undefined;
    if (typeof customDoViewCorePrint !== 'undefined' && typeof customDoViewCorePrint === 'function') customDoViewCorePrint = undefined;
    if (typeof customDoCorePrint !== 'undefined' && typeof customDoCorePrint === 'function') customDoCorePrint = undefined;
    if (typeof doSetCoreReqParam !== 'undefined' && typeof doSetCoreReqParam === 'function') doSetCoreReqParam = undefined;

    $(document).on('delconfirmation', '.delremodal', function () {
        var $this = $(this);
        doCoreDeleteRecord($this.find("input[name='POPUP_URL_ACTION']").val(), $this.find("input[name='POPUP_OBJECT_ID']").val());
    });

    $(document).on('delcancellation', '.delremodal', function () {
    });

    return true;
}

function ErrorPopup(message, title, errorType) {
    var strPopupType = "popup_style_error";
    var strPopupTitle = "Error Message!";

    if (title != "") {
        strPopupTitle = title;
    }

    if (errorType == "alert") {
        toastr.warning(message);
    } else {
        toastr.error(message, strPopupTitle);
    }
}

function MessagePopup(message) {
    toastr.success(message, "");
}

function warningCoreDeleteRecord(eUser, eDate) {
    var dialogContent = "<form role=\"form\" method=\"POST\" id=\"mainPopupForm\" mode=\"INS\" onsubmit=\"event.preventDefault();\">"
                        + "<div class=\"form-group-popup-header\">"
                        + "     <label class=\"popup-label-group-title\">Record Locked</label>"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_URL_ACTION\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_OBJECT_ID\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_OBJECT_ID\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_FIELD_NAME\" value=\"\" nosave />"
                        + "</div>"
                        + "<div class=\"form-group-popup\">"
                        + "    <label class=\"popup-label-group\">User</label>"
                        + "    <div class=\"popup-input-group\">" + eUser + "</div>"
                        + "</div>"
                        + "<div class=\"form-group-popup\">"
                        + "    <label class=\"popup-label-group\">Date</label>"
                        + "    <div class=\"popup-input-group\">" + eDate + "</div>" 
                        + "</div>"
                        + "<div class=\"form-group-popup-footer\">"
                        + "     <button data-remodal-action=\"cancel\" id=\"remodal-cancel\" class=\"remodal-cancel\">Close</button>"
                        + "</div>"
                        + "</form>";

    $("#content-remodal").html(dialogContent);
    instPopup = $.remodal.lookup[$('[data-remodal-id=remodalform]').data('remodal')];
    instPopup.open();
}

function coreDeleteRecord(urlRecord, tid) {
    var dialogContent = "<form role=\"form\" method=\"POST\" id=\"mainPopupForm\" mode=\"INS\" onsubmit=\"event.preventDefault();\">"
                        + "<div class=\"form-group-popup-header\">"
                        + "     <label class=\"popup-label-group-title\">Confirm Delete Data!</label>"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_URL_ACTION\" value=\"" + urlRecord + "\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_OBJECT_ID\" value=\"" + tid + "\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_OBJECT_ID\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_FIELD_NAME\" value=\"\" nosave />"
                        + "</div>"
                        + "<div class=\"form-group-popup\" style=\"font-size:14pt;margin:15px\">"
                        + "Apakah Anda yakin ingin menghapus data ini ?"
                        + "</div>"
                        + "<div class=\"form-group-popup-footer\">"
                        + "     <button data-delremodal-action=\"confirm\" id=\"delremodal-confirm\" class=\"delremodal-confirm\">Ya</button>"
                        + "     <button data-delremodal-action=\"cancel\" id=\"delremodal-cancel\" class=\"delremodal-cancel\">Tidak</button>"
                        + "</div>"
                        + "</form>";

   $("#content-delremodal").html(dialogContent);
   instDelPopup = $.delremodal.lookup[$('[data-delremodal-id=delremodalform]').data('delremodal')];
   instDelPopup.open();
}

function corePrintRecord(urlRecord) {
    var dialogContent = "<iframe id='frmprintareacore' name='frmprintareacore' src='' style='display:none!important' />"
                        + "<form method=\"POST\" id=\"printPopupForm\" name=\"printPopupForm\" action=\"" + urlRecord + "\" target=\"\" style='display:none!important'>"
                        + "     <input type=\"hidden\" name=\"format\" id=\"printact\" value=\"\" />"
                        + "     <input type=\"hidden\" name=\"printerid\" id=\"printerid\" value=\"\" />"
                        + "     <div id=\"frmprintareacorebody\" style='display:none!important'></div>"
                        + "</form>"
                        + "<form role=\"form\" method=\"POST\" id=\"printPopupForm\" onsubmit=\"event.preventDefault();\">"
                        + "<div class=\"form-group-popup-header\">"
                        + "     <label class=\"popup-label-group-title\">Print Dialog!</label>"
                        + "</div>"
                        + "<div id=\"printPopupForm-step2\" class=\"form-group-popup hide\" style=\"font-size:10pt;margin-top:15px;margin-bottom:15px;\">"
                        + "     <div class=\"selectPrinter\" style=\"display:block;float:left;width:90%;margin-left:5%\"><b>Printer</b><br /><select name=\"printer_default\" id=\"printer_default\" class=\"form-control popup-select-group\" style=\"width:100%; margin-top:15px; margin-bottom:15px;\"></select></div>"
                        + "     <button id=\"printremodal-doprint\" class=\"printremodal-cancel\" onclick=\"doCorePrint()\">Print</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id=\"printremodal-cancel\" class=\"printremodal-cancel\" onclick=\"doPrevStep1CorePrint()\">Cancel</button>"
                        + "</div>"
                        + "<div id=\"printPopupForm-step1\" class=\"form-group-popup\" style=\"font-size:10pt;margin-top:15px;margin-bottom:15px\">"
                        + "     <button id=\"printremodal-print\" class=\"printremodal-cancel\" onclick=\"doPreCorePrint()\">Print</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id=\"printremodal-view\" class=\"printremodal-cancel\" onclick=\"doViewCorePrint()\">View</button>"
                        + "</div>"
                        + "<div class=\"form-group-popup-footer\">"
                        + "     <button data-printremodal-action=\"cancel\" id=\"printremodal-cancel\" class=\"printremodal-cancel\">Close</button>"
                        + "</div>"
                        + "</form>";

    $("#content-printremodal").html(dialogContent);
    instPrintPopup = $.printremodal.lookup[$('[data-printremodal-id=printremodalform]').data('printremodal')];
    loadCoreListPrinter();
    instPrintPopup.open();
}

function loadCoreListPrinter() {
    var xhr;
    xhr && xhr.abort();
    xhr = $.ajax({
        method: "POST",
        url: "listprinter",
        beforeSend: function () {
        },
        success: function (results) {
            if (results != "") {
                $("#printer_default").find("option").remove().end().append(results);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
        }
    });
}

function doViewCorePrint() {
    resetParamPrintRecord();
    $("form[name='printPopupForm']").attr("target", "_blank");
    $("input[name='printerid']").val("");
    if (typeof customDoViewCorePrint !== 'undefined' && typeof customDoViewCorePrint === 'function') {
        customDoViewCorePrint();
    } else {
        $("#printact").val("pdf");
        if (typeof doSetCoreReqParam !== 'undefined' && typeof doSetCoreReqParam === 'function') {
            doSetCoreReqParam();
        }
        document.forms["printPopupForm"].submit();
    }
}

function doCorePrint() {
    resetParamPrintRecord();
    $("form[name='printPopupForm']").attr("target", "frmprintareacore");
    $("input[name='printerid']").val($("select[name='printer_default']").val());
    if (typeof customDoCorePrint !== 'undefined' && typeof customDoCorePrint === 'function') {
        customDoCorePrint();
    } else {
        $("#printact").val("print");
        if (typeof doSetCoreReqParam !== 'undefined' && typeof doSetCoreReqParam === 'function') {
            doSetCoreReqParam();
        }
        document.forms["printPopupForm"].submit();
    }
}

function doPreCorePrint() {
    $("#printPopupForm-step1").addClass("hide");
    $("#printPopupForm-step2").removeClass("hide");
}

function doPrevStep1CorePrint() {
    $("#printPopupForm-step1").removeClass("hide");
    $("#printPopupForm-step2").addClass("hide");
}

function resetParamPrintRecord() {
    $("#frmprintareacorebody").html("");
}

function appendParamPrintRecord(id, value) {
    $("#frmprintareacorebody").append("<input type='hidden' id='" + id + "' name='" + id + "' value='" + value + "' />");
}

function closePopupCorePrint() {
    instPrintPopup.close();
}

$(document).on('cconfirmation', '.cremodal', function () {
});

$(document).on('ccancellation', '.cremodal', function () {
    if (typeof customExtendCancelCRemodal !== 'undefined' && typeof customExtendCancelCRemodal === 'function') {
        customExtendCancelCRemodal();
    }
});

$(document).on('delconfirmation', '.delremodal', function () {
    var $this = $(this);
	doCoreDeleteRecord($this.find("input[name='POPUP_URL_ACTION']").val(), $this.find("input[name='POPUP_OBJECT_ID']").val());
});

$(document).on('delcancellation', '.delremodal', function () {
});

function coreConfirmPopup(urlRecord, tid, title, message) {
    var dialogContent = "<form role=\"form\" method=\"POST\" id=\"mainPopupForm\" mode=\"INS\" onsubmit=\"event.preventDefault();\">"
                        + "<div class=\"form-group-popup-header\">"
                        + "     <label class=\"popup-label-group-title\">" + title + "</label>"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_URL_ACTION\" value=\"" + urlRecord + "\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_OBJECT_ID\" value=\"" + tid + "\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_OBJECT_ID\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_FIELD_NAME\" value=\"\" nosave />"
                        + "</div>"
                        + "<div class=\"form-group-popup\" style=\"font-size:14pt;margin-bottom:10px;margin-top:10px;\">"
                        + message 
                        + "</div>"
                        + "<div class=\"form-group-popup-footer\">"
                        + "     <button data-cfremodal-action=\"confirm\" id=\"cfremodal-confirm\" class=\"cfremodal-confirm\">Ok</button>"
                        + "     <button data-cfremodal-action=\"cancel\" id=\"cfremodal-cancel\" class=\"cfremodal-cancel\">Cancel</button>"
                        + "</div>"
                        + "</form>";

    $("#content-cfremodal").html(dialogContent);
    intCfPopUp = $.cfremodal.lookup[$('[data-cfremodal-id=cfremodalform]').data('cfremodal')];
    intCfPopUp.open();   
}

/*
function ErrorPopup(message, title, errorType) {
    var strPopupType = "popup_style_error";
    var strPopupTitle = "Error Message!";

    if (title != "") {
        strPopupTitle = title;
    }

    if (errorType == "alert") {
        strPopupType = "popup_style_alert";
    }

    var dialogContent = "<form role=\"form\" method=\"POST\" id=\"mainPopupForm\" mode=\"INS\" onsubmit=\"event.preventDefault();\">"
                        + "<div class=\"form-group-popup-header " + strPopupType + "\">"
                        + "     <label class=\"popup-label-group-title\">" + strPopupTitle + "</label>"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_URL_ACTION\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_OBJECT_ID\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_OBJECT_ID\" value=\"\" nosave />"
                        + "     <input type=\"hidden\" dataType=\"string\" dataKey=\"0\" name=\"POPUP_TOP_FIELD_NAME\" value=\"\" nosave />"
                        + "</div>"
                        + "<div class=\"form-content-group-popup\">"
                        + "     <div class=\"form-content-group-popup-detail\">"
                        + "         <div class=\"form-group-popup\" style=\"font-size:12pt;margin-bottom:10px;\">" + message + "</div>"
                        + "             <div class=\"form-group-popup-footer\">"
                        + "                 <button data-cremodal-action=\"cancel\" id=\"cremodal-cancel\" class=\"cremodal-cancel\">Close</button>"
                        + "             </div>"
                        + "         </div>"
                        + "     </div>"
                        + "</div>"
                        + "</form>";

    $("#content-cremodal").html(dialogContent);
    instComPopUp = $.cremodal.lookup[$('[data-cremodal-id=cremodalform]').data('cremodal')];
    instComPopUp.open();
}
*/

/*
$(document).on('cconfirmation', '.cremodal', function () {
});

$(document).on('ccancellation', '.cremodal', function () {
    if (typeof customExtendCancelCRemodal !== 'undefined' && typeof customExtendCancelCRemodal === 'function') {
        customExtendCancelCRemodal();
    }
});
*/

function doCoreDeleteRecord(urlRecord, tid) {
    if (typeof customDoDeleteRecord !== 'undefined' && typeof customDoDeleteRecord === 'function') {
        customDoDeleteRecord(urlRecord, tid);
    } else {
        var xhr;
        xhr && xhr.abort();
        xhr = $.ajax({
            method: "POST",
            url: urlRecord,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
                instDelPopup.close();
                if (results != "") {
                    var dataJson = JSON.parse(results);
                    if (dataJson.code == "1") {
                        if (typeof customCloseReModalPopup !== 'undefined' && typeof customCloseReModalPopup === 'function') {
                            customCloseReModalPopup(urlRecord);
                        } else {
                            coreLoadListRecord(tid);
                        }
                    } else {
                        if (dataJson.message != "" && dataJson.message != "ERROR") {
                            var dataJsonError = JSON.parse(dataJson.message);
                            if (dataJsonError.RECORD_STATUS == "e") {
                                warningCoreDeleteRecord(dataJsonError.LOCKED_BY, dataJsonError.LOCKED_DATE);
                            }
                        }
                    }
                } else {
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                instDelPopup.close();
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.", "", "");
                }
                closeMainLoading();
            }
        });
    }
}

function openShortPopupForm(menuId, formId, popupType, recordId) {
    var xhr;
    xhr && xhr.abort();

    if (recordId == "") {
        xhr = $.ajax({
            method: "POST",
            url: 'popupshort' + menuId,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
                switch (popupType) {
                    case "remodal":
                        $("#content-remodal").html("");
                        if (results != "") {
                            $("#content-remodal").html(results);
                            instPopup = $.remodal.lookup[$('[data-remodal-id=' + formId + ']').data('remodal')];
                            instPopup.open();
                        }
                        break;
                    case "subremodal":
                        $("#content-subremodal").html("");
                        if (results != "") {
                            $("#content-subremodal").html(results);
                            instSubPopUp = $.subremodal.lookup[$('[data-subremodal-id=' + formId + ']').data('subremodal')];
                            instSubPopUp.open();
                        }
                        break;
                    case "sub2remodal":
                        $("#content-sub2remodal").html("");
                        if (results != "") {
                            $("#content-sub2remodal").html(results);
                            instSub2PopUp = $.sub2remodal.lookup[$('[data-sub2remodal-id=' + formId + ']').data('sub2remodal')];
                            instSub2PopUp.open();
                        }
                        break;
                    case "sub3remodal":
                        $("#content-sub3remodal").html("");
                        if (results != "") {
                            $("#content-sub3remodal").html(results);
                            instSub3PopUp = $.sub3remodal.lookup[$('[data-sub3remodal-id=' + formId + ']').data('sub3remodal')];
                            instSub3PopUp.open();
                        }
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.");
                    autoLoginForm();
                }
                closeMainLoading();
            }
        });
    } else {
        xhr = $.ajax({
            method: "POST",
            url: 'editshort' + menuId + '_' + recordId,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
                switch (popupType) {
                    case "remodal":
                        $("#content-remodal").html("");
                        if (results != "") {
                            $("#content-remodal").html(results);
                            instPopup = $.remodal.lookup[$('[data-remodal-id=' + formId + ']').data('remodal')];
                            instPopup.open();
                        }
                        break;
                    case "subremodal":
                        $("#content-subremodal").html("");
                        if (results != "") {
                            $("#content-subremodal").html(results);
                            instSubPopUp = $.subremodal.lookup[$('[data-subremodal-id=' + formId + ']').data('subremodal')];
                            instSubPopUp.open();
                        }
                        break;
                    case "sub2remodal":
                        $("#content-sub2remodal").html("");
                        if (results != "") {
                            $("#content-sub2remodal").html(results);
                            instSub2PopUp = $.sub2remodal.lookup[$('[data-sub2remodal-id=' + formId + ']').data('sub2remodal')];
                            instSub2PopUp.open();
                        }
                        break;
                    case "sub3remodal":
                        $("#content-sub3remodal").html("");
                        if (results != "") {
                            $("#content-sub3remodal").html(results);
                            instSub3PopUp = $.sub3remodal.lookup[$('[data-sub3remodal-id=' + formId + ']').data('sub3remodal')];
                            instSub3PopUp.open();
                        }
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.");
                }
                closeMainLoading();
            }
        });
    }

    return true;
}

function openPopupForm(menuId, formId, popupType, recordId) {
    var xhr;
    xhr && xhr.abort();
        
    if (recordId == "") {
        xhr = $.ajax({
            method: "POST",
            url: 'popup' + menuId,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
                switch (popupType) {
                    case "remodal":
                        $("#content-remodal").html("");
                        if (results != "") {
                            $("#content-remodal").html(results);
                            instPopup = $.remodal.lookup[$('[data-remodal-id=' + formId + ']').data('remodal')];
                            instPopup.open();
                        }
                        break;
                    case "subremodal":
                        $("#content-subremodal").html("");
                        if (results != "") {
                            $("#content-subremodal").html(results);
                            instSubPopUp = $.subremodal.lookup[$('[data-subremodal-id=' + formId + ']').data('subremodal')];
                            instSubPopUp.open();
                        }
                        break;
                    case "sub2remodal":
                        $("#content-sub2remodal").html("");
                        if (results != "") {
                            $("#content-sub2remodal").html(results);
                            instSub2PopUp = $.sub2remodal.lookup[$('[data-sub2remodal-id=' + formId + ']').data('sub2remodal')];
                            instSub2PopUp.open();
                        }
                        break;
                    case "sub3remodal":
                        $("#content-sub3remodal").html("");
                        if (results != "") {
                            $("#content-sub3remodal").html(results);
                            instSub3PopUp = $.sub3remodal.lookup[$('[data-sub3remodal-id=' + formId + ']').data('sub3remodal')];
                            instSub3PopUp.open();
                        }
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.");
                    autoLoginForm();
                }
                closeMainLoading();
            }
        });
    } else {
        xhr = $.ajax({
            method: "POST",
            url: 'edit' + menuId + '_' + recordId,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
                switch (popupType) {
                    case "remodal":
                        $("#content-remodal").html("");
                        if (results != "") {
                            $("#content-remodal").html(results);
                            instPopup = $.remodal.lookup[$('[data-remodal-id=' + formId + ']').data('remodal')];
                            instPopup.open();
                        }
                        break;
                    case "subremodal":
                        $("#content-subremodal").html("");
                        if (results != "") {
                            $("#content-subremodal").html(results);
                            instSubPopUp = $.subremodal.lookup[$('[data-subremodal-id=' + formId + ']').data('subremodal')];
                            instSubPopUp.open();
                        }
                        break;
                    case "sub2remodal":
                        $("#content-sub2remodal").html("");
                        if (results != "") {
                            $("#content-sub2remodal").html(results);
                            instSub2PopUp = $.sub2remodal.lookup[$('[data-sub2remodal-id=' + formId + ']').data('sub2remodal')];
                            instSub2PopUp.open();
                        }
                        break;
                    case "sub3remodal":
                        $("#content-sub3remodal").html("");
                        if (results != "") {
                            $("#content-sub3remodal").html(results);
                            instSub3PopUp = $.sub3remodal.lookup[$('[data-sub3remodal-id=' + formId + ']').data('sub3remodal')];
                            instSub3PopUp.open();
                        }
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.");
                }
                closeMainLoading();
            }
        });
    }

    return true;
}

function openPopupFormWithParam(menuId, formId, popupType, param) {
    var xhr;
    xhr && xhr.abort();

    openMainLoading();

    xhr = $.ajax({
            method: "POST",
            url: 'popup' + menuId,
            data: param, 
            beforeSend: function () {
            },
            success: function (results) {
                closeMainLoading();

                switch (popupType) {
                    case "remodal":
                        $("#content-remodal").html("");
                        if (results != "") {
                            $("#content-remodal").html(results);
                            instPopup = $.remodal.lookup[$('[data-remodal-id=' + formId + ']').data('remodal')];
                            instPopup.open();
                        }
                        break;
                    case "subremodal":
                        $("#content-subremodal").html("");
                        if (results != "") {
                            $("#content-subremodal").html(results);
                            instSubPopUp = $.subremodal.lookup[$('[data-subremodal-id=' + formId + ']').data('subremodal')];
                            instSubPopUp.open();
                        }
                        break;
                    case "sub2remodal":
                        $("#content-sub2remodal").html("");
                        if (results != "") {
                            $("#content-sub2remodal").html(results);
                            instSub2PopUp = $.sub2remodal.lookup[$('[data-sub2remodal-id=' + formId + ']').data('sub2remodal')];
                            instSub2PopUp.open();
                        }
                        break;
                    case "sub3remodal":
                        $("#content-sub3remodal").html("");
                        if (results != "") {
                            $("#content-sub3remodal").html(results);
                            instSub3PopUp = $.sub3remodal.lookup[$('[data-sub3remodal-id=' + formId + ']').data('sub3remodal')];
                            instSub3PopUp.open();
                        }
                        break;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                closeMainLoading();
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.");
                    autoLoginForm();
                }
            }
        });
    
    return true;
}

function loadContentOnePopupForm(urlId, oPopUp, formId, popupType, param, contentId) {
    var xhr;
    xhr && xhr.abort();

    if (formId == "execute") {
        xhr = $.ajax({
            method: "POST",
            url: urlId,
            data: param,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.");
                    autoLoginForm();
                }
                closeMainLoading();
            }
        });
    } else {
        xhr = $.ajax({
            method: "POST",
            url: urlId,
            data: param,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
                var errorMessage = "";

                if (contentId != "") oPopUp.find("#" + contentId).html("");
                if (results != "" && contentId != "") {
                    if (results.indexOf("code") != -1 && results.indexOf("locked_by") != -1 && results.indexOf("locked_date") != -1) {
                        var oJson = JSON.parse(results);
                        if (oJson.code == "0") {
                            errorMessage = "<b>Record Locked<br />User : " + oJson.locked_by + "<br />Date : " + oJson.locked_date + "</b>";
                            ErrorPopup(errorMessage);
                        }
                    } else {
                        oPopUp.find("#" + contentId).html(results);
                    }
                }
                if (typeof customLoadContentOnePopupForm !== 'undefined' && typeof customLoadContentOnePopupForm === 'function') {
                    customLoadContentOnePopupForm(urlId, param, oPopUp, formId, popupType, results);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status == 0) {
                    ErrorPopup("Cannot connect to server. Please try re-sign.");
                    autoLoginForm();
                }
                closeMainLoading();
            }
        });
    }
}

function openCustomPopupFormWithParam(urlId, formId, popupType, param) {
    var xhr;
    xhr && xhr.abort();

    xhr = $.ajax({
        method: "POST",
        url: urlId,
        data: param,
        beforeSend: function () {
            openMainLoading();
        },
        success: function (results) {
            closeMainLoading();
            switch (popupType) {
                case "remodal":
                    $("#content-remodal").html("");
                    if (results != "") {
                        $("#content-remodal").html(results);
                        instPopup = $.remodal.lookup[$('[data-remodal-id=' + formId + ']').data('remodal')];
                        instPopup.open();
                    }
                    break;
                case "subremodal":
                    $("#content-subremodal").html("");
                    if (results != "") {
                        $("#content-subremodal").html(results);
                        instSubPopUp = $.subremodal.lookup[$('[data-subremodal-id=' + formId + ']').data('subremodal')];
                        instSubPopUp.open();
                    }
                    break;
                case "sub2remodal":
                    $("#content-sub2remodal").html("");
                    if (results != "") {
                        $("#content-sub2remodal").html(results);
                        instSub2PopUp = $.sub2remodal.lookup[$('[data-sub2remodal-id=' + formId + ']').data('sub2remodal')];
                        instSub2PopUp.open();
                    }
                    break;
                case "sub3remodal":
                    $("#content-sub3remodal").html("");
                    if (results != "") {
                        $("#content-sub3remodal").html(results);
                        instSub3PopUp = $.sub3remodal.lookup[$('[data-sub3remodal-id=' + formId + ']').data('sub3remodal')];
                        instSub3PopUp.open();
                    }
                    break;
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status == 0) {
                ErrorPopup("Cannot connect to server. Please try re-sign.");
                autoLoginForm();
            }
            closeMainLoading();
        }
    });

    return true;
}

function doProcessPreClosePopUp(oPopUp, popupType, tid) {
    if (popupType == "remodal") {
        coreLoadListRecord(tid);
    } else {
        if (typeof customDoProcessPreClosePopUp !== 'undefined' && typeof customDoProcessPreClosePopUp === 'function') {
            customDoProcessPreClosePopUp(oPopUp, popupType, tid);
        } else {
            var oTableId = oPopUp.find("input[name='POPUP_OBJECT_ID']").val();
            var topTableId = oPopUp.find("input[name='POPUP_TOP_OBJECT_ID']").val();
            var topFieldName = oPopUp.find("input[name='POPUP_TOP_FIELD_NAME']").val();

            var xhr;
            xhr && xhr.abort();

            xhr = $.ajax({
                method: "POST",
                url: 'list' + oTableId,
                beforeSend: function () {
                    openMainLoading();
                },
                success: function (results) {
                    closeMainLoading();
                    if (results != "") {

                        var selectedValue = oRemodalPopUp.find("select[name='" + topFieldName + "']").val();
                        
                        if (typeof customProcessPreClosePopUp !== 'undefined' && typeof customProcessPreClosePopUp === 'function') {
                            oRemodalPopUp.find("select[name='" + topFieldName + "']").find('option').remove().end().append(results);
							oRemodalPopUp.find("select[name='" + topFieldName + "']").val(selectedValue);
							customProcessPreClosePopUp(topFieldName, selectedValue);
                        } else {
                            if (oRemodalPopUp.find("select[name='" + topFieldName + "']").hasClass("selectized")) {
                                var $select = oRemodalPopUp.find("select[name='" + topFieldName + "']").selectize();
                                var selectize = $select[0].selectize;
								selectize.clearOptions();
								oRemodalPopUp.find("select[name='" + topFieldName + "']").find('option').remove().end().append(results);
								oRemodalPopUp.find("select[name='" + topFieldName + "']").val(selectedValue);
								oRemodalPopUp.find("select[name='" + topFieldName + "'] option").each(function () {
                                    selectize.addOption({ value: $(this).val(), text: $(this).text() });
                                });
                                selectize.refreshOptions();
                            } else {
								oRemodalPopUp.find("select[name='" + topFieldName + "']").find('option').remove().end().append(results);
								oRemodalPopUp.find("select[name='" + topFieldName + "']").val(selectedValue);
							}
                        }

                        instSubPopUp.close();
                        oRemodalPopUp.find("select[name='" + topFieldName + "']").focus();
                    }
                },
                error: function () {
                    closeMainLoading();
                }
            });
        }
    }
}

function saveEntryPopup(oPopUp, popupType, formId, tableName, autoNumFormat) {
    var mode = oPopUp.find('#' + formId).attr("mode");
    var firstErrorId = "";
    var customErrorId = "";
    var customErrorMessage = "";

    switch (popupType) {
        case "remodal":
            oPopUp.find("#remodal-confirm").prop("disabled", true);
            break;
        case "subremodal":
            oPopUp.find("#subremodal-confirm").prop("disabled", true);
            break;
        case "sub2remodal":
            oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
            break;
        case "sub3remodal":
            oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
            break;
    }

    var dtAccess = new dataAccess();
    var actionValidation = true;
    var dataKey = "0";
    var upperCase = true;
    var optByPassValidate = false;
    dtAccess.initialize(tableName, autoNumFormat, mode);

    oPopUp.find(".form-control").removeClass("error");

    oPopUp.find("#" + formId).find(":input").each(function () {
        var nosaveFlag = $(this).attr("nosave");
        var uppercaseFlag = $(this).attr("uppercase");
        var isValidSaveField = true;
        var fieldName = $(this).attr("name");

        if (fieldName != undefined && fieldName != "undefined")
        {
            if (fieldName.indexOf("dataList") != -1)
            {
                isValidSaveField = false;
            }
        }

        if ($(this).attr("name") != "undefined" && isValidSaveField && typeof nosaveFlag == "undefined") {
            var relTblIndex = $(this).attr("relatedTblIndex");
    
            if ($(this).attr("data-mandatory") == "true") {
                optByPassValidate = false;
 
                if ($(this).attr("dataType") == "refid" && mode == "INS"){
                    optByPassValidate = true;
                }
                
                if ($(this).val() == "" && mode != "DEL" && !optByPassValidate) {
                    switch (popupType) {
                        case "remodal":
                            oPopUp.find("#remodal-confirm").removeAttr("disabled");
                            break;
                        case "subremodal":
                            oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                            break;
                        case "sub2remodal":
                            oPopUp.find("#sub2remodal-confirm").removeAttr("disabled");
                            break;
                        case "sub3remodal":
                            oPopUp.find("#sub3remodal-confirm").removeAttr("disabled");
                            break;
                    }
					
					if (firstErrorId == "") firstErrorId = $(this).attr("id");
					
					//$(this).addClass("error");

                    if ($(this).hasClass("popup-select-group")) {
                        $(this).next().addClass("error");
                    } else {
                        $(this).addClass("error");
                    }

                    //popup-select-group

                    //ErrorPopup($(this).attr("validation-string") + " field doesn't accepted without a value!", "", "");

                    /*
                    $.alert({
                        title: 'Message',
                        type: 'red',
                        content: $(this).attr("validation-string") + " field doesn't accepted without a value!",
                        buttons: {
                            confirm: {
                                text: 'Ok',
                                btnClass: 'btn-alert-confirm',
                                action: function () {
                                }
                            },
                        }
                    });
                    */

                    /*
                    if (typeof showCustomSaveEntryPopup !== 'undefined' && typeof showCustomSaveEntryPopup === 'function') {
                        showCustomSaveEntryPopup();
                    }
                    */

                    actionValidation = false;
                    //return false;
                }
            }

            if (firstErrorId == "") {
                if ($(this).attr("validate-minlength") != undefined && $(this).attr("validate-minlength") != "undefined") {
                    if (customErrorId == "") {
                        if (!isMinLength($(this).val(), $(this).attr("validate-minlength"))) {
                            $(this).addClass("error");
                            customErrorId = $(this).attr("id");
                            customErrorMessage = $(this).attr("validation-string") + " field invalid min length " + $(this).attr("validate-minlength") + "!"
                            actionValidation = false;
                        }
                    }
                }

                if ($(this).attr("validate-number") != undefined && $(this).attr("validate-number") != "undefined") {
                    if (customErrorId == "") {
                        if (!isNumber($(this).val())) {
                            $(this).addClass("error");
                            customErrorId = $(this).attr("id");
                            customErrorMessage = $(this).attr("validation-string") + " field invalid format number!"
                            actionValidation = false;
                        }
                    }
                }

                if ($(this).attr("validate-email") != undefined && $(this).attr("validate-email") != "undefined") {
                    if (customErrorId == "") {
                        if (!isEmail($(this).val())) {
                            $(this).addClass("error");
                            customErrorId = $(this).attr("id");
                            customErrorMessage = $(this).attr("validation-string") + " field invalid format email!"
                            actionValidation = false;
                        }
                    }
                }
            }

            if (typeof $(this).attr("dataKey") == "undefined") {
                dataKey = "0";
            } else {
                dataKey = $(this).attr("dataKey");
            }

            if (actionValidation) {
                if ($(this).attr("dataType") == "string") {
                    if (!isValidSpecialCharacter($(this).val())) {
                        $(this).addClass("error");
                        customErrorId = $(this).attr("id");
                        customErrorMessage = $(this).attr("validation-string") + " field contain not valid character (Ex : ' , \" , \\ , &)";
                        actionValidation = false;
                    }
                } else if ($(this).attr("dataType") == "path") {
					if (!isValidSpecialCharacterForPath($(this).val())) {
                        $(this).addClass("error");
                        customErrorId = $(this).attr("id");
                        customErrorMessage = $(this).attr("validation-string") + " field contain not valid character (Ex : ' , \" , &)";
                        actionValidation = false;
                    }
				}
            }

            if (typeof uppercaseFlag == "undefined") {
                if (actionValidation) {
                    dtAccess.addItem($(this).attr("name"), $(this).val(), $(this).attr("dataType"), dataKey, $(this).attr("data-flag"));
                }
            } else {
                if (actionValidation) {
                    dtAccess.addItem($(this).attr("name"), $(this).val().toUpperCase(), $(this).attr("dataType"), dataKey, $(this).attr("data-flag"));
                }
            }
        }
    });

    if (actionValidation) {
        sendPostPopUpForm(oPopUp, popupType, dtAccess.getJSONstring());
    } else {
        if (firstErrorId != "")
        {
            toastr.error("Field doesn't accepted without a value!", "Error");
            oPopUp.find("#" + firstErrorId).select();
            oPopUp.find("#" + firstErrorId).focus();
        }
        else 
        {
            if (customErrorId != "")
            {
                switch (popupType) {
                    case "remodal":
                        oPopUp.find("#remodal-confirm").removeAttr("disabled");
                        break;
                    case "subremodal":
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                        break;
                    case "sub2remodal":
                        oPopUp.find("#sub2remodal-confirm").removeAttr("disabled");
                        break;
                    case "sub3remodal":
                        oPopUp.find("#sub3remodal-confirm").removeAttr("disabled");
                        break;
                }

                toastr.error(customErrorMessage, "Error");
                oPopUp.find("#" + customErrorId).select();
                oPopUp.find("#" + customErrorId).focus();
            }
        }
    }

}

function checkuniquepopup(oPopUp, popupType, el) {
    var xhr;
    xhr && xhr.abort();

    if (oPopUp.find("input[name=MODIFY_STATUS]").val() == "INS") {
        var param1 = "0";
    } else {
        if (oPopUp.find("input[name=AUTONUMBER]").length > 0){
			var param1 = oPopUp.find("input[name=AUTONUMBER]").val();
		} else {
			var param1 = oPopUp.find("input[name=SYSTEM_ID]").val();
    	}
	}

    var param2 = $(el).val().trim();

    param1 = convertForGetRequest(param1);
    param2 = convertForGetRequest(param2);

    if (isCheckUniquePopup) return;
    if (param2 == "") return;
    xhr = $.ajax({
        method: "POST",
        url: 'unique' + $(el).attr("data-id") + '_' + param1 + '_' + param2,
        beforeSend: function () {
            //openMainLoading();
            isCheckUniquePopup = true;
            if (popupType == "remodal") {
                oPopUp.find("#remodal-confirm").prop("disabled", true);
            } else if (popupType == "subremodal") {
                oPopUp.find("#subremodal-confirm").prop("disabled", true);
            } else if (popupType == "sub2remodal") {
                oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
            } else if (popupType == "sub3remodal") {
                oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
            }
            /*
            oPopUp.find("." + $(el).attr("id")).removeClass("has-error");
            oPopUp.find("." + $(el).attr("id")).html('<div>validating .... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></div>');
            oPopUp.find("." + $(el).attr("id")).show();
            */
        },
        success: function (results) {
            //closeMainLoading();
            var nextElement = "";
            if (results != "") {
                results = results.replace(/(?:\r\n|\r|\n)/g, '');

                if (results == "0") {
                    oPopUp.find("." + $(el).attr("id")).html("");
                    oPopUp.find("#" + $(el).attr("id")).removeClass("error");
                    setTimeout(function () { oPopUp.find("." + $(el).attr("id")).hide(); }, 500);
                    if ($(el).attr("next-el") != null) {
                        nextElement = $(el).attr("next-el");
                    }
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "remodal-confirm") {
                            oPopUp.find("#remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "subremodal-confirm") {
                            oPopUp.find("#subremodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "sub2remodal-confirm") {
                            oPopUp.find("#sub2remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "sub3remodal-confirm") {
                            oPopUp.find("#sub3remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    }
                } else if (results == "2") {
                    oPopUp.find("." + $(el).attr("id")).addClass("has-error");
                    oPopUp.find("." + $(el).attr("id")).html("Wrong " + $(el).attr("validation-string") + " '" + $(el).val() + "' detected, please update your entry!");
                    oPopUp.find("." + $(el).attr("id")).show();
                    oPopUp.find("#" + $(el).attr("id")).val("");
                    oPopUp.find("#" + $(el).attr("id")).addClass("error");
                    oPopUp.find("#" + $(el).attr("id")).select();
                    oPopUp.find("#" + $(el).attr("id")).focus();
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").prop("disabled", true);
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
                    }
                } else {
                    oPopUp.find("." + $(el).attr("id")).addClass("has-error");
                    oPopUp.find("." + $(el).attr("id")).html("Duplicate " + $(el).attr("validation-string") + " '" + $(el).val() + "' detected, please update your entry!");
                    oPopUp.find("." + $(el).attr("id")).show();
                    oPopUp.find("#" + $(el).attr("id")).val("");
                    oPopUp.find("#" + $(el).attr("id")).addClass("error");
                    oPopUp.find("#" + $(el).attr("id")).select();
                    oPopUp.find("#" + $(el).attr("id")).focus();
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").prop("disabled", true);
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
                    }
                }
            }
            isCheckUniquePopup = false;
        },
        error: function () {
            //closeMainLoading();
            oPopUp.find("." + $(el).attr("id")).addClass("has-error");
            oPopUp.find("." + $(el).attr("id")).html("Error while validating '" + $(el).val() + "', please try again!");
            oPopUp.find("." + $(el).attr("id")).show();
            oPopUp.find("#" + $(el).attr("id")).val("");
            oPopUp.find("#" + $(el).attr("id")).addClass("error");
            oPopUp.find("#" + $(el).attr("id")).select();
            oPopUp.find("#" + $(el).attr("id")).focus();
            if (popupType == "remodal") {
                oPopUp.find("#remodal-confirm").prop("disabled", true);
            } else if (popupType == "subremodal") {
                oPopUp.find("#subremodal-confirm").prop("disabled", true);
            } else if (popupType == "sub2remodal") {
                oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
            } else if (popupType == "sub3remodal") {
                oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
            }
            isCheckUniquePopup = false;
        }
    })
}

function checkuniquepopup(oPopUp, popupType, el) {
    var xhr;
    xhr && xhr.abort();

    if (oPopUp.find("input[name=MODIFY_STATUS]").val() == "INS") {
        var param1 = "0";
    } else {
        if (oPopUp.find("input[name=AUTONUMBER]").length > 0){
			var param1 = oPopUp.find("input[name=AUTONUMBER]").val();
		} else {
			var param1 = oPopUp.find("input[name=SYSTEM_ID]").val();
    	}
	}

    var param2 = $(el).val().trim();

    param1 = convertForGetRequest(param1);
    param2 = convertForGetRequest(param2);

    if (isCheckUniquePopup) return;
    if (param2 == "") return;
    xhr = $.ajax({
        method: "POST",
        url: 'unique' + $(el).attr("data-id") + '_' + param1 + '_' + param2,
        beforeSend: function () {
            //openMainLoading();
            isCheckUniquePopup = true;
            if (popupType == "remodal") {
                oPopUp.find("#remodal-confirm").prop("disabled", true);
            } else if (popupType == "subremodal") {
                oPopUp.find("#subremodal-confirm").prop("disabled", true);
            } else if (popupType == "sub2remodal") {
                oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
            } else if (popupType == "sub3remodal") {
                oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
            }
            /*
            oPopUp.find("." + $(el).attr("id")).removeClass("has-error");
            oPopUp.find("." + $(el).attr("id")).html('<div>validating .... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></div>');
            oPopUp.find("." + $(el).attr("id")).show();
            */
        },
        success: function (results) {
            //closeMainLoading();
            var nextElement = "";
            if (results != "") {
                results = results.replace(/(?:\r\n|\r|\n)/g, '');

                if (results == "0") {
                    oPopUp.find("." + $(el).attr("id")).html("");
                    oPopUp.find("#" + $(el).attr("id")).removeClass("error");
                    setTimeout(function () { oPopUp.find("." + $(el).attr("id")).hide(); }, 500);
                    if ($(el).attr("next-el") != null) {
                        nextElement = $(el).attr("next-el");
                    }
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "remodal-confirm") {
                            oPopUp.find("#remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "subremodal-confirm") {
                            oPopUp.find("#subremodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "sub2remodal-confirm") {
                            oPopUp.find("#sub2remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "sub3remodal-confirm") {
                            oPopUp.find("#sub3remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    }
                } else if (results == "2") {
                    oPopUp.find("." + $(el).attr("id")).addClass("has-error");
                    oPopUp.find("." + $(el).attr("id")).html("Wrong " + $(el).attr("validation-string") + " '" + $(el).val() + "' detected, please update your entry!");
                    oPopUp.find("." + $(el).attr("id")).show();
                    oPopUp.find("#" + $(el).attr("id")).val("");
                    oPopUp.find("#" + $(el).attr("id")).addClass("error");
                    oPopUp.find("#" + $(el).attr("id")).select();
                    oPopUp.find("#" + $(el).attr("id")).focus();
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").prop("disabled", true);
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
                    }
                } else {
                    oPopUp.find("." + $(el).attr("id")).addClass("has-error");
                    oPopUp.find("." + $(el).attr("id")).html("Duplicate " + $(el).attr("validation-string") + " '" + $(el).val() + "' detected, please update your entry!");
                    oPopUp.find("." + $(el).attr("id")).show();
                    oPopUp.find("#" + $(el).attr("id")).val("");
                    oPopUp.find("#" + $(el).attr("id")).addClass("error");
                    oPopUp.find("#" + $(el).attr("id")).select();
                    oPopUp.find("#" + $(el).attr("id")).focus();
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").prop("disabled", true);
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
                    }
                }
            }
            isCheckUniquePopup = false;
        },
        error: function () {
            //closeMainLoading();
            oPopUp.find("." + $(el).attr("id")).addClass("has-error");
            oPopUp.find("." + $(el).attr("id")).html("Error while validating '" + $(el).val() + "', please try again!");
            oPopUp.find("." + $(el).attr("id")).show();
            oPopUp.find("#" + $(el).attr("id")).val("");
            oPopUp.find("#" + $(el).attr("id")).addClass("error");
            oPopUp.find("#" + $(el).attr("id")).select();
            oPopUp.find("#" + $(el).attr("id")).focus();
            if (popupType == "remodal") {
                oPopUp.find("#remodal-confirm").prop("disabled", true);
            } else if (popupType == "subremodal") {
                oPopUp.find("#subremodal-confirm").prop("disabled", true);
            } else if (popupType == "sub2remodal") {
                oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
            } else if (popupType == "sub3remodal") {
                oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
            }
            isCheckUniquePopup = false;
        }
    })
}


function checkuniquepopupwithparam(oPopUp, popupType, el) {
    var xhr;
    xhr && xhr.abort();

    console.log("checkuniquepopupwithparam");

    if (oPopUp.find("input[name=MODIFY_STATUS]").val() == "INS") {
        var param1 = "0";
    } else {
        if (oPopUp.find("input[name=AUTONUMBER]").length > 0) {
            var param1 = oPopUp.find("input[name=AUTONUMBER]").val();
        } else {
            var param1 = oPopUp.find("input[name=SYSTEM_ID]").val();
        }
    }

    var param2 = $(el).val().trim();

    param1 = convertForGetRequest(param1);
    param2 = convertForGetRequest(param2);

    if (isCheckUniquePopup) return;
    if (param2 == "") return;
    xhr = $.ajax({
        method: "POST",
        url: 'unique' + $(el).attr("data-id"),
        data: "param1=" + param1 + "&param2=" + param2,
        beforeSend: function () {
            //openMainLoading();
            isCheckUniquePopup = true;
            if (popupType == "remodal") {
                oPopUp.find("#remodal-confirm").prop("disabled", true);
            } else if (popupType == "subremodal") {
                oPopUp.find("#subremodal-confirm").prop("disabled", true);
            } else if (popupType == "sub2remodal") {
                oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
            } else if (popupType == "sub3remodal") {
                oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
            }
            /*
            oPopUp.find("." + $(el).attr("id")).removeClass("has-error");
            oPopUp.find("." + $(el).attr("id")).html('<div>validating .... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></div>');
            oPopUp.find("." + $(el).attr("id")).show();
            */
        },
        success: function (results) {
            //closeMainLoading();
            var nextElement = "";
            if (results != "") {
                results = results.replace(/(?:\r\n|\r|\n)/g, '');

                if (results == "0") {
                    oPopUp.find("." + $(el).attr("id")).html("");
                    oPopUp.find("#" + $(el).attr("id")).removeClass("error");
                    setTimeout(function () { oPopUp.find("." + $(el).attr("id")).hide(); }, 500);
                    if ($(el).attr("next-el") != null) {
                        nextElement = $(el).attr("next-el");
                    }
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "remodal-confirm") {
                            oPopUp.find("#remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "subremodal-confirm") {
                            oPopUp.find("#subremodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "sub2remodal-confirm") {
                            oPopUp.find("#sub2remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").removeAttr("disabled");
                        if (nextElement == "" || nextElement == "sub3remodal-confirm") {
                            oPopUp.find("#sub3remodal-confirm").focus();
                        } else {
                            oPopUp.find("#" + nextElement).focus();
                        }
                    }
                } else if (results == "2") {
                    oPopUp.find("." + $(el).attr("id")).addClass("has-error");
                    oPopUp.find("." + $(el).attr("id")).html("Wrong " + $(el).attr("validation-string") + " '" + $(el).val() + "' detected, please update your entry!");
                    oPopUp.find("." + $(el).attr("id")).show();
                    oPopUp.find("#" + $(el).attr("id")).val("");
                    oPopUp.find("#" + $(el).attr("id")).addClass("error");
                    oPopUp.find("#" + $(el).attr("id")).select();
                    oPopUp.find("#" + $(el).attr("id")).focus();
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").prop("disabled", true);
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
                    }
                } else {
                    oPopUp.find("." + $(el).attr("id")).addClass("has-error");
                    oPopUp.find("." + $(el).attr("id")).html("Duplicate " + $(el).attr("validation-string") + " '" + $(el).val() + "' detected, please update your entry!");
                    oPopUp.find("." + $(el).attr("id")).show();
                    oPopUp.find("#" + $(el).attr("id")).val("");
                    oPopUp.find("#" + $(el).attr("id")).addClass("error");
                    oPopUp.find("#" + $(el).attr("id")).select();
                    oPopUp.find("#" + $(el).attr("id")).focus();
                    if (popupType == "remodal") {
                        oPopUp.find("#remodal-confirm").prop("disabled", true);
                    } else if (popupType == "subremodal") {
                        oPopUp.find("#subremodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub2remodal") {
                        oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
                    } else if (popupType == "sub3remodal") {
                        oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
                    }
                }
            }
            isCheckUniquePopup = false;
        },
        error: function () {
            //closeMainLoading();
            oPopUp.find("." + $(el).attr("id")).addClass("has-error");
            oPopUp.find("." + $(el).attr("id")).html("Error while validating '" + $(el).val() + "', please try again!");
            oPopUp.find("." + $(el).attr("id")).show();
            oPopUp.find("#" + $(el).attr("id")).val("");
            oPopUp.find("#" + $(el).attr("id")).addClass("error");
            oPopUp.find("#" + $(el).attr("id")).select();
            oPopUp.find("#" + $(el).attr("id")).focus();
            if (popupType == "remodal") {
                oPopUp.find("#remodal-confirm").prop("disabled", true);
            } else if (popupType == "subremodal") {
                oPopUp.find("#subremodal-confirm").prop("disabled", true);
            } else if (popupType == "sub2remodal") {
                oPopUp.find("#sub2remodal-confirm").prop("disabled", true);
            } else if (popupType == "sub3remodal") {
                oPopUp.find("#sub3remodal-confirm").prop("disabled", true);
            }
            isCheckUniquePopup = false;
        }
    })
}