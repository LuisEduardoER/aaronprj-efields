/**
* <code>Et1.oController.App</code>
* <br /><br />
* $Id: AccountsCombo.js 47305 2008-09-10 00:20:08Z mgarcia $
* <br /><br />
* Controller for <code>accountscombo</code> page.
* @object S_DATATYPE <code>string</code> The datatype of objects made from this class: 
*                    et1.js.framework.page_specific.controller.etrade.site04.projects.accounts.AccountsCombo
* @object bSingleton <code>boolean</code> <code>true</code> This is a singleton.
* @extends Et1.oController.oSite.oEtrade.Controller
* @author jwang3
*/
Et1.oController.App = Et1.oLang.Class.getConstructor( Et1.oController.oSite.oEtrade.Controller, {

    S_DATATYPE : "et1.js.framework.page_specific.controller.etrade.site04.projects.accounts.AccountsCombo",


    /**
    * Initializes new objects made from this class.
    */
    init : function() {
        arguments.callee.superClass.init.call( this );
    },


    /**
     * The page has been lazily loaded
     * @param p_eEvent <code>Event</code> A synthetic event
     */
    eventLazilyLoaded : function( p_eEvent ) {
        if( Et1.oController.oSite.oEtrade.CalloutTooltipCurveEdge ) {
            this.oHelpController = new Et1.oController.oSite.oEtrade.CalloutTooltipCurveEdge();
        }
    }

} );
