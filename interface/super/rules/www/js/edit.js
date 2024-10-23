/*
 *
 */
var rule_edit = function( args ) {
 
   var fn_work = function() {
       // Apply restrictions on form controls
      $(".form-control").each( function() {
           // Set placeholder and pattern for numeric input
          $(this).attr("placeholder","Enter a number");
          $(this).attr("pattern","[0-9]+");
 
           // Input event: restrict input to numeric values only
          $(this).on('input', function() {
               if (this.value.match(/[^0-9]/)) {
                  var currentValue = this.value;
                  var newValue = currentValue.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                  this.value = newValue;
                  this.setCustomValidity('Please enter a valid integer.');
               } else {
                  this.setCustomValidity('');
               }
              this.reportValidity(); // Show the validation error message
           });
 
           // Keydown event: prevent invalid characters from being typed
          $(this).on('keydown', function(event) {
               if (event.key === 'e' || event.key === '.' || event.key === '-') {
                  event.preventDefault(); // Prevent these keys
               }
           });
       });
 
       // Setup required field markers
      $(".req").each( function() {
           var txt = $(this).text();
           txt = "<span class='required'>*</span>" + txt;
          $(this).html(txt);
       });
 
       if ($(".req").length > 0) {
          $("#required_msg").show();
       }
   }
 
   var fn_validate = function() {
      String.prototype.trim = function() {
           return this.replace(/^\s+|\s+$/g,"");
       }
 
       // Clear previous validation markings
      $(".field_err_marker").removeClass("field_err_marker");
      $(".field_err_lbl_marker").removeClass("field_err_lbl_marker");
 
       var success = true;
 
      $(".req").each( function() {
           var label = $(this);
 
           // Test field
           var fldName = label.attr("data-fld");
           var fld = $("[name='" + fldName + "']");
           if (fld.length > 0) {
               if (fld.length == 1) {
                   // Likely dealing with some kind of textbox
                  var val = fld.prop("value");
                   if (!val || val.trim() == "") {
                      fld.addClass("field_err_marker");
                      label.addClass("field_err_lbl_marker");
                      success = false;
                   }
               } else {
                   // Likely dealing with a set
                  var fieldSet = fld.serializeArray();
                   if (fieldSet.length == 0) {
                      label.addClass("field_err_lbl_marker");
                      success = false;
                   }
               }
           }
 
           // Test group
           var dataGroup = label.attr("data-grp");
           var grp = $("[data-grp-tgt='" + dataGroup + "']");
           var ct = 0;
           for (var i = 0; i < grp.length; i++) {
               var el = grp[i];
               if (el.selectedIndex != undefined) {
                   // It's a selectbox
                   if (el.selectedIndex >= 0) {
                      ct++;
                   }
               } else {
                   if (el.value && el.value.trim() != "") {
                      ct++;
                   }
               }
           }
           if (ct != grp.length) {
              label.addClass("field_err_lbl_marker");
              grp.addClass("field_err_marker");
              success = false;
           }
       });
 
       return success;
   }
 
   var fn_wire_events = function() {
      $('#btn_save').on("click", function() {
          if (fn_validate()) {
             top.restoreSession();
             $('#frm_submit').trigger("submit");
          }
       });
   }
 
   return {
       init: function() {
           $(function () {
              fn_wire_events();
              fn_work();
           });
       }
   };
}
