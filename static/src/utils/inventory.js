

// Calculate Over Burn Stock
export function calculateOverBurnStock(quantity) {
    // console.error(quantity)
    if (!quantity || quantity.burnQuantity === 0 || quantity === {}) {
        return 'N/A';
    }
    // Return 7 Day Burn
    var overBurn = quantity.stock - (quantity.burnQuantity * quantity.burnDays);
    if (overBurn >= 0) {
        return 'N/A';
    }
    // console.error(overBurn)
    return overBurn;
}

// Calculate Over Burn Priority
export function calculateOverBurnPriority(overBurn) {
    // console.error(overBurn)
    if (overBurn < 0) {
        return 'high';
    }
    if (overBurn === 0) {
        return 'med';
    }
    if (overBurn > 0) {
        return 'low';
    }
    return overBurn;
}

// Utility Function
function range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

// Calculate Over Burn Required By Date
export function calculateOverBurnRequiredBy(quantity) {
    // console.error(quantity)
    // console.error(range(quantity.burnDays))
    var daysToBurn = 0;
    var burnDate = new Date();
    var stock = quantity.stock;
    range(quantity.burnDays).forEach((d) => {
          var overBurn = stock - (quantity.burnQuantity * d); // index + 1 = day
          // console.log(overBurn)
          if (overBurn < 0) {
              const today = new Date();
              const priorSeconds = new Date().setDate(today.getDate() + d);
              const burnDay = new Date(priorSeconds);
              // console.log(burnDate)
              daysToBurn = d;
              burnDate = burnDay;
          }
          // stock - overBurn;
    });
    return {daysToBurn, burnDate}
}

// Calculate Lead Available By Date
export function calculateLeadAvailableBy(quantity) {
    // console.error(quantity)
    // console.error(range(quantity.leadDays))
    var daysToLead = 0;
    var leadStartTime = quantity.leadStartTime;
    var leadFinishTime = quantity.leadStartTime;
    var stock = quantity.stock;
    range(quantity.leadDays).forEach((d) => {
          var availLead = stock - (quantity.leadQuantity * d); // index + 1 = day
          // console.log(availLead)
          if (availLead > 0) {
              const today = new Date();
              const priorSeconds = new Date().setDate(today.getDate() + d);
              const leadDay = new Date(priorSeconds);
              // console.log(leadFinishTime)
              daysToLead = d;
              leadFinishTime = leadDay;
          }
    });
    // console.log(leadStartTime)
    // console.log(leadFinishTime)
    return {leadStartTime, leadFinishTime}
}
