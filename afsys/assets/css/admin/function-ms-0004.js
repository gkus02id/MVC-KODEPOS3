
if (initCorePopup()) {

    function customLoadRecord(urlRecord) {
        openPopupForm('0004', 'remodalform', 'remodal', urlRecord.replace("edit0004_", ""));
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
                if (popupType == "remodal") {
                    oPopUp.find("#remodal-confirm").prop("disabled", true);
                } else {
                    oPopUp.find("#subremodal-confirm").prop("disabled", true);
                }
                oPopUp.find(".validation-result").hide();
            },
            success: function (results) {
                closeMainLoading();
                if (results != "") {
                    var oJSonResult = JSON.parse(results);
                    if (oJSonResult.code == "1") {
                        doProcessPreClosePopUp(oPopUp, popupType, "0004");
                    } else {
                        oPopUp.find(".validation-result").removeClass("has-error");
                        oPopUp.find(".validation-result").show();
                        oPopUp.find(".validation-result").html(oJSonResult.message);
                        if (popupType == "remodal") {
                            oPopUp.find("#remodal-confirm").removeAttr("disabled");
                        } else {
                            oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                        }
                    }
                }
                oPopUp.find(".validation-result").hide();
            },
            error: function () {
                closeMainLoading();
                oPopUp.find(".validation-result").html("Error while validating '" + $("#groupname").val() + "', please try again!");
                oPopUp.find(".validation-result").show();
                oPopUp.find("#groupname").val("");
                if (popupType == "remodal") {
                    oPopUp.find("#remodal-confirm").removeAttr("disabled");
                } else {
                    oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                }
            }
        })
    }
    function customLoadListRecord() {
        instPopup.close();
        //instPopup.destroy();
    }

    function doResetStatusRecord(id) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "reset0004",
            headers: { "x-sysuid": vsysuid },
            data: "SYSTEM_ID=" + id,
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
            url: "read0004",
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
                                strTable += "<td><a href=\"#\" onclick=\"event.preventDefault();coreLoadRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>";
                                strModifyRecord = "edit_url";
                            } else if (keysByIndex[z] == "delete_url") {
                                if (strModifyRecord == "") {
                                    strTable += "<td>";
                                } else {
                                    strTable += "&nbsp;|&nbsp;";
                                }
                                strTable += "<a href=\"#\" onclick=\"event.preventDefault();coreDeleteRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>";
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

                    var listDataTable = $('#dataList').DataTable({ ordering: true, responsive: true, stateSave: true });
                }
            },
            error: function () {
                closeMainLoading();
            }
        });
    }

    $(document).on('confirmation', '.remodal', function () {
        saveEntryPopup(oRemodalPopUp, 'remodal', 'masterPopupForm', 'AF0004', 'AF/MS');
    });

    $(document).on('cancellation', '.remodal', function () {
        var $this = $(this);

        if ($this.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            if ($this.find("input[name='MODIFY_STATUS']").val() == "UPD") {
                doResetStatusRecord($this.find("input[name='SYSTEM_ID']").val());
            }
        }
    });

    $(document).on('opened', '.remodal', function () {
        oRemodalPopUp = $(this);

        if (oRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            oRemodalPopUp.find("input[name='GROUP_NAME']").focus();
            oRemodalPopUp.find("input[name='GROUP_NAME']").select();
            oRemodalPopUp.find("input[name='GROUP_NAME']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
            oRemodalPopUp.find("input[name='GROUP_NAME']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
        }
    });

    

}
