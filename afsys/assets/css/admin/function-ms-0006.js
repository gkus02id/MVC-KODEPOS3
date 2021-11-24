var onValidationProcess = true;

if (initCorePopup()) {

    function showCustomButton() {
        $(".validation-result").hide();
        $(".validation-result").html('');
        if ($("#mainForm").attr("mode") == "INS") $("#saveobject").show();
        if ($("#mainForm").attr("mode") == "UPD") $("#removeobject").show();
        $("#newsession").show();
    }

    function hideCustomButton() {
        $("#saveobject").hide();
        $("#removeobject").hide();
        $("#newsession").hide();
    }

    function customCloseReModalPopup() {
        $(".validation-result").hide();
        $(".validation-result").html('');
        if ($("#mainForm").attr("mode") == "INS") $("#saveobject").hide();
        $("input[name='SETTING_NAME']").val("");
        $("input[name='TABLE_ID']").val("");
        $("input[name='FIELD_ID']").val("");
        $("input[name='FORMULA']").val("");
        $("#mainForm").attr("mode", "INS");
        reloadListTable();
        showCustomButton();
        $("#newsession").show();
    }

    function sendPostForm(jsonobject) {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "save-data",
            data: "jsonobject=" + jsonobject,
            beforeSend: function () {
                onValidationProcess = true;
                openMainLoading();
                hideCustomButton();
                $(".validation-result").removeClass("has-error");
                $(".validation-result").show();
                $(".validation-result").html('<div>validating .... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span></div>');
            },
            success: function (results) {
                if (results != "") {
                    var oJSonResult = JSON.parse(results);
                    if (oJSonResult.code == "1") {
                        $(".validation-result").hide();
                        $(".validation-result").html('');
                        if ($("#mainForm").attr("mode") == "INS") $("#saveobject").hide();
                        $("input[name='SETTING_NAME']").val("");
                        $("input[name='TABLE_ID']").val("");
                        $("input[name='FIELD_ID']").val("");
                        $("input[name='FORMULA']").val("");
                        $("#mainForm").attr("mode", "INS");
                        reloadListTable();
                        showCustomButton();
                        $("#newsession").show();
                    } else {
                        showCustomButton();
                        ErrorPopup(oJSonResult.message);
                    }
                    closeMainLoading();
                }
                onValidationProcess = false;
            },
            error: function () {
                showCustomButton();
                closeMainLoading();
                onValidationProcess = false;
            }
        })
    }

    function reloadListTable() {
        var xhr;
        xhr && xhr.abort();

        xhr = $.ajax({
            method: "POST",
            url: "read0006",
            beforeSend: function () {
            },
            success: function (results) {
                if (results != "") {
                    if ($.fn.DataTable.isDataTable('#dataList')) {
                        $('#dataList').DataTable().destroy();
                    }

                    $("#listDataTable").html(results);

                    var listDataTable = $('#dataList').DataTable({ ordering: true, responsive: true, stateSave: true });

                    $('#listDataTable tbody').on('click', 'td.details-control', function () {
                        var sel = $(this);
                        var tr = $(this).closest('tr').next('tr');
                        if (tr.css('display') == "none") {
                            // This row is already open - close it
                            $(sel).addClass("hideme");
                            tr.slideDown("slow");
                        }
                        else {
                            // Open this row

                            tr.slideUp("slow", function () {
                                $(sel).removeClass("hideme");
                            });
                        }
                    });
                }
            },
            error: function () {
            }
        })
    }

    $("#newsession").click(function () {
        coreConfirmPopup("/documentno", "0006", "Confirm New Session!", "Are you sure you want to setup a new session?");
    });

    $(document).on('cfconfirmation', '.cfremodal', function () {
        menuQuery('/documentno');
    });

    $(document).on('cfcancellation', '.cfremodal', function () {
    });

    $("#removeobject").click(function () {
        var id = $("input[name='AUTONUMBER']").val();
        coreDeleteRecord("delete_0006_" + id, "0006");
    });

    $("#saveobject").click(function () {
        onValidationProcess = false;
        coreSaveEntry("mainForm", "AF0006", "");
    });

    $(document).on('delconfirmation', '.delremodal', function () {
        var $this = $(this);
        doCoreDeleteRecord($this.find("input[name='POPUP_URL_ACTION']").val(), $this.find("input[name='POPUP_OBJECT_ID']").val());
    });

}
