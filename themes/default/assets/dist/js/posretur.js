/**
 * Created by Aji on 13-11-2017.
 */

$(document).ready(function()
{
    $( "#sales_id" ).focus(function()
     {
         $.ajax({
             url: base_url+"posretur/getsalesbyid",
             beforeSend: function(){
                 //$('#loading').show();
             },
             success: function(response){
                // $('#loading').hide();
                 store("spositems",response);
                 loadItems();
             }
         });
    });


    $("#searchsales").autocomplete(
        {
            source:base_url+"posretur/autocompletesales",
            minLength:1,
            autoFocus:!1,
            delay:200,
            response:function(t,e)
            {
                $(this).val().length>=16&&0==e.content[0].id?
                    (
                        bootbox.alert(lang.no_match_found,function() {$("#searchsales").focus()}),
                            $(this).val("")
                    )
                    :1==e.content.length&&0!=e.content[0].id?
                    (e.item=e.content[0],$(this).data("ui-autocomplete")._trigger("select","autocompleteselect",e),
                            $(this).autocomplete("close")
                    ):1==e.content.length&&0==e.content[0].id&&
                (bootbox.alert(lang.no_match_found,function(){$("#searchsales").focus()}),$(this).val(""))

            },
            select:function(t,e)
            {

                // $("#customerauto").val(e.item.name);
                // alert(e.item.name);
                t.preventDefault(),
                    $(this).val(e.item.name);
                $("#sales_id").val(e.item.item_id);
                $("#sales_id").focus();
                //0!==e.item.id?add_invoice_item(e.item)&&$(this).val(""):bootbox.alert(lang.no_match_found)
            }
        });

    function loadItems()
    {
        if(1==count&&(spositems={}),get("spositems"))
        {
            total=0,count=1,an=1,product_tax=0,invoice_tax=0,product_discount=0,order_discount=0,
                total_discount=0,
                $("#posTable tbody").empty();
            var t=(new Date).getTime()/1e3;
            if(1!=Settings.remote_printing)
            {
                var e=(r="C: "+$("#select2-spos_customer-container").text()+"\n")+
                    (l="R: "+$("#hold_ref").val()+"\n")+(i="U: "+username+"\n")+
                    (c="T: "+date(Settings.dateformat+" "+Settings.timeformat,t)+"\n")+"\n";
                order_data.info=e,bill_data.info=e;var a="",o=""
            }
            else{
                $("#order_span").empty(),$("#bill_span").empty();var n="<style>.bb td, .bb th { border-bottom: 1px solid #DDD; }</style>",s='<span style="text-align:center;"><h3>'+Settings.site_name+"</h3>",r="<h5>C: "+$("#select2-spos_customer-container").text()+"</h5>",l="<h5>R: "+$("#hold_ref").val()+"</h5>",i="<h5>U: "+username+"</h5>",c="<h5>T: "+date(Settings.dateformat+" "+Settings.timeformat,t)+"</h5>";$("#order_span").prepend(n+s+"<h4>"+lang.order+"</h4></span>"+r+l+i+c),$("#bill_span").prepend(n+s+"<h4>"+lang.bill+"</h4></span>"+r+l+i+c),$("#order-table").empty(),$("#bill-table").empty()
            }

            //mendapatkan data dari localstore
            spositems=JSON.parse(get("spositems")),
                $.each(spositems,function()
                {
                    var t=this,e=1==Settings.item_addition?t.item_id:t.id;
                    spositems[e]=t;
                    var n=t.row.id,s=t.row.type,r=parseFloat(t.row.tax_method),l=t.combo_items,
                        i=t.row.qty,c=parseFloat(t.row.quantity),
                        s=t.row.type,d=t.row.discount,p=t.row.code,
                        u=t.row.name.replace(/"/g,"&#034;").replace(/'/g,"&#039;"),
                        m=parseFloat(t.row.real_unit_price),_=t.row.comment,g=t.row.ordered?t.row.ordered:0,
                        f=d||"0",v=formatDecimal(f);
                    if(-1!==f.indexOf("%"))
                    {
                        var h=f.split("%");
                        isNaN(h[0])||(v=formatDecimal(parseFloat(m*parseFloat(h[0])/100)))
                    }
                    product_discount+=formatDecimal(v*i),m=formatDecimal(m-v);
                    var y=parseInt(t.row.tax),b=0;
                    null!==y&&0!=y&&(0==r?(m-=b=formatDecimal(m*parseFloat(y)/(100+parseFloat(y))),
                        tax=lang.inclusive):(b=formatDecimal(m*parseFloat(y)/100),tax=lang.exclusive)),
                        product_tax+=formatDecimal(b*i);var x=(new Date).getTime(),
                    //k='';
                    k=$('<tr id="'+x+'" class="'+e+'" data-item-id="'+e+'"></tr>');
                    tr_html='<td><input name="product_id[]" type="hidden" class="rid" value="'+n+'">'
                    tr_html+='<input name="item_comment[]" type="hidden" class="ritem_comment" value="'+_+'">'
                    tr_html+='<input name="product_code[]" type="hidden" value="'+t.row.code+'">'
                    tr_html+='<input name="product_name[]" type="hidden" value="'+t.row.name+'">'
                    tr_html+='<button type="button" class="btn bg-purple btn-block btn-xs edit" id="'+x+'" data-item="'+e+'">'
                    tr_html+='<span class="sname" id="name_'+x+'">'+u+" ("+p+")</span></button></td>",
                        tr_html+='<td class="text-right">'
                    tr_html+='<input class="realuprice" name="real_unit_price[]" type="hidden" value="'+t.row.real_unit_price+'">'
                    tr_html+='<input class="rdiscount" name="product_discount[]" type="hidden" id="discount_'+x+'" value="'+f+'">'
                    tr_html+='<span class="text-right sprice" id="sprice_'+x+'">'
                        +formatMoney(parseFloat(m)+parseFloat(b))+"</span></td>",
                        tr_html+='<td><input name="item_was_ordered[]" type="hidden" class="riwo" value="'+g+'">'
                    tr_html+='<input name="quantity[]" type="text" class="form-control input-qty kb-pad text-center rquantity" value="'
                        +formatDecimal(i)+'" data-id="'+x+'" data-item="'+e+'" id="quantity_'+x+'" onClick="this.select();"></td>',
                        tr_html+='<td class="text-right"><span class="text-right ssubtotal" id="subtotal_'+x+'">'
                            +formatMoney((parseFloat(m)+parseFloat(b))*parseFloat(i))+"</span></td>",
                        tr_html+='<td class="text-center"><i class="fa fa-trash-o tip pointer posdel" id="'+x+'" title="Remove"></i></td>',
                        k.html(tr_html),
                        k.prependTo("#posTable"),
                        total+=formatDecimal((parseFloat(m)+parseFloat(b))*parseFloat(i)),
                        count+=parseFloat(i),an++;
                    var w=$("#list-table-div")[0].scrollHeight;$("#list-table-div").slimScroll({scrollTo:w}),
                    "standard"==s&&i>c?($("#"+x).addClass("danger"),$("#"+x).find(".edit").removeClass("bg-purple").addClass("btn-warning")):"combo"==s&&(!1===l?$("#"+x).addClass("danger"):$.each(l,function(){parseFloat(this.quantity)<parseFloat(this.qty)*i&&($("#"+x).addClass("danger"),$("#"+x).find(".edit").removeClass("bg-purple").addClass("btn-warning"))}));var M=_?_.split(/\r?\n/g):[];if(1!=Settings.remote_printing){o+="#"+(an-1)+" "+u+" ("+p+")\n";
                    for(var S=0,F=M.length;S<F;S++)o+=M[S].length>0?"   * "+
                    M[S]+"\n":"";o+=printLine(i+" x "+formatMoney(parseFloat(m)+parseFloat(b))+": "+
                            formatMoney((parseFloat(m)+parseFloat(b))*parseFloat(i)))+"\n",a+=printLine("#"+(an-1)+" "+u+" ("+p+"): [ "+(0!=g?"xxxx":i))+" ]\n";
                    for(var S=0,F=M.length;S<F;S++)a+=M[S].length>0?"   * "+M[S]+"\n":"";a+="\n"
                }else
                {
                    for(var D='<tr class="row_'+e+'" data-item-id="'+e+'"><td colspan="2">#'+(an-1)+" "+(0==e?t.row.name:u+" ("+p+")"),S=0,F=M.length;S<F;S++)D+=M[S]?"<br> <b>*</b> <small>"+M[S]+"</small>":"";
                    D+="</td></tr>",D+='<tr class="bb row_'+e+'" data-item-id="'+e+'"><td>('+i
                        +" x "+formatMoney(parseFloat(m)+parseFloat(b))+')</td><td style="text-align:right;">'
                        +formatMoney((parseFloat(m)+parseFloat(b))*parseFloat(i))+"</td></tr>";
                    for(var C='<tr class="bb row_'+e+'" data-item-id="'+e+'"><td>#'+(an-1)+" "+u+" ("+p+")",S=0,F=M.length;
                        S<F;S++)C+=M[S]?"<br> <b>*</b> <small>"+M[S]+"</small>":"";
                    C+="</td><td>[ "+(0!=g?"xxxx":i)+" ]</td></tr>",$("#order-table").append(C),
                        $("#bill-table").append(D)}
                });
            var d=get("spos_discount")?get("spos_discount"):$("#discount_val").val()?$("#discount_val").val():"0";if(order_discount=parseFloat(d),-1!==d.indexOf("%")){var p=d.split("%");order_discount=parseFloat(total*parseFloat(p[0])/100)}var u=get("spos_tax")?get("spos_tax"):$("#tax_val").val()?$("#tax_val").val():"0";if(order_tax=parseFloat(u),-1!==u.indexOf("%")){var m=u.split("%");order_tax=(total-order_discount)*parseFloat(m[0])/100}var _=total-parseFloat(order_discount)+parseFloat(order_tax);if(grand_total=formatMoney(_),$("#ds_con").text("("+formatMoney(product_discount)+") "+formatMoney(order_discount)),$("#ts_con").text(formatMoney(order_tax)),$("#total-payable").text(grand_total),$("#total").text(formatMoney(total)),$("#count").text(an-1+" ("+formatMoney(count-1)+")"),1!=Settings.remote_printing){order_data.items=a,bill_data.items=o;var g="";if(g+=printLine(lang.total+": "+formatMoney(total))+"\n",(order_discount>0||product_discount>0)&&(g+=printLine(lang.discount+": "+formatMoney(order_discount+product_discount))+"\n"),0!=order_tax&&(g+=printLine(lang.order_tax+": "+formatMoney(order_tax))+"\n"),g+=printLine(lang.grand_total+": "+formatMoney(_))+"\n",0!=Settings.rounding){round_total=roundNumber(_,parseInt(Settings.rounding));v=formatDecimal(round_total-_);g+=printLine(lang.rounding+": "+formatMoney(v))+"\n",g+=printLine(lang.total_payable+": "+formatMoney(round_total))+"\n"}g+="\n"+lang.total_items+": "+(an-1)+" ("+(parseFloat(count)-1)+")\n",bill_data.totals=g}else{var f="";if(f+='<tr class="bb"><td>'+lang.total_items+'</td><td style="text-align:right;">'+(an-1)+" ("+(parseFloat(count)-1)+")</td></tr>",f+='<tr class="bb"><td>'+lang.total+'</td><td style="text-align:right;">'+formatMoney(total)+"</td></tr>",(order_discount>0||product_discount>0)&&(f+='<tr class="bb"><td>'+lang.discount+'</td><td style="text-align:right;">'+formatMoney(order_discount+product_discount)+"</td></tr>"),0!=order_tax&&(f+='<tr class="bb"><td>'+lang.order_tax+'</td><td style="text-align:right;">'+formatMoney(order_tax)+"</td></tr>"),f+='<tr class="bb"><td>'+lang.grand_total+'</td><td style="text-align:right;">'+formatMoney(_)+"</td></tr>",0!=Settings.rounding){round_total=roundNumber(_,parseInt(Settings.rounding));var v=formatDecimal(round_total-_);f+='<tr class="bb"><td>'+lang.rounding+'</td><td style="text-align:right;">'+formatMoney(v)+"</td></tr>",f+='<tr class="bb"><td>'+lang.total_payable+'</td><td style="text-align:right;">'+formatMoney(round_total)+"</td></tr>"}f+='<tr class="bb"><td colspan="2" style="text-align:center;">'+lang.merchant_copy+"</td></tr>",$("#bill-total-table").empty(),$("#bill-total-table").append(f)}1==Settings.display_kb&&display_keyboards(),$("#add_item").focus()
        }
    }

});
