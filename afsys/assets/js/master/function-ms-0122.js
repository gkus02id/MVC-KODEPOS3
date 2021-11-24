var oSubRemodalPopUp;

if (initCorePopup()) {
    function customLoadRecord(urlRecord) {
        var oAutoNumber = "";
        var oModifyStatus = "";

        if (urlRecord != "") {
            if (urlRecord.indexOf("edit0122_") != -1) {
                openPopupForm('0122', 'remodalform', 'remodal', urlRecord.replace("edit0122_", ""));
            }
        }
    }

    function sendPostPopUpForm(oPopUp, popupType, jsonobject) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "save-data",
            headers: { "x-sysuid": vsysuid },
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
                openMainLoading();
                oPopUp.find(".validation-result").hide();
            },
            success: function (results) {
                closeMainLoading();
                if (results != "") {
                    var oJSonResult = JSON.parse(results);
                    if (oJSonResult.code == "1") {
                        //doProcessPreClosePopUp(oPopUp, popupType, "0122");
                        customLoadListRecord();
                    } else {
                        ErrorPopup(oJSonResult.message, "", "");
                    }
                }
                oPopUp.find(".validation-result").hide();
            },
            error: function () {
                closeMainLoading();
            }
        })
    }

    function customLoadListRecord() {
        instPopup.close();
    }

    function customDoProcessPreClosePopUp(oPopUp, popupType, tid) {
        var oTableId = oPopUp.find("input[name='POPUP_OBJECT_ID']").val();
        var topTableId = oPopUp.find("input[name='POPUP_TOP_OBJECT_ID']").val();
        var topFieldName = oPopUp.find("input[name='POPUP_TOP_FIELD_NAME']").val();
        var oAutoNumber = oPopUp.find("input[name='AUTONUMBER']").val();
        var oModifyStatus = oPopUp.find("input[name='MODIFY_STATUS']").val();

        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: 'list' + oTableId,
            headers: { "x-sysuid": vsysuid },
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

    function resetCombo(comboId) {
        oRemodalPopUp.find("select[name='" + comboId + "']").find('option').remove().end().append("<option value=''></option>");
        if (oRemodalPopUp.find("select[name='" + comboId + "']").hasClass("selectized")) {
            var $select = oRemodalPopUp.find("select[name='" + comboId + "']").selectize();
            var selectize = $select[0].selectize;
            selectize.clearOptions();
        }
    }

    function doResetStatusRecord(id) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "reset0122",
            headers: { "x-sysuid": vsysuid },
            data: "AUTONUMBER=" + id,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                closeMainLoading();
            },
            error: function () {
                closeMainLoading();
            }
        });
    }

    function customCloseReModalPopup() {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "read0122",
            headers: { "x-sysuid": vsysuid },
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
                                strTable += "<td><a href=\"#\" onclick=\"coreLoadRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>";
                                strModifyRecord = "edit_url";
                            } else if (keysByIndex[z] == "delete_url") {
                                if (strModifyRecord == "") {
                                    strTable += "<td>";
                                } else {
                                    strTable += "&nbsp;|&nbsp;";
                                }
                                strTable += "<a href=\"#\" onclick=\"coreDeleteRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>";
                                strModifyRecord = "delete_url";
                            } else {
                                if (strModifyRecord == "edit_url") {
                                    strTable += "</td>";
                                    strModifyRecord = "";
                                }
                                strTable += "<td>" + deFilterJSon(oDataTables[i][keysByIndex[z]]) + "</td>";
                            }
                        }
                        strTable += "</tr>";
                    }

                    $('#dataList tbody').empty();

                    $("#dataList tbody").html(strTable);

                    var listDataTable = $('#dataList').DataTable({ ordering: false, responsive: true, stateSave: true });
                }
            },
            error: function () {
                closeMainLoading();
            }
        });
    }

    $(document).on('confirmation', '.remodal', function () {
        saveEntryPopup(oRemodalPopUp, 'remodal', 'masterPopupForm', 'AF0122', 'AF/MS-CS');
    });

    $(document).on('cancellation', '.remodal', function () {
        
    });

    $(document).on('closing', '.remodal', function (e) {
        var $this = $(this);

        if ($this.find("input[name='MODIFY_STATUS']").val() == "UPD") {
            doResetStatusRecord($this.find("input[name='AUTONUMBER']").val());
        }
        doReloadFormCoreNavigation("/customer", "");
    });

    $(document).on('opened', '.remodal', function () {
        oRemodalPopUp = $(this);

        if (oRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            oRemodalPopUp.find("input[name='CUSTOMER_CODE']").focus();
            oRemodalPopUp.find("input[name='CUSTOMER_CODE']").select();
            oRemodalPopUp.find("input[name='CUSTOMER_CODE']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
            oRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
            oRemodalPopUp.find("#remodal-end").on('keyup', function (e) {
                if (e.which == 9) {
                    oRemodalPopUp.find("input[name='CUSTOMER_CODE']").focus();
                    oRemodalPopUp.find("input[name='CUSTOMER_CODE']").select();
                }
            });

            if (oRemodalPopUp.find("input[name='MODIFY_STATUS']").val() == "INS") {
                $("#listDataTable .input-sm").val("");
            }

            oRemodalPopUp.find("input[name='image_tmp']").change(function () {
                if (oRemodalPopUp.find("input[name='image_tmp']").val() != ""){
                    var jForm = new FormData();
                    
                    jForm.append('file', $('#image_tmp')[0].files[0]);

                    var xhr;
                    xhr && xhr.abort();

                    xhr = $.ajax({
                        method: "POST",
                        url: "/upcustimage_" + $("input[name='AUTONUMBER']").val(),
                        processData: false,
                        contentType: false,
                        data: jForm, 
                        beforeSend: function () {
                        },
                        success: function (results) {
                            if (results != "") {
                                var oJSonResult = JSON.parse(results);
                                if (oJSonResult.code == "1") {
                                    oRemodalPopUp.find("#preview-image").html("");
                                    if (oJSonResult.filename != "") {
                                        oRemodalPopUp.find("input[name='IMAGE']").val(oJSonResult.filename);
                                        contentImage = "<img src='" + jsBaseUrl + "assets/customer/" + oJSonResult.filename + "' width=125 border=0 />";
                                        oRemodalPopUp.find("#preview-image").html(contentImage);
                                    }
                                } else {
                                    ErrorPopup(oJSonResult.message, "", "");
                                }
                            }
                            //oPopUp.find(".validation-result").hide();
                        },
                        error: function () {
                            //closeMainLoading();
                        }
                    })

                    /*
                                    document.getElementById("new_image").value = "";

                                    contentImage = "<img src='"+jsBaseUrl+"assets/images/fundamental/"+oJson.name+"' width=100 border=0 />"
                                                   + "<div style=\"display:inline-table;margin-left:10px;vertical-align:bottom;\">"
                                                   + "	<a href=\"javascript:delImage('"+oJson.id+"')\"><i class=\"fa fa-trash-o\" aria-hidden=\"true\"></i></a>"
                                                   + "</div>";

                                    $("#image_file").html(contentImage);
                                    $("#row_history_image").removeClass("hide");
                                }
                            }, 
                            error: function (xhr, ajaxOptions, thrownError) {
                                console.log("error");
                            }
                    });
                    */
                }
            });
        }
    });
    
}