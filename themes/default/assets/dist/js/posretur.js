/**
 * Created by Aji on 13-11-2017.
 */

$(document).ready(function()
{
    $("#mfaauto").autocomplete(
        {
            source:base_url+"pos/autocompletemfa",
            minLength:1,
            autoFocus:!1,
            delay:200,
            response:function(t,e)
            {
                $(this).val().length>=16&&0==e.content[0].id?
                    (
                        bootbox.alert(lang.no_match_found,function() {$("#mfaauto").focus()}),
                            $(this).val("")
                    )
                    :1==e.content.length&&0!=e.content[0].id?
                    (e.item=e.content[0],$(this).data("ui-autocomplete")._trigger("select","autocompleteselect",e),
                            $(this).autocomplete("close")
                    ):1==e.content.length&&0==e.content[0].id&&
                (bootbox.alert(lang.no_match_found,function(){$("#mfaauto").focus()}),$(this).val(""))

            },
            select:function(t,e)
            {

                // $("#customerauto").val(e.item.name);
                // alert(e.item.name);
                t.preventDefault(),
                    $(this).val(e.item.name);
                $("#mfa_id").val(e.item.item_id);
                //0!==e.item.id?add_invoice_item(e.item)&&$(this).val(""):bootbox.alert(lang.no_match_found)
            }
        })
});
