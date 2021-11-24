var oPopUpDataTable = null;
var strDatatablePO = "{\"rows\":[]}";
var jSonDataTablePO = JSON.parse(strDatatablePO);

var isValidItemCode = false;

if (initCorePopup()) {
    
    /*
    function PreviewDO(id) {
        $("#AutonumberPO").val(id);
        document.getElementById("previewDO").submit();
    }

    function DownloadDO(id) {
        $("#AutonumberPO").val(id);
        $("#format").val("xls");
        document.getElementById("previewDO").submit();
    }
    */

    function customLoadRecord(urlRecord) {
        openPopupForm('PO', 'remodalform', 'remodal', urlRecord.replace("editPO_", ""));
    }

    function AddtoDetail(oDataTable) {
        strRecord = "{\"AUTONUMBER\" : \"" + oPopUpDataTable.find("#autonumber_dtl").val() + "\","
                         + "\"MODIFY_STATUS\" : \"" + oPopUpDataTable.find("#modify_status_dtl").val() + "\","
                         + "\"FIELD1\" : {\"NAME\":\"DO_NO\",\"VALUE\":\"" + oPopUpDataTable.find("#do_no").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                         + "\"FIELD2\" : {\"NAME\":\"NO_SO\",\"VALUE\":\"" + oPopUpDataTable.find("#no_so").val().toUpperCase() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                         + "\"FIELD3\" : {\"NAME\":\"SIZE_NAME\",\"VALUE\":\"" + oPopUpDataTable.find("#size_description").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                         + "\"FIELD4\" : {\"NAME\":\"ITEM_CODE\",\"VALUE\":\"" + oPopUpDataTable.find("#item_code").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                         + "\"FIELD5\" : {\"NAME\":\"GRADE\",\"VALUE\":\"" + oPopUpDataTable.find("#grade").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                         + "\"FIELD6\" : {\"NAME\":\"QTY\",\"VALUE\":\"" + oPopUpDataTable.find("#qty").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                         + "\"FIELD7\" : {\"NAME\":\"DO_ID\",\"VALUE\":\"\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                         + "\"FIELD8\" : {\"NAME\":\"VERSION\",\"VALUE\":\"WEB\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                         + "\"FIELD9\" : {\"NAME\":\"BRAND\",\"VALUE\":\"" + oPopUpDataTable.find("#brand").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"}"
                         + "}";

        if (dtSaveRecord(jSonDataTablePO, JSON.parse(strRecord), oPopUpDataTable, "masterPopupForm")) {
            coreLoadListDataTableRecord(oPopUpDataTable, jSonDataTablePO, "dataListDtl", "");

            selectedSize = ""
            selected_size.setValue("");

            selected_brand.enable();
            selected_size.enable();

            oPopUpDataTable.find("#autonumber_dtl").val("0");
            oPopUpDataTable.find("#modify_status_dtl").val("INS");
            oPopUpDataTable.find("#qty").val("0");
            oPopUpDataTable.find("#qty_picking").val("0");

            oPopUpDataTable.find('#type').removeClass("error");
            oPopUpDataTable.find('#customer').removeClass("error");
            oPopUpDataTable.find('#no_so').removeClass("error");
            oPopUpDataTable.find('#brand').removeClass("error");
            oPopUpDataTable.find('#item_code').removeClass("error");
            oPopUpDataTable.find('#qty').removeClass("error");

            if (jSonDataTablePO.rows.length > 0) {
                $('#type')[0].selectize.disable();
                $('#customer')[0].selectize.disable();

                $(".remodal-close").prop("disabled", false);
                $(".remodal-confirm").prop("disabled", false);
                $(".remodal-cancel").prop("disabled", false);

            }
            document.getElementById("fileupload").style.display = '';
        }
    }

    function customDoDeleteRecord(urlRecord, tid) {
        if (urlRecord == "delete_0402_") {
            var xhr;
            xhr && xhr.abort();
            xhr = $.ajax({
                method: "POST",
                url: urlRecord + tid,
                headers: { "x-sysuid": vsysuid },
                beforeSend: function () {
                    openMainLoading();
                },
                success: function (results) {
                    closeMainLoading();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    closeMainLoading();
                }
            });
        }
        else if (urlRecord == "delete_SODetail") {
            if (dtDelRecord(jSonDataTablePO, tid)) {
                coreLoadListDataTableRecord(oPopUpDataTable, jSonDataTablePO, "dataListDtl", "");
            }
            instDelPopup.close();
        }
        else if (urlRecord == "deleteSOdetail_") {
            var xhr;
            xhr && xhr.abort();
            xhr = $.ajax({
                method: "POST",
                url: urlRecord + tid,
                headers: { "x-sysuid": vsysuid },
                beforeSend: function () {
                    openMainLoading();
                },
                success: function (results) {
                    closeMainLoading();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    closeMainLoading();
                }
            });
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
                if (popupType == "remodal") {
                    oPopUp.find("#remodal-confirm").prop("disabled", true);
                } else {
                    oPopUp.find("#subremodal-confirm").prop("disabled", true);
                }
                oPopUp.find(".validation-result").hide();
            },
            success: function (results) {
                if (results != "") {
                    var oJSonResult = JSON.parse(results);
                    if (oJSonResult.code == "1") {
                        if (popupType == "remodal") {
                            if (oPopUp.find("input[name='AUTONUMBER']").val() != "0" && oPopUp.find("input[name='AUTONUMBER']").val() != "") {
                                saveDataTable(oPopUp, popupType, oPopUp.find("input[name='AUTONUMBER']").val(), oPopUp.find("input[name='DO_NO']").val());
                            } else {
                                //oPopUp.find("input[name='DO_NO']").val(oJSonResult.option);
                                getDocumentNo(oPopUp, popupType, oJSonResult.message);
                                //saveDataTable(oPopUp, popupType, oJSonResult.message);
                            }
                        }
                        instPopup.close();
                    } else {
                        ErrorPopup(oJSonResult.message, "", "");
                        if (popupType == "remodal") {
                            oPopUp.find("#remodal-confirm").removeAttr("disabled");
                        } else {
                            oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                        }
                    }
                }
                oPopUp.find(".validation-result").hide();
                //closeMainLoading();
            },
            error: function () {
                closeMainLoading();
                oPopUp.find(".validation-result").html("Error while validating '" + $("#name").val() + "', please try again!");
                oPopUp.find(".validation-result").show();
                oPopUp.find("#name").val("");
                if (popupType == "remodal") {
                    oPopUp.find("#remodal-confirm").removeAttr("disabled");
                } else {
                    oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                }
            }
        })
    }

    function getDocumentNo(oPopUp, popupType, autonumberHeader) {
        var jsonobject = "{\"autonumberHeader\" : \"" + autonumberHeader + "\"}";

        var xhr;
        xhr && xhr.abort();
        xhr = $.ajax({
            method: "POST",
            url: "getDocumentNo",
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
            },
            success: function (results) {
                var results = results.replace(/(\r\n|\n|\r)/gm, "");
                if (results != "") {
                    saveDataTable(oPopUp, popupType, autonumberHeader, results);
                }
                else {

                }

            },
            error: function () {
            }
        })
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
            jSonDataTablePO = JSON.parse(jsonStr);
        }
    }

    function doResetStatusRecord(id) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "resetSOHeader",
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
            url: "readSOHeader",
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
                            } else if (keysByIndex[z] == "delete_url") {
                                if (strModifyRecord == "") {
                                    strTable += "<td>";
                                } else {
                                    strTable += "&nbsp;|&nbsp;";
                                }
                                strTable += "<a href=\"#\" onclick=\"coreDeleteRecord('" + oDataTables[i][keysByIndex[z]] + "')\"><i class=\"fa fa-trash-o\"></i>&nbsp;delete</a></td>";
                                strModifyRecord = "delete_url";
                            } else if (keysByIndex[z] == "preview_url") {
                                if (strModifyRecord == "") {
                                    strTable += "<td>";
                                } else {
                                    strTable += "&nbsp;&nbsp;";
                                }
                                strTable += "<a onclick=\"PreviewDO(" + oDataTables[i][keysByIndex[z]] + ")\" id=\"PreviewDO_" + oDataTables[i][keysByIndex[z]] + "\" class=\"preview-so-lnk\"><i class=\"fa fa-edit\"></i>&nbsp;Preview</a>";
                                strModifyRecord = "preview_url";
                            } else if (keysByIndex[z] == "outstanding_url") {
                                if (strModifyRecord == "") {
                                    strTable += "<td>";
                                } else {
                                    strTable += "&nbsp;&nbsp;";
                                }
                                strTable += "<a onclick=\"Outstanding(" + oDataTables[i][keysByIndex[z]] + ")\" id=\"Outstanding_" + oDataTables[i][keysByIndex[z]] + "\" class=\"preview-so-lnk\"><i class=\"fa fa-edit\"></i>&nbsp;Outstanding</a>";
                                strModifyRecord = "outstanding_url";
                            } else {
                                if (z == 0) {
                                    strTable += "<th scope=\"row\">" + deFilterJSon(oDataTables[i][keysByIndex[z]]) + "</th>";
                                }
                                else {
                                    strTable += "<td>" + deFilterJSon(oDataTables[i][keysByIndex[z]]) + "</td>";
                                }
                            }
                        }

                        if (strModifyRecord == "outstanding_url") {
                            strTable += "</td>";
                            strModifyRecord = "";
                        }
                        else if (strModifyRecord == "edit_url") {
                            strTable += "</td>";
                            strModifyRecord = "";
                        }
                        strTable += "</tr>";
                    }

                    $('#dataList tbody').empty();

                    $("#dataList tbody").html(strTable);

                    //var listDataTable = $('#dataList').DataTable({ ordering: true, "order": [[4, "asc"], [5, "asc"]], responsive: true, stateSave: false });
                    var listDataTable = $('#dataList').DataTable({ ordering: true, "order": [[5, "asc"], [6, "asc"]], responsive: true, stateSave: false });
                }
                MessagePopup("Save Successfully...");
                closeMainLoading();

                setTimeout(function () {
                    document.getElementById('frmrptso').submit();
                }, 5000)

                //instPopup.close();
            },
            error: function () {
                closeMainLoading();
            }
        });
    }

    function saveDataTable(oPopUp, popupType, refAutoNumber, refDocumentNo) {
        oPopUpDataTable.find("#pdescription").val(refDocumentNo);

        if (jSonDataTablePO.rows.length > 0) {
            for (var pRow = 0; pRow < jSonDataTablePO.rows.length; pRow++) {
                jSonDataTablePO.rows[pRow].FIELD1.VALUE = refDocumentNo;
                jSonDataTablePO.rows[pRow].FIELD7.VALUE = refAutoNumber;
            }
        }

        if (dtExecute("DO_LINES", jSonDataTablePO, "", "deleteSOdetail_")) {
            jSonDataTablePO = dbResetRecord();
            customCloseReModalPopup();
            //MessagePopup("Save Successfully...");
        }
    }

    $(document).on('confirmation', '.remodal', function () {
        if (jSonDataTablePO.rows.length > 0) {
            saveEntryPopup(oPopUpDataTable, 'remodal', 'masterPopupForm', 'DO_HEADER', oPopUpDataTable.find("input[name='LT_DTYPE']").val());
        }
        else {
            toastr.error("Item Detail SO Can Not Empty!", "Error");
        }
    });

    $(document).on('cancellation', '.remodal', function () {
        /*
        var $this = $(this);
        if($this.find("#modify_status").val() =="UPD")
        {
            var do_no = $this.find("#do_no").val();
            unlockRecordActiveDoc(do_no);
        }
        */
    });

    $(document).on('closing', '.remodal', function (e) {
        var $this = $(this);
        if ($this.find("#modify_status").val() == "UPD") {
            var do_no = $this.find("#do_no").val();
            unlockRecordActiveDoc(do_no);
        }
    });

    
    $(document).on('opened', '.remodal', function () {
        oPopUpDataTable = $(this);

        var labelpopup = document.getElementById('titlePopup').innerHTML;

        if (labelpopup == "Sales Order Entry Form") {
            
            document.getElementById("pnlnote").style.display = 'none';
            document.getElementById("fileupload").style.display = 'none';

            if (jSonDataTablePO.rows.length > 0) {
                strDatatablePO = "{\"rows\":[]}";
                jSonDataTablePO = JSON.parse(strDatatablePO);
            }

            if (oPopUpDataTable.find("input[name='AUTONUMBER']").val() != "0" && oPopUpDataTable.find("input[name='AUTONUMBER']").val() != "") {
                if (oPopUpDataTable.find("#status_transaction").val() == "POSTED") {
                    jSonDataTablePO = dtLoadData(oPopUpDataTable, "readSODetail_" + oPopUpDataTable.find("input[name='AUTONUMBER']").val(), "dataListDtl", "disabled");
                }
                else {
                    jSonDataTablePO = dtLoadData(oPopUpDataTable, "readSODetail_" + oPopUpDataTable.find("input[name='AUTONUMBER']").val(), "dataListDtl", "");
                }
            }

            oPopUpDataTable.find("input[name='NO_SO']").blur(function () {
                if (oPopUpDataTable.find("#no_so").val() != "") {

                    if (oPopUpDataTable.find("input[name='STATUS_TRANSACTION']").val() == 'POSTED') {
                        document.getElementById("fileupload").style.display = 'none';
                    }
                    else {
                        document.getElementById("fileupload").style.display = '';
                    }

                    if (oPopUpDataTable.find("#autonumber_dtl").val() == "0") {
                        selected_brand.enable();
                        selected_brand.focus();
                    }
                    else {
                        selected_brand.disable();
                    }

                }
            });

            oPopUpDataTable.find("#remodal-end").on('keyup', function (e) {
                if (e.which == 9) {
                    oPopUpDataTable.find("input[name='PRODUCT_CODE']").focus();
                    oPopUpDataTable.find("input[name='PRODUCT_CODE']").select();
                }
            });

            oPopUpDataTable.find("#addNote").click(function () {
                document.getElementById("pnlnote").style.display = '';
                oPopUpDataTable.find("#note").focus();
            });

            oPopUpDataTable.find("#PRINT").click(function () {
                oPopUpDataTable.find("#format").val("pdf");
                document.getElementById('frmrptso').submit();
            });

            oPopUpDataTable.find("#EXCEL").click(function () {
                document.getElementById('frmexportso').submit();
            });

            if (oPopUpDataTable.find("#note").val() != "") {
                document.getElementById("pnlnote").style.display = '';
            }

            oPopUpDataTable.find("#add").click(function () {
                var validation = true;

                oPopUpDataTable.find('#type').removeClass("error");
                oPopUpDataTable.find('#customer').removeClass("error");
                oPopUpDataTable.find('#no_so').removeClass("error");
                oPopUpDataTable.find('#brand').removeClass("error");
                oPopUpDataTable.find('#item_code').removeClass("error");
                oPopUpDataTable.find('#qty').removeClass("error");

                if (oPopUpDataTable.find('#type').val() == "") {
                    oPopUpDataTable.find('#type').addClass("error");
                    toastr.error("Location Loading Can Not Empty!", "Error");
                    oPopUpDataTable.find("#type").select();
                    oPopUpDataTable.find("#type").focus();
                    validation = false;
                }
                else if (oPopUpDataTable.find('#customer').val() == "") {
                    oPopUpDataTable.find('#customer').addClass("error");
                    toastr.error("Customer Can Not Empty!", "Error");
                    oPopUpDataTable.find("#customer").select();
                    oPopUpDataTable.find("#customer").focus();
                    validation = false;
                }
                else if (oPopUpDataTable.find('#no_so').val() == "") {
                    oPopUpDataTable.find('#no_so').addClass("error");
                    toastr.error("SO No Can Not Empty!", "Error");
                    oPopUpDataTable.find("#no_so").select();
                    oPopUpDataTable.find("#no_so").focus();

                    validation = false;
                }
                else if (oPopUpDataTable.find('#brand').val() == "") {
                    oPopUpDataTable.find('#brand').addClass("error");
                    toastr.error("Brand Can Not Empty!", "Error");
                    oPopUpDataTable.find("#brand").select();
                    oPopUpDataTable.find("#brand").focus();
                    validation = false;
                }
                else if (oPopUpDataTable.find('#item_code').val() == "") {
                    oPopUpDataTable.find('#item_code').addClass("error");
                    toastr.error("Size Name Can Not Empty!", "Error");
                    oPopUpDataTable.find("#item_code").select();
                    oPopUpDataTable.find("#item_code").focus();
                    validation = false;
                }
                else if (oPopUpDataTable.find('#qty').val() == "") {
                    oPopUpDataTable.find('#qty').addClass("error");
                    toastr.error("Qty Can Not Empty!", "Error");
                    oPopUpDataTable.find("#qty").select();
                    oPopUpDataTable.find("#qty").focus();
                    validation = false;
                }
                else if (parseInt(oPopUpDataTable.find('#qty').val()) < 1) {
                    oPopUpDataTable.find('#qty').addClass("error");
                    toastr.error("Qty Must More Than Zero!", "Error");
                    oPopUpDataTable.find("#qty").select();
                    oPopUpDataTable.find("#qty").focus();
                    validation = false;
                }

                else if (parseInt(oPopUpDataTable.find('#qty').val()) < parseInt(oPopUpDataTable.find('#qty_picking').val())) {
                    oPopUpDataTable.find('#qty').addClass("error");
                    toastr.error("Qty Can Not Less Than Qty Picking!", "Error");
                    oPopUpDataTable.find("#qty").select();
                    oPopUpDataTable.find("#qty").focus();
                    validation = false;
                }

                if (validation) {
                    var isExistData = false;
                    if (jSonDataTablePO.rows.length > 0) {
                        for (var pRow = 0; pRow < jSonDataTablePO.rows.length; pRow++) {
                            var mod = jSonDataTablePO.rows[pRow].MODIFY_STATUS;
                            if (jSonDataTablePO.rows[pRow].FIELD4.VALUE == oPopUpDataTable.find("#item_code").val() && jSonDataTablePO.rows[pRow].MODIFY_STATUS != 'DEL') {
                                isExistData = true;
                                break;
                            }
                        }
                    }

                    if (!isExistData) {
                        AddtoDetail(jSonDataTablePO);
                    }
                    else {
                        toastr.error('Size ' + $("#item_code option:selected").text() + ' Already Exist\nChange Qty Only!');
                    }
                }
            });

            oPopUpDataTable.find('#customer').selectize({
                onChange: function (value) {
                    getCustomerNameAndAdress();
                }
            });

            $selected_brand = $('#brand').selectize({
                selectOnTab: true,
                onChange: function (value) {
                    if (!value.length) {
                        selected_size.setValue("");
                        return;
                    }
                    selected_size.clearOptions();
                    selected_size.load(function (callback) {

                        var brandid = coreFilterData($("#brand").val());
                        var jsonobject = "{\"brandid\" : \"" + brandid + "\"}";

                        var xhr;

                        xhr && xhr.abort();
                        xhr = $.ajax({
                            method: "POST",
                            url: "getOptSize",
                            data: "jsonobject=" + jsonobject,
                            success: function (results) {
                                var results = results.replace(/(\r\n|\n|\r)/gm, "");
                                callback(JSON.parse(results));
                                selected_size.setValue(selectedSize);
                                if (oPopUpDataTable.find("#autonumber_dtl").val() == "0") {
                                    selected_size.enable();
                                    selected_size.focus();
                                }
                                else {
                                    selected_size.disable();
                                }
                            },
                            error: function () {
                                callback();
                            }
                        })
                    });
                }
            });
            selected_brand = $selected_brand[0].selectize;

            $selected_size = $('#item_code').selectize({
                valueField: 'id',
                labelField: 'name',
                searchField: ['name'],
                selectOnTab: true,
                onChange: function (value) {
                    if (!value.length) {
                        selected_size.setValue("");
                        return;
                    }

                    getSizeDescription(value);
                }
            });

            selected_size = $selected_size[0].selectize;

            selected_brand.disable();
            selected_size.disable();

            oPopUpDataTable.find('#type').selectize({
            });

            oPopUpDataTable.find('#no_so').attr("disabled", true);
            oPopUpDataTable.find('#qty').attr("disabled", true);
            oPopUpDataTable.find('#PRINT').attr("disabled", true);
            oPopUpDataTable.find('#EXCEL').attr("disabled", true);

            if (oPopUpDataTable.find("input[name='CUSTOMER_ID']").val() != "") {
                var $select = $('#customer').selectize();
                var control = $select[0].selectize;
                control.setValue(oPopUpDataTable.find("input[name='CUSTOMER_ID']").val());
                $('#customer')[0].selectize.disable();
            }

            if (oPopUpDataTable.find("input[name='LOCATION_LOADING']").val() != "") {
                var $selectlocationloading = $('#type').selectize();
                var controllocationloading = $selectlocationloading[0].selectize;
                controllocationloading.setValue(oPopUpDataTable.find("input[name='LOCATION_LOADING']").val());
            }

            if (oPopUpDataTable.find("input[name='STATUS_TRANSACTION']").val() == 'OPEN' || oPopUpDataTable.find("input[name='STATUS_TRANSACTION']").val() == 'BOOKING' || oPopUpDataTable.find("input[name='STATUS_TRANSACTION']").val() == 'LOADING') {
                if (oPopUpDataTable.find("#modify_status").val() == "UPD") {
                    oPopUpDataTable.find('#EXCEL').attr("disabled", false);
                }
                else {
                    oPopUpDataTable.find('#EXCEL').attr("disabled", true);
                }

                if (oPopUpDataTable.find("input[name='STATUS_TRANSACTION']").val() == 'OPEN') {
                    $('#type')[0].selectize.enable();
                    oPopUpDataTable.find('#PRINT').attr("disabled", false);
                }
                else {
                    oPopUpDataTable.find('#PRINT').attr("disabled", false);
                    $('#type')[0].selectize.disable();
                }
                //document.getElementById("fileupload").style.display = '';
                oPopUpDataTable.find('#no_so').attr("disabled", false);
            }
            else if (oPopUpDataTable.find("input[name='STATUS_TRANSACTION']").val() == 'POSTED') {
                oPopUpDataTable.find('#EXCEL').attr("disabled", false);
                oPopUpDataTable.find('#no_so').attr("disabled", true);
                oPopUpDataTable.find('#PRINT').attr("disabled", false);
                oPopUpDataTable.find('#remodal-confirm').attr("disabled", true);
                oPopUpDataTable.find('#add').attr("disabled", true);
                $('#type')[0].selectize.disable();
                document.getElementById("fileupload").style.display = 'none';
            }
            -
            oPopUpDataTable.find("#qty").blur(function () {
                oPopUpDataTable.find("#add").focus();
            });

            oPopUpDataTable.find("#fileuploader").change(function (e) {
                if (oPopUpDataTable.find('#type').val() == "") {
                    $("#fileuploader").val("");
                    toastr.error("Location Loading Can Not Empty!", "Error");
                    oPopUpDataTable.find("#type").select();
                    oPopUpDataTable.find("#type").focus();
                    return;
                }
                else if (oPopUpDataTable.find('#customer').val() == "") {
                    $("#fileuploader").val("");
                    toastr.error("Customer Can Not Empty!", "Error");
                    oPopUpDataTable.find("#customer").select();
                    oPopUpDataTable.find("#customer").focus();
                    return;
                }
                else if (oPopUpDataTable.find("#no_so").val() == "") {
                    $("#fileuploader").val("");
                    toastr.error("SO No Can Not Empty!", "Error");
                    oPopUpDataTable.find("#no_so").select();
                    oPopUpDataTable.find("#no_so").focus();
                    return;
                }

                var isValidData = true;
                var strRecord = ""
                var files = e.target.files;

                var data = new FormData();

                $.each(files, function (key, value) {
                    data.append('fileuploader', value);
                });

                //data.append('jsondatatableso', JSON.stringify(jSonDataTablePO));
                data.append('mode_hdr', oPopUpDataTable.find("#modify_status").val());
                data.append('do_no', oPopUpDataTable.find("#do_no").val());

                $.ajax({
                    url: '/uploadso',
                    type: 'POST',
                    data: data,
                    cache: false,
                    processData: false,
                    contentType: false,
                    beforeSend: function () {
                        openMainLoading();
                    },
                    success: function (data, textStatus, jqXHR) {
                        closeMainLoading();
                        var errorMessage = "";
                        $("#fileuploader").val("");
                        if (data != "") {
                            var jSonUpload = "";
                            try {
                                jSonUpload = JSON.parse(data);
                                if (jSonUpload.jsonobject.length > 0) {
                                    var ArrayItemCode = [];
                                    for (var pRow = 0; pRow < jSonUpload.jsonobject.length; pRow++) {
                                        if (jSonUpload.jsonobject[pRow].IsvalidTemplate == "0") {
                                            errorMessage = "Template Upload SO Tidak Sesuai dengan Format!" + "\n";
                                            isValidData = false;
                                            toastr.error(errorMessage);
                                            return;
                                        }
                                        else {
                                            if (jSonUpload.jsonobject[pRow].ISAVAILABLEDB == "1") {
                                                var duplicateitem = false;
                                                len = ArrayItemCode.length;
                                                if (len > 0) {
                                                    for (i = 0; i < len; i++) {
                                                        if (ArrayItemCode[i] == jSonUpload.jsonobject[pRow].ITEM_CODE) {
                                                            errorMessage = "Duplicate Size Code " + jSonUpload.jsonobject[pRow].ITEM_CODE + "!" + "\n";
                                                            isValidData = false;
                                                            toastr.error(errorMessage);
                                                            duplicateitem = true;
                                                            return;
                                                        }
                                                    }
                                                }

                                                if (duplicateitem == false) {
                                                    if (parseInt(jSonUpload.jsonobject[pRow].QTY_PICKING) > parseInt(jSonUpload.jsonobject[pRow].QTY)) {
                                                        errorMessage = "Size Code " + jSonUpload.jsonobject[pRow].ITEM_CODE + " Qty SO : " + parseInt(jSonUpload.jsonobject[pRow].QTY) + " tidak Boleh Kurang Dari Qty Picking : " + parseInt(jSonUpload.jsonobject[pRow].QTY_PICKING) + "!" + "\n";
                                                        isValidData = false;
                                                        toastr.error(errorMessage);
                                                        return;
                                                    }
                                                    else {
                                                        ArrayItemCode.push(jSonUpload.jsonobject[pRow].ITEM_CODE);
                                                        isValidData = true;
                                                    }
                                                }
                                            }
                                            else {
                                                errorMessage = jSonUpload.jsonobject[pRow].ITEM_CODE + " Tidak terdaftar!" + "\n";
                                                isValidData = false;
                                                toastr.error(errorMessage);
                                                return;
                                            }
                                        }
                                    }

                                    if (isValidData) {
                                        var NumberofjSonDataTablePO = jSonDataTablePO.rows.length;

                                        if (NumberofjSonDataTablePO == "0") {
                                            for (var NRow = 0; NRow < jSonUpload.jsonobject.length; NRow++) {
                                                strRecord = "{\"AUTONUMBER\" : \"" + oPopUpDataTable.find("#autonumber_dtl").val() + "\","
                                                    + "\"MODIFY_STATUS\" : \"" + oPopUpDataTable.find("#modify_status_dtl").val() + "\","
                                                    + "\"FIELD1\" : {\"NAME\":\"DO_NO\",\"VALUE\":\"" + oPopUpDataTable.find("#do_no").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                    + "\"FIELD2\" : {\"NAME\":\"NO_SO\",\"VALUE\":\"" + oPopUpDataTable.find("#no_so").val().toUpperCase() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                                                    + "\"FIELD3\" : {\"NAME\":\"SIZE_NAME\",\"VALUE\":\"" + jSonUpload.jsonobject[NRow].SIZE_NAME + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                                                    + "\"FIELD4\" : {\"NAME\":\"ITEM_CODE\",\"VALUE\":\"" + jSonUpload.jsonobject[NRow].ITEM_CODE + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                                                    + "\"FIELD5\" : {\"NAME\":\"GRADE\",\"VALUE\":\"" + oPopUpDataTable.find("#grade").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                    + "\"FIELD6\" : {\"NAME\":\"QTY\",\"VALUE\":\"" + jSonUpload.jsonobject[NRow].QTY + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                                                    + "\"FIELD7\" : {\"NAME\":\"DO_ID\",\"VALUE\":\"\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                    + "\"FIELD8\" : {\"NAME\":\"VERSION\",\"VALUE\":\"WEB\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                    + "\"FIELD9\" : {\"NAME\":\"BRAND\",\"VALUE\":\"" + jSonUpload.jsonobject[NRow].BRAND + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"}"
                                                    + "}";
                                                dtSaveRecord(jSonDataTablePO, JSON.parse(strRecord), oPopUpDataTable, "mainPopupFormDtl");
                                            }
                                        }
                                        else {
                                            for (var URow = 0; URow < jSonUpload.jsonobject.length; URow++) {
                                                var ExistInJsonSO = false;
                                                for (var ERow = 0; ERow < jSonDataTablePO.rows.length; ERow++) {
                                                    if (jSonDataTablePO.rows[ERow].FIELD4.VALUE == jSonUpload.jsonobject[URow].ITEM_CODE) {
                                                        if (jSonDataTablePO.rows[ERow].AUTONUMBER == "0") {
                                                            jSonDataTablePO.rows[ERow].MODIFY_STATUS = "INS";
                                                        }
                                                        else {
                                                            jSonDataTablePO.rows[ERow].MODIFY_STATUS = "UPD";
                                                        }
                                                        jSonDataTablePO.rows[ERow].FIELD6.VALUE = jSonUpload.jsonobject[URow].QTY;
                                                        ExistInJsonSO = true;
                                                        break;
                                                    }
                                                }

                                                if (ExistInJsonSO == false) {
                                                    strRecord = "{\"AUTONUMBER\" : \"" + oPopUpDataTable.find("#autonumber_dtl").val() + "\","
                                                            + "\"MODIFY_STATUS\" : \"" + oPopUpDataTable.find("#modify_status_dtl").val() + "\","
                                                            + "\"FIELD1\" : {\"NAME\":\"DO_NO\",\"VALUE\":\"" + oPopUpDataTable.find("#do_no").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                            + "\"FIELD2\" : {\"NAME\":\"NO_SO\",\"VALUE\":\"" + oPopUpDataTable.find("#no_so").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                            + "\"FIELD3\" : {\"NAME\":\"SIZE_NAME\",\"VALUE\":\"" + jSonUpload.jsonobject[URow].SIZE_NAME + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                                                            + "\"FIELD4\" : {\"NAME\":\"ITEM_CODE\",\"VALUE\":\"" + jSonUpload.jsonobject[URow].ITEM_CODE + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                                                            + "\"FIELD5\" : {\"NAME\":\"GRADE\",\"VALUE\":\"" + oPopUpDataTable.find("#grade").val() + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                            + "\"FIELD6\" : {\"NAME\":\"QTY\",\"VALUE\":\"" + jSonUpload.jsonobject[URow].QTY + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"1\"},"
                                                            + "\"FIELD7\" : {\"NAME\":\"DO_ID\",\"VALUE\":\"\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                            + "\"FIELD8\" : {\"NAME\":\"VERSION\",\"VALUE\":\"WEB\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"},"
                                                            + "\"FIELD9\" : {\"NAME\":\"BRAND\",\"VALUE\":\"" + jSonUpload.jsonobject[URow].BRAND + "\",\"DATAKEY\":\"0\",\"DATATYPE\":\"string\",\"DATAFLAG\":\"\",\"NOSAVE\":\"1\", \"VALIDATION_STRING\":\"\",\"SHOW_GRID\":\"0\"}"
                                                            + "}";
                                                    dtSaveRecord(jSonDataTablePO, JSON.parse(strRecord), oPopUpDataTable, "mainPopupFormDtl");
                                                }
                                            }
                                        }

                                        coreLoadListDataTableRecord(oPopUpDataTable, jSonDataTablePO, "dataListDtl", "");
                                        MessagePopup(jSonUpload.jsonobject.length + " data berhasil terupload");
                                    }
                                } else {
                                    ErrorPopup("Data gagal terupload atau Template Upload SO Tidak Sesuai dengan Format!", "", "");
                                }

                            }
                            catch (e) {
                                errorMessage = "Template Upload SO Tidak Sesuai dengan Format!" + "\n";
                                isValidData = false;
                                toastr.error(errorMessage);
                                return;
                            }
                        } else {
                            ErrorPopup("Data gagal terupload", "", "");
                        }


                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        ErrorPopup("Data gagal terupload", "", "");
                        closeMainLoading();
                    }
                });
            });
        }
        else if (labelpopup == "Outstanding Sales Order") {
            if (jSonDataTablePO.rows.length > 0) {
                strDatatablePO = "{\"rows\":[]}";
                jSonDataTablePO = JSON.parse(strDatatablePO);
            }

            if (oPopUpDataTable.find("input[name='AUTONUMBER']").val() != "0" && oPopUpDataTable.find("input[name='AUTONUMBER']").val() != "") {
                jSonDataTablePO = dtLoadData(oPopUpDataTable, "readOutstandingSO_" + oPopUpDataTable.find("input[name='AUTONUMBER']").val(), "dataListDtl", "no_edit_no_delete");
            }
        }
    });

    function extendLoadDataTableRecord(pos) {
        var autoNumber = "";
        var no_do = "";
        var no_so = "";
        var brand = "";
        var item_code = "";
        var qty = "";

        if (jSonDataTablePO.rows.length > 0) {
            autoNumber = jSonDataTablePO.rows[pos].AUTONUMBER;
            do_no = jSonDataTablePO.rows[pos].FIELD1.VALUE;
            no_so = jSonDataTablePO.rows[pos].FIELD2.VALUE;
            brand = jSonDataTablePO.rows[pos].FIELD9.VALUE;
            item_code = jSonDataTablePO.rows[pos].FIELD4.VALUE;
            qty = jSonDataTablePO.rows[pos].FIELD6.VALUE;

            oPopUpDataTable.find("#autonumber_dtl").val(autoNumber);
            oPopUpDataTable.find("#no_so").val(no_so);

            selected_brand.setValue(brand);
            selectedSize = item_code;

            oPopUpDataTable.find("#qty").val(qty);

            if (autoNumber != "0") oPopUpDataTable.find("#modify_status_dtl").val("UPD");
            dtEditRecord1Form(jSonDataTablePO, pos);

            if (autoNumber != "0") {
                getQtyPicking(do_no, item_code, "edit", "", "");
                selected_brand.disable();
                selected_size.disable();
            }
            else {
                selected_brand.enable();
                selected_size.enable();
            }

            document.getElementById("fileupload").style.display = 'none';

            $(".remodal-close").prop("disabled", true);
            $(".remodal-confirm").prop("disabled", true);
            $(".remodal-cancel").prop("disabled", true);
            $(".remodal-confirm").prop("disabled", true);

            coreLoadListDataTableRecord(oPopUpDataTable, jSonDataTablePO, "dataListDtl", "disabled");
        }
    }

    function getQtyPicking(do_no, item_code, mode, deletevalidation, rowindex) {
        var jsonobject = "{\"do_no\" : \"" + do_no + "\"";
        jsonobject += ", \"item_code\" : \"" + item_code + "\"";
        jsonobject += ", \"mode\" : \"" + mode + "\"}";

        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "getQtyPickingSO",
            headers: { "x-sysuid": vsysuid },
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
            },
            success: function (results) {
                var qty = results.replace(/(\r\n|\n|\r)/gm, "");

                if (deletevalidation == "") {
                    if (qty != "0") {
                        oPopUpDataTable.find("#qty_picking").val(qty);
                        //selected_brand.disable();
                        //selected_size.disable();
                    }
                    else {
                        oPopUpDataTable.find("#qty_picking").val("0");
                        //selected_brand.enable();
                        //selected_size.enable();
                    }

                    selected_brand.disable();
                    selected_size.disable();
                }
                else {
                    if (parseInt(qty) > 0) {
                        toastr.error("Qty " + item_code + " Already Picked");
                        selected_brand.enable();
                        selected_size.disable();
                    }
                    else {
                        coreDeleteRecord("delete_SODetail", rowindex);
                    }
                }
            },
            error: function () {
            }
        });
    }

    function getSizeDescription(item_code) {
        var jsonobject = "{\"item_code\" : \"" + item_code + "\"}";

        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "getSizeDescription",
            headers: { "x-sysuid": vsysuid },
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
            },
            success: function (results) {
                var size_desc = results.replace(/(\r\n|\n|\r)/gm, "");
                oPopUpDataTable.find("#size_description").val(size_desc);
                oPopUpDataTable.find('#qty').attr("disabled", false);
                oPopUpDataTable.find("#qty").select();
                oPopUpDataTable.find("#qty").focus();
            },
            error: function () {
            }
        });
    }

    function CekIsValidItemCodeFromUpload(item_code) {

        //toastr.error("Tidak Terdaftar!");
        var jsonobject = "{\"item_code\" : \"" + item_code + "\"}";

        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "CekIsValidItemCodeFromUpload",
            headers: { "x-sysuid": vsysuid },
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
            },
            success: function (results) {
                var results = results.replace(/(\r\n|\n|\r)/gm, "");
                if (results == "1") {
                    return true;
                }
                else {
                    return false;
                }
            },
            error: function () {
                return false;
            }
        });
    }

    function unlockRecordActiveDoc(do_no) {
        var jsonobject = "{\"do_no\" : \"" + do_no + "\"}";

        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "UnlockRecordSO",
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

    function extendDeleteDataTableRecord(pos) {
        var autonumber = "0";
        var do_no = "";
        var no_so = "";
        if (jSonDataTablePO.rows.length > 0) {
            if (jSonDataTablePO.rows.length >= pos) {
                autonumber = jSonDataTablePO.rows[pos].AUTONUMBER;
                if (autonumber != "0") {
                    do_no = jSonDataTablePO.rows[pos].FIELD1.VALUE;
                    item_code = jSonDataTablePO.rows[pos].FIELD4.VALUE;
                    getQtyPicking(do_no, item_code, "delete", "deletevalidation", pos);
                }
                else {
                    coreDeleteRecord("delete_SODetail", pos);
                }
            }
        }
    }
}
