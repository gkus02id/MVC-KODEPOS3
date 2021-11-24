var oSubRemodalPopUp;

if (initCorePopup()) {
    function customLoadRecord(urlRecord) {
        var oAutoNumber = "";
        var oModifyStatus = "";

        if (urlRecord != "") {
			if (urlRecord.indexOf("edit0001_") != -1){
				openPopupForm('0001', 'remodalform', 'remodal', urlRecord.replace("edit0001_", ""));
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
                                        MessagePopup("Data saved successfully");
                                        doProcessPreClosePopUp(oPopUp, popupType, "0001");
                                    } else {
                                        oPopUp.find(".validation-result").removeClass("has-error");
                                        oPopUp.find(".validation-result").show();
                                        oPopUp.find(".validation-result").html(oJSonResult.message);
                                    }
                                }
                                oPopUp.find(".validation-result").hide();
                            },
                        error: function () {
                                closeMainLoading();
                                oPopUp.find(".validation-result").html("Please try again!");
                                oPopUp.find(".validation-result").show();
                                oPopUp.find("#group_name").val("");
                            }
                      });
    }

    function customLoadListRecord() {
        instPopup.close();
    }

    function doResetStatusRecord(id) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "reset0001",
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
            url: "read0001",
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
                                strTable += "<td class=\"DTCOL_ACTION\"><a href=\"#\" onclick=\"event.preventDefault();coreLoadRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-edit\"></i>&nbsp;edit</a>";
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
								coreTdClassName = keysByIndex[z];
								coreTdClassName = coreTdClassName.replace(/ /g, "_");
                                strTable += "<td class=\"DTCOL_" + coreTdClassName + "\">" + deFilterJSon(oDataTables[i][keysByIndex[z]]) + "</td>";
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
        if (oRemodalPopUp.find("input[name='USERID']").val() == "") oRemodalPopUp.find("input[name='USERID']").val(oRemodalPopUp.find("input[name='NIK']").val());
        saveEntryPopup(oRemodalPopUp, 'remodal', 'masterPopupForm', 'AF0001', '');    
    });

    $(document).on('cancellation', '.remodal', function () {
        var $this = $(this);

        if ($this.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            if ($this.find("input[name='MODIFY_STATUS']").val() == "UPD") {
                doResetStatusRecord($this.find("input[name='AUTONUMBER']").val());
            }
        }
    });

    $(document).on('opened', '.remodal', function () {
        oRemodalPopUp = $(this);
        
        oRemodalPopUp.find("input[name='USERID']").blur(function () {
            checkuniquepopup(oRemodalPopUp, 'remodal', this);
        });

        oRemodalPopUp.find("select[name='GROUP_ROLE']").change(function () {
            var groupRole = $(this).val();
            var groupRoleName = oRemodalPopUp.find("select[name='GROUP_ROLE']").find("option[value='" + groupRole + "']").text();
            oRemodalPopUp.find("input[name='USER_RIGHT']").val(groupRoleName.toLowerCase());
        });

        oRemodalPopUp.find("input[name='PASSWORD']").blur(function () {
            if (oRemodalPopUp.find("#masterPopupForm").attr("mode") == "UPD"){
                if ($(this).val() != ""){
                    $(this).attr("data-mandatory","true");
                    $(this).removeAttr("nosave");
                } else {
                    $(this).removeAttr("data-mandatory");
                    $(this).attr("nosave");
                }
            } 
        });

        /*
        if (oRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            oRemodalPopUp.find('#gender').selectize();
            oRemodalPopUp.find('#group_id').selectize();
            oRemodalPopUp.find('#parent_id').selectize();
        }
        */
    });

    $(document).on('subopened', '.subremodal', function () {
        oSubRemodalPopUp = $(this);
    });

    $(document).on('delconfirmation', '.delremodal', function () {
        var $this = $(this);
        var vUrlDelete = $this.find("input[name='POPUP_URL_ACTION']").val();
        vUrlDelete = vUrlDelete.replace("delete_", "deleteuser_")
        doCoreDeleteRecord(vUrlDelete, $this.find("input[name='POPUP_OBJECT_ID']").val());
    });

    $(document).on('delcancellation', '.delremodal', function () {
    });
    
}
