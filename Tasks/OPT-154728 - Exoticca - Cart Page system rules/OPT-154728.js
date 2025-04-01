Insider.fns.hasParameter('personalization') && Insider.dom('div[class*=GridColumn]:has([class*=TripSummary])').exists();

//

return ['personalization', 'passengers', 'payment'].some((parameter) => Insider.fns.hasParameter(parameter)) &&
    Insider.dom('div[class*=GridColumn]:has([class*=TripSummary])').exists(); /* OPT-154728 */
