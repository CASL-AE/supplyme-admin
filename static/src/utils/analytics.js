
// Event is (action_model_result)
export function generalAnalytic(userId, event, eventCategory) {
    console.log(eventCategory);
    return gtag(
        'event', event, {
            event_category: eventCategory,
        },
    );
}

export function xupplyAnalytic(event, parameters) {
    return gtag(
        'event', event, {
            parameters: parameters,
        },
    );
}
