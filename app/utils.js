define([], function() {
    return {
        formatDate: function(dt, fstr) {
            function pz(n) {
                var s = n + '';
                if (s.length === 1) {
                    return '0' + s;
                }
                return s;
            }

            fstr = fstr || 'DD.MM.YYYY hh:mm';

            return fstr.replace(/YYYY/g, dt.getFullYear())
                .replace(/MM/g, pz(dt.getMonth() + 1))
                .replace(/DD/g, pz(dt.getDate()))
                .replace(/hh/g, pz(dt.getHours()))
                .replace(/mm/g, pz(dt.getMinutes()));
        }
    }
})