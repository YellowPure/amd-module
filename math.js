define(['util','a'], function(util, a) {
    var math = {
        getRandom: function(num) {
            return util.formatNum(parseInt(Math.random()* num));
        }
    };
    return math; 
});