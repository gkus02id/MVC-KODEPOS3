
function openMainLoading() {
    $("#core_sys_loader").removeClass("hide-layout");
}

function closeMainLoading() {
    $("#core_sys_loader").addClass("hide-layout");
}

function removejscssfile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement)
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

function removeJsSource(fileName) {
    var jsSource = ["function-ms-05.js", "function-ms-06.js"];
    
    for (a = 0; a < jsSource.length; a++) {
        if (fileName != jsSource[a]) removejscssfile(jsSource[a],"js");
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function isNumber(value) {
    /*
    isNumberFlag = false;

    if (value != "")
    {
        if ($.isNumeric(value)) isNumberFlag = true;
    }

    return isNumberFlag;
    */

    var numberRegex = /^[+-]?\d+(\.\d+)?([eE][+-]?\d+)?$/;
    
    if(numberRegex.test(value)) {
        return true;
    } else {
        return false;
    }
}

function isMinLength(value, lenValidate)
{
    strValue = "";
    isValidLength = false;
    if (value != "")
    {
        strValue = value;
        strValue = strValue.replace(/ +?/g, '');
        if (strValue.length >= lenValidate) isValidLength = true;
    }
    return isValidLength;
}

function coreCustomLoadRecord(urlCustomRecord) {
    if (typeof customProcessLoadRecord !== 'undefined' && typeof customProcessLoadRecord === 'function') {
        customProcessLoadRecord(urlCustomRecord);
    } else {
        
    }
}

function isValidSpecialCharacter(value) {
    isValid = true;

    if (value != "") {
        if (value.indexOf("\"") != -1 || value.indexOf("\\") != -1 || value.indexOf("'") != -1 || value.indexOf("&") != -1) {
            isValid = false;
        }
    }

    return isValid;
}

function isValidSpecialCharacterForPath(value) {
    isValid = true;

    if (value != "") {
        if (value.indexOf("\"") != -1 || value.indexOf("'") != -1 || value.indexOf("&") != -1) {
            isValid = false;
        }
    }

    return isValid;
}

function coreLoadRecord(urlRecord) {

	if (typeof customLoadRecord !== 'undefined' && typeof customLoadRecord === 'function') {
        customLoadRecord(urlRecord);
    } else {
		var xhr;
        xhr && xhr.abort();
        xhr = $.ajax({
            method: "POST",
            url: urlRecord,
            beforeSend: function () {
                            openMainLoading();
            },
            success: function (results, textStatus, xhr) {
                            closeMainLoading(); 
                            if (results != "") {
                                var dataJson = JSON.parse(results);
                                if (dataJson) {
                                    if (dataJson["mode"] != "LOCK") {
                                        $('#mainForm').attr("mode", dataJson["mode"]);
                                        if ($("input[name=MODIFY_STATUS]").length > 0) {
                                            $("input[name=MODIFY_STATUS]").val(dataJson["mode"]);
                                        }
                                        var mainTable = dataJson["dt_objectTable"];
                                        if (mainTable) {
                                            var fieldCols = mainTable[0]["dt_fieldsCollection"];
                                            for (var i = 0; i < fieldCols.length; i++) {
                                                $(":input[name='" + fieldCols[i]["fieldName"] + "']").val(fieldCols[i]["fieldValue"]);
                                                //$('input[name="' + fieldCols[i]["fieldName"] + '"]').val(fieldCols[i]["fieldValue"]);
                                            }
                                        }

                                        if (typeof showCustomLoadRecord !== 'undefined' && typeof showCustomLoadRecord === 'function') {
                                            showCustomLoadRecord();
                                        }

                                        //tambahan set value type select selectize

                                        //var mainSelTable = dataJson["dt_objectSelectize"];
                                        //if (mainSelTable) {
                                        //    var fieldSel = mainSelTable[0]["dt_selectize"];
                                        //    for (var i = 0; i < fieldSel.length; i++) {
                                        //        setValueSelectize(fieldSel[i]["fieldName"], fieldSel[i]["fieldValue"]);
                                        //    }
                                        //}

                                        //tambahan show save button for update

                                        if (typeof showCustomButton !== 'undefined' && typeof showCustomButton === "function") {
                                            showCustomButton();
                                        }
                                    } else {
                                        warningCoreDeleteRecord(dataJson["locked_by"], dataJson["locked_date"]);
                                    }
                                }
                            } else {
                            }
            },
            error: function () {
                            closeMainLoading();
            }
        });
    }   
}

function coreResetForm() {
    //if (oFormField != null) {
        var oFormFieldArray = oFormField.split(",");
        for (var ia = 0; ia < oFormFieldArray.length; ia++) {
            if (oFormFieldArray[ia] != "") {
                $(':input[name="' + oFormFieldArray[ia] + '"]').val("");
            }
        }
        $('#mainForm').attr("mode", "INS");
    //}
    return true;
}

function coreLoadListRecord(tid) {
    var xhr;
    xhr && xhr.abort();

    xhr = $.ajax({
        method: "POST",
        url: "read" + tid,
        beforeSend: function () {
                        openMainLoading();
        },
        success: function (results) {
                        closeMainLoading();
                        if (results != "") {
                            var oJson = JSON.parse(results);
                            var oDataTables = oJson.jsonobject;
                            var strTable = "";
                            var nFieldsRow = 0;

                            if ($.fn.DataTable.isDataTable('#dataList')) {
                                $('#dataList').DataTable().destroy();
                            }

                            for (i = 0; i < oDataTables.length; i++) {
                                nFieldsRow = Object.keys(oDataTables[i]).length;
                                strTable += "<tr>";
                                strModifyRecord = "";

                                var keysByIndex = Object.keys(oDataTables[i]);
                                for (var z = 0; z < keysByIndex.length; z++) {

                                    if (keysByIndex[z] == "edit_url") {
                                        strTable += "<td class=\"DTCOL_ACTION\"><a href=\"#\" onclick=\"event.preventDefault();coreLoadRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>";
                                        strModifyRecord = "edit_url";
                                    } else if (keysByIndex[z] == "delete_url") {
                                        if (strModifyRecord == "") {
                                            strTable += "<td>";
                                        } else {
                                            strTable += "&nbsp;|&nbsp;";
                                        }
                                        strTable += "<a href=\"#\" onclick=\"event.preventDefault();coreDeleteRecord('" + oDataTables[i][keysByIndex[z]] + "','" + tid + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>";
                                        strModifyRecord = "delete_url";
                                    } else if (keysByIndex[z] == "custom_url") {
                                        if (strModifyRecord == "") {
                                            strTable += "<td>";
                                        } else {
                                            strTable += "&nbsp;|&nbsp;";
                                        }
                                        strTable += "<a href=\"#\" onclick=\"event.preventDefault();coreCustomLoadRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-eye\"></i>&nbsp;View</a></td>";
                                        strModifyRecord = "custom_url";
                                    } else {
                                        if (strModifyRecord == "edit_url") {
                                            strTable += "</td>";
                                            strModifyRecord = "";
                                        }
                                        coreTdClassName = keysByIndex[z];
                                        coreTdClassName = coreTdClassName.replace(/ /g, "_");
                                        strTable += "<td class=\"DTCOL_" + coreTdClassName + "\">" + deFilterJSon(oDataTables[i][keysByIndex[z]]) + "</td>";
                                    }
                                }
                                strTable += "</tr>";
                            }

                            $('#dataList tbody').empty();

                            $("#dataList tbody").html(strTable);

                            var listDataTable = $('#dataList').DataTable({ ordering: false, responsive: true, stateSave: true });
                        }

                        if (typeof customLoadListRecord !== 'undefined' && typeof customLoadListRecord === 'function') {
                            customLoadListRecord();
                        }
        },
        error: function () {
                        closeMainLoading();
        }
    });
}

function deFilterJSon(str){
    strValue = "";	
	if (str != undefined) strValue = str.replace(/~/g, "\"");
	return strValue;
}

function convertForGetRequest(str) {
	strValue = "";	
	if (str != undefined) strValue = str.replace(/\//g, '`');
	return strValue;
}

function coreFilterData(strFieldValue) {
    strValue = "";
    if (strFieldValue != undefined && strFieldValue != "undefined") {
        strValue = strFieldValue;
        strValue = strFieldValue.replace(/'/gi, "");
        strValue = strValue.replace(/"/gi, "");
        strValue = strValue.replace(/%20/i, "");
        strValue = strValue.replace(/__/i, "");
        strValue = strValue.replace(/&/gi, "");
        strValue = strValue.replace(/\\/gi, "");
    }
    return strValue;
}

function coreFilterDataPath(strFieldValue) {
    strValue = "";
    if (strFieldValue != undefined && strFieldValue != "undefined") {
        strValue = strFieldValue;
        strValue = strFieldValue.replace(/'/gi, "");
        strValue = strValue.replace(/"/gi, "");
        strValue = strValue.replace(/%20/i, "");
        strValue = strValue.replace(/__/i, "");
        strValue = strValue.replace(/&/gi, "");
    }
    return strValue;
}

function coreSaveEntry(formId, tableName, autoNumFormat) {
    var mode = $('#' + formId).attr("mode");
    var firstErrorId = "";
    var customErrorId = "";
    var customErrorMessage = "";
	
    if (onValidationProcess) return false;

    var dtAccess = new dataAccess();
    var actionValidation = true;
    var dataKey = "0";
    var upperCase = true;
    var optByPassValidate = false;
    dtAccess.initialize(tableName, autoNumFormat, mode);

    $("#" + formId).removeClass("error");

    $("#" + formId).find(":input").each(function () {
        var nosaveFlag = $(this).attr("nosave");
        var uppercaseFlag = $(this).attr("uppercase");

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
                    if (typeof showCustomSaveEntry !== 'undefined' && typeof showCustomSaveEntry === 'function') {
                        showCustomSaveEntry();
                    }
					*/

                    if (firstErrorId == "") firstErrorId = $(this).attr("id");

                    $(this).addClass("error");

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

            if (typeof $(this).attr("dataKey") == "undefined") {
                dataKey = "0";
            } else {
                dataKey = $(this).attr("dataKey");
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
        sendPostForm(dtAccess.getJSONstring());
    } else {
        if (firstErrorId != "") {
            onValidationProcess = false;
            toastr.error("Field doesn't accepted without a value!", "Error");
            oPopUp.find("#" + firstErrorId).select();
            oPopUp.find("#" + firstErrorId).focus();
        }
        else {
            onValidationProcess = false;
            toastr.error(customErrorMessage, "Error");
            oPopUp.find("#" + customErrorId).select();
            oPopUp.find("#" + customErrorId).focus();
        }
    }

}
