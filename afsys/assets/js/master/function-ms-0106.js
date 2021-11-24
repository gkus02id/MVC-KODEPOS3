var oSubRemodalPopUp;

if (initCorePopup()) {
    function customLoadRecord(urlRecord) {
        var oAutoNumber = "";
        var oModifyStatus = "";

        if (urlRecord != "") {
            if (urlRecord.indexOf("edit0106_") != -1) {
                openPopupForm('0106', 'remodalform', 'remodal', urlRecord.replace("edit0106_", ""));
            } else if (urlRecord.indexOf("edit0101_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0101", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "form0101-content");
            } else if (urlRecord.indexOf("edit0102_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0102", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "form0102-content");
            } else if (urlRecord.indexOf("edit0104_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0104", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "form0104-content");
            } else if (urlRecord.indexOf("edit0111_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0111", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "form0111-content");
            }
        }
    }

    function customLoadContentOnePopupForm(urlId, param, oPopUp, formId, popupType, results) {
        var isCustomLoad = false;

        if (results != "") {
            if (results.indexOf("code") != -1 && results.indexOf("locked_by") != -1 && results.indexOf("locked_date") != -1) {
                var oJson = JSON.parse(results);
                if (oJson.code == "0" && oJson.locked_by != "") {
                    if (urlId.indexOf("edit0101_") != -1) {
                        loadContentOnePopupForm("popup0101", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0101-content");
                    } else if (urlId.indexOf("edit0102_") != -1) {
                        loadContentOnePopupForm("popup0102", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0102-content");
                    } else if (urlId.indexOf("edit0104_") != -1) {
                        loadContentOnePopupForm("popup0104", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0104-content");
                    } else if (urlId.indexOf("edit0111_") != -1) {
                        loadContentOnePopupForm("popup0111", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0111-content");
                    }
                }
            } else {
                if (param == "new_form=1") {
                    if (urlId.indexOf("popup0101") != -1) {
                        oPopUp.find("#mBrandPopupForm").attr("mode", "INS");
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    } else if (urlId.indexOf("popup0102") != -1) {
                        oPopUp.find("#mCategoryPopupForm").attr("mode", "INS");
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    } else if (urlId.indexOf("popup0104") != -1) {
                        oPopUp.find("#mInvStatusPopupForm").attr("mode", "INS");
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    } else if (urlId.indexOf("popup0111") != -1) {
                        oPopUp.find("#mUomPopupForm").attr("mode", "INS");
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    }
                } else {
                    if (urlId.indexOf("edit0101_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("0101");
                    } else if (urlId.indexOf("edit0102_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("0102");
                    } else if (urlId.indexOf("edit0104_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("0104");
                    } else if (urlId.indexOf("edit0111_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("0111");
                    }

                    if (isCustomLoad) {
                        if (oPopUp.find("#AUTONUMBER_TMP").length > 0) oPopUp.find("#AUTONUMBER").val(oPopUp.find("#AUTONUMBER_TMP").val());
                        if (oPopUp.find("#SYSTEM_ID_TMP").length > 0) oPopUp.find("#SYSTEM_ID").val(oPopUp.find("#SYSTEM_ID_TMP").val());
                        if (urlId.indexOf("edit0101_") != -1) {
                            oPopUp.find("#mBrandPopupForm").attr("mode", "UPD");
                        } else if (urlId.indexOf("edit0102_") != -1) {
                            oPopUp.find("#mCategoryPopupForm").attr("mode", "UPD");
                        } else if (urlId.indexOf("edit0104_") != -1) {
                            oPopUp.find("#mInvStatusPopupForm").attr("mode", "UPD");
                        } else if (urlId.indexOf("edit0111_") != -1) {
                            oPopUp.find("#mUomPopupForm").attr("mode", "UPD");
                        }
                        oPopUp.find("input[name='MODIFY_STATUS']").val("UPD");
                    }
                }
            }
        }
    }

    function loadCustomerRecord(urlRecord) {
        var xhr;
        xhr && xhr.abort();
        xhr = $.ajax({
            method: "POST",
            url: urlRecord,
            headers: { "x-sysuid": vsysuid },
            beforeSend: function () {
                openMainLoading();
            },
            success: function (results, textStatus, xhr) {
                closeMainLoading();
                if (results != "") {
                    $("#form0122-content").html(results);
                    $("#mCustomerPopupForm").find("#AUTONUMBER").val($("#mCustomerPopupForm").find("#AUTONUMBER_TMP").val());
                    $("#mCustomerPopupForm").find("#SYSTEM_ID").val($("#mCustomerPopupForm").find("#SYSTEM_ID_TMP").val());
                    $("#mCustomerPopupForm").attr("mode", "UPD");
                }
            },
            error: function () {
                closeMainLoading();
            }
        });
    }

    function loadDefaultPopUpForm(id) {
        var oAutoNumber = "";
        var oModifyStatus = "";

        switch (id) {
            case "0101":
                oSubRemodalPopUp.find("input[name='BRAND_CODE']").focus();
                oSubRemodalPopUp.find("input[name='BRAND_CODE']").select();
                oSubRemodalPopUp.find("input[name='BRAND_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0101", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                    loadContentOnePopupForm("popup0101", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0101-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='BRAND_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='BRAND_CODE']").select();
                    }
                });
                break;
            case "0102":
                oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").focus();
                oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").select();
                oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0102", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                    loadContentOnePopupForm("popup0102", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "formh0102-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").select();
                    }
                });
                break;
            case "0104":
                oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").focus();
                oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").select();
                oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0104", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                    loadContentOnePopupForm("popup0104", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0104-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").select();
                    }
                });
                break;
            case "0111":
                oSubRemodalPopUp.find("input[name='UOM_CODE']").focus();
                oSubRemodalPopUp.find("input[name='UOM_CODE']").select();
                oSubRemodalPopUp.find("input[name='UOM_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    oModifyStatus = oSubRemodalPopUp.find("input[name='MODIFY_STATUS']").val();
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0111", oSubRemodalPopUp, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                    loadContentOnePopupForm("popup0104", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0111-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='UOM_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='UOM_CODE']").select();
                    }
                });
                break;
        }
    }

    function sendPostPopUpForm(oPopUp, popupType, jsonobject) {
        var xhr;
        var xhr2;
        xhr && xhr.abort();
        xhr2 && xhr2.abort();
		
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
                         
                        var jsBaseUrlBarcode = jsBaseUrl;
						
						jsBaseUrlBarcode = jsBaseUrlBarcode.replace(":80", ":8184");
						
                        xhr2 = $.ajax({
                            method: "GET",
                            url: jsBaseUrlBarcode + "ean13.php?code=" + $("input[name='ALT_CODE']").val(),
                            data: "",
                            beforeSend: function () {
                            },
                            success: function (results) {
                                if (popupType == "subremodal") {
                                    customDoProcessPreClosePopUp(oPopUp, popupType, "");
                                } else {
                                    customLoadListRecord();
                                }
                            },
                            error: function () {
                            }
                        });
                        
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
		
		switch(oTableId)
        {
		    case "0122":
	    	        if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0122", oPopUp, "execute", popupType, "AUTONUMBER=" + oAutoNumber, "");
    		        break;
		    case "0101":
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0101", oPopUp, "execute", popupType, "AUTONUMBER=" + oAutoNumber, "");
                    break;
            case "0102":
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0102", oPopUp, "execute", popupType, "AUTONUMBER=" + oAutoNumber, "");
                    break;
            case "0104":
                    if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0104", oPopUp, "execute", popupType, "AUTONUMBER=" + oAutoNumber, "");
                    break;
		    case "0111":
		            if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0111", oPopUp, "execute", popupType, "AUTONUMBER=" + oAutoNumber, "");
		            break;
        }

		if (oTableId == "0106") {
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
            url: "reset0106",
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
            url: "read0106",
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
        //if (oRemodalPopUp.find("input[name='DESCRIPTION']").val() == "") {
        oRemodalPopUp.find("input[name='SHORT_NAME']").val(oRemodalPopUp.find("input[name='DESCRIPTION']").val());
        //}
        saveEntryPopup(oRemodalPopUp, 'remodal', 'masterPopupForm', 'AF0106', 'AF/MS-PD');
    });

    $(document).on('cancellation', '.remodal', function () {
        
    });

    $(document).on('closing', '.remodal', function (e) {
        var $this = $(this);

        if ($this.find("input[name='MODIFY_STATUS']").val() == "UPD") {
            doResetStatusRecord($this.find("input[name='AUTONUMBER']").val());
        }
        doReloadFormCoreNavigation("/finish_good", "");
    });

    $(document).on('subconfirmation', '.subremodal', function (e) {
        var $this = $(this);

        switch ($this.find("input[name='POPUP_OBJECT_ID']").val()) {
            case "0122":
                saveEntryPopup($this, 'subremodal', 'mCustomerPopupForm', 'AF0122', 'AF/MS-CS');
                break;
            case "0101":
                saveEntryPopup($this, 'subremodal', 'mBrandPopupForm', 'AF0101', 'AF/MS-BR');
                break;
            case "0102":
                saveEntryPopup($this, 'subremodal', 'mCategoryPopupForm', 'AF0102', 'AF/MS-CT');
                break;
            case "0104":
                saveEntryPopup($this, 'subremodal', 'mInvStatusPopupForm', 'AF0104', 'AF/MS-VS');
                break;
            case "0111":
                saveEntryPopup($this, 'subremodal', 'mUomPopupForm', 'AF0111', 'AF/MS-UM');
                break;
        }
    });
	
	$(document).on('subcancellation', '.subremodal', function () {
        var $this = $(this);
        var oAutoNumber = $this.find("input[name='AUTONUMBER']").val();
        var oModifyStatus = $this.find("input[name='MODIFY_STATUS']").val();

        switch ($this.find("input[name='POPUP_OBJECT_ID']").val())
        {
            case "0101":
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0101", $this, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                break;
            case "0102":
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0102", $this, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                break;
            case "0104":
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0104", $this, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                break;
            case "0111":
                if (oModifyStatus == "UPD") loadContentOnePopupForm("reset0111", $this, "execute", "subremodal", "AUTONUMBER=" + oAutoNumber, "");
                break;
        }

        oRemodalPopUp.find("select[name='" + $this.find("input[name='POPUP_TOP_FIELD_NAME']").val() + "']").focus();
    });
	
    $(document).on('opened', '.remodal', function () {
        oRemodalPopUp = $(this);
        var customerId = "";

        if (oRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            oRemodalPopUp.find("input[name='PRODUCT_CODE']").focus();
            oRemodalPopUp.find("input[name='PRODUCT_CODE']").select();
            oRemodalPopUp.find("input[name='PRODUCT_CODE']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
            oRemodalPopUp.find("input[name='PID_CUSTOMER']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
            oRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                checkuniquepopup(oRemodalPopUp, 'remodal', this);
            });
            oRemodalPopUp.find("#remodal-end").on('keyup', function (e) {
                if (e.which == 9) {
                    oRemodalPopUp.find("input[name='PRODUCT_CODE']").focus();
                    oRemodalPopUp.find("input[name='PRODUCT_CODE']").select();
                }
            });

            if (oRemodalPopUp.find("input[name='MODIFY_STATUS']").val() == "INS") {
                $("#listDataTable .input-sm").val("");
            }

            oRemodalPopUp.find("input[name='image_in_tmp']").change(function () {
                if (oRemodalPopUp.find("input[name='image_in_tmp']").val() != "") {
                    var jForm = new FormData();

                    jForm.append('file', $('#image_in_tmp')[0].files[0]);

                    var xhr;
                    xhr && xhr.abort();

                    xhr = $.ajax({
                        method: "POST",
                        url: "/upfgimage_in_" + $("input[name='AUTONUMBER']").val(),
                        processData: false,
                        contentType: false,
                        data: jForm,
                        beforeSend: function () {
                        },
                        success: function (results) {
                            if (results != "") {
                                var oJSonResult = JSON.parse(results);
                                if (oJSonResult.code == "1") {
                                    oRemodalPopUp.find("#preview-imagein").html("");
                                    if (oJSonResult.filename != "") {
                                        oRemodalPopUp.find("input[name='FILE_IN']").val(oJSonResult.filename);
                                        contentImage = "<img src='" + jsBaseUrl + "assets/item/" + oJSonResult.filename + "' width=125 border=0 />";
                                        oRemodalPopUp.find("#preview-imagein").html(contentImage);
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
                    });
                }
            });

            oRemodalPopUp.find("input[name='image_out_tmp']").change(function () {
                if (oRemodalPopUp.find("input[name='image_out_tmp']").val() != "") {
                    var jForm = new FormData();

                    jForm.append('file', $('#image_out_tmp')[0].files[0]);

                    var xhr;
                    xhr && xhr.abort();

                    xhr = $.ajax({
                        method: "POST",
                        url: "/upfgimage_out_" + $("input[name='AUTONUMBER']").val(),
                        processData: false,
                        contentType: false,
                        data: jForm,
                        beforeSend: function () {
                        },
                        success: function (results) {
                            if (results != "") {
                                var oJSonResult = JSON.parse(results);
                                if (oJSonResult.code == "1") {
                                    oRemodalPopUp.find("#preview-imageout").html("");
                                    if (oJSonResult.filename != "") {
                                        oRemodalPopUp.find("input[name='FILE_OUT']").val(oJSonResult.filename);
                                        contentImage = "<img src='" + jsBaseUrl + "assets/item/" + oJSonResult.filename + "' width=125 border=0 />";
                                        oRemodalPopUp.find("#preview-imageout").html(contentImage);
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
                    });
                }
            });
            
            oRemodalPopUp.find("input[name='UNIT_PRICE']").val(numeral(oRemodalPopUp.find("input[name='UNIT_PRICE']").val()).format('0,0.00'));

            oRemodalPopUp.find("input[name='UNIT_PRICE']").on('blur', function (e) {
                $(this).val(numeral($(this).val()).format('0,0.00'));
            });

            customerId = oRemodalPopUp.find('#customer_id').val();

            oRemodalPopUp.find('#brand').selectize();
            oRemodalPopUp.find('#category').selectize();
            oRemodalPopUp.find('#customer_id').selectize();
            oRemodalPopUp.find('#invstatus').selectize();
            oRemodalPopUp.find('#uom_id').selectize();
            
            var $custSelect = $("#customer_id").selectize();
            var custSelectize = $custSelect[0].selectize;
            custSelectize.setValue(customerId);
        }
    });

    $(document).on('subopened', '.subremodal', function () {
        oSubRemodalPopUp = $(this);

        switch (oSubRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val()) {
            case "0101":
                oSubRemodalPopUp.find("input[name='BRAND_CODE']").focus();
                oSubRemodalPopUp.find("input[name='BRAND_CODE']").select();
                oSubRemodalPopUp.find("input[name='BRAND_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='BRAND_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='BRAND_CODE']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListBrand").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListBrand_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListBrand_filter").parent().removeClass("col-sm-6");
				oSubRemodalPopUp.find("#dataListBrand_info").parent().addClass("col-sm-12");
				oSubRemodalPopUp.find("#dataListBrand_info").parent().removeClass("col-sm-5");
                break;
            case "0102":
                oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").focus();
                oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").select();
                oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='CATEGORY_CODE']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListCategory").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListCategory_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListCategory_filter").parent().removeClass("col-sm-6");
                oSubRemodalPopUp.find("#dataListCategory_info").parent().addClass("col-sm-12");
				oSubRemodalPopUp.find("#dataListCategory_info").parent().removeClass("col-sm-5");
                break;
            case "0104":
                oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").focus();
				oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").select();
                oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='INVSTATUS_CODE']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListInvStatus").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListInvStatus_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListInvStatus_filter").parent().removeClass("col-sm-6");
                oSubRemodalPopUp.find("#dataListInvStatus_info").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListInvStatus_info").parent().removeClass("col-sm-5");
                break;
            case "0111":
                oSubRemodalPopUp.find("input[name='UOM_CODE']").focus();
                oSubRemodalPopUp.find("input[name='UOM_CODE']").select();
                oSubRemodalPopUp.find("input[name='UOM_CODE']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("input[name='DESCRIPTION']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='UOM_CODE']").focus();
                        oSubRemodalPopUp.find("input[name='UOM_CODE']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListUom").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListUom_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListUom_filter").parent().removeClass("col-sm-6");
                oSubRemodalPopUp.find("#dataListUom_info").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListUom_info").parent().removeClass("col-sm-5");
                break;
        }
    });

}