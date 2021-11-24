var oPopUpDataTable = null;
var strDatatableMachine = "{\"rows\":[]}";
var jSonDataTableMachine = JSON.parse(strDatatableMachine);
var saveNotDeleteRecordIM = 0;
var saveCurrentNotDeleteRecordIM = 0;
var deleteRecordIM = 0;
var deleteCurrentRecordIM = 0;

var isValidItemCode = false;

if (initCorePopup()) {

    function customDtSaveRecord(oDataTable, oRecord, oPopUp, formId) {
        oDataTable.rows.push(oRecord);
        return true;
    }

    function customLoadRecord(urlRecord) {
        openPopupForm('machine', 'remodalform', 'remodal', urlRecord.replace("editmachine_", ""));
    }

    function AddtoDetail(oDataTable, productCode) {
        /*
        var SystemId = "";
        
        for (var i = 0; i >= jSonDataTableMachine.rows.length; i++) {
            if (jSonDataTableMachine.rows[i].FIELD5["VALUE"] != "" && jSonDataTableMachine.rows[i].FIELD5["VALUE"] != "0") {
                SystemId = jSonDataTableMachine.rows[i].FIELD5["VALUE"];
            }  
        }
        */

        strRecord = "{\"AUTONUMBER\" : \"" + oPopUpDataTable.find("#autonumber_dtl").val() + "\","
                    + "\"MODIFY_STATUS\" : \"" + oPopUpDataTable.find("#modify_status_dtl").val() + "\","
                    + "\"FIELD1\" : {\"NAME\":\"NO\",\"VALUE\":\"\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                    + "\"FIELD2\" : {\"NAME\":\"PRODUCT_CODE\",\"VALUE\":\"" + productCode + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                    + "\"FIELD3\" : {\"NAME\":\"DESCRIPTION\",\"VALUE\":\"" + oPopUpDataTable.find("div.opt_product_list[productcode='" + productCode + "']").attr("description") + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                    + "\"FIELD4\" : {\"NAME\":\"MC_ID\",\"VALUE\":\"" + oPopUpDataTable.find("#autonumber").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                    + "\"FIELD5\" : {\"NAME\":\"SYSTEM_ID\",\"VALUE\":\"\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"true\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"}";

        /*
        if (SystemId == "") {
            strRecord += "\"FIELD5\" : {\"NAME\":\"SYSTEM_ID\",\"VALUE\":\"" + oPopUpDataTable.find("#system_id_dtl").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"true\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"}";
        } else {
            strRecord += "\"FIELD5\" : {\"NAME\":\"SYSTEM_ID\",\"VALUE\":\"" + SystemId + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"}";
        }
        */

        strRecord += "}";

        if (customDtSaveRecord(jSonDataTableMachine, JSON.parse(strRecord), oPopUpDataTable, "masterPopupForm")) {
            var nrecord = 0;
            for (var pr = jSonDataTableMachine.rows.length - 1; pr >= 0 ; pr--) {
                if (jSonDataTableMachine.rows[pr].MODIFY_STATUS != "DEL") {
                    objRecord = jSonDataTableMachine.rows[pr];
                    nrecord++;
                    Object.keys(objRecord).forEach(function (key) {
                        if (key == "FIELD1") {
                            objRecord[key].VALUE = nrecord.toString();
                        }
                    });
                }
            }

            coreLoadListDataTableRecord(oPopUpDataTable, jSonDataTableMachine, "dataListDtl", "no_edit");

            oPopUpDataTable.find("select[name='PRODUCT_CODE']").val("");
            oPopUpDataTable.find("#modify_status_dtl").val("INS");

            if (jSonDataTableMachine.rows.length > 0) {
            }
        }
    }

    function extendDeleteDataTableRecord(machines) {
        var autonumber = "0";
        var item_code = "";

        if (jSonDataTableMachine.rows.length > 0) {
            if (jSonDataTableMachine.rows.length >= machines) {
                coreDeleteRecord("delete_MachineDetail", machines);
            }
        }
    }

    function extendLoadDataTableRecord(machines) {
        var autoNumber = "";
        var product_code = "";
        var description = "";
        var system_id_dtl = "";

        if (jSonDataTableMachine.rows.length > 0) {
            autoNumber = jSonDataTableMachine.rows[machines].AUTONUMBER;
            product_code = jSonDataTableMachine.rows[machines].FIELD2.VALUE;
            system_id_dtl = jSonDataTableMachine.rows[machines].FIELD5.VALUE;
            
            oPopUpDataTable.find("#autonumber_dtl").val(autoNumber);
            oPopUpDataTable.find("#product_code").val(product_code);
            oPopUpDataTable.find("#modify_status_dtl").val("INS");
            
            if (autoNumber != "0") oPopUpDataTable.find("#modify_status_dtl").val("UPD");
            dtEditRecord1Form(jSonDataTableMachine, machines);

            coreLoadListDataTableRecord(oPopUpDataTable, jSonDataTableMachine, "dataListDtl", "disabled");
        }
    }

    function customDoDeleteRecord(urlRecord, tid) {
        
		if (urlRecord == "delete_MachineDetail") {
            if (dtDelRecord(jSonDataTableMachine, tid)) {
                coreLoadListDataTableRecord(oPopUpDataTable, jSonDataTableMachine, "dataListDtl", "no_edit");
            }
            instDelPopup.close();
        } else if (urlRecord == "deleteMachinedetail_") {
                var xhr;
                xhr && xhr.abort();
                xhr = $.ajax({
                    method: "POST",
                    url: "deleteMachinedetail_" + tid,
                    headers: { "x-sysuid": vsysuid },
                    beforeSend: function () {
                        openMainLoading();
                    },
                    success: function (results) {
                        closeMainLoading();
                        instDelPopup.close();
                        if (results != "") {
                            var dataJson = JSON.parse(results);
                            if (dataJson.code == "1") {
                                deleteCurrentRecordIM++;
                                if (saveNotDeleteRecordIM == saveCurrentNotDeleteRecordIM && deleteRecordIM == deleteCurrentRecordIM) {
                                    MessagePopup("Data Tersimpan");
                                    jSonDataTableMachine = dbResetRecord();
									jSonDataTableMachine = dtLoadData(oPopUpDataTable, "readmachinedetail_" + oPopUpDataTable.find("input[name='AUTONUMBER']").val(), "dataListDtl", "no_edit");
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

    $(document).on('delconfirmation', '.delremodal', function () {
        var $this = $(this);
        doCoreDeleteRecord($this.find("input[name='POPUP_URL_ACTION']").val(), $this.find("input[name='POPUP_OBJECT_ID']").val());
    });

    $(document).on('delcancellation', '.delremodal', function () {
    });

    function sendPostPopUpForm(oPopUp, machinepupType, jsonobject) {
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
                if (results != "") {
                    var oJSonResult = JSON.parse(results);
                    if (oJSonResult.code == "1") {
                        customLoadListRecord();
                        /*
                        if (oPopUp.find('#masterPopupForm').attr("mode") == "INS2PLUS_SYSTEM_ID") {
                            oPopUp.find("input[name='AUTONUMBER']").val(oJSonResult.message);
                            oPopUp.find("input[name='SYSTEM_ID']").val(oJSonResult.reference);
                            oPopUp.find('#masterPopupForm').attr("mode","UPD");
                        }
                        customCloseReModalPopup();
                        */
                    } else {
                        ErrorPopup(oJSonResult.message, "", "");
                    }
                }
                oPopUp.find(".validation-result").hide();
                //closeMainLoading();
            },
            error: function () {
                closeMainLoading();
                oPopUp.find(".validation-result").html("Please try again!");
                oPopUp.find(".validation-result").show();
            }
        });
    }

    function sendPostDataTable(jsonobject) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "save-data",
            headers: { "x-sysuid": vsysuid },
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
                //closeMainLoading();
               if (results != "") {
                    var oJSonResult = JSON.parse(results);
                    if (oJSonResult.code == "1") {
                        saveCurrentNotDeleteRecordIM++;
                        if (saveNotDeleteRecordIM == saveCurrentNotDeleteRecordIM && deleteRecordIM == deleteCurrentRecordIM) {
                            MessagePopup("Data Tersimpan");
                            instPopup.close();
                            //jSonDataTableMachine = dbResetRecord();
                            //jSonDataTableMachine = dtLoadData(oPopUpDataTable, "readmachinedetail_" + oPopUpDataTable.find("input[name='AUTONUMBER']").val(), "dataListDtl", "no_edit");
                        }
                    } else {
                        ErrorPopup(oJSonResult.message, "", "");
                    }
                }
            },
            error: function () {
                closeMainLoading();
            }
        })
    }

    function customLoadListRecord() {
        instPopup.close();
    }

    function setJsonExtendDataTable(jsonStr) {
        if (jsonStr != "") {
            jSonDataTableMachine = JSON.parse(jsonStr);
        }
    }

    function doResetStatusRecord(id) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "resetMachineHeader",
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

    function customCloseSettingReModalPopup() {
        MessagePopup("Data Tersimpan");
        closeMainLoading();
    }

    function customCloseReModalPopup() {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "readmachine",
            headers: { "x-sysuid": vsysuid },
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results) {
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
                            } else if (keysByIndex[z] == "addsetting_url") {
                                if (strModifyRecord == "") {
                                    strTable += "<td>";
                                } else {
                                    strTable += "&nbsp;|&nbsp;";
                                }
                                strTable += "<a href=\"#\" onclick=\"editSettingLoadRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-plus\"></i>&nbsp;add setting</a></td>";
                                strModifyRecord = "delete_url";
                            } else {
                                if (z == 0) {
                                    strTable += "<th scope=\"row\">" + deFilterJSon(oDataTables[i][keysByIndex[z]]) + "</th>";
                                }
                                else {
                                    strTable += "<td>" + deFilterJSon(oDataTables[i][keysByIndex[z]]) + "</td>";
                                }
                            }
                        }

                        if (strModifyRecord == "edit_url") {
                            strTable += "</td>";
                            strModifyRecord = "";
                        }
                        strTable += "</tr>";
                    }

                    $('#dataList tbody').empty();

                    $("#dataList tbody").html(strTable);

                    //var listDataTable = $('#dataList').DataTable({ ordering: true, "order": [[4, "asc"], [5, "asc"]], resmachinensive: true, stateSave: false });
                    var listDataTable = $('#dataList').DataTable({ ordering: true, "order": [[1, "asc"]], resmachinensive: true, stateSave: false });
                }
                MessagePopup("Data Tersimpan");
                closeMainLoading();
                instPopup.close();

                //instPopup.close();
            },
            error: function () {
                closeMainLoading();
            }
        });
    }

    function editSettingLoadRecord(urlSetting) {
        openCustomPopupFormWithParam(urlSetting, "remodalform", "remodal", "");
    }
    
    function saveDataTable(oPopUp, machinepupType, refAutoNumber, refDocumentNo) {
        saveNotDeleteRecordIM = 0;
        saveCurrentNotDeleteRecordIM = 0;
        deleteRecordIM = 0;
        deleteCurrentRecordIM = 0;

        if (jSonDataTableMachine.rows.length > 0) {
            for (var pRow = 0; pRow < jSonDataTableMachine.rows.length; pRow++) {
                jSonDataTableMachine.rows[pRow].FIELD4.VALUE = refAutoNumber;

                if (jSonDataTableMachine.rows[pRow].MODIFY_STATUS == "INS" || jSonDataTableMachine.rows[pRow].MODIFY_STATUS == "UPD") {
                    saveNotDeleteRecordIM++;
                }
                if (jSonDataTableMachine.rows[pRow].MODIFY_STATUS == "DEL") {
                    deleteRecordIM++;
                }
            }
        }

        if (jSonDataTableMachine.rows.length > 0) {
            for (var pRow = 0; pRow < jSonDataTableMachine.rows.length; pRow++) {
                if (jSonDataTableMachine.rows[pRow].MODIFY_STATUS != "") {
                    if (jSonDataTableMachine.rows[pRow].MODIFY_STATUS == "INS" || jSonDataTableMachine.rows[pRow].MODIFY_STATUS == "UPD") {
                        saveEntryDataTablePopup("AF0108", jSonDataTableMachine.rows[pRow], "AF/MS-MF", jSonDataTableMachine.rows[pRow].MODIFY_STATUS)
                    } else if (jSonDataTableMachine.rows[pRow].MODIFY_STATUS == "DEL") {
                        if (jSonDataTableMachine.rows[pRow].AUTONUMBER != "0") {
                            doCoreDeleteRecord("deleteMachinedetail_", jSonDataTableMachine.rows[pRow].AUTONUMBER);
                        }
                    }
                }
            }
        }
    }
    
    $(document).on('confirmation', '.remodal', function () {
        //toastr.error("Finish Good Detail Machine Can Not Empty!", "Error");
        //if (jSonDataTableMachine.rows.length > 0) {
            if (oPopUpDataTable.find("input[name='popup_type']").val() == "machine") {
                saveEntryPopup(oPopUpDataTable, 'remodal', 'masterPopupForm', 'AF0107', 'AF/MS-MM');
            } else {
                saveDataTable(oPopUpDataTable, "", oPopUpDataTable.find("input[name='AUTONUMBER']").val(), oPopUpDataTable.find("input[name='SYSTEM_ID']").val());
            }
        /*
        } else {
            toastr.error("Item Detail Machine Can Not Empty!", "Error");
        }
        */
        
    });
    
    $(document).on('cancellation', '.remodal', function () {
        
    });

    $(document).on('closing', '.remodal', function (e) {
        var $this = $(this);
        if ($this.find("input[name='MODIFY_STATUS']").val() == "UPD") {
            doResetStatusRecord($this.find("input[name='AUTONUMBER']").val());
        }
        doReloadFormCoreNavigation("/machine", "");
    });
  
    $(document).on('opened', '.remodal', function () {
        oPopUpDataTable = $(this);
        var optProductList = "";

        oPopUpDataTable.find("select[name='PRODUCT_CODE']").find("option").each(function () {
            optProductList += "<div productcode='" + $(this).val() + "' description='" + $(this).text() + "' class='opt_product_list'></div>";
        });

        oPopUpDataTable.find("#product_list").html(optProductList);

        if (jSonDataTableMachine.rows.length > 0) {
            strDatatableMachine = "{\"rows\":[]}";
            jSonDataTableMachine = JSON.parse(strDatatableMachine);
        }

        var machinetypeSelect0401 = oPopUpDataTable.find("select[name='MACHINE_TYPE']").selectize();
        var buffterSelect0401 = oPopUpDataTable.find("select[name='BUFFER']").selectize();
        var onprocessSelect0401 = oPopUpDataTable.find("select[name='ONPROCESS']").selectize();
        var outputSelect0401 = oPopUpDataTable.find("select[name='OUTPUT']").selectize();

        if (oPopUpDataTable.find("input[name='AUTONUMBER']").val() != "0" && oPopUpDataTable.find("input[name='AUTONUMBER']").val() != "") {
            jSonDataTableMachine = dtLoadData(oPopUpDataTable, "readmachinedetail_" + oPopUpDataTable.find("input[name='AUTONUMBER']").val(), "dataListDtl", "no_edit");
        }

        if (oPopUpDataTable.find("input[name='popup_type']").val() == "fg") {
            
            oPopUpDataTable.find("#add").click(function () {
                var validation = true;
                var prodSelect0107 = oPopUpDataTable.find("select[name='PRODUCT_CODE']").selectize();
                var prodSelectize0107 = prodSelect0107[0].selectize;
                var productCode = prodSelectize0107.getValue();

                if (productCode == "") {
                    toastr.error("Item Can Not Empty!", "Error");
                    validation = false;
                }

                if (validation) {
                    var isExistData = false;
                    if (jSonDataTableMachine.rows.length > 0) {
                        for (var pRow = 0; pRow < jSonDataTableMachine.rows.length; pRow++) {
                            var mod = jSonDataTableMachine.rows[pRow].MODIFY_STATUS;
                            if (jSonDataTableMachine.rows[pRow].FIELD2.VALUE == productCode && jSonDataTableMachine.rows[pRow].MODIFY_STATUS != 'DEL') {
                                isExistData = true;
                                break;
                            }
                        }
                    }

                    if (!isExistData) {
                        AddtoDetail(jSonDataTableMachine, productCode);
                    } else {
                        toastr.error('Finish Good Already Exist!');
                    }
                }
            });

            oPopUpDataTable.find("select[name='PRODUCT_CODE']").selectize();
        } else {
            oPopUpDataTable.find("input[name='MACHINE_ID']").blur(function () {
                checkuniquepopup(oPopUpDataTable, 'remodal', this);
            });
            oPopUpDataTable.find("input[name='DESCRIPTION']").blur(function () {
                checkuniquepopup(oPopUpDataTable, 'remodal', this);
            });

            oPopUpDataTable.find("select[name='BUFFER_RACK_ID']").selectize();
            oPopUpDataTable.find("select[name='RACK_ID']").selectize();
            oPopUpDataTable.find('#visible').selectize();
        }
    });
   
    function unlockRecordActiveDoc(autonumber) {
        var jsonobject = "{\"autonumber\" : \"" + autonumber + "\"}";

        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "unlockrecordmachine",
            headers: { "x-sysuid": vsysuid },
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
            },
            success: function (results) {
            },
            error: function () {
            }
        });
    }
}