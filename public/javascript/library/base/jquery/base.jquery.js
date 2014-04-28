/********************************
  * base.jquery.js               *  
  *                              *
  * extendendo funções e métodos *
  * do jQuery                    *
  ********************************/

$.fn.attrOld = $.fn.attr;
/**
 * Extendendo o .attr() 
 *
 * @param mixed x
 * @param mixed y
 * @return object
 */
$.fn.attr = function(x,y,w,z){
    // quando for elemento select... 
    if( $(this).is('select') ){
        // se for setado como readonly...
        if( x === 'readonly' && (y === 'readonly' || y === true)){
            $(this).find('option').attrOld('disabled','disabled');
        }
    //    }else if ($(this).hasClass('masked')){
    //        if( x === 'readonly' && ( y === 'readonly' || y === true)){
    //            $(this).unmask();
    //        }
    }else if ($(this).hasClass('hasDatepicker')){
        if( x === 'disabled' && ( y === 'disabled' || y === true)){
            $(this).datepickerOld('disable');
        }
        if( x === 'readonly' && ( y === 'readonly' || y === true)){
            $(this).datepickerOld('disable');
            $(this).removeAttr('disabled');
        }
    }
    if(y === false){
        return $(this).removeAttr(x);
    }
    // retornano a função padrão do jQuery
    return $(this).attrOld(x,y,w,z);
};

$.fn.removeAttrOld = $.fn.removeAttr;
/**
 * Extendendo o .removeAttr() 
 *
 * @param mixed x
 * @return object
 */
$.fn.removeAttr = function(x){
    // quando for elemento select... 
    if( $(this).is('select') ){
        // se for removido o readonly...
        if( x === 'readonly' ){
            $(this).find('option').removeAttrOld('disabled');
        }
    //    }else if ($(this).hasClass('masked')){
    //        if( x === 'readonly'){
    //            $(this).removeAttrOld(x);
    //            setupInputs($(this));
    //            $(this).attr(x,x);
    //        }
    }else if ($(this).hasClass('hasDatepicker')){
        if( x === 'disabled'){
            $(this).datepicker('enable');
        }
        if( x === 'readonly'){
            $(this).datepicker('enable');
        }
    }
    // retornano a função padrão do jQuery
    return $(this).removeAttrOld(x);
};

$.fn.datepickerOld = $.fn.datepicker;
/**
 * Extendendo o .datepicker() 
 *
 * @param mixed x
 * @return object
 */
$.fn.datepicker = function(x){
    var attrDisabled = $(this).attr('disabled');
    var attrReadonly = $(this).attr('readonly');

    $(this).datepickerOld(x);

    if( attrDisabled || attrReadonly ){
        $(this).datepickerOld('disable');
        if( attrReadonly ){
            $(this).removeAttrOld('disabled');
        }
    }
    return $(this);
};

$.fn.autocompleteOld = $.fn.autocomplete;
/**
 * Extendendo o .autocomplete()
 *
 * @param mixed urlOrData
 * @param function functionResult
 * @param function functionFormatItem
 * @param function functionFormatResult
 * @return object
 */
$.fn.autocomplete = function(config){
    var input = $(this);
    if( input.length > 1){
        input.each(function(){
            $(this).autocomplete(config);
        });
    } else {
        
        var url  = (isset(config.url)) ? config.url  : false;
        var data = (isset(config.data))? config.data : false;
        if(!url && !data){
            return false;
        }
        
        // se não passar 'result' ele assume o valor padrão
        var resultado         = (isset(config.result))            ? config.result            : function(event, row, formatted){};
        // se não passar 'formatItem' ele assume o valor padrão
        var formatItem        = (isset(config.formatItem))        ? config.formatItem        : function(row,i,max){
            return false;
        };
        // se não passar 'formatResult' ele assume o valor de 'formatItem'
        var formatResult      = (isset(config.formatResult))      ? config.formatResult      : formatItem;
        // se não passar 'minChar' ele assume o valor padrão
        var minChar           = (isset(config.minChar))           ? config.minChar           : 2;
        // se não passar 'width' ele assume o valor padrão
        var width             = (isset(config.width))             ? config.width             : (parseInt(input.css('width')) + 10);
        // se não passar 'matchContains' ele assume o valor padrão
        var matchContains     = (isset(config.matchContains))     ? config.matchContains     : true;
        // se não passar 'max' ele assume o valor padrão
        var max               = (isset(config.max))               ? config.max               : 1000;
        // se não passar 'mustMatch' ele assume o valor padrão
        var mustMatch         = (isset(config.mustMatch))         ? config.mustMatch         : true;
        // se não passar 'autoFill' ele assume o valor padrão
        var autoFill          = (isset(config.autoFill))          ? config.autoFill          : false;
        // se não passar 'multiple' ele assume o valor padrão
        var multiple          = (isset(config.multiple))          ? config.multiple          : false;
        // se não passar 'multipleSeparator' ele assume o valor padrão
        var multipleSeparator = (isset(config.multipleSeparator)) ? config.multipleSeparator : "; ";



        input.autocompleteOld((!data)?url:data,{
            "width"             : width,
            "minChars"          : minChar,
            "autoFill"          : autoFill,
            "matchContains"     : matchContains,
            "multiple"          : multiple,
            "multipleSeparator" : multipleSeparator,
            "max"               : max,
            "mustMatch"         : mustMatch,
            "formatItem"        : formatItem,
            "formatResult"      : formatResult
        }).blur(function(){
            var dependent = input.attr('dependent');
            if(dependent != ""){
                dependent = $(dependent);
                if(dependent.length){
                    if($.trim(input.val()) == ""){
                        dependent.val('');
                    }
                }
            }
        }).result(resultado);
        
        input.bind('keyup',function(e){
            var e=e||window.event;
            var k=e.charCode||e.keyCode||e.which;
            if( k == 17 ){
                $(this).val('');
            }
        });        
        
        return input;
    }
};

/**
 * Extendendo o .tabs()
 *
 * @param mixed a
 * @return object
 */
$.fn.baseTabs = function(a){

    var funcShow = function(){
        removeToolTip();
        $(this).find('.ui-tabs-nav li').eq(0).addClass('first');
        var selected = $(this).tabs('option', 'selected');
        if( selected == 0){
            $(this).find('.ui-tabs-nav li').eq(0).addClass('firstSelected');
        }else{
            $(this).find('.ui-tabs-nav li').eq(0).removeClass('firstSelected');
        }
    };
    var funcDisable = function(event, ui){
        if( ui.index == 0){
            $(this).find('.ui-tabs-nav li').eq(0).addClass('firstDisabled');
        }
    };
    var funcEnable = function(event, ui, index){
        if( ui.index == 0){
            $(this).find('.ui-tabs-nav li').eq(0).removeClass('firstDisabled');
        }
    };
    a = $.extend({
        "show"    : funcShow,
        "disable" : funcDisable,
        "enable"  : funcEnable
    },a);
    // retornano a função padrão do jQuery
    return $(this).tabs(a);
}