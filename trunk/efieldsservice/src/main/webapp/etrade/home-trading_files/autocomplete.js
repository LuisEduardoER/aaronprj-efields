$(document).bind('autosearch', function(){

    var host_autoSuggest = "/home/autosuggest.json";
    var host_searchResults = "/search-results";

    // Add autocomplete to the symbol input field using json
        var ac = $("#searchtext").autocomplete({
        delay: 300,
        minLength: 2,
        position:({
          offset: "-18"
        }), // offseting autosuggest table left position
        source: function( request, response ) {
            var _self = $(this.element);
            $.ajax({
                url: host_autoSuggest,
                dataType: "json",
                data: {
                    q: request.term,
                    limit: 5 // set limit for showing the result to 5
                },
                success: function(data) {
                    var results= [];
                    if('undefined' !== typeof data && 'undefined' !== typeof data.data.response){
                        $.each(data.data.response.autosuggest.etradeSuggestion, function(index, obj){ // Etrade category
                            var _val = {category: "Etrade", label: obj};
                            results.push(_val);
                        });
                        $.each(data.data.response.autosuggest.companySuggestion, function(index, obj){// company category
                            var _val = {category: "Company", label: obj.symbol + " " + obj.content, sym: obj.symbol};
                            results.push(_val);
                        });
                    }
                    _self.removeClass('et-header-searching');
                      response(results); // response(results.reverse()); to reverse the category order 
                },
                error: function(data){
                    _self.removeClass('et-header-searching');
                }
            });
        },
        search: function(){
            if ( this.value < 2 ) {
                return false;
            }
            $(this).addClass('et-header-searching');
        },
        close: function() {
            $('#searchtext').closest("form").removeClass('autosuggest');
        },
        select: function(event, ui) {
            var value = ui.item.label;
            if('undefined' !== typeof ui.item.sym){
                value = ui.item.sym;
            }
            window.top.location.href = host_searchResults+'?q=' + value; // sending query to server
        }
    }).data( "autocomplete" );

    ac._renderMenu = function( ul, items ) { 
        var self = this,
            currentCategory = "";
        ul.addClass('pros-home'); // adding css hook to position table of results
        var x = 1;
        $.each( items, function( index, item ) {
            if(item.category == 'Etrade'){
                item.category = 'E*TRADE Financial'
            }

            if ( item.category != currentCategory ) {
                ul.append( "<li class='ui-autocomplete-category pros-home'>" + item.category + ":</li>" );
                currentCategory = item.category;
            }
            var rendered = self._renderItem( ul, item );
            if(x%2 != 0){
                rendered.addClass('et-header-ac-odd');
            }
            x++;
        });
        ul.css("z-index", "");
        $('#searchtext').closest("form").addClass("autosuggest"); // removing third state of background position from the form
        $('ul.ui-autocomplete').css("margin-top","7px"); // adding inline style to position top of the table of results
    };

    ac._renderItem = function( ul, item ) {
         function highlight(value, term) {
            var start = ((term.indexOf("'") == 0) || (term.indexOf("\"") == 0)) ? 1 : 0;
            var len = ((term.lastIndexOf("'")+1 == term.length) || (term.lastIndexOf("\"")+1 == term.length)) ? (term.length-1) : term.length+1;
            term = term.substr(start, len-1);
            return value.replace(new RegExp("(?![^&;]+;)(?!<[^><]*)(" + term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^><]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
        }

        var value = this.element.val();
        return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( "<a>" + highlight(item.label, value) + "</a>" )
            .appendTo( ul );
    };

});
