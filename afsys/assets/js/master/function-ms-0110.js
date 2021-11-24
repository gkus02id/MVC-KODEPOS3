var oSubRemodalPopUp;

if (initCorePopup()) {
    function customLoadRecord(urlRecord) {
        var oAutoNumber = "";
        var oModifyStatus = "";

        if (urlRecord != "") {
            if (urlRecord.indexOf("edit0110_") != -1) {
                openPopupForm('0110', 'remodalform', 'remodal', urlRecord.replace("edit0110_", ""));
            } else if (urlRecord.indexOf("edit0109_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0109", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "form0109-content");
            }
        }
    }

    function customLoadContentOnePopupForm(urlId, param, oPopUp, formId, popupType, results) {
        var isCustomLoad = false;

        if (results != "") {
            if (results.indexOf("code") != -1 && results.indexOf("locked_by") != -1 && results.indexOf("locked_date") != -1) {
                var oJson = JSON.parse(results);
                if (oJson.code == "0" && oJson.locked_by != "") {
                    if (urlId.indexOf("edit0109_") != -1) {
                        loadContentOnePopupForm("popup0109", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0109-content");
                    }
                }
            } else {
                if (param == "new_form=1") {
                    if (urlId.indexOf("popup0109") != -1) {
                        oPopUp.find("#mWarehousePopupForm").attr("mode", "INS");
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    }
                } else {
                    if (urlId.indexOf("edit0109_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("0109");
                    }

                    if (isCustomLoad) {
                        if (oPopUp.find("#AUTONUMBER_TMP").length > 0) oPopUp.find("#AUTONUMBER").val(oPopUp.find("#AUTONUMBER_TMP").val());
                        if (oPopUp.find("#SYSTEM_ID_TMP").length > 0) oPopUp.find("#SYSTEM_ID").val(oPopUp.find("#SYSTEM_ID_TMP").val());
                        if (urlId.indexOf("edit0109_") != -1) {
                            oPopUp.find("#mWarehousePopupForm").attr("mode", "UPD");
                        }
                        oPopUp.find("input[name='MODIFY_STATUS']").val("UPD");
                    }
                }
            }
        }
    }

    function loadDefaultPopUpForm(id) {
        var oAutoNumber = "";
        var oModifyStatus = "";

        switch (id) {
            case "0109":
                oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").focus();
                oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").select();
                oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0109", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                    loadContentOnePopupForm("popup0109", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0109-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").focus();
                        oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").select();
                    }
                });
                break;
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
                        //doProcessPreClosePopUp(oPopUp, popupType, "0110");
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
        
        switch (oTableId) {
            case "0109":
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0109", oPopUp, "execute", popupType, "AUTONUMBER=" + oAutoNumber, "");
                break;
        }

        if (oTableId == "0110") {
            closeMainLoading();
            instPopup.close();
        } else {
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
            url: "reset0110",
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
            url: "read0110",
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
        saveEntryPopup(oRemodalPopUp, 'remodal', 'masterPopupForm', 'AF0110', 'AF/MS-RC');
    });

    $(document).on('cancellation', '.remodal', function () {
        
    });

    $(document).on('closing', '.remodal', function (e) {
        var $this = $(this);

        if ($this.find("input[name='MODIFY_STATUS']").val() == "UPD") {
            doResetStatusRecord($this.find("input[name='AUTONUMBER']").val());
        }
        doReloadFormCoreNavigation("/rack", "");
    });

    $(document).on('subconfirmation', '.subremodal', function (e) {
        var $this = $(this);

        switch ($this.find("input[name='POPUP_OBJECT_ID']").val()) {
            case "0109":
                saveEntryPopup($this, 'subremodal', 'mWarehousePopupForm', 'AF0109', 'AF/MS-WH');
                break;
        }
    });

    $(document).on('subcancellation', '.subremodal', function () {
        var $this = $(this);
        var oAutoNumber = $this.find("input[name='AUTONUMBER']").val();
        var oModifyStatus = $this.find("input[name='MODIFY_STATUS']").val();

        switch ($this.find("input[name='POPUP_OBJECT_ID']").val()) {
            case "0109":
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0109", $this, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                break;
        }

        oRemodalPopUp.find("select[name='" + $this.find("input[name='POPUP_TOP_FIELD_NAME']").val() + "']").focus();
    });

    $(document).on('opened', '.remodal', function () {
        oRemodalPopUp = $(this);

        if (oRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            oRemodalPopUp.find("input[name='RACK_ID']").focus();
            oRemodalPopUp.find("input[name='RACK_ID']").select();
            oRemodalPopUp.find("input[name='RACK_ID']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
            oRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });

            oRemodalPopUp.find("#remodal-end").on('keyup', function (e) {
                if (e.which == 9) {
                    oRemodalPopUp.find("input[name='RACK_ID']").focus();
                    oRemodalPopUp.find("input[name='RACK_ID']").select();
                }
            });

            if (oRemodalPopUp.find("input[name='MODIFY_STATUS']").val() == "INS") {
                $("#listDataTable .input-sm").val("");
            }

            oRemodalPopUp.find('#warehouse').selectize();
            oRemodalPopUp.find('#visible').selectize();
            oRemodalPopUp.find('#active').selectize();
        }
    });

    $(document).on('subopened', '.subremodal', function () {
        oSubRemodalPopUp = $(this);

        switch (oSubRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val()) {
            case "0109":
                oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").focus();
                oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").select();
                oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").focus();
                        oSubRemodalPopUp.find("input[name='WAREHOUSE_ID']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListWarehouse").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListWarehouse_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListWarehouse_filter").parent().removeClass("col-sm-6");
                oSubRemodalPopUp.find("#dataListWarehouse_info").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListWarehouse_info").parent().removeClass("col-sm-5");
                break;
        }
    });

}