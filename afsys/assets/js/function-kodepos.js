var oSubRemodalPopUp;

if (initCorePopup()) {
    function customLoadRecord(urlRecord) {
        var oAutoNumber = "";
        var oModifyStatus = "";

        if (urlRecord != "") {
            if (urlRecord.indexOf("editkodepos_") != -1) {
                openPopupForm('kodepos', 'remodalform', 'remodal', urlRecord.replace("editkodepos_", ""));
            } else if (urlRecord.indexOf("editpropinsi_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "formpropinsi-content");
            } else if (urlRecord.indexOf("editkecamatan_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "formkecamatan-content");
            } else if (urlRecord.indexOf("editkabupaten_") != -1) {
                oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                loadContentOnePopupForm(urlRecord, oSubRemodalPopUp, 'subremodalform', 'subremodal', "", "formkabupaten-content");
            }
        }
    }

    function customLoadContentOnePopupForm(urlId, param, oPopUp, formId, popupType, results) {
        var isCustomLoad = false;

        if (results != "") {
            if (results.indexOf("code") != -1 && results.indexOf("locked_by") != -1 && results.indexOf("locked_date") != -1) {
                var oJson = JSON.parse(results);
                if (oJson.code == "0" && oJson.locked_by != "") {
                    if (urlId.indexOf("editpropinsi_") != -1) {
                        loadContentOnePopupForm("popuppropinsi", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0121-content");
                    } else if (urlId.indexOf("editkabupaten_") != -1) {
                        loadContentOnePopupForm("popupkabupaten", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0102-content");
                    } else if (urlId.indexOf("editkecamatan_") != -1) {
                        loadContentOnePopupForm("popupkecamatan", oPopUp, 'subremodalform', 'subremodal', "new_form=1", "form0104-content");
                    }
                }
            } else {
                if (param == "new_form=1") {
                    if (urlId.indexOf("popuppropinsi") != -1) {
                        oPopUp.find("#propinsiPopupForm").attr("mode", "INS");
						oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    } else if (urlId.indexOf("popupkabupaten") != -1) {
                        oPopUp.find("#mkabupatenPopupForm").attr("mode", "INS");
						oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    } else if (urlId.indexOf("popupkecamatan") != -1) {
                        oPopUp.find("#mkecamatanPopupForm").attr("mode", "INS");
                        oPopUp.find("#subremodal-confirm").removeAttr("disabled");
                    }
                } else {
                    if (urlId.indexOf("editpropinsi_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("propinsi");
                    } else if (urlId.indexOf("editkabupaten_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("kabupaten");
                    } else if (urlId.indexOf("editkecamatan_") != -1) {
                        isCustomLoad = true;
                        loadDefaultPopUpForm("kecamatan");
                    }

                    if (isCustomLoad) {
                        if (oPopUp.find("#AUTONUMBER_TMP").length > 0) oPopUp.find("#AUTONUMBER").val(oPopUp.find("#AUTONUMBER_TMP").val());
                        if (oPopUp.find("#SYSTEM_ID_TMP").length > 0) oPopUp.find("#SYSTEM_ID").val(oPopUp.find("#SYSTEM_ID_TMP").val());
                        if (urlId.indexOf("editpropinsi_") != -1) {
                            oPopUp.find("#propinsiPopupForm").attr("mode", "UPD");
                        } else if (urlId.indexOf("editkabupaten_") != -1) {
                            oPopUp.find("#kabupatenPopupForm").attr("mode", "UPD");
                        } else if (urlId.indexOf("editkecamatan_") != -1) {
                            oPopUp.find("#kecamatanPopupForm").attr("mode", "UPD");
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
            case "propinsi":
                oSubRemodalPopUp.find("input[name='NAMA']").focus();
                oSubRemodalPopUp.find("input[name='NAMA']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });

                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    loadContentOnePopupForm("popuppropinsi", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "formpropinsi-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='NAMA']").focus();
                        oSubRemodalPopUp.find("input[name='NAMA']").select();
                    }
                });
                break;
            case "kabupaten":
                oSubRemodalPopUp.find("input[name='NAMA']").focus();
                oSubRemodalPopUp.find("input[name='NAMA']").select();
                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    loadContentOnePopupForm("popupkabupaten", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "formkabupaten-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='NAMA']").focus();
                        oSubRemodalPopUp.find("input[name='NAMA']").select();
                    }
                });
                break;
            case "kecamatan":
                oSubRemodalPopUp.find("input[name='NAMA']").focus();
                oSubRemodalPopUp.find("input[name='NAMA']").select();
                oSubRemodalPopUp.find("#subremodal-new").click(function () {
                    oAutoNumber = oSubRemodalPopUp.find("input[name='AUTONUMBER']").val();
                    loadContentOnePopupForm("popupkecamatan", oSubRemodalPopUp, 'subremodalform', 'subremodal', "new_form=1", "formkecamatan-content");
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='NAMA']").focus();
                        oSubRemodalPopUp.find("input[name='NAMA']").select();
                    }
                });
                break;
            case "kodepos":
                oSubRemodalPopUp.find("select[name='PROPINSI_ID']").change(function () {
                    var $select = oRemodalPopUp.find("select[name='KABUPATEN_ID']").selectize();
                    var selectize = $select[0].selectize;
                    selectize.clearOptions();
                    oRemodalPopUp.find("select[name=KABUPATEN_ID']").find('option').remove();

                    var $select2 = oRemodalPopUp.find("select[name='KECAMATAN_ID']").selectize();
                    var selectize2 = $select2[0].selectize;
                    selectize2.clearOptions();
                    oRemodalPopUp.find("select[name='KECAMATAN_ID']").find('option').remove();

                    var selectedValue = oRemodalPopUp.find("select[name='PROPINSI_ID']").val();

                });


                oSubRemodalPopUp.find("select[name='KABUPATEN_ID']").change(function () {
                    var $select2 = oRemodalPopUp.find("select[name='KECAMATAN_ID']").selectize();
                    var selectize2 = $select2[0].selectize;
                    selectize2.clearOptions();
                    oRemodalPopUp.find("select[name='KECAMATAN_ID']").find('option').remove();

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
                        //doResetStatusRecord(oRemodalPopUp.find("input[name='AUTONUMBER']").val());
                        //doProcessPreClosePopUp(oPopUp, popupType, "0105");
                        if (popupType == "subremodal") {
                            customDoProcessPreClosePopUp(oPopUp, popupType, "");
                        } else {
                            customLoadListRecord();
                        }
                    } else {
                        ErrorPopup(oJSonResult.message, "", "");
                    }
                }
                oPopUp.find(".validation-result").hide();
            },
            error: function () {
                closeMainLoading();
            }
        });
    }

    function preopenPopupForm(element) {
        if (element == "kabupaten") {
            if (oRemodalPopUp.find("select[name='PROPINSI_ID']").val() != "") {
                openPopupFormWithParam('kabupaten', 'subremodalform', 'subremodal', 'propinsi_id=' + oRemodalPopUp.find("select[name='PROPINSI_ID']").val());
            } else {
                ErrorPopup("Pilih propinsi terlebih dahulu", "", "");
            }
        } else if (element == "kecamatan") {
            if (oRemodalPopUp.find("select[name='KABUPATEN_ID']").val() != "") {
                openPopupFormWithParam('kecamatan', 'subremodalform', 'subremodal', 'kabupaten_id=' + oRemodalPopUp.find("select[name='KABUPATEN_ID']").val());
            } else {
                ErrorPopup("Pilih kabupaten terlebih dahulu", "", "");
            }
        }
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
        var prefixUrl = "list";
        var param = "";
		
		if (oTableId == "kodepos") {
		    instPopUp.close();
		} else {
		    switch(oTableId)
		    {
		        case "kabupaten":
		                  param = "propinsi_id=" + oSubRemodalPopUp.find("input[name='PROPINSI_ID']").val();
		                  break;
		        case "kecamatan":
		                  param = "kabupaten_id=" + oSubRemodalPopUp.find("input[name='KABUPATEN_ID']").val();
		                  break;
		    }

		    var xhr;
		    xhr && xhr.abort();

		    xhr = $.ajax({
		        method: "POST",
		        url: prefixUrl + oTableId,
		        data:param,
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
            url: "reset0105",
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

    function customCloseReModalPopup(urlRecord) {
        var xhr;
        xhr && xhr.abort();

        if (urlRecord.indexOf("kabupaten_") != -1) {
            xhr = $.ajax({
                method: "POST",
                url: "readkabupaten",
                data: "propinsi_id=" + oSubRemodalPopUp.find("input[name='PROPINSI_ID']").val(),
                beforeSend: function () {
                    openMainLoading();
                },
                success: function (results) {
                        closeMainLoading();

                        if ($.fn.DataTable.isDataTable('#dataListKabupaten')) {
                            $('#dataListKabupaten').DataTable().destroy();
                        }

                        oSubRemodalPopUp.find("#listDataTable").html(results);

                        $("#dataListKabupaten").DataTable({
                            "columnDefs": [
                              {
                                  "targets": [0],
                                  "visible": false,
                                  "searchable": false
                              }
                            ],
                            "order": [[0, "desc"]],
                            "ordering": true,
                            "language": { "search": "Search : " },
                            "pageLength": 5,
                            "responsive": true,
                            "stateSave": true
                        });
                },
                error: function () {
                    closeMainLoading();
                }
            });
        } else if (urlRecord.indexOf("propinsi_") != -1) {
            
            xhr = $.ajax({
                method: "POST",
                url: "readpropinsi",
                beforeSend: function () {
                    openMainLoading();
                },
                success: function (results) {
                    closeMainLoading();

                    if ($.fn.DataTable.isDataTable('#dataListPropinsi')) {
                        $('#dataListPropinsi').DataTable().destroy();
                    }

                    oSubRemodalPopUp.find("#listDataTable").html(results);

                    $("#dataListPropinsi").DataTable({
                        "columnDefs": [
                          {
                              "targets": [0],
                              "visible": false,
                              "searchable": false
                          }
                        ],
                        "order": [[0, "desc"]],
                        "ordering": true,
                        "language": { "search": "Search : " },
                        "pageLength": 5,
                        "responsive": true,
                        "stateSave": true
                    });

                },
                error: function () {
                    closeMainLoading();
                }
            });
        } else if (urlRecord.indexOf("kecamatan_") != -1) {
            xhr = $.ajax({
                method: "POST",
                url: "readkecamatan",
                data: "kabupaten_id=" + oSubRemodalPopUp.find("input[name='KABUPATEN_ID']").val(),
                beforeSend: function () {
                    openMainLoading();
                },
                success: function (results) {
                    closeMainLoading();

                    if ($.fn.DataTable.isDataTable('#dataListKecamatan')) {
                        $('#dataListKecamatan').DataTable().destroy();
                    }

                    oSubRemodalPopUp.find("#listDataTable").html(results);

                    $("#dataListKecamatan").DataTable({
                        "columnDefs": [
                          {
                              "targets": [0],
                              "visible": false,
                              "searchable": false
                          }
                        ],
                        "order": [[0, "desc"]],
                        "ordering": true,
                        "language": { "search": "Search : " },
                        "pageLength": 5,
                        "responsive": true,
                        "stateSave": true
                    });
                    
                },
                error: function () {
                    closeMainLoading();
                }
            });
                    } else {
                        xhr = $.ajax({
                            method: "POST",
                            url: "readkodepos",
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

                                    /*
                                    var listDataTable = $('#dataList').DataTable({ ordering: true, responsive: true, stateSave: true });
                                    */

                                    $("#dataList").DataTable({
                                        "columnDefs": [
                                          {
                                              "targets": [0],
                                              "visible": false,
                                              "searchable": false
                                          }
                                        ],
                                        "order": [[0, "desc"]],
                                        "ordering": true,
                                        "language": { "search": "Search : " },
                                        "pageLength": 25,
                                        "responsive": true,
                                        "stateSave": true
                                    });
                                }
                            },
                            error: function () {
                                closeMainLoading();
                            }
                        });
                    }
    }

    $(document).on('confirmation', '.remodal', function () {
        saveEntryPopup(oRemodalPopUp, 'remodal', 'masterPopupForm', 'MS_KODEPOS', '');
    });

    $(document).on('cancellation', '.remodal', function () {
        
    });

    $(document).on('closing', '.remodal', function (e) {
        customCloseReModalPopup();
    });

    /*
    $(document).on('subconfirmation', '.subremodal', function (e) {
        var $this = $(this);

        console.log("subconfirmation " + $this.find("input[name='POPUP_OBJECT_ID']").val());

        switch ($this.find("input[name='POPUP_OBJECT_ID']").val()) {
            case "propinsi":
                saveEntryPopup($this, 'subremodal', 'propinsiPopupForm', 'MS_PROPINSI', '');
                break;
            case "kabupaten":
                saveEntryPopup($this, 'subremodal', 'kabupatenPopupForm', 'MS_KABUPATEN', '');
                break;
            case "kecamatan":
                saveEntryPopup($this, 'subremodal', 'kecamatanPopupForm', 'MS_KECAMATAN', '');
                break;
        }
    });
	*/

	$(document).on('subcancellation', '.subremodal', function () {
        var $this = $(this);
        var oAutoNumber = $this.find("input[name='AUTONUMBER']").val();
        var oModifyStatus = $this.find("input[name='MODIFY_STATUS']").val();

        oRemodalPopUp.find("select[name='" + $this.find("input[name='POPUP_TOP_FIELD_NAME']").val() + "']").focus();

        customDoProcessPreClosePopUp(oSubRemodalPopUp, "subremodal", "");
    });
	
    $(document).on('opened', '.remodal', function () {
        oRemodalPopUp = $(this);

        console.log("oRemodalPopUp Start");

        if (oRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val() != "") {
            
            oRemodalPopUp.find('#propinsi_id').selectize();
            oRemodalPopUp.find('#kabupaten_id').selectize();
            oRemodalPopUp.find('#kecamatan_id').selectize();
            
            console.log("oRemodalPopUp");

            oRemodalPopUp.find("select[name='PROPINSI_ID']").change(function () {
                var $select = oRemodalPopUp.find("select[name='KABUPATEN_ID']").selectize();
                var selectize = $select[0].selectize;
                selectize.clearOptions();
                oRemodalPopUp.find("select[name='KABUPATEN_ID']").find('option').remove();

                var $select2 = oRemodalPopUp.find("select[name='KECAMATAN_ID']").selectize();
                var selectize2 = $select2[0].selectize;
                selectize2.clearOptions();
                oRemodalPopUp.find("select[name='KECAMATAN_ID']").find('option').remove();

                var selectedValue = oRemodalPopUp.find("select[name='PROPINSI_ID']").val();

                var xhr;
                xhr && xhr.abort();

                xhr = $.ajax({
                    method: "POST",
                    url: "getoptionkabupaten",
                    data: "id=" + selectedValue,
                    beforeSend: function () {
                        openMainLoading();
                    },
                    success: function (results) {
                        closeMainLoading();

                        var $select3 = oRemodalPopUp.find("select[name='KABUPATEN_ID']").selectize();
                        var selectize3 = $select3[0].selectize;

                        oRemodalPopUp.find("select[name='KABUPATEN_ID']").find('option').remove().end().append(results);
                        oRemodalPopUp.find("select[name='KABUPATEN_ID']").val("");
                        oRemodalPopUp.find("select[name='KABUPATEN_ID'] option").each(function () {
                            selectize3.addOption({ value: $(this).val(), text: $(this).text() });
                        });
                        selectize3.refreshOptions();

                    },
                    error: function () {
                        closeMainLoading();
                    }
                });

            });


            oRemodalPopUp.find("select[name='KABUPATEN_ID']").change(function () {
                var $select2 = oRemodalPopUp.find("select[name='KECAMATAN_ID']").selectize();
                var selectize2 = $select2[0].selectize;
                selectize2.clearOptions();
                oRemodalPopUp.find("select[name='KECAMATAN_ID']").find('option').remove();

                var selectedValue = oRemodalPopUp.find("select[name='KABUPATEN_ID']").val();

                var xhr;
                xhr && xhr.abort();

                xhr = $.ajax({
                    method: "POST",
                    url: "getoptionkecamatan",
                    data: "id=" + selectedValue,
                    beforeSend: function () {
                        openMainLoading();
                    },
                    success: function (results) {
                        closeMainLoading();

                        var $select4 = oRemodalPopUp.find("select[name='KECAMATAN_ID']").selectize();
                        var selectize4 = $select4[0].selectize;

                        oRemodalPopUp.find("select[name='KECAMATAN_ID']").find('option').remove().end().append(results);
                        oRemodalPopUp.find("select[name='KECAMATAN_ID']").val(selectedValue);
                        oRemodalPopUp.find("select[name='KECAMATAN_ID'] option").each(function () {
                            selectize4.addOption({ value: $(this).val(), text: $(this).text() });
                        });
                        selectize4.refreshOptions();
                    },
                    error: function () {
                        closeMainLoading();
                    }
                });

            });
        }
    });

    $(document).on('subopened', '.subremodal', function () {
        oSubRemodalPopUp = $(this);

        switch (oSubRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val()) {
            case "propinsi":
                oSubRemodalPopUp.find("input[name='NAMA']").focus();
                oSubRemodalPopUp.find("input[name='NAMA']").select();
                oSubRemodalPopUp.find("input[name='NAMA']").blur(function () {
                    checkuniquepopup(oSubRemodalPopUp, 'subremodal', this);
                });
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='NAMA']").focus();
                        oSubRemodalPopUp.find("input[name='NAMA']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListPropinsi").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListPropinsi_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListPropinsi_filter").parent().removeClass("col-sm-6");
                oSubRemodalPopUp.find("#dataListPropinsi_info").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListPropinsi_info").parent().removeClass("col-sm-5");

                oSubRemodalPopUp.find("#subremodal-confirm").click(function () {
                    switch (oSubRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val()) {
                        case "propinsi":
                            saveEntryPopup(oSubRemodalPopUp, 'subremodal', 'propinsiPopupForm', 'MS_PROPINSI', '');
                            break;
                    }
                });

                break;
            case "kabupaten":
                oSubRemodalPopUp.find("input[name='NAMA']").focus();
                oSubRemodalPopUp.find("input[name='NAMA']").select();
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='NAMA']").focus();
                        oSubRemodalPopUp.find("input[name='NAMA']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListKabupaten").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListKabupaten_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListKabupaten_filter").parent().removeClass("col-sm-6");
                oSubRemodalPopUp.find("#dataListKabupaten_info").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListKabupaten_info").parent().removeClass("col-sm-5");

                oSubRemodalPopUp.find("#subremodal-confirm").click(function () {
                    switch (oSubRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val()) {
                        case "kabupaten":
                            saveEntryPopup(oSubRemodalPopUp, 'subremodal', 'kabupatenPopupForm', 'MS_KABUPATEN', '');
                            break;
                    }
                });
                break;
            case "kecamatan":
                oSubRemodalPopUp.find("input[name='NAMA']").focus();
                oSubRemodalPopUp.find("input[name='NAMA']").select();
                oSubRemodalPopUp.find("#subremodal-end").on('keyup', function (e) {
                    if (e.which == 9) {
                        oSubRemodalPopUp.find("input[name='NAMA']").focus();
                        oSubRemodalPopUp.find("input[name='NAMA']").select();
                    }
                });
                oSubRemodalPopUp.find("#dataListKecamatan").DataTable({
                    ordering: true, language: { "search": "Search : " }, responsive: true, stateSave: true, paginate: false, scrollY: 190
                });
                oSubRemodalPopUp.find("#dataListKecamatan_filter").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListKecamatan_filter").parent().removeClass("col-sm-6");
                oSubRemodalPopUp.find("#dataListKecamatan_info").parent().addClass("col-sm-12");
                oSubRemodalPopUp.find("#dataListKecamatan_info").parent().removeClass("col-sm-5");

                oSubRemodalPopUp.find("#subremodal-confirm").click(function () {
                    switch (oSubRemodalPopUp.find("input[name='POPUP_OBJECT_ID']").val()) {
                        case "kecamatan":
                            saveEntryPopup(oSubRemodalPopUp, 'subremodal', 'kecamatanPopupForm', 'MS_KECAMATAN', '');
                            break;
                    }
                });
                break;
        }
    });

}