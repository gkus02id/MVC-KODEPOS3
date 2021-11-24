
function dtValidateRecord(oPopupDataTable, formId) {
    var mode = oPopupDataTable.find('#' + formId).attr("mode");
    var firstErrorId = "";
    var customErrorId = "";
    var customErrorMessage = "";
    var actionValidation = true;
    var dataKey = "0";
    var upperCase = true;
    var optByPassValidate = false;
    var isValidProcess = false;

    oPopupDataTable.find(".form-control").removeClass("error");

    oPopupDataTable.find("#" + formId).find(":input").each(function () {
        var nosaveFlag = $(this).attr("nosave");
        var isValidSaveField = true;
        var fieldName = $(this).attr("name");

        if (fieldName != undefined && fieldName != "undefined") {
            if (fieldName.indexOf("dataList") != -1) {
                isValidSaveField = false;
            }
        }

        if ($(this).attr("name") != "undefined" && isValidSaveField && typeof nosaveFlag == "undefined") {
            var relTblIndex = $(this).attr("relatedTblIndex");

            if ($(this).attr("data-mandatory") == "true") {
                optByPassValidate = false;

                if ($(this).attr("dataType") == "refid" && mode == "INS") {
                    optByPassValidate = true;
                }

                if ($(this).val() == "" && mode != "DEL" && !optByPassValidate) {
                    if (firstErrorId == "") firstErrorId = $(this).attr("id");

                    $(this).addClass("error");

                    actionValidation = false;
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
        }

        if (actionValidation) {
            if ($(this).attr("dataType") == "string") {
                if (!isValidSpecialCharacter($(this).val())) {
                    $(this).addClass("error");
                    customErrorId = $(this).attr("id");
                    customErrorMessage = $(this).attr("validation-string") + " field contain not valid character (Ex : ' , \" , \\ , &)";
                    actionValidation = false;
                }
            }
        }
    });

    if (actionValidation) {
        isValidProcess = true;
    } else {
        if (firstErrorId != "") {
            toastr.error("Field doesn't accepted without a value!", "Error");
            oPopUp.find("#" + firstErrorId).select();
            oPopUp.find("#" + firstErrorId).focus();
        }
        else {
            if (customErrorId != "") {
                toastr.error(customErrorMessage, "Error");
                oPopUp.find("#" + customErrorId).select();
                oPopUp.find("#" + customErrorId).focus();
            }
        }
    }

    return isValidProcess;
}

function dtSaveRecord(oDataTable, oRecord, oPopUp, formId) {
    if (dtValidateRecord(oPopUp, formId)) {
        oDataTable.rows.push(oRecord);
        return true;
    }
    else {
        return false;
    }
}

function dtEditRecord1Form(oDataTable, oPosRecord) {
    if (oDataTable.rows.length > 0) {
        if (oDataTable.rows.length >= oPosRecord) {
            oDataTable.rows.splice(oPosRecord, 1);
        }
    }
    return true;
}

function dtEditRecord(oDataTable, oPosRecord) {
    vRecord = "";

    if (oDataTable.rows.length > 0) {
        if (oDataTable.rows.length >= oPosRecord) {
            vRecord = JSON.stringify(oDataTable.rows[oPosRecord]);
            oDataTable.rows.splice(oPosRecord, 1);
        }
    }
    return vRecord;
}

function dtDelRecord(oDataTable, oPosRecord) {
    if (oDataTable.rows.length > 0) {
        if (oDataTable.rows.length >= oPosRecord) {
            oDataTable.rows[oPosRecord].MODIFY_STATUS = "DEL";
        }
    }
    return true;
}

function dbResetRecord() {
    return JSON.parse("{\"rows\":[]}");
}

function dtExecute(tableName, oDataTable, autoNumFormat, urlDelete) {
    if (oDataTable.rows.length > 0) {
        for (var pRow = 0; pRow < oDataTable.rows.length; pRow++) {
            if (oDataTable.rows[pRow].MODIFY_STATUS != "") {
                if (oDataTable.rows[pRow].MODIFY_STATUS == "INS" || oDataTable.rows[pRow].MODIFY_STATUS == "UPD") {
                    saveEntryDataTablePopup(tableName, oDataTable.rows[pRow], autoNumFormat, oDataTable.rows[pRow].MODIFY_STATUS)
                } else if (oDataTable.rows[pRow].MODIFY_STATUS == "DEL") {
                    if (oDataTable.rows[pRow].AUTONUMBER != "0") {
                        doCoreDeleteRecord(urlDelete, oDataTable.rows[pRow].AUTONUMBER);
                    }
                }
            }
        }
    }
    return true;
}

function dtLoadData(oPopUpContent, urlLoadData, gridId, mode) {
    var xhr;
    xhr && xhr.abort();
    xhr = $.ajax({
        method: "POST",
        url: urlLoadData,
        beforeSend: function () {
            openMainLoading();
        },
        success: function (results) {
            closeMainLoading();
            if (results != "") {
                coreLoadListDataTableRecord(oPopUpContent, JSON.parse(results), gridId, mode);
                setJsonExtendDataTable(results);
                
                if (typeof customExtenddtLoadRecord !== 'undefined' && typeof customExtenddtLoadRecord === 'function') {
                    customExtenddtLoadRecord(results);
                }
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            //instDelPopup.close();
            //if (xhr.status == 0) {
            //   ErrorPopup("Cannot connect to server. Please try re-sign.", "", "");
            //}
            closeMainLoading();
        }
    });
}

/*
function dtExecute(oPopUp, popupType, tableName, oDataTable, autoNumFormat, urlDelete) {
    if (oDataTable != null && oDataTable.rows.length > 0)
    {
        for(var pRow = 0; pRow < oDataTable.rows.length; pRow++)
        {
            if (oDataTable.rows[pRow].MODIFY_STATUS != "")
            {
                if (oDataTable.rows[pRow].MODIFY_STATUS == "INS" || oDataTable.rows[pRow].MODIFY_STATUS == "UPD")
                {
                    saveEntryDataTablePopup(oPopUp, popupType, tableName, oDataTable.rows[pRow], autoNumFormat, oDataTable.rows[pRow].MODIFY_STATUS)
                }
                else if (oDataTable.rows[pRow].MODIFY_STATUS == "DEL")  
                {
                    if (oDataTable.rows[pRow].AUTONUMBER != "0")
                    {
                        doCoreDeleteRecord(urlDelete, oDataTable.rows[pRow].AUTONUMBER);
                    }    
                }
            }
        }
    }
}
*/
/*
function saveEntryDataTablePopup(oPopUp, popupType, tableName, oRecord, autoNumFormat, mode) {
    
    var dtAccess = new dataAccess();
    var actionValidation = true;
    var dataKey = "0";
    var upperCase = true;
    var optByPassValidate = false;

    if (oRecord != null) {
        dtAccess.initialize(tableName, autoNumFormat, mode);

        Object.keys(oRecord).forEach(function (key) {
            
            if (key != "MODIFY_STATUS")
            {
                if (oRecord[key].NAME != "undefined" && oRecord[key].NOSAVE != "1") {
                    if (oRecord[key].DATA_MANDATORY == "true") {
                        optByPassValidate = false;
                    }

                    if (oRecord[key].DATATYPE == "refid" && mode == "INS") {
                        optByPassValidate = true;
                    }

                    if (oRecord[key].VALUE == "" && mode != "DEL" && !optByPassValidate) {
                        ErrorPopup(oRecord[key].VALIDATION_STRING + " field doesn't accepted without a value!", "", "");
                    }

                    if (typeof showCustomSaveEntryPopup !== 'undefined' && typeof showCustomSaveEntryPopup === 'function') {
                        showCustomSaveEntryPopup();
                    }
                    actionValidation = false;
                    return false;

                    if (typeof oRecord[key].DATAKEY == "undefined") {
                        dataKey = "0";
                    } else {
                        dataKey = oRecord[key].DATAKEY;
                    }                    
                }

                dtAccess.addItem(oRecord[key].NAME, oRecord[key].VALUE, oRecord[key].DATATYPE, dataKey, oRecord[key].DATAFLAG);
            }
        });
    }

    if (actionValidation) {
        sendPostPopUpForm(oPopUp, popupType, dtAccess.getJSONstring());
    }
}
*/

function saveEntryDataTablePopup(tableName, oRecord, autoNumFormat, mode) {

    var dtAccess = new dataAccess();
    var actionValidation = true;
    var dataKey = "0";
    var upperCase = true;
    var optByPassValidate = false;
    var customErrorMessage = "";

    dtAccess.initialize(tableName, autoNumFormat, mode);

    Object.keys(oRecord).forEach(function (key) {
        if (key == "AUTONUMBER") {
            if (oRecord.AUTONUMBER != "0" && oRecord.AUTONUMBER != "") {
                dtAccess.addItem("AUTONUMBER", oRecord.AUTONUMBER, "autonumber", "1", "");
            }
        }
        else if (key != "MODIFY_STATUS") {
            if (oRecord[key].NAME != "undefined" && oRecord[key].NAME != undefined && oRecord[key].NOSAVE != "1") {
                if (oRecord[key].DATA_MANDATORY == "undefined" || oRecord[key].DATA_MANDATORY == undefined || oRecord[key].DATA_MANDATORY == "false") {
                    optByPassValidate = true;
                } else {
                    if (oRecord[key].DATA_MANDATORY == "true") {
                        optByPassValidate = false;
                    }
                }

                if (oRecord[key].DATATYPE == "refid" && mode == "INS") {
                    optByPassValidate = true;
                }

                if (oRecord[key].VALUE == "" && mode != "DEL" && !optByPassValidate) {
                    ErrorPopup(oRecord[key].VALIDATION_STRING + " field doesn't accepted without a value!", "", "");

                    if (typeof showCustomSaveEntryPopup !== 'undefined' && typeof showCustomSaveEntryPopup === 'function') {
                        showCustomSaveEntryPopup();
                    }

                    actionValidation = false;
                    return false;
                }

                if (typeof oRecord[key].DATAKEY == "undefined") {
                    dataKey = "0";
                } else {
                    dataKey = oRecord[key].DATAKEY;
                }

                if (actionValidation) {
                    if (oRecord[key].DATATYPE == "string") {
                        if (!isValidSpecialCharacter(oRecord[key].VALUE)) {
                            customErrorMessage = oRecord[key].NAME + " field contain not valid character (Ex : ' , \" , \\ , &)";
                            actionValidation = false;
                        }
                    }
                }

                if (typeof oRecord[key].UPPERCASE == "undefined") {
                    if (actionValidation) {
                        dtAccess.addItem(oRecord[key].NAME, oRecord[key].VALUE, oRecord[key].DATATYPE, dataKey, oRecord[key].DATAFLAG);
                    }
                } else {
                    if (actionValidation) {
                        dtAccess.addItem(oRecord[key].NAME, oRecord[key].VALUE.toUpperCase(), oRecord[key].DATATYPE, dataKey, oRecord[key].DATAFLAG);
                    }
                }
            }

            //dtAccess.addItem(oRecord[key].NAME, oRecord[key].VALUE, oRecord[key].DATATYPE, dataKey, oRecord[key].DATAFLAG);
        }
    });

    if (actionValidation) {
        sendPostDataTable(dtAccess.getJSONstring());
    } else {
        toastr.error(customErrorMessage, "Error");
    }
}

function coreLoadListDataTableRecord(oPopUpContent, oDataTable, gridId, mode) {
    strTable = "";

    if (oDataTable != null) {
        if (oPopUpContent.find('#' + gridId).length > 0) oPopUpContent.find('#' + gridId).DataTable().destroy();

        //for (var pr = 0; pr < oDataTable.rows.length; pr++) {
        for (var pr = oDataTable.rows.length - 1; pr >= 0 ; pr--) {
            if (oDataTable.rows[pr].MODIFY_STATUS != "DEL") {
                strTable += "<tr>";
                objRecord = oDataTable.rows[pr];

                Object.keys(objRecord).forEach(function (key) {

                    if (key != "MODIFY_STATUS" && key != "AUTONUMBER") {

                        if (objRecord[key].SHOW_GRID == "1") {
							coreTdClassName = objRecord[key].NAME;
							coreTdClassName = coreTdClassName.replace(/ /g, "_");
							strTable += "<td class=\"DTCOL_" + coreTdClassName + "\">";
							if (objRecord[key].DATATYPE == "numeric"){
							    strTable += numeral(deFilterJSon(objRecord[key].VALUE)).format('0,0');
							} else if (objRecord[key].DATATYPE == "decimal") {
							    strTable += numeral(deFilterJSon(objRecord[key].VALUE)).format('0,0.00');
							} else {
							    strTable += deFilterJSon(objRecord[key].VALUE);
							}
							strTable += "</td>";
                        }
                    }

                });

                switch (mode)
                {
                    case "disabled":
                           strTable += "<td class=\"link_detail_datatable\"><i class=\"fa fa-edit\"></i>&nbsp;edit"
                                       + "&nbsp;|&nbsp;"
                                       + "<i class=\"fa fa-trash-o\"></i>&nbsp;delete</td>"
                                       + "</tr>";
                           break;
                    case "no_edit":
                            strTable += "<td class=\"link_detail_datatable\"><a href=\"#\" onclick=\"event.preventDefault();extendDeleteDataTableRecord('" + pr + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>"
                                        + "</tr>";
                            break;
                    case "no_delete":
                            strTable += "<td class=\"link_detail_datatable\"><a href=\"#\" onclick=\"event.preventDefault();extendLoadDataTableRecord('" + pr + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a></td>"
                                        + "</tr>";
                            break;
                    case "no_edit_no_delete":
                            break;
                    default:
                            strTable += "<td class=\"link_detail_datatable\"><a href=\"#\" onclick=\"event.preventDefault();extendLoadDataTableRecord('" + pr + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>"
                                        + "&nbsp;|&nbsp;"
                                        + "<a href=\"#\" onclick=\"event.preventDefault();extendDeleteDataTableRecord('" + pr + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>"
                                        + "</tr>";
                            break;
                }
            }
        }

        oPopUpContent.find('#' + gridId + ' tbody').empty();

        oPopUpContent.find('#' + gridId + ' tbody').html(strTable);

        oPopUpContent.find('#' + gridId).DataTable({ ordering: true, responsive: true, stateSave: true });
    }
	
	if (typeof customExtendCoreLoadListDataTableRecord !== 'undefined' && typeof customExtendCoreLoadListDataTableRecord === 'function') {
        customExtendCoreLoadListDataTableRecord(oPopUpContent, oDataTable, gridId, mode);
    }
}

function coreNormalLoadListDataTableRecord(oDataTable, gridId, mode) {
    strTable = "";

    if (oDataTable != null) {
        if ($('#' + gridId).length > 0) $('#' + gridId).DataTable().destroy();

        //for (var pr = 0; pr < oDataTable.rows.length; pr++) {
        for (var pr = oDataTable.rows.length - 1; pr >= 0 ; pr--) {
            if (oDataTable.rows[pr].MODIFY_STATUS != "DEL") {
                strTable += "<tr>";
                objRecord = oDataTable.rows[pr];

                Object.keys(objRecord).forEach(function (key) {

                    if (key != "MODIFY_STATUS" && key != "AUTONUMBER") {

                        if (objRecord[key].SHOW_GRID == "1") {
                            coreTdClassName = objRecord[key].NAME;
                            coreTdClassName = coreTdClassName.replace(/ /g, "_");
                            strTable += "<td class=\"DTCOL_" + coreTdClassName + "\">";
                            if (objRecord[key].DATATYPE == "numeric") {
                                strTable += numeral(deFilterJSon(objRecord[key].VALUE)).format('0,0');
                            } else if (objRecord[key].DATATYPE == "decimal") {
                                strTable += numeral(deFilterJSon(objRecord[key].VALUE)).format('0,0.00');
                            } else {
                                strTable += deFilterJSon(objRecord[key].VALUE);
                            }
                            strTable += "</td>";
                        }
                    }

                });

                switch (mode) {
                    case "disabled":
                        strTable += "<td class=\"link_detail_datatable\"><i class=\"fa fa-edit\"></i>&nbsp;edit"
                                    + "&nbsp;|&nbsp;"
                                    + "<i class=\"fa fa-trash-o\"></i>&nbsp;delete</td>"
                                    + "</tr>";
                        break;
                    case "no_edit":
                        strTable += "<td class=\"link_detail_datatable\"><a href=\"#\" onclick=\"event.preventDefault();extendDeleteDataTableRecord('" + pr + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>"
                                    + "</tr>";
                        break;
                    case "no_delete":
                        strTable += "<td class=\"link_detail_datatable\"><a href=\"#\" onclick=\"event.preventDefault();extendLoadDataTableRecord('" + pr + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a></td>"
                                    + "</tr>";
                        break;
                    case "no_edit_no_delete":
                        break;
                    default:
                        strTable += "<td class=\"link_detail_datatable\"><a href=\"#\" onclick=\"event.preventDefault();extendLoadDataTableRecord('" + pr + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>"
                                    + "&nbsp;|&nbsp;"
                                    + "<a href=\"#\" onclick=\"event.preventDefault();extendDeleteDataTableRecord('" + pr + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>"
                                    + "</tr>";
                        break;
                }
            }
        }

        $('#' + gridId + ' tbody').empty();

        $('#' + gridId + ' tbody').html(strTable);

        $('#' + gridId).DataTable({ ordering: true, responsive: true, stateSave: true });
    }
}