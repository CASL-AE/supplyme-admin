import history from '../history';

export function errorAlert(statusText) {
    return swal({
        title: 'Ouch',
        text: statusText,
        icon: 'error',
    });
}

export function infoAlert(statusText) {
    return swal({
        title: 'Let us help',
        text: statusText,
        icon: 'info',
    });
}

export function warningAlert(statusText) {
    return swal({
        title: 'Hold On',
        text: statusText,
        icon: 'warning',
    });
}

export function successAlert(statusText) {
    return swal({
        title: 'Success',
        text: statusText,
        icon: 'success',
    });
}
