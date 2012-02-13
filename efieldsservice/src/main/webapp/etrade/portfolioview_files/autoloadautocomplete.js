/**
 * Dynamic Search Suggest
 *
 * @param config    - (Object) Configuration object.
 *                      config.fldId    - (String) CSS Selector for autocomplete text box
 *                      config.width    - (Number) Width that the autocomplete dropdown should have
 * @param resultFn  - (Function) Callback function. Resolves the correct server to send the query to
 */

/* There is an odd bug where IE sometimes presents as supporting "standard" XHR
 * construction, when in fact it does not.  This tricks jQuery into attempting
 * to use standard construction, which errors out and prevents AJAX from
 * succeeding.  jQuery has not yet incorporated a fix, as a concrete text case
 * has not been presented (see bug #6437 - http://bugs.jquery.com/ticket/6437).
 *
 * A workaround in included here because the bug occurs with the autocomplete
 * script on the Banking page, for reasons unknown.  It is idempotent and will
 * not cause conflicts if its scope is broadened due to the bug presenting
 * elsewhere.
 */
if (window.ActiveXObject && window.XMLHttpRequest) {
    try {
        // attempt to create an XHR using the default method
        $.ajaxSettings.xhr();
        // if we get this far, there is no problem, so don't change anything
    } catch (ex) {
        // could not create an XHR; replace the method
        $.ajaxSettings.xhr = function() {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        }
    }
}

function loadAutoComplete(config, resultFn){
    $.ajax({
        url: AkamaiURL + '/javascript/jquery/plugins/jquery.autocomplete.ext.js',
        dataType: "script",
        cache: true,
        success: function(response, stat, xhr){
            //Only continue if autocomplete has been parsed out....
            if('undefined' !== typeof $.fn.autocomplete && 'undefined' !== typeof $.fn.result){
                initAutoComplete();
            }else{
                var _f = arguments.callee;
                window.setTimeout(function () {
                    _f(response, stat, xhr);
                }, 500);
            }
        }
    });
    
    function initAutoComplete() {
        $(config.fldId).autocomplete("/e/t/search/searchsuggestforward.xml", {
            dataType: "xml",
            scroll: false,
            minChars: 2,
            width: config.width,
            max: 13,
            matchSubset: false,
            extraParams: {"searchtext":function(){
                   return $(config.fldId).val();
                }
            },
            resultSet: 2,
            left: "-75",
            titles: ['E*TRADE Financial', 'Companies:'],
            selectFirst: false,
            highlight: function(value, term) {
                var start = ((term.indexOf("'") == 0) || (term.indexOf("\"") == 0)) ? 1 : 0;
                var len = ((term.lastIndexOf("'")+1 == term.length) || (term.lastIndexOf("\"")+1 == term.length)) ? (term.length-1) : term.length+1;
                term = term.substr(start, len-1);
                return value.replace(new RegExp("(?![^&;]+;)(?!<[^><]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^><]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
            },
            parse: function(data) {
                var companySuggestsCnt = 0;
                var etradeSuggestsCnt = 0;
                var results = [];

                $(data).find('Results').each(function() {
                    var content = $(this).find('Content').text();
                    var rtype = $(this).find('Type').text();

                    if(rtype == 'Etrade' && etradeSuggestsCnt < 5)
                    {
                        results[results.length] = { 'data': { text: content, value: content, rset: 1, symbol: ''}, 'result': content, 'value': content, 'rset': 1, 'symbol': ''};
                        etradeSuggestsCnt++;
                    }
                    else if(rtype == 'Company' && companySuggestsCnt < 8) {
                        var info = $(this).find('Symbol').text();

                        results[results.length] = { 'data': { text: content, value: content, rset: 2, symbol: info}, 'result': info, 'value': content, 'rset': 2, 'symbol': info};
                        companySuggestsCnt++;
                    }
                });

                return results;
            },

            formatItem: function(data) {
                if(data.symbol != ''){
                    return '<div class="pdr">' + data.symbol + '</div><div>' + (data.text).substring(0, (61 - (data.symbol).length)) + '</div>';
                } else {
                    return '<div>' + (data.text).substring(0, 61) + '</div>';
                }
            }
        }).result(function(e, item) {
            resultFn(e, item);
        });// End of autocomplete

    }

}
