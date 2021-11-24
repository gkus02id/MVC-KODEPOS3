function loadMainContentBi(contentHtml, titlePage) {
    var curDivId = "";
    var divId = $(".main-section.active").attr("id");

    if (divId == "bi_part_1") {
        curDivId = "bi_part_2";
    } else {
        curDivId = "bi_part_1";
    }

    $("#" + curDivId).html(contentHtml);
    if (titlePage != "") {
        $("#" + curDivId + " .bi-main-title").html(titlePage);
    }
}

function sinkronDefaultDiv(divId) {
    var curDivId = "";

    if (divId == "bi_part_1") {
        curDivId = "bi_part_2";
    } else {
        curDivId = "bi_part_1";
    }

    $("#" + curDivId).removeClass("hide-layer");
    $("#" + curDivId).addClass("active");
    $("#" + divId).addClass("hide-layer");
    $("#" + divId).removeClass("active");
    $("#" + divId).transition({ perspective: '800px', rotateY: '0deg' });
}

function go_next() {
    var divId = $(".main-section.active").attr("id");
    $("#" + divId).transition({
        perspective: '800px',
        rotateY: '180deg'
    }, function () {
        sinkronDefaultDiv(divId);
    });
}

function go_back() {
    var divId = $(".main-section.active").attr("id");
    $("#" + divId).transition({
        perspective: '800px',
        rotateY: '-180deg'
    }, function () {
        sinkronDefaultDiv(divId);
    });
}