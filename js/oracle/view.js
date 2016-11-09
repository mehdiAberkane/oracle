var OracleView = function() {
    this.f7 = null;
    this.mainView = null;
    this.init();
}

OracleView.prototype.init = function init() {
    this.f7 = new Framework7();

    this.mainView = this.f7.addView('.view-main', {
        dynamicNavbar: true,
        domCache: true
    });
}
