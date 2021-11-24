
$("li.dropdown.user-menu").click(function () {
    event.stopPropagation();
    if ($(this).hasClass("open")) {
        $(this).removeClass("open");
    } else {
        $(this).addClass("open");
    }
});

$(window).click(function (e) {
    if ($("li.dropdown.user-menu").hasClass("open")) {
        $("li.dropdown.user-menu").removeClass("open");
    }
});

