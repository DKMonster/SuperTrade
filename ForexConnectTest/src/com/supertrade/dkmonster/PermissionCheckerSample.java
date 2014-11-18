package com.supertrade.dkmonster;

import com.fxcore2.O2GLoginRules;
import com.fxcore2.O2GPermissionChecker;
import com.fxcore2.O2GSession;

public class PermissionCheckerSample {

    private O2GSession mSession;

    private SimpleLog mSimpleLog;

    public PermissionCheckerSample(SimpleLog simpleLog, O2GSession session) {
        mSimpleLog = simpleLog;
        mSession = session;
    }
    
    public void print()
    {
        String sInstrument = "EUR/USD";
        O2GLoginRules loginRules = mSession.getLoginRules();
        O2GPermissionChecker permissionChecker = loginRules.getPermissionChecker();
        mSimpleLog.log("canCreateMarketOpenOrder = {0}", permissionChecker.canCreateMarketOpenOrder(sInstrument));
        mSimpleLog.log("canChangeMarketOpenOrder = {0}", permissionChecker.canChangeMarketOpenOrder(sInstrument));
        mSimpleLog.log("canDeleteMarketOpenOrder = {0}", permissionChecker.canDeleteMarketOpenOrder(sInstrument));
        mSimpleLog.log("canCreateMarketCloseOrder = {0}", permissionChecker.canCreateMarketCloseOrder(sInstrument));
        mSimpleLog.log("canChangeMarketCloseOrder = {0}", permissionChecker.canChangeMarketCloseOrder(sInstrument));
        mSimpleLog.log("canDeleteMarketCloseOrder = {0}", permissionChecker.canDeleteMarketCloseOrder(sInstrument));
        mSimpleLog.log("canCreateEntryOrder = {0}", permissionChecker.canCreateEntryOrder(sInstrument));
        mSimpleLog.log("canChangeEntryOrder = {0}", permissionChecker.canChangeEntryOrder(sInstrument));
        mSimpleLog.log("canDeleteEntryOrder = {0}", permissionChecker.canDeleteEntryOrder(sInstrument));
        mSimpleLog.log("canCreateStopLimitOrder = {0}", permissionChecker.canCreateStopLimitOrder(sInstrument));
        mSimpleLog.log("canChangeStopLimitOrder = {0}", permissionChecker.canChangeStopLimitOrder(sInstrument));
        mSimpleLog.log("canDeleteStopLimitOrder = {0}", permissionChecker.canDeleteStopLimitOrder(sInstrument));
        mSimpleLog.log("canRequestQuote = {0}", permissionChecker.canRequestQuote(sInstrument));
        mSimpleLog.log("canAcceptQuote = {0}", permissionChecker.canAcceptQuote(sInstrument));
        mSimpleLog.log("canDeleteQuote = {0}", permissionChecker.canDeleteQuote(sInstrument));
        mSimpleLog.log("canCreateOCO = {0}", permissionChecker.canCreateOCO(sInstrument));
        mSimpleLog.log("canCreateOTO = {0}", permissionChecker.canCreateOTO(sInstrument));
        mSimpleLog.log("canJoinToNewContingencyGroup = {0}", permissionChecker.canJoinToNewContingencyGroup(sInstrument));
        mSimpleLog.log("canJoinToExistingContingencyGroup = {0}", permissionChecker.canJoinToExistingContingencyGroup(sInstrument));
        mSimpleLog.log("canRemoveFromContingencyGroup = {0}", permissionChecker.canRemoveFromContingencyGroup(sInstrument));
        mSimpleLog.log("canChangeOfferSubscription = {0}", permissionChecker.canChangeOfferSubscription(sInstrument));
        mSimpleLog.log("canCreateNetCloseOrder = {0}", permissionChecker.canCreateNetCloseOrder(sInstrument));
        mSimpleLog.log("canChangeNetCloseOrder = {0}", permissionChecker.canChangeNetCloseOrder(sInstrument));
        mSimpleLog.log("canDeleteNetCloseOrder = {0}", permissionChecker.canDeleteNetCloseOrder(sInstrument));
        mSimpleLog.log("canCreateNetStopLimitOrder = {0}", permissionChecker.canCreateNetStopLimitOrder(sInstrument));
        mSimpleLog.log("canChangeNetStopLimitOrder = {0}", permissionChecker.canChangeNetStopLimitOrder(sInstrument));
        mSimpleLog.log("canDeleteNetStopLimitOrder = {0}", permissionChecker.canDeleteNetStopLimitOrder(sInstrument));
        mSimpleLog.log("canUseDynamicTrailingForStop = {0}", permissionChecker.canUseDynamicTrailingForStop());
        mSimpleLog.log("canUseDynamicTrailingForLimit = {0}", permissionChecker.canUseDynamicTrailingForLimit());
        mSimpleLog.log("canUseDynamicTrailingForEntryStop = {0}", permissionChecker.canUseDynamicTrailingForEntryStop());
        mSimpleLog.log("canUseDynamicTrailingForEntryLimit = {0}", permissionChecker.canUseDynamicTrailingForEntryLimit());
        mSimpleLog.log("canUseFluctuateTrailingForStop = {0}", permissionChecker.canUseFluctuateTrailingForStop());
        mSimpleLog.log("canUseFluctuateTrailingForLimit = {0}", permissionChecker.canUseFluctuateTrailingForLimit());
        mSimpleLog.log("canUseFluctuateTrailingForEntryStop = {0}", permissionChecker.canUseFluctuateTrailingForEntryStop());
        mSimpleLog.log("canUseFluctuateTrailingForEntryLimit = {0}", permissionChecker.canUseFluctuateTrailingForEntryLimit());
    }
}