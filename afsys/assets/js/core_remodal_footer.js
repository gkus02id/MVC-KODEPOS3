
$(document).on('cconfirmation', '.cremodal', function () {
});

$(document).on('ccancellation', '.cremodal', function () {
    if (typeof customExtendCancelCRemodal !== 'undefined' && typeof customExtendCancelCRemodal === 'function') {
        customExtendCancelCRemodal();
    }
});

$(document).on('delconfirmation', '.delremodal', function () {
    var $this = $(this);
    alert("test");
    doCoreDeleteRecord($this.find("input[name='POPUP_URL_ACTION']").val(), $this.find("input[name='POPUP_OBJECT_ID']").val());
});

$(document).on('delcancellation', '.delremodal', function () {
});
